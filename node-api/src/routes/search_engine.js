import { Router } from "express";
import dbConnection from "../config/dbConfig.js";

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
searchEngineRouter.get("/columns/:tableName", async (req, res) => {
  const { tableName } = req.params;
  let connection;
  try {
    connection = await dbConnection.getConnection();
    const [columns] = await connection.query("SHOW COLUMNS FROM ??", [
      tableName,
    ]);
    const columnNames = columns.map((column) => column.Field);
    return res.status(200).json({ ok: true, columns: columnNames });
  } catch (err) {
    return res.status(500).json({ ok: false, message: err.message });
  } finally {
    if (connection) connection.release();
  }
});
// Path     :   /api/search_engine/engine-detail/:id
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
        ec.*,
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
      FROM engine_general e
      LEFT JOIN engine_condition ec ON e.engine_id = ec.engine_id
      LEFT JOIN engine_cooling ecool ON e.engine_id = ecool.engine_id
      LEFT JOIN engine_dimensions ed ON e.engine_id = ed.engine_id
      LEFT JOIN engine_electrical ee ON e.engine_id = ee.engine_id
      LEFT JOIN engine_emissions eem ON e.engine_id = eem.engine_id
      LEFT JOIN engine_fuel ef ON e.engine_id = ef.engine_id
      LEFT JOIN engine_location el ON e.engine_id = el.engine_id
      LEFT JOIN engine_maintenance em ON e.engine_id = em.engine_id
      LEFT JOIN engine_mounting emount ON e.engine_id = emount.engine_id
      LEFT JOIN engine_oil eo ON e.engine_id = eo.engine_id
      LEFT JOIN engine_performance ep ON e.engine_id = ep.engine_id
      LEFT JOIN engine_propulsion eps ON e.engine_id = eps.engine_id
      LEFT JOIN engine_safety es ON e.engine_id = es.engine_id
      LEFT JOIN engine_transmission et ON e.engine_id = et.engine_id
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
// Path     :   /api/search_engine/:tableName/:columnName
// Method   :   Get
// Access   :   Public
// Desc     :   Endpoint to get columns against a table
searchEngineRouter.get("/:tableName/:columnName", async (req, res) => {
  const { tableName, columnName } = req.params;
  let connection;

  try {
    connection = await dbConnection.getConnection();

    // Validate table name to prevent SQL injection
    const [tables] = await connection.query("SHOW TABLES");
    const validTable = tables.some(
      (table) => Object.values(table)[0] === tableName
    );

    if (!validTable) {
      return res
        .status(400)
        .json({ ok: false, message: `Invalid table name: ${tableName}` });
    }

    // Validate column name to prevent SQL injection
    const [columns] = await connection.query("SHOW COLUMNS FROM ??", [
      tableName,
    ]);
    const validColumn = columns.some((column) => column.Field === columnName);

    if (!validColumn) {
      return res
        .status(400)
        .json({ ok: false, message: `Invalid column name: ${columnName}` });
    }

    // Use placeholders for dynamic table and column names
    const [rows] = await connection.query(
      `SELECT ??, COUNT(*) as count FROM ?? GROUP BY ?? ORDER BY ??`,
      [columnName, tableName, columnName, columnName]
    );

    return res.status(200).json({
      ok: true,
      result: rows.map((row) => ({
        value: row[columnName],
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
    console.log(req.query);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 21;
    const offset = (page - 1) * limit;

    const tables = JSON.parse(req.query.t || "[]");
    const columns = JSON.parse(req.query.c || "[]");
    const values = JSON.parse(req.query.v || "[]");

    if (
      !Array.isArray(tables) ||
      !Array.isArray(columns) ||
      !Array.isArray(values)
    ) {
      return res
        .status(400)
        .json({ error: "Invalid query parameters format." });
    }

    let countQuery = "SELECT COUNT(*) AS total FROM engine_general e";
    const countQueryParams = [];

    let staticJoins = `
      LEFT JOIN engine_condition t1 ON e.engine_id = t1.engine_id
      LEFT JOIN engine_cooling t2 ON e.engine_id = t2.engine_id
      LEFT JOIN engine_dimensions t3 ON e.engine_id = t3.engine_id
      LEFT JOIN engine_electrical t4 ON e.engine_id = t4.engine_id
      LEFT JOIN engine_emissions t5 ON e.engine_id = t5.engine_id
      LEFT JOIN engine_equipment t6 ON e.engine_id = t6.engine_id
      LEFT JOIN engine_fuel t7 ON e.engine_id = t7.engine_id
      LEFT JOIN engine_location t8 ON e.engine_id = t8.engine_id
      LEFT JOIN engine_maintenance t9 ON e.engine_id = t9.engine_id
      LEFT JOIN engine_mounting t10 ON e.engine_id = t10.engine_id
      LEFT JOIN engine_oil t11 ON e.engine_id = t11.engine_id
      LEFT JOIN engine_performance t12 ON e.engine_id = t12.engine_id
      LEFT JOIN engine_propulsion t13 ON e.engine_id = t13.engine_id
      LEFT JOIN engine_safety t14 ON e.engine_id = t14.engine_id
      LEFT JOIN engine_transmission t15 ON e.engine_id = t15.engine_id
    `;

    const aliasMap = {
      engine_general: "e",
      engine_condition: "t1",
      engine_cooling: "t2",
      engine_dimensions: "t3",
      engine_electrical: "t4",
      engine_emissions: "t5",
      engine_equipment: "t6",
      engine_fuel: "t7",
      engine_location: "t8",
      engine_maintenance: "t9",
      engine_mounting: "t10",
      engine_oil: "t11",
      engine_performance: "t12",
      engine_propulsion: "t13",
      engine_safety: "t14",
      engine_transmission: "t15",
    };

    let dynamicJoins = "";
    let conditions = [];

    tables.forEach((table, index) => {
      if (columns[index] && values[index]) {
        if (!aliasMap[table]) {
          const alias = `t${Object.keys(aliasMap).length + 1}`;
          dynamicJoins += ` LEFT JOIN ${table} ${alias} ON e.engine_id = ${alias}.engine_id `;
          aliasMap[table] = alias;
        }

        const tableAlias = aliasMap[table];
        conditions.push(`${tableAlias}.${columns[index]} LIKE ?`);
        countQueryParams.push(`%${values[index]}%`);
      }
    });

    if (conditions.length > 0) {
      countQuery += ` ${staticJoins} ${dynamicJoins} WHERE ${conditions.join(
        " AND"
      )}`;
    }

    console.log("Count Query:", countQuery);
    console.log("Count Query Params:", countQueryParams);

    const [[countResult]] = await connection.query(
      countQuery,
      countQueryParams
    );
    const totalRecords = countResult.total;
    const totalPages = Math.ceil(totalRecords / limit);

    let dataQuery = `
      SELECT e.*, t1.*, t2.*, t3.*, t4.*, t5.*, t6.*, t7.*, t8.*, t9.*, t10.*, t11.*, t12.*, t13.*, t14.*, t15.*
      FROM engine_general e
    `;

    dataQuery += staticJoins + dynamicJoins;

    if (conditions.length > 0) {
      dataQuery += ` WHERE ${conditions.join(" OR ")}`;
    }

    dataQuery += " LIMIT ? OFFSET ?";
    const dataQueryParams = [...countQueryParams, limit, offset];

    console.log("Data Query:", dataQuery);
    console.log("Data Query Params:", dataQueryParams);

    const [results] = await connection.query(dataQuery, dataQueryParams);

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

const validateJSON = (jsonString) => {
  try {
    const parsed = JSON.parse(jsonString);
    if (Array.isArray(parsed)) {
      return parsed;
    } else {
      throw new Error("Parsed JSON is not an array");
    }
  } catch (e) {
    console.error("Invalid JSON:", e);
    return [];
  }
};
const buildQuery = (tables, columns, values, page, limit) => {
  // Construct the WHERE clause based on the columns and values
  let whereClauses = columns.map((column, index) => {
    return `${column} LIKE ?`;
  });

  let whereSql = whereClauses.join(" AND ");

  // Construct the SQL query
  let query = `
    SELECT e.*, t1.*, t2.*, t3.*, t4.*, t5.*, t6.*, t7.*, t8.*, t9.*, t10.*, t11.*, t12.*, t13.*, t14.*, t15.*
    FROM ${tables.join(", ")}
    WHERE ${whereSql}
    LIMIT ? OFFSET ?
  `;

  // Calculate the offset
  const offset = (page - 1) * limit;

  return {
    query,
    params: [...values, limit, offset],
  };
};

// Example usage in the route handler

const getAllTables = async () => {
  let connection;
  connection = await dbConnection.getConnection();
  try {
    const [rows] = await connection.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = DATABASE();
    `);
    return rows.map((row) => row.table_name);
  } catch (error) {
    throw new Error(`Error fetching tables: ${error.message}`);
  }
};

const getAllColumns = async (tableName) => {
  let connection;
  connection = await dbConnection.getConnection();
  try {
    const [rows] = await connection.query(
      `
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = DATABASE()
      AND table_name = ?;
    `,
      [tableName]
    );
    return rows.map((row) => row.column_name);
  } catch (error) {
    throw new Error(`Error fetching columns: ${error.message}`);
  }
};

export default searchEngineRouter;
