import { Router } from "express";
import dbConnection from "../config/dbConfig.js";
import {
  TRAILERS_ADVERT,
  UNIQUE_TABLE,
} from "../config/Trailer_Advert_Config.js";

const advertTrailerRouter = Router();

advertTrailerRouter.post("/trailers", async (req, res) => {
  let connection;
  const { sectionKey, fieldKey } = req.body; // Extract the specific section and field

  try {
    connection = await dbConnection.getConnection();

    // Find the corresponding table and column info
    const tableInfo = TRAILERS_ADVERT.find((item) => item.key === fieldKey);
    if (!tableInfo) {
      return res.status(400).json({ ok: false, message: "Invalid field key" });
    }

    // Check if the column exists in the database
    const columnCheck = await connection.query(
      `SELECT 1
      FROM information_schema.columns
      WHERE table_name = '${tableInfo.tableName}'
      AND table_schema = 'marisail'
      AND column_name = '${tableInfo.columnName}'`
    );

    if (columnCheck[0].length === 0) {
      return res.status(404).json({ ok: false, message: "Column not found" });
    }

    // Fetch distinct values for the specified column
    const tables = await connection.query(
      `SELECT DISTINCT ${tableInfo.columnName}
      FROM ${tableInfo.tableName} 
      WHERE ${tableInfo.columnName} IS NOT NULL
      GROUP BY ${tableInfo.columnName}`
    );

    const formattedData = tables[0].map((row) => Object.values(row));

    return res
      .status(200)
      .json({ ok: true, res: { [fieldKey]: formattedData } });
  } catch (err) {
    console.error("Database error:", err);
    return res
      .status(500)
      .json({ ok: false, message: "Internal server error" });
  } finally {
    if (connection) connection.release();
  }
});

advertTrailerRouter.post("/:tableName/:fetchColumn", async (req, res) => {
  let connection;
  try {
    let filterOptions = "";
    connection = await dbConnection.getConnection();
    const filters = [];
    let queryParams = {};
    const fetchColumnName = TRAILERS_ADVERT.find(
      (item) => item.key === req.params?.fetchColumn
    );
    TRAILERS_ADVERT.forEach((item) => {
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
advertTrailerRouter.post("/relevant_data", async (req, res) => {
  let connection;
  try {
    let filterOptions = "";
    connection = await dbConnection.getConnection();
    const filters = [];
    let queryParams = {};
    let valid_tables = [];
    valid_tables.push(UNIQUE_TABLE);
    TRAILERS_ADVERT.forEach((item) => {
      const key = item.key;
      const columnName = item.columnName;
      if (req.body?.allSelectedOptions?.identification[key]) {
        queryParams[columnName] =
          req.body?.allSelectedOptions?.identification[key];
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
    const [trailerID] = await connection.query(
      `SELECT DISTINCT Trailer_ID FROM Trailers_ID ${filterOptions} ORDER BY Trailer_ID`
    );
    if (trailerID.length === 0) {
      return res.status(404).json({ ok: false, message: "No data found" });
    }
    for (let tableName of UNIQUE_TABLE) {
      const [columns] = await connection.query("SHOW COLUMNS FROM ??", [
        tableName,
      ]);
      for (let column of columns) {
        const columnName = column.Field;
        if (columnName != "Trailer_ID") {
          const [rows] = await connection.query(
            `SELECT DISTINCT ?? FROM ?? WHERE Trailer_ID IN (?) AND ?? IS NOT NULL GROUP BY ?? ORDER BY COUNT(*) DESC LIMIT 0,1`,
            [
              columnName,
              tableName,
              trailerID.map((row) => row.Trailer_ID),
              columnName,
              columnName,
            ]
          );
          results[
            TRAILERS_ADVERT.find((item) => item.columnName === columnName)?.key
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
export default advertTrailerRouter;