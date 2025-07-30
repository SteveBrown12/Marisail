import { Router } from "express";
import dbConnection from "../config/dbConfig.js";
import {  SERVICES } from "../config/All_service_config.js";

const genericAdvertRouter = Router();

// Helper to get config for a service
function getAdvertConfig(serviceName) {
    const config = SERVICES[serviceName];
    if (!config) throw new Error(`Unknown service: ${serviceName}`);
    return config;
}

// POST /api/generic_advert/:service
genericAdvertRouter.post("/:service", async (req, res) => {
    let connection;
    try {
        const serviceRoute = req.baseUrl.replace(/^\/+/, ""); // Remove leading slash
        // Remove "api/advert_" prefix and map to service name (e.g. "api/advert_berth" -> "berth")
        const service = serviceRoute.replace(/^api\/advert_/, "");
        if(service == "chandlery") {
            service = "shop"; 
        }
        console.log("Service:", service);
        const config = getAdvertConfig(service);
        const filter = req.body;
        connection = await dbConnection.getConnection();

        for (const key of Object.keys(filter)) {
            let tableInfo;
            for (const table of config.tables) {
                if (table.columns[key]) {
                    tableInfo = {
                        tableName: table.table_Name,
                        columnName: table.columns[key].column_Name,
                    };
                    break;
                }
            }
            if (!tableInfo) continue;

            const columnCheck = await connection.query(
                `SELECT COLUMN_NAME
                 FROM information_schema.columns
                 WHERE table_name = ? AND table_schema = 'Marisail' AND column_name = ?`,
                [tableInfo.tableName, tableInfo.columnName]
            );
            if (columnCheck[0].length > 0) {
                const tables = await connection.query(
                    `SELECT DISTINCT ?? FROM ?? WHERE ?? IS NOT NULL GROUP BY ??`,
                    [
                        tableInfo.columnName,
                        tableInfo.tableName,
                        tableInfo.columnName,
                        tableInfo.columnName,
                    ]
                );
                filter[key] = tables[0].map((row) => Object.values(row));
            }
        }
        return res.status(200).json({ ok: true, res: filter });
    } catch (err) {
        return res.status(500).json({ ok: false, message: err.message });
    } finally {
        if (connection) connection.release();
    }
});

// POST /api/generic_advert/:tableName/:fetchColumn
genericAdvertRouter.post("/:tableName/:fetchColumn", async (req, res) => {
    let connection;
    try {
        // Expect service name in req.body.service
        const { service } = req.body;
        if (!service) {
            return res.status(400).json({ ok: false, message: "Missing service in request body" });
        }
        const config = getAdvertConfig(service);
        const { tableName, fetchColumn } = req.params;
        connection = await dbConnection.getConnection();

        let queryParams = {};
        let filters = [];
        let fetchColumnName;
        for (const table of config.tables) {
            if (table.table_Name === tableName && table.columns[fetchColumn]) {
                fetchColumnName = table.columns[fetchColumn].column_Name;
                break;
            }
        }
        config.tables.forEach((table) => {
            Object.entries(table.columns).forEach(([key, col]) => {
                if (req.body?.requestBody?.[key]) {
                    queryParams[col.column_Name] = req.body.requestBody[key];
                }
            });
        });
        for (const [key, value] of Object.entries(queryParams)) {
            if (value) filters.push(`${key} = '${value}'`);
        }
        const filterOptions = filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";
        const [rows] = await connection.query(
            `SELECT DISTINCT ?? FROM ?? ${filterOptions} GROUP BY ?? ORDER BY ??`,
            [fetchColumnName, tableName, fetchColumnName, fetchColumnName]
        );
        const formattedResult = rows.map((row) => [Object.values(row)[0]]);
        return res.status(200).json({ ok: true, result: formattedResult });
    } catch (err) {
        return res.status(500).json({ ok: false, message: err.message });
    } finally {
        if (connection) connection.release();
    }
});

