import { Router } from "express";
import dbConnection from "../config/dbConfig.js";
import { ENGINES_ADVERT, UNIQUE_TABLE } from "../config/enginesAdvertConfig.js";

const advertEngineRouter = Router();

//API call from frontend - http://localhost:3001/api/advert_engine/
advertEngineRouter.get("/", (req, res) => {
  console.log("Inside advert engine...");
  res.json({ message: "advert engine route" });
});

//API call from frontend - http://localhost:3001/api/advert_engine/main
advertEngineRouter.get("/main/", (req, res) => {
  console.log("Inside advert_engine main page...");
  res.json({ message: "advert engine main page route" });
});

//NEW APIs
advertEngineRouter.post("/engines", async (req, res) => {
  let connection;
  const filter = req.body;

  try {
    connection = await dbConnection.getConnection();
    // Iterate over filter keys
    for (const key of Object.keys(filter)) {
      const tableInfo = ENGINES_ADVERT.find((item) => item.key === key);
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
          GROUP BY ${tableInfo.columnName}`
        );
        filter[key] = tables[0].map((table) => Object.values(table));
      }
    }

    return res.status(200).json({ ok: true, res: filter });
  } catch (err) {
    return res.status(500).json({ ok: false, message: err.message });
  } finally {
    if (connection) connection.release();
  }
});
advertEngineRouter.post("/:tableName/:fetchColumn", async (req, res) => {
  let connection;
  try {
    let filterOptions = "";
    connection = await dbConnection.getConnection();
    const filters = [];
    let queryParams = {};
    const fetchColumnName = ENGINES_ADVERT.find(
      (item) => item.key === req.params.fetchColumn
    );

    // Prepare query parameters based on the request body
    ENGINES_ADVERT.forEach((item) => {
      const key = item.key;
      const columnName = item.columnName;
      if (req.body.requestBody[key]) {
        queryParams[columnName] = req.body.requestBody[key];
      }
    });
    // Dynamically construct filter options
    for (const [key, value] of Object.entries(queryParams)) {
      if (value) {
        filters.push(`${key} = '${value}'`);
      }
    }

    filterOptions = filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";
    // Fetch distinct values for the given column and table
    const [rows] = await connection.query(
      `SELECT DISTINCT ?? FROM ?? ${filterOptions} GROUP BY ?? ORDER BY ??`,
      [
        fetchColumnName.columnName,
        req.params.tableName,
        fetchColumnName.columnName,
        fetchColumnName.columnName,
      ]
    );

    // Format the response like API 1
    const formattedResult = rows.map((row) => [Object.values(row)[0]]);

    // Return the result in the desired format
    return res.status(200).json({ ok: true, result: formattedResult });
  } catch (err) {
    return res.status(500).json({ ok: false, message: err.message });
  } finally {
    connection.release();
  }
});
advertEngineRouter.post("/relevant_data", async (req, res) => {
  let connection;
  try {
    let filterOptions = "";
    connection = await dbConnection.getConnection();
    const filters = [];
    let queryParams = {};
    ENGINES_ADVERT.forEach((item) => {
      const key = item.key;
      const columnName = item.columnName;
      if (req.body?.allSelectedOptions?.engineDetails[key]) {
        queryParams[columnName] =
          req.body?.allSelectedOptions?.engineDetails[key];
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
    const [engineID] = await connection.query(
      `SELECT DISTINCT Engine_ID FROM General ${filterOptions} ORDER BY Engine_ID`
    );
    
    if (engineID.length === 0) {
      return res.status(404).json({ ok: false, message: "No data found" });
    }
    for (let tableName of UNIQUE_TABLE) {
      const [columns] = await connection.query("SHOW COLUMNS FROM ??", [
        tableName,
      ]);
      for (let column of columns) {
        const columnName = column.Field;
        if (columnName != "Engine_ID") {
          const [rows] = await connection.query(
            `SELECT DISTINCT ?? FROM ?? WHERE Engine_ID IN (?) AND ?? IS NOT NULL GROUP BY ?? ORDER BY COUNT(*) DESC LIMIT 0,1`,
            [
              columnName,
              tableName,
              engineID.map((row) => row.Engine_ID),
              columnName,
              columnName,
            ]
          );
          results[
            ENGINES_ADVERT.find((item) => item.columnName === columnName)?.key
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
export default advertEngineRouter;
