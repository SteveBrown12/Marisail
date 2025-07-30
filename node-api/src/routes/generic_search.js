import { Router } from "express";
import dbConnection from "../config/dbConfig.js";
import {
    engine_Var_To_Column,
    engine_Var_To_Table,
    engine_Unique_Table,
    trailer_Var_To_Column,
    trailer_Var_To_Table,
    trailer_Unique_Table,
    berth_Var_To_Column,
    berth_Var_To_Table,
    berth_Unique_Table,
    charter_Var_To_Column,
    charter_Var_To_Table,
    charter_Unique_Table,
    transport_Var_To_Column,
    transport_Var_To_Table,
    transport_Unique_Table,
    shop_Var_To_Column,
    shop_Var_To_Table,
    shop_Unique_Table,
    auction_Var_To_Column,
    auction_Var_To_Table,
    auction_Unique_Table,
} from "../config/All_service_config.js";

const genericSearchRouter = Router();

// Map service to variable sets
const SERVICE_MAP = {
    engine: {
        varToColumn: engine_Var_To_Column,
        varToTable: engine_Var_To_Table,
        uniqueTable: engine_Unique_Table,
    },
    trailer: {
        varToColumn: trailer_Var_To_Column,
        varToTable: trailer_Var_To_Table,
        uniqueTable: trailer_Unique_Table,
    },
    berth: {
        varToColumn: berth_Var_To_Column,
        varToTable: berth_Var_To_Table,
        uniqueTable: berth_Unique_Table,
    },
    charter: {
        varToColumn: charter_Var_To_Column,
        varToTable: charter_Var_To_Table,
        uniqueTable: charter_Unique_Table,
    },
    transport: {
        varToColumn: transport_Var_To_Column,
        varToTable: transport_Var_To_Table,
        uniqueTable: transport_Unique_Table,
    },
    shop: {
        varToColumn: shop_Var_To_Column,
        varToTable: shop_Var_To_Table,
        uniqueTable: shop_Unique_Table,
    },
    auction: {
        varToColumn: auction_Var_To_Column,
        varToTable: auction_Var_To_Table,
        uniqueTable: auction_Unique_Table,
    },
};

// Utility to extract service from route, e.g. /search_engine -> engine
function extractService(req) {
    const serviceRoute = req.baseUrl.replace(/^\/+/, "");
    let service = serviceRoute.replace(/^search_/, "");
    if (service === "chandlery") service = "shop";
    return service;
}

// GET /search_xxx/:tableName
genericSearchRouter.get("/:tableName", async (req, res) => {
    let connection;
    try {
        const service = extractService(req);
        const { uniqueTable, varToColumn } = SERVICE_MAP[service] || {};
        const { tableName } = req.params;
        if (!uniqueTable || !uniqueTable.includes(tableName)) {
            return res.status(404).json({ ok: false, message: "Table not found" });
        }
        connection = await dbConnection.getConnection();
        // Use the first variable as default column
        const firstVar = Object.keys(varToColumn).find(
            (v) => SERVICE_MAP[service].varToTable[v] === tableName
        );
        const firstColumn = firstVar ? varToColumn[firstVar] : null;
        if (!firstColumn) return res.status(404).json({ ok: false, message: "No columns found" });

        const [rows] = await connection.query(
            `SELECT ??, COUNT(*) AS occurrence_cnt FROM ?? GROUP BY ??`,
            [firstColumn, tableName, firstColumn]
        );
        const tableNames = rows.map(row => Object.values(row));
        return res.status(200).json({ ok: true, tables: tableNames });
    } catch (err) {
        return res.status(500).json({ ok: false, message: err.message });
    } finally {
        if (connection) connection.release();
    }
});

