import { Router } from "express";
import db_connection from "../config/dbConfig.js";
import { SERVICES } from "../Config/All_Services_Config.js";
import {get_service_config_by_name,
send_error_response,
check_service_schema,
initialize_service_middleware,
execute_with_retry,
validate_fields
} from "../utils/utils.js"
const advert_router = Router();

// ========================
// ROUTES
advert_router.post("/:service_name/options", initialize_service_middleware, async (request, callback) => {
  try {
    const payload = request.body;
    const Var_To_Column = request.Var_To_Column;
    const Var_To_Table = request.Var_To_Table;
    const validFields = Object.keys(payload).filter(
      (key) => Var_To_Column[key] && Var_To_Table[key]
    );

    if (validFields.length === 0) {
      return send_error_response(
        callback,
        "No valid fields provided in payload",
        400
      );
    }


    // Execute each SELECT statement separately and aggregate the results
    const options = {};
    for (const key of validFields) {
      const column = Var_To_Column[key];
      const table = Var_To_Table[key];
      if (column && table) {
        const sql = `SELECT DISTINCT ${column} AS value FROM ${table} WHERE ${column} IS NOT NULL`;
        const [rows] = await db_connection.query(sql);
        options[key] = rows.map((row) => row.value);
      }
    }

    callback.json({ ok: true, res: options });
  } catch (err) {
    send_error_response(callback, `Options fetch failed: ${err.message}`);
  }
});

advert_router.post(
  "/:service_name/autofill",
  initialize_service_middleware,
  async (request, callback) => {
    try {
      const { service_name } = request.params;
      const { main_table, primary_key } = request.service_config;

      if (!["trailer", "engine", "vessel"].includes(service_name)) {
        return callback.json({ ok: true, data: {} });
      }

      const query = `
      SELECT ${main_table}.* 
      FROM ${main_table}
      ${request.service_config.join_tables
        .map(
          (tbl) =>
            `LEFT JOIN ${tbl} ON ${main_table}.${primary_key} = ${tbl}.${primary_key}`
        )
        .join(" ")}
      WHERE make=? AND model=? AND year=?
      LIMIT 1
    `;

      const [data] = await db_connection.query(query, [
        request.body.make,
        request.body.model,
        request.body.year,
      ]);

      callback.json({ ok: true, data: data[0] || {} });
    } catch (err) {
      send_error_response(callback, `Autofill failed: ${err.message}`);
    }
  }
);

advert_router.post(
  "/:service_name/submit",
  initialize_service_middleware,
  validate_fields,
  async (request, callback) => {
    try {
      const result = await execute_with_retry(async () => {
        const transaction = await db_connection.beginTransaction();
        try {
          const { main_table, primary_key, fields } = request.service_config;

          // Main table insert
          const main_data = {};
          Object.entries(fields).forEach(([key, config]) => {
            if (
              config.table_name === main_table &&
              request.body[key] !== undefined
            ) {
              main_data[config.column_name] = request.body[key];
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
          for (const table of request.service_config.join_tables) {
            const table_data = {};
            Object.entries(fields).forEach(([key, config]) => {
              if (config.table_name === table && request.body[key] !== undefined) {
                table_data[config.column_name] = request.body[key];
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

      callback.json(result);
    } catch (err) {
      send_error_response(callback, `Submit failed: ${err.message}`);
    }
  }
);

export default advert_router;