// POST /api/generic_advert/relevant_data
genericAdvertRouter.post("/relevant_data", async (req, res) => {
    let connection;
    try {
        // Expect service name in req.body.service
        const { service } = req.body;
        if (!service) {
            return res.status(400).json({ ok: false, message: "Missing service in request body" });
        }
        const config = getAdvertConfig(service);
        connection = await dbConnection.getConnection();

        // Build queryParams from request body (supports nested structure like engineDetails)
        let queryParams = {};
        const selectedOptions = req.body?.allSelectedOptions?.engineDetails || req.body;
        config.tables.forEach((table) => {
            Object.entries(table.columns).forEach(([key, col]) => {
                if (selectedOptions[key]) {
                    queryParams[col.column_Name] = selectedOptions[key];
                }
            });
        });

        // Build filters for SQL WHERE clause
        const filters = [];
        for (const [key, value] of Object.entries(queryParams)) {
            if (value) filters.push(`${key} = '${value}'`);
        }
        const filterOptions = filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";

        // Get main table PKs
        const mainTable = config.main_table || config.tables[0].table_Name;
        const mainPK = config.primary_key || "Engine_ID";
        const [ids] = await connection.query(
            `SELECT DISTINCT ?? FROM ?? ${filterOptions} ORDER BY ??`,
            [mainPK, mainTable, mainPK]
        );
        if (ids.length === 0) {
            return res.status(404).json({ ok: false, message: "No data found" });
        }

        // For each table, get most relevant value for each column
        let results = {};
        for (let table of config.tables) {
            const [columns] = await connection.query("SHOW COLUMNS FROM ??", [table.table_Name]);
            for (let column of columns) {
                const columnName = column.Field;
                if (columnName !== mainPK) {
                    const [rows] = await connection.query(
                        `SELECT DISTINCT ?? FROM ?? WHERE ?? IN (?) AND ?? IS NOT NULL GROUP BY ?? ORDER BY COUNT(*) DESC LIMIT 0,1`,
                        [
                            columnName,
                            table.table_Name,
                            mainPK,
                            ids.map((row) => row[mainPK]),
                            columnName,
                            columnName,
                        ]
                    );
                    // Find config key for this column
                    const key = Object.keys(table.columns).find(
                        (k) => table.columns[k].column_Name === columnName
                    );
                    if (key) results[key] = rows.map((row) => row[columnName]);
                }
            }
        }
        return res.status(200).json({ ok: true, result: results });
    } catch (err) {
        return res.status(500).json({ ok: false, message: err.message });
    } finally {
        if (connection) connection.release();
    }
});

// POST /api/generic_advert/
genericAdvertRouter.post("/", async (req, res) => {
    let connection;
    try {
        // Extract service from the route path, e.g. /advert_berth, /advert_engine, etc.
        // req.baseUrl will be something like "/advert_berth"
        const serviceRoute = req.baseUrl.replace(/^\/+/, ""); // Remove leading slash
        // Map route to service name (e.g. "advert_berth" -> "berth")
        const service = serviceRoute.replace(/^advert_/, "");
        const config = getAdvertConfig(service);
        const filter = req.body;
        connection = await dbConnection.getConnection();

        for (const key of Object.keys(filter)) {
            let tableInfo;
            for (const table of config.tables) {
                if (table.columns[key]) {
                    tableInfo = {
                        tableName: table.table_Name,
                        columnName: table.columns[key].column_Name,
                    };
                    break;
                }
            }
            if (!tableInfo) continue;

            const columnCheck = await connection.query(
                `SELECT COLUMN_NAME
                 FROM information_schema.columns
                 WHERE table_name = ? AND table_schema = 'Marisail' AND column_name = ?`,
                [tableInfo.tableName, tableInfo.columnName]
            );
            if (columnCheck[0].length > 0) {
                const tables = await connection.query(
                    `SELECT DISTINCT ?? FROM ?? WHERE ?? IS NOT NULL GROUP BY ??`,
                    [
                        tableInfo.columnName,
                        tableInfo.tableName,
                        tableInfo.columnName,
                        tableInfo.columnName,
                    ]
                );
                filter[key] = tables[0].map((row) => Object.values(row));
            }
        }
        return res.status(200).json({ ok: true, res: filter });
    } catch (err) {
        return res.status(500).json({ ok: false, message: err.message });
    } finally {
        if (connection) connection.release();
    }
});

export default genericAdvertRouter;