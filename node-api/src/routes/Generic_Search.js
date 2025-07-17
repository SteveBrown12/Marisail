import { Router } from "express";
import db_connection from "../config/dbConfig.js";
import { SERVICES } from "../Config/All_Services_Config.js";

import {get_service_config_by_name,
send_error_response,
initialize_service_middleware,
build_range_facets,
build_joins
} from "../utils/utils.js"
const search_router = Router();

// ========================
// ROUTES
// ========================
search_router.get("/:service_name/search", initialize_service_middleware, async (request, callback) => {
  try {
    const { main_table, primary_key, Var_To_Table } = request.service_config;
    const { selectedOptions = {}, page = 0, limit = 50 } = request.query || {};
    const offset = page * limit;

    // Build WHERE clause from selectedOptions
    const whereClause = Object.keys(selectedOptions).length
      ? `WHERE ${build_where(selectedOptions, Var_To_Table)}`
      : "";

    const query = `
      SELECT ${main_table}.*
      FROM ${main_table}
      ${build_joins(request.service_config)}
      ${whereClause}
      ORDER BY ${main_table}.${primary_key} DESC
      LIMIT ?
      OFFSET ?
    `;

    const [results] = await db_connection.query(query, [limit, offset]);
    callback.json({ ok: true, res: results });
  } catch (err) {
    send_error_response(callback, `Search failed: ${err.message}`);
  }
});

search_router.get("/:service_name/counts", initialize_service_middleware, async (request, callback) => {
  try {
    const { main_table, var_to_column } = request.service_config;
    const counts = {};

    await Promise.all(
      Object.entries(request.query.filters || {}).map(async ([field, values]) => {
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

    callback.json({ ok: true, counts });
  } catch (err) {
    send_error_response(callback, `Counts failed: ${err.message}`);
  }
});

search_router.get(
  "/:service_name/facets/:field",
  initialize_service_middleware,
  async (request, callback) => {
    try {
      const { field } = request.params;
      const { var_to_column, main_table } = request.service_config;

      if (request.query.range) {
        const [ranges] = await db_connection.query(
          build_range_facets(var_to_column[field], parseInt(request.query.range))
        );
        callback.json({ ok: true, facets: ranges });
      } else {
        const [values] = await db_connection.query(
          `SELECT DISTINCT ${var_to_column[field]} AS value
         FROM ${main_table}
         WHERE ${var_to_column[field]} IS NOT NULL
         ORDER BY value`
        );
        callback.json({ ok: true, facets: values.map((val) => val.value) });
      }
    } catch (err) {
      send_error_response(callback, `Facets failed: ${err.message}`);
    }
  }
);

search_router.get(
  "/:service_name/details/:id",
  initialize_service_middleware,
  async (request, callback) => {
    try {
      const { main_table, primary_key } = request.service_config;
      const query = `
      SELECT ${main_table}.*, ${request.service_config.join_tables
        .map((tbl) => `${tbl}.*`)
        .join(", ")}
      FROM ${main_table}
      ${build_joins(request.service_config)}
      WHERE ${main_table}.${primary_key} = ?
    `;
    const [results] = await db_connection.query(query, [request.params.id]);
      if (results.length === 0) throw new Error("Record not found");

      callback.json({ ok: true, res: results });
    } catch (err) {
      send_error_response(callback, `Details failed: ${err.message}`);
    }
  }
);

export default search_router;
