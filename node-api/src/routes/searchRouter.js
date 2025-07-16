// searchRouter.js – Unified search routes for all advert services

import { Router } from "express";
import dbConnection from "../config/dbConfig.js";
import { advertRegistry } from "../config/Advert_Registry.js";
import {
  buildWhereMulti,
  buildJoins,
  buildSelectAll,
} from "../utils/queryBuilder.js";

const searchRouter = Router();

// Loop over each registered advert service (e.g. berth, charter, engine, etc.)
Object.entries(advertRegistry).forEach(([type, cfg]) => {
  const { mainTable, idField, config, joinTables } = cfg;
  const base = `/search/${type}`;

  /**
   * POST /search/:type/dropdown
   * Returns distinct values + counts for a specific fieldKey with optional filters
   */
  searchRouter.post(`${base}/dropdown`, async (req, res) => {
    const { uiKey, filters = {} } = req.body;
    const field = config.find((f) => f.key === uiKey);
    if (!field) {
      return res.status(400).json({ ok: false, message: "Invalid field key" });
    }

    const { sql, params } = buildWhereMulti(filters, config);
    const query = `
      SELECT DISTINCT \`${field.columnName}\` AS value, COUNT(*) AS occurrence_cnt
      FROM \`${field.tableName}\`
      ${sql}
      GROUP BY \`${field.columnName}\`
      ORDER BY occurrence_cnt DESC, value
      LIMIT 200;
    `;

    let conn;
    try {
      conn = await dbConnection.getConnection();
      const [rows] = await conn.query(query, params);
      res.json({ ok: true, data: rows });
    } catch (err) {
      res.status(500).json({ ok: false, message: err.message });
    } finally {
      if (conn) conn.release();
    }
  });

  /**
   * POST /search/:type/list
   * Returns paginated list of results from the main table + joined tables
   */
 searchRouter.post(`${base}/list`, async (req, res) => {
  const { page = 0, filters = {} } = req.body;
  const limit = 30;
  const offset = page * limit;

  console.log("📥 Incoming /list request:", { type, filters, page });

  const selectClause = buildSelectAll(mainTable, joinTables);
  const joinClause = buildJoins(mainTable, idField, joinTables);
  const { sql: whereClause, params } = buildWhereMulti(filters, config);

  const query = `
    SELECT ${selectClause}
    FROM \`${mainTable}\`
    ${joinClause}
    ${whereClause}
    LIMIT ${limit} OFFSET ${offset};
  `;

  console.log("🔍 Executing query:", query);
  console.log("📦 With params:", params);

  let conn;
  try {
    conn = await dbConnection.getConnection();
    const [rows] = await conn.query(query, params);
    res.json({ ok: true, data: rows });
  } catch (err) {
    console.error("❌ Error in /list:", err);
    res.status(500).json({ ok: false, message: err.message });
  } finally {
    if (conn) conn.release();
  }
});


  /**
   * GET /search/:type/detail/:id
   * Fetches full joined detail for a single ID
   */
  searchRouter.get(`${base}/detail/:id`, async (req, res) => {
    const { id } = req.params;

    const selectClause = buildSelectAll(mainTable, joinTables);
    const joinClause = buildJoins(mainTable, idField, joinTables);

    const query = `
      SELECT ${selectClause}
      FROM \`${mainTable}\`
      ${joinClause}
      WHERE \`${mainTable}\`.\`${idField}\` = ?
      LIMIT 1;
    `;

    let conn;
    try {
      conn = await dbConnection.getConnection();
      const [rows] = await conn.query(query, [id]);
      if (!rows.length) {
        return res.status(404).json({ ok: false, message: "Not found" });
      }
      res.json({ ok: true, data: rows[0] });
    } catch (err) {
      res.status(500).json({ ok: false, message: err.message });
    } finally {
      if (conn) conn.release();
    }
  });
});

export default searchRouter;
