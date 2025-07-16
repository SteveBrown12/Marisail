import { Router } from "express";
import db_connection from "../config/dbConfig.js";
import { SERVICES, SERVICE_MAPPINGS } from "../Config/All_Services_Config.js";

const advert_router = Router();

// ========================
// CORE UTILITIES
// ========================
const init_service_config = (service_name) => {
  const config = SERVICES[service_name.toLowerCase()];
  if (!config) throw new Error(`Invalid service '${service_name}'`);
  return config;
};

const handle_error_response = (res, message, status = 500) => {
  console.error(`[Advert Error] ${message}`);
  res.status(status).json({ ok: false, message });
};

const validate_schema = async (connection, config) => {
  const errors = [];
  // Main table check
  const [main_table] = await connection.query(
    `SHOW TABLES LIKE '${config.main_table}'`
  );
  if (!main_table.length)
    errors.push(`Main table '${config.main_table}' missing`);

  // Join tables check
  for (const table of config.join_tables) {
    const [join_table] = await connection.query(`SHOW TABLES LIKE '${table}'`);
    if (!join_table.length) errors.push(`Join table '${table}' missing`);
  }

  if (errors.length) throw new Error(errors.join("\n"));
};

// ========================
// MIDDLEWARE
// ========================
const init_service = async (req, res, next) => {
  try {
    const serviceName = req.params.service_name?.toLowerCase();
    const config = init_service_config(serviceName);
    await validate_schema(db_connection, config);
    req.service_config = config;
    req.confg_data = SERVICE_MAPPINGS[serviceName];
    next();
  } catch (err) {
    handle_error_response(res, err.message, 400);
  }
};

const validate_fields = (req, res, next) => {
  const missing = Object.entries(req.service_config.fields)
    .filter(([_, f]) => f.mandatory && !req.body[f.column_name])
    .map(([name]) => name);
  if (missing.length)
    handle_error_response(res, `Missing fields: ${missing.join(", ")}`, 400);
  else next();
};

// ========================
// TRANSACTION HANDLING
// ========================
const execute_with_retry = async (operation, max_attempts = 3) => {
  let attempt = 0;
  while (attempt < max_attempts) {
    try {
      return await operation();
    } catch (err) {
      attempt++;
      if (attempt >= max_attempts) throw err;
      await new Promise((resolve) => setTimeout(resolve, 100 * attempt));
    }
  }
};

// ========================
// ROUTES
advert_router.post("/:service_name/options", init_service, async (req, res) => {
  try {
    const payload = req.body;
    const confg_data = req.confg_data;
    const Var_To_Column = confg_data.Var_To_Column;
    const Var_To_Table = confg_data.Var_To_Table;

    // Collect valid fields from payload that exist in Var_To_Column and Var_To_Table
    const validFields = Object.keys(payload).filter(
      (key) => Var_To_Column[key] && Var_To_Table[key]
    );

    if (validFields.length === 0) {
      return handle_error_response(
        res,
        "No valid fields provided in payload",
        400
      );
    }

    // Build queries for all fields in parallel
    const queries = validFields.map(async (key) => {
      const column = Var_To_Column[key];
      const table = Var_To_Table[key];
      const [rows] = await db_connection.query(
        `SELECT DISTINCT ${column} AS value FROM ${table} WHERE ${column} IS NOT NULL`
      );
      return {
        field: key,
        options: rows.map((row) => row.value),
      };
    });

    const results = await Promise.all(queries);

    // Build response object: { fieldName: [options] }
    const options = {};
    results.forEach((row) => {
      options[row.field] = row.options;
    });

    res.json({ ok: true, res: options });
  } catch (err) {
    handle_error_response(res, `Options fetch failed: ${err.message}`);
  }
});

advert_router.post(
  "/:service_name/autofill",
  init_service,
  async (req, res) => {
    try {
      const { service_name } = req.params;
      const { main_table, primary_key } = req.service_config;

      if (!["trailer", "engine", "vessel"].includes(service_name)) {
        return res.json({ ok: true, data: {} });
      }

      const query = `
      SELECT ${main_table}.* 
      FROM ${main_table}
      ${req.service_config.join_tables
        .map(
          (tbl) =>
            `LEFT JOIN ${tbl} ON ${main_table}.${primary_key} = ${tbl}.${primary_key}`
        )
        .join(" ")}
      WHERE make=? AND model=? AND year=?
      LIMIT 1
    `;

      const [data] = await db_connection.query(query, [
        req.body.make,
        req.body.model,
        req.body.year,
      ]);

      res.json({ ok: true, data: data[0] || {} });
    } catch (err) {
      handle_error_response(res, `Autofill failed: ${err.message}`);
    }
  }
);

advert_router.post(
  "/:service_name/submit",
  init_service,
  validate_fields,
  async (req, res) => {
    try {
      const result = await execute_with_retry(async () => {
        const transaction = await db_connection.beginTransaction();
        try {
          const { main_table, primary_key, fields } = req.service_config;

          // Main table insert
          const main_data = {};
          Object.entries(fields).forEach(([key, config]) => {
            if (
              config.table_name === main_table &&
              req.body[key] !== undefined
            ) {
              main_data[config.column_name] = req.body[key];
            }
          });

          await transaction.query(
            `INSERT INTO ${main_table} (${Object.keys(main_data).join(", ")}) 
           VALUES (${Object.values(main_data)
             .map((val) => `'${val}'`)
             .join(", ")})`
          );

          // Join tables insert
          const [[{ new_id }]] = await transaction.query(
            `SELECT LAST_INSERT_ID() AS new_id`
          );
          for (const table of req.service_config.join_tables) {
            const table_data = {};
            Object.entries(fields).forEach(([key, config]) => {
              if (config.table_name === table && req.body[key] !== undefined) {
                table_data[config.column_name] = req.body[key];
              }
            });

            if (Object.keys(table_data).length > 0) {
              await transaction.query(
                `INSERT INTO ${table} (${primary_key}, ${Object.keys(
                  table_data
                ).join(", ")}) 
               VALUES (?, ${Object.values(table_data)
                 .map((val) => `'${val}'`)
                 .join(", ")})`,
                [new_id]
              );
            }
          }

          await transaction.commit();
          return { ok: true, new_id };
        } catch (err) {
          await transaction.rollback();
          throw err;
        }
      });

      res.json(result);
    } catch (err) {
      handle_error_response(res, `Submit failed: ${err.message}`);
    }
  }
);

export default advert_router;
