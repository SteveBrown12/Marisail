import { Router } from "express";
import db_connection from "../config/dbConfig.js";
import { SERVICES } from "../Config/All_Services_Config.js";

const search_router = Router();

// ========================
// CORE UTILITIES
// ========================
const load_service_config = (service_name) => {
  const config = SERVICES[service_name.toLowerCase()];
  if (!config) throw new Error(`Invalid service '${service_name}'`);
  return config;
};

const handle_error_response = (res, message, status = 500) => {
  console.error(`[Search Error] ${message}`);
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
    const config = load_service_config(req.params.service_name);
    await validate_schema(db_connection, config);
    req.service_config = config;
    next();
  } catch (err) {
    handle_error_response(res, err.message, 400);
  }
};

// ========================
// QUERY BUILDERS
// ========================
const build_joins = (config) =>
  config.join_tables
    .map(
      (tbl) =>
        `LEFT JOIN ${tbl} ON ${config.main_table}.${config.primary_key} = ${tbl}.${config.primary_key}`
    )
    .join("\n");

const build_where = (filters, var_to_column) => {
  const conditions = [];
  Object.entries(filters).forEach(([key, values]) => {
    if (values && values.length > 0) {
      conditions.push(
        `${var_to_column[key]} IN (${values.map((val) => `'${val}'`).join(",")})`
      );
    }
  });
  return conditions.join(" AND ");
};

const build_range_facets = (column, bucket_size) => {
  return `
    SELECT 
      CONCAT(
        FLOOR(${column}/${bucket_size})*${bucket_size}, 
        '-', 
        FLOOR(${column}/${bucket_size})*${bucket_size} + ${bucket_size}
      ) AS range,
      COUNT(*) AS count
    FROM ${table}
    GROUP BY FLOOR(${column}/${bucket_size})
  `;
};

// ========================
// ROUTES
// ========================
search_router.get("/:service_name/search", init_service, async (req, res) => {
  try {
    const { main_table, primary_key, Var_To_Table } = req.service_config;
    const { selectedOptions = {}, page = 0, limit = 50 } = req.query || {};
    const offset = page * limit;

    // Build WHERE clause from selectedOptions
    const whereClause = Object.keys(selectedOptions).length
      ? `WHERE ${build_where(selectedOptions, Var_To_Table)}`
      : "";

    const query = `
      SELECT ${main_table}.*
      FROM ${main_table}
      ${build_joins(req.service_config)}
      ${whereClause}
      ORDER BY ${main_table}.${primary_key} DESC
      LIMIT ?
      OFFSET ?
    `;

    const [results] = await db_connection.query(query, [limit, offset]);
    res.json({ ok: true, res: results });
  } catch (err) {
    handle_error_response(res, `Search failed: ${err.message}`);
  }
});

search_router.get("/:service_name/counts", init_service, async (req, res) => {
  try {
    const { main_table, var_to_column } = req.service_config;
    const counts = {};

    await Promise.all(
      Object.entries(req.query.filters || {}).map(async ([field, values]) => {
        if (values && values.length > 0) {
          const [result] = await db_connection.query(
            `SELECT ${var_to_column[field]} AS value, COUNT(*) AS count
             FROM ${main_table}
             WHERE ${var_to_column[field]} IN (?)
             GROUP BY value`,
            [values]
          );
          counts[field] = result.reduce((acc, row) => {
            acc[row.value] = row.count;
            return acc;
          }, {});
        }
      })
    );

    res.json({ ok: true, counts });
  } catch (err) {
    handle_error_response(res, `Counts failed: ${err.message}`);
  }
});

search_router.get(
  "/:service_name/facets/:field",
  init_service,
  async (req, res) => {
    try {
      const { field } = req.params;
      const { var_to_column, main_table } = req.service_config;

      if (req.query.range) {
        const [ranges] = await db_connection.query(
          build_range_facets(var_to_column[field], parseInt(req.query.range))
        );
        res.json({ ok: true, facets: ranges });
      } else {
        const [values] = await db_connection.query(
          `SELECT DISTINCT ${var_to_column[field]} AS value
         FROM ${main_table}
         WHERE ${var_to_column[field]} IS NOT NULL
         ORDER BY value`
        );
        res.json({ ok: true, facets: values.map((val) => val.value) });
      }
    } catch (err) {
      handle_error_response(res, `Facets failed: ${err.message}`);
    }
  }
);

search_router.get(
  "/:service_name/details/:id",
  init_service,
  async (req, res) => {
    try {
      const { main_table, primary_key } = req.service_config;
      const query = `
      SELECT ${main_table}.*, ${req.service_config.join_tables
        .map((tbl) => `${tbl}.*`)
        .join(", ")}
      FROM ${main_table}
      ${build_joins(req.service_config)}
      WHERE ${main_table}.${primary_key} = ?
    `;

      const [results] = await db_connection.query(query, [req.params.id]);
      if (results.length === 0) throw new Error("Record not found");

      res.json({ ok: true, data: results[0] });
    } catch (err) {
      handle_error_response(res, `Details failed: ${err.message}`);
    }
  }
);

export default search_router;
