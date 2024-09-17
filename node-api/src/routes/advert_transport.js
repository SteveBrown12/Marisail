import { Router } from "express";
import dbConnection from "../config/dbConfig.js";
import {
  TRANSPORT_ADVERT,
  UNIQUE_TABLE,
} from "../config/transportAdvertConfig.js";

const advertTransportRouter = Router();

advertTransportRouter.post("/transport", async (req, res) => {
  let connection;
  const filter = req.body;

  try {
    connection = await dbConnection.getConnection();
    for (const key of Object.keys(filter)) {
      const tableInfo = TRANSPORT_ADVERT.find((item) => item.key === key);
      if (!tableInfo) continue;

      const columnCheck = await connection.query(
        `SELECT COLUMN_NAME
        FROM information_schema.columns
        WHERE table_name = '${tableInfo.tableName}'
        AND table_schema = 'Marisail'
        AND column_name = '${tableInfo.columnName}'`
      );
      if (columnCheck[0].length > 0) {
        const tables = await connection.query(
          `SELECT distinct ${tableInfo.columnName}
          FROM ${tableInfo.tableName} WHERE ${tableInfo.columnName} IS NOT NULL
          GROUP BY ${tableInfo.columnName};`
        );
        filter[key] = tables?.[0].map((table) => Object.values(table));
      }
    }

    return res.status(200).json({ ok: true, res: filter });
  } catch (err) {
    return res.status(500).json({ ok: false, message: err.message });
  } finally {
    if (connection) connection.release();
  }
});
advertTransportRouter.post("/:tableName/:fetchColumn", async (req, res) => {
  let connection;
  try {
    let filterOptions = "";
    connection = await dbConnection.getConnection();
    const filters = [];
    let queryParams = {};
    const fetchColumnName = TRANSPORT_ADVERT.find(
      (item) => item.key === req.params?.fetchColumn
    );
    TRANSPORT_ADVERT.forEach((item) => {
      const key = item.key;
      const columnName = item.columnName;
      if (req.body?.requestBody[key]) {
        queryParams[columnName] = req.body?.requestBody[key];
      }
    });
    for (const [key, value] of Object.entries(queryParams)) {
      if (value) {
        filters.push(`${key} = '${value}'`);
      }
    }

    filterOptions = filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";
    const [rows] = await connection.query(
      `SELECT DISTINCT ?? FROM ?? ${filterOptions} GROUP BY ?? ORDER BY ??`,
      [
        fetchColumnName.columnName,
        req.params.tableName,
        fetchColumnName.columnName,
        fetchColumnName.columnName,
      ]
    );

    const formattedResult = rows.map((row) => [Object.values(row)?.[0]]);
    return res.status(200).json({ ok: true, result: formattedResult });
  } catch (err) {
    return res.status(500).json({ ok: false, message: err.message });
  } finally {
    connection.release();
  }
});
advertTransportRouter.post("/relevant_data", async (req, res) => {
  let connection;
  try {
    let filterOptions = "";
    connection = await dbConnection.getConnection();
    const filters = [];
    let queryParams = {};
    let valid_tables = [];
    valid_tables.push(UNIQUE_TABLE);
    TRANSPORT_ADVERT.forEach((item) => {
      const key = item.key;
      const columnName = item.columnName;
      if (req.body?.allSelectedOptions?.jobDescription[key]) {
        queryParams[columnName] =
          req.body?.allSelectedOptions?.jobDescription[key];
      }
    });

    // Dynamically construct filter options
    for (const [key, value] of Object.entries(queryParams)) {
      if (value) {
        filters.push(`${key} = '${value}'`);
      }
    }
    filterOptions = filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";
    let results = {};
    const [marisailTransportID] = await connection.query(
      `SELECT DISTINCT Transport_Item_ID FROM Trailers_ID ${filterOptions} ORDER BY Transport_Item_ID`
    );
    if (marisailTransportID.length === 0) {
      return res.status(404).json({ ok: false, message: "No data found" });
    }
    for (let tableName of UNIQUE_TABLE) {
      const [columns] = await connection.query("SHOW COLUMNS FROM ??", [
        tableName,
      ]);
      for (let column of columns) {
        const columnName = column.Field;
        if (columnName != "Transport_Item_ID") {
          const [rows] = await connection.query(
            `SELECT DISTINCT ?? FROM ?? WHERE Transport_Item_ID IN (?) AND ?? IS NOT NULL GROUP BY ?? ORDER BY COUNT(*) DESC LIMIT 0,1`,
            [
              columnName,
              tableName,
              marisailTransportID.map((row) => row.Transport_Item_ID),
              columnName,
              columnName,
            ]
          );
          results[
            TRANSPORT_ADVERT.find((item) => item.columnName === columnName)?.key
          ] = rows.map((row) => row[columnName]);
        }
      }
    }
    return res.status(200).json({ ok: true, result: results });
  } catch (err) {
    return res.status(500).json({ ok: false, message: err.message });
  } finally {
    connection.release();
  }
});
export default advertTransportRouter;
