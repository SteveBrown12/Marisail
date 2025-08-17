import { Router } from "express";
import dbConnection from "../config/dbConfig.js";
import {
  engineVarToColumn,
  engineVarToTable,
} from "../config/Engine_Search_Config.js";
import { withDatabaseConnection } from "./Berth_Search.js";

const searchEngineRouter = Router();

// Path     :   /api/search_engine/tables
// Method   :   Get
// Access   :   Public
// Desc     :   Endpoint to get list of tables
searchEngineRouter.get("/tables", async (req, res) => {
  let connection;
  try {
    connection = await dbConnection.getConnection();
    const [tables] = await connection.query("SHOW TABLES");
    const tableNames = tables.map((table) => Object.values(table)[0]);
    return res.status(200).json({ ok: true, tables: tableNames });
  } catch (err) {
    return res.status(500).json({ ok: false, message: err.message });
  } finally {
    if (connection) connection.release();
  }
});
// Path     :   /api/search_engine/columns/:tableName
// Method   :   Get
// Access   :   Public
// Desc     :   Endpoint to get columns for a specific table
searchEngineRouter.get("/engine-detail/:id", async (req, res) => {
  try {
    console.log("Engine ID:", req.params.id);
    const { id } = req.params; // Get the engine ID from the URL parameter
    let connection;
    connection = await dbConnection.getConnection();

    // SQL query to fetch data from all related tables
    const query = `
      SELECT
        e.*,
        ecool.*,
        ed.*,
        ee.*,
        eem.*,
        ef.*,
        el.*,
        em.*,
        emount.*,
        eo.*,
        ep.*,
        eps.*,
        es.*,
        et.*
      FROM Engine_General e
      LEFT JOIN Engine_Cooling ecool ON e.engine_id = ecool.engine_id
      LEFT JOIN Engine_Dimensions ed ON e.engine_id = ed.engine_id
      LEFT JOIN Engine_Electrical ee ON e.engine_id = ee.engine_id
      LEFT JOIN Engine_Emmissions eem ON e.engine_id = eem.engine_id
      LEFT JOIN Engine_Fuel ef ON e.engine_id = ef.engine_id
      LEFT JOIN Engine_Location el ON e.engine_id = el.engine_id
      LEFT JOIN Engine_Maintenance em ON e.engine_id = em.engine_id
      LEFT JOIN Engine_Mounting emount ON e.engine_id = emount.engine_id
      LEFT JOIN Engine_Oil eo ON e.engine_id = eo.engine_id
      LEFT JOIN Engine_Performance ep ON e.engine_id = ep.engine_id
      LEFT JOIN Engine_Propulsion eps ON e.engine_id = eps.engine_id
      LEFT JOIN Engine_Safety es ON e.engine_id = es.engine_id
      LEFT JOIN Engine_Transmission et ON e.engine_id = et.engine_id
      WHERE e.engine_id = ?
    `;

    const [results] = await connection.query(query, [id]);

    if (results.length === 0) {
      return res.status(404).send("Engine not found");
    }

    res.json(results);
  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).send(`Server error: ${err.message}`);
  }
});

// Path     :   /api/search_engine/engine-detail/:id
// Method   :   Get
// Access   :   Public
// Desc     :   Endpoint to get columns for a specific table
searchEngineRouter.get("/:tableName/:columnName", async (req, res) => {
  const { tableName, columnName } = req.params;
  const { engine_make, engine_model } = req.query;

  let connection;
  try {
    connection = await dbConnection.getConnection();

    let query;
    const parameters = [];

    if (columnName === "engine_make") {
      // Fetch all distinct engine_make values
      query = `SELECT DISTINCT ${columnName} as value, COUNT(*) as count FROM ${tableName} GROUP BY ${columnName}`;
    } else if (columnName === "engine_model") {
      // Fetch all distinct engine_model values filtered by engine_make
      query = `SELECT DISTINCT ${columnName} as value, COUNT(*) as count FROM ${tableName} WHERE 1=1`;

      if (engine_make) {
        const engineMakeArray = engine_make.split(",");
        const engineMakeConditions = engineMakeArray.map(() => "?").join(",");
        query += ` AND engine_make IN (${engineMakeConditions})`;
        parameters.push(...engineMakeArray);
      }

      query += ` GROUP BY ${columnName}`;
    } else {
      // Apply filters for other columns
      query = `SELECT DISTINCT ${columnName} as value, COUNT(*) as count FROM ${tableName} WHERE 1=1`;

      if (engine_make) {
        const engineMakeArray = engine_make.split(",");
        const engineMakeConditions = engineMakeArray.map(() => "?").join(",");
        query += ` AND engine_make IN (${engineMakeConditions})`;
        parameters.push(...engineMakeArray);
      }

      if (engine_model) {
        const engineModelArray = engine_model.split(",");
        const engineModelConditions = engineModelArray.map(() => "?").join(",");
        query += ` AND engine_model IN (${engineModelConditions})`;
        parameters.push(...engineModelArray);
      }

      query += ` GROUP BY ${columnName}`;
    }

    console.log("Executing query:", query);
    console.log("With parameters:", parameters);

    const [rows] = await connection.query(query, parameters);
    console.log("Rows returned:", rows);

    const totalCountQuery = `SELECT COUNT(DISTINCT ${columnName}) as totalCount FROM ${tableName}`;
    const [[{ totalCount }]] = await connection.query(totalCountQuery);

    return res.status(200).json({
      ok: true,
      count: totalCount,
      result: rows.map((row) => ({
        value: row.value,
        count: row.count,
      })),
    });
  } catch (err) {
    return res.status(500).json({ ok: false, message: err.message });
  } finally {
    if (connection) connection.release();
  }
});

