// Unified dynamic advert router for all advert types (berth, trailer, charter, engine, transport)

import { Router } from "express";
import dbConnection from "../config/dbConfig.js";
import { advertRegistry } from "../config/Advert_Registry.js";

const advertRouter = Router();

// Utility: build dynamic WHERE clause and params
function buildFilterClause(body = {}, config = []) {
  const filters = [];
  const params = [];
  config.forEach(({ key, columnName }) => {
    const value = body[key];
    if (value) {
      filters.push(`${columnName} = ?`);
      params.push(value);
    }
  });
  return {
    clause: filters.length ? `WHERE ${filters.join(" AND ")}` : "",
    params,
  };
}

// Register all advert types from registry
Object.entries(advertRegistry).forEach(([type, config]) => {
  const {
    idField,
    mainTable,
    config: fieldConfig,
    joinTables,
    mapToColumn,
    mapToTable,
  } = config;

  const base = `/advert/${type}`;

  // Route 1: Get distinct field values
  advertRouter.post(`${base}/distinct`, async (req, res) => {
    const { fieldKey } = req.body;
    const field = fieldConfig.find((f) => f.key === fieldKey);
    if (!field) return res.status(400).json({ ok: false, message: "Invalid field key" });

    let connection;
    try {
      connection = await dbConnection.getConnection();
      const [rows] = await connection.query(
        `SELECT DISTINCT ?? FROM ?? WHERE ?? IS NOT NULL GROUP BY ?? ORDER BY ??`,
        [field.columnName, field.tableName, field.columnName, field.columnName, field.columnName]
      );
      res.status(200).json({ ok: true, res: { [fieldKey]: rows.map((r) => Object.values(r)) } });
    } catch (err) {
      res.status(500).json({ ok: false, message: err.message });
    } finally {
      connection?.release();
    }
  });

  // Route 2: Get filtered column values
  advertRouter.post(`${base}/:tableName/:fetchColumn`, async (req, res) => {
    const { fetchColumn, tableName } = req.params;
    let connection;
    try {
      connection = await dbConnection.getConnection();
      const columnKey = mapToColumn?.[fetchColumn] || fieldConfig.find((i) => i.key === fetchColumn)?.columnName;
      const realTable = mapToTable?.[tableName] || tableName;

      if (!columnKey || !realTable) {
        return res.status(400).json({ ok: false, message: "Invalid column/table" });
      }

      const { clause, params } = buildFilterClause(req.body?.requestBody || {}, fieldConfig);

      const [rows] = await connection.query(
        `SELECT DISTINCT ?? FROM ?? ${clause} GROUP BY ?? ORDER BY ??`,
        [columnKey, realTable, columnKey, columnKey, ...params]
      );

      res.status(200).json({ ok: true, result: rows.map((r) => [Object.values(r)[0]]) });
    } catch (err) {
      res.status(500).json({ ok: false, message: err.message });
    } finally {
      connection?.release();
    }
  });

  // Route 3: Suggest relevant data
  advertRouter.post(`${base}/relevant_data`, async (req, res) => {
    let connection;
    try {
      connection = await dbConnection.getConnection();
      const selected = req.body?.allSelectedOptions?.[`${type}Details`] || {};
      const { clause, params } = buildFilterClause(selected, fieldConfig);

      const [ids] = await connection.query(
        `SELECT DISTINCT ?? FROM ?? ${clause} ORDER BY ??`,
        [idField, mainTable, idField, ...params]
      );
      if (!ids.length) return res.status(404).json({ ok: false, message: "No data found" });

      const idList = ids.map((r) => r[idField]);
      const results = {};

      for (const table of joinTables) {
        const [columns] = await connection.query("SHOW COLUMNS FROM ??", [table]);
        for (const { Field } of columns) {
          if (Field === idField) continue;
          const [rows] = await connection.query(
            `SELECT DISTINCT ?? FROM ?? WHERE ?? IN (?) AND ?? IS NOT NULL GROUP BY ?? ORDER BY COUNT(*) DESC LIMIT 1`,
            [Field, table, idField, idList, Field, Field]
          );
          const key = fieldConfig.find((f) => f.columnName === Field)?.key;
          if (key) results[key] = rows.map((r) => r[Field]);
        }
      }

      res.status(200).json({ ok: true, result: results });
    } catch (err) {
      res.status(500).json({ ok: false, message: err.message });
    } finally {
      connection?.release();
    }
  });
});

export default advertRouter;