// POST /search_xxx/:tableName
genericSearchRouter.post("/:tableName", async (req, res) => {
    let connection;
    try {
        const service = extractService(req);
        const { varToColumn, uniqueTable } = SERVICE_MAP[service] || {};
        const { tableName } = req.params;
        const filter = req.body.filter;
        if (!uniqueTable || !uniqueTable.includes(tableName)) {
            return res.status(404).json({ ok: false, message: "Table not found" });
        }
        connection = await dbConnection.getConnection();

        for (const key of Object.keys(filter)) {
            const colName = varToColumn[key];
            if (!colName) continue;
            const columnCheck = await connection.query(
                `SELECT COLUMN_NAME FROM information_schema.columns WHERE table_name = ? AND table_schema = 'Marisail' AND column_name = ?`,
                [tableName, colName]
            );
            if (columnCheck[0].length > 0) {
                const [rows] = await connection.query(
                    `SELECT ??, COUNT(*) AS occurrence_cnt FROM ?? GROUP BY ??`,
                    [colName, tableName, colName]
                );
                filter[key] = rows.map(row => Object.values(row));
            }
        }
        return res.status(200).json({ ok: true, res: filter });
    } catch (err) {
        return res.status(500).json({ ok: false, message: err.message });
    } finally {
        if (connection) connection.release();
    }
});

// POST /search_xxx/:tableName/Data
genericSearchRouter.post("/:tableName/Data", async (req, res) => {
    let connection;
    try {
        const service = extractService(req);
        const { varToColumn, uniqueTable } = SERVICE_MAP[service] || {};
        const { tableName } = req.params;
        const page = req.body.page || 0;
        const selectedOptions = req.body.selectedOptions || {};
        if (!uniqueTable || !uniqueTable.includes(tableName)) {
            return res.status(404).json({ ok: false, message: "Table not found" });
        }
        // Build filter object: { columnName: [values] }
        let filter = {};
        for (const key of Object.keys(selectedOptions)) {
            const colKey = varToColumn[key];
            if (!colKey) continue;
            if (!filter[colKey]) filter[colKey] = [key];
            else filter[colKey].push(key);
        }

        connection = await dbConnection.getConnection();

        // Build SELECT columns (first 3 columns)
        const allVars = Object.keys(varToColumn).filter(
            (v) => SERVICE_MAP[service].varToTable[v] === tableName
        );
        const selectCols = allVars
            .map(v => varToColumn[v])
            .slice(0, 3)
            .join(", ");

        let query = `SELECT ${selectCols} FROM ?? `;
        let params = [tableName];

        // Build WHERE clause
        if (Object.keys(filter).length > 0) {
            query += "WHERE ";
            let whereParts = [];
            for (const key of Object.keys(filter)) {
                let temp = `${key} IN (${filter[key].map(() => "?").join(",")})`;
                whereParts.push(temp);
                params.push(...filter[key]);
            }
            query += whereParts.join(" OR ");
        }

        query += ` LIMIT 60 OFFSET ${page * 30};`;

        const [rows] = await connection.query(query, params);

        return res.status(200).json({ ok: true, res: rows });
    } catch (err) {
        return res.status(500).json({ ok: false, message: err.message });
    } finally {
        if (connection) connection.release();
    }
});

// GET /search_xxx/:tableName-detail/:id
genericSearchRouter.get("/:tableName-detail/:id", async (req, res) => {
    let connection;
    try {
        const service = extractService(req);
        const { uniqueTable } = SERVICE_MAP[service] || {};
        const { tableName, id } = req.params;
        if (!uniqueTable || !uniqueTable.includes(tableName)) {
            return res.status(404).json({ ok: false, message: "Table not found" });
        }
        connection = await dbConnection.getConnection();

        // Build SELECT with JOINs
        let query = `SELECT`;
        uniqueTable.forEach((table) => {
            query += ` ${table}.*,`;
        });
        query = query.slice(0, -1);
        query += ` FROM ${uniqueTable[0]}`;
        for (let i = 1; i < uniqueTable.length; i++) {
            query += ` JOIN ${uniqueTable[i]} ON ${uniqueTable[0]}.id = ${uniqueTable[i]}.id`;
        }
        query += ` WHERE ${uniqueTable[0]}.id = ?;`;

        const [rows] = await connection.query(query, [id]);
        return res.status(200).json({ ok: true, res: rows });
    } catch (err) {
        return res.status(500).json({ ok: false, message: err.message });
    } finally {
        if (connection) connection.release();
    }
});

export default genericSearchRouter;