// Path     :   /api/search_engine/engines
// Method   :   Get
// Access   :   Public
// Desc     :   Endpoint to get engines
searchEngineRouter.get("/engines", async (req, res) => {
  try {
    let connection = await dbConnection.getConnection();
    console.log("Query Parameters:", req.query);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 21;
    const offset = (page - 1) * limit;

    const tables = JSON.parse(req.query.tables || "[]");
    const columns = JSON.parse(req.query.columns || "[]");
    const values = JSON.parse(req.query.values || "[]");

    if (
      !Array.isArray(tables) ||
      !Array.isArray(columns) ||
      !Array.isArray(values)
    ) {
      return res
        .status(400)
        .json({ error: "Invalid query parameters format." });
    }

    let dataQuery = `
      SELECT 
      e.engine_id,
        e.engine_make, 
        e.engine_model, 
        e.engine_modelyear
      FROM engine_general e
    `;

    let countQuery = "SELECT COUNT(*) AS total FROM engine_general e";
    const queryParams = [];
    const conditions = [];

    // Construct conditions based on columns and values
    columns.forEach((column, index) => {
      const valueArray = values[index];
      if (valueArray && valueArray.length) {
        const columnConditions = valueArray
          .map((value) => `e.${column} LIKE ?`)
          .join(" OR ");
        conditions.push(`(${columnConditions})`);
        queryParams.push(...valueArray.map((value) => `%${value}%`));
      }
    });

    // Add conditions to the query if any exist
    if (conditions.length > 0) {
      const whereClause = `WHERE ${conditions.join(" AND ")}`;
      dataQuery += ` ${whereClause}`;
      countQuery += ` ${whereClause}`;
    }

    // Add pagination
    dataQuery += " LIMIT ? OFFSET ?";
    queryParams.push(limit, offset);

    // Fetch the data
    const [results] = await connection.query(dataQuery, queryParams);

    const [[countResult]] = await connection.query(
      countQuery,
      queryParams.slice(0, queryParams.length - 2) // Remove LIMIT and OFFSET params
    );
    const totalRecords = countResult.total;
    const totalPages = Math.ceil(totalRecords / limit);

    // Respond with data and pagination
    res.json({
      data: results,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalRecords: totalRecords,
        limit: limit,
      },
    });
  } catch (err) {
    console.error("Error executing query:", err.message, err.stack);
    res.status(500).json({ error: "Internal server error" });
  }
});

searchEngineRouter.post("/enginesData", async (req, res) => {
  let connection;

  console.log(req.body);

  var page = req.body.page;
  var filter = {};
  for (const key of Object.keys(req.body.selectedOptions)) {
    let val = key,
      key2 = req.body.selectedOptions[key];
    console.log(key2);
    console.log(val);

    if (filter[key2] === undefined) {
      filter[key2] = [val];
    } else {
      filter[key2].push(val);
    }
  }
  console.log(filter);

  try {
    connection = await dbConnection.getConnection();

    var required = "engine_id, Engine_Make, Engine_Model, Engine_Model_Year";

    var basic = `SELECT ${required} FROM Engine_General`;

    if (Object.keys(filter).length > 0) {
      basic += `WHERE `;

      for (const key of Object.keys(filter)) {
        var temp = `${key} IN (`;
        for (const val of filter[key]) {
          temp += `'${val}',`;
        }
        temp = temp.slice(0, -1);
        temp += `) OR `;
        basic += temp;
      }

      basic = basic.slice(0, -3);
    }
    let offset = page * 30;
    basic += ` LIMIT ${offset}, 60;`;

    console.log(basic);

    const tables = await connection.query(basic);

    console.log(tables);

    return res.status(200).json({ ok: true, res: tables });
  } catch (err) {
    return res.status(500).json({ ok: false, message: err.message });
  } finally {
    if (connection) connection.release();
  }
});

export const countDropDownEngines = async (
  connection,
  actualColumn,
  currentcolumn,
  appliedFilters,
  result
) => {
  delete appliedFilters[currentcolumn];
  if (!result || result.length === 0) return;

  var wherePart = "";

  for (const key of Object.keys(appliedFilters)) {
    var columnKey = engineVarToColumn[key];
    if (appliedFilters[key].length === 0) continue;
    wherePart += "(";
    for (const value of appliedFilters[key]) {
      if (columnKey === "Accommodation_Location")
        columnKey = "al.Accommodation_Location";
      wherePart += ` ${columnKey} = '${value}' OR`;
    }
    wherePart = wherePart.slice(0, -3);
    wherePart += ") AND ";
  }
  wherePart = wherePart.slice(0, -4);
  if (wherePart !== "") wherePart = `WHERE ${wherePart}`;
  var sumString = "";
  const diffValueOfResult = result.map((obj) => obj[actualColumn]);
  for (const obj of diffValueOfResult) {
    sumString += `SUM(CASE WHEN ${
      actualColumn === "Accommodation_Location"
        ? "al.Accommodation_Location"
        : actualColumn
    } = '${obj}' THEN 1 ELSE 0 END) AS \`${obj}\`,`;
  }

  var query = `SELECT ${sumString.slice(
    0,
    -1
  )} FROM Engine_General ${wherePart};`;

  const [check] = await connection.query(query, []);
  result.map((item) => {
    // Find the matching value from the check array
    const itemCount = check[0][item[actualColumn]];

    if (itemCount) {
      // Add the check value to occurrence_cnt
      item.occurrence_cnt = parseInt(itemCount);
    }
    return item;
  });
};

export default searchEngineRouter;
