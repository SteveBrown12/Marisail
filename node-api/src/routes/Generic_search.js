// generic_search_router.js

import { Router } from "express";
import db_connection from "../config/dbConfig.js";
import { 
    initialize_service, 
    handle_error_response,
    build_joins,
    build_where_clause,
    build_range_facets
} from "../utils/common_utils.js"; // Import the new query builders

const search_router = Router();

// Endpoint to provide the UI with the fields needed to build the search form.
search_router.get("/:service_name/search-options", initialize_service, (req, res) => {
    res.json({ ok: true, data: req.service_config.searchable_fields || [] });
});

// The main search route, using the imported builders.
// search_router.get("/:service_name/search", initialize_service, async (req, res) => {
//     try {
//         const { service_config } = req;
//         const query = `
//             SELECT ${service_config.main_table}.*
//             FROM ${service_config.main_table}
//             ${build_joins(service_config)}
//             ${build_where_clause(req.query.filters || {}, service_config.mappings)}
//             ORDER BY ${service_config.main_table}.${service_config.primary_key} DESC
//             LIMIT 50 OFFSET 0
//         `;
//         const [results] = await db_connection.query(query);
//         res.json({ ok: true, data: results });
//     } catch (err) {
//         handle_error_response(res, `Search failed: ${err.message}`);
//     }
// });

search_router.get("/:service_name/search", initialize_service, async (req, res) => {
    try {
        // We get both the config and mappings from the request object.
        const { service_config, service_mappings } = req; 

        const query = `
            SELECT \`${service_config.main_table}\`.*
            FROM \`${service_config.main_table}\`
            ${build_joins(service_config)}
            ${build_where_clause(req.query.filters || {}, service_mappings)}
            ORDER BY \`${service_config.main_table}\`.\`${service_config.primary_key}\` DESC
            LIMIT 50 OFFSET 0
        `;
        
        console.log("Executing Query:", query.trim().replace(/\s+/g, ' ')); // Add this for debugging
        
        const [results] = await db_connection.query(query);
        res.json({ ok: true, data: results });
    } catch (err) {
        handle_error_response(res, `Search failed: ${err.message}`);
    }
});


// search_router.get("/:service_name/search", initialize_service, async (req, res) => {
//     try {
//         console.log("=== DEBUGGING SEARCH ROUTE ===");
//         console.log("req.main_table_info:", req.main_table_info);
//         console.log("req.service_mappings:", !!req.service_mappings);
//         console.log("req.service_config_array:", !!req.service_config_array);
        
//         // If you're using build_joins, check this:
//         if (req.main_table_info?.join_tables) {
//             console.log("About to call build_joins with join_tables:",join_tables);
//         }
        
//         // Check if filters are being processed
//         console.log("Filters from query:", req.query.filters);
        
//         // ... rest of your search logic
        
//     } catch (err) {
//         console.error("Error in search route:", err);
//         handle_error_response(res, `Search failed: ${err.message}`);
//     }
// });

// The details route, now fully implemented and using the imported builder.
search_router.get("/:service_name/details/:id", initialize_service, async (req, res) => {
    try {
        const { service_config } = req;
        const all_columns = service_config.join_tables.map(t => `${t}.*`).join(', ');

        const query = `
            SELECT ${service_config.main_table}.*, ${all_columns}
            FROM ${service_config.main_table}
            ${build_joins(service_config)}
            WHERE ${service_config.main_table}.${service_config.primary_key} = ?
        `;
        const [results] = await db_connection.query(query, [req.params.id]);

        if (results.length === 0) {
            return handle_error_response(res, 'Record not found', 404);
        }
        res.json({ ok: true, data: results[0] });
    } catch (err) {
        handle_error_response(res, `Details fetch failed: ${err.message}`);
    }
});

// RESTORED: The facets route for getting filter options (e.g., all distinct locations).
search_router.get("/:service_name/facets/:field", initialize_service, async (req, res) => {
    try {
        const { field } = req.params;
        const { service_config } = req;
        const { mappings } = service_config;

        const column_name = mappings.var_to_column[field];
        if (!column_name) {
            return handle_error_response(res, `Field '${field}' not found.`, 404);
        }
        const table_name = mappings.var_to_table[field];

        if (req.query.range) {
            const query = build_range_facets(table_name, column_name, parseInt(req.query.range));
            const [ranges] = await db_connection.query(query);
            return res.json({ ok: true, facets: ranges });
        } else {
            const query = `
                SELECT DISTINCT ${column_name} AS value FROM ${table_name}
                WHERE ${column_name} IS NOT NULL ORDER BY value ASC LIMIT 200
            `;
            const [values] = await db_connection.query(query);
            return res.json({ ok: true, facets: values.map(v => v.value) });
        }
    } catch (err) {
        handle_error_response(res, `Facets failed for field '${req.params.field}': ${err.message}`);
    }
});

export default search_router;