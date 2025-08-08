import { Router } from "express";
import db_connection from "../config/dbConfig.js";
import { initialize_service, handle_error_response, build_joins, build_where_clause, build_range_facets } from "../utils/Common_Utils.js"
const search_Router = Router();

// Endpoint to provide the UI with the fields needed to build the search form.

search_Router.get("/:service_name/search-options", initialize_service, (request, response) => {
    response.json({ ok: true, data: request.service_config.searchable_fields || [] });
});
search_Router.get("/:service_name/search", initialize_service, async (request, response) => {
    try {

        // We get both the config and mappings from the request object.

        const { service_config, service_mappings } = request;
        const query = `  SELECT \`${service_config.main_table}\`.* FROM \`${service_config.main_table}\` ${build_joins(service_config)} 
                         ${build_where_clause(request.query.filters || {}, service_mappings)}ORDER BY \`${service_config.main_table}\`.\`${service_config.primary_key}\` DESC LIMIT 50 OFFSET 0 `;
        console.log("Executing Query:", query.trim().replace(/\s+/g, ' ')); 
        const [results] = await db_connection.query(query);
        response.json({ ok: true, data: results });
    } catch (error) {
        handle_error_response(response, `Search failed: ${error.message}`);
    }
});
search_Router.get("/:service_name/details/:id", initialize_service, async (request, response) => {
    try {
        const { service_config } = request;
        const all_columns = (service_config.join_tables || []).map(t => `\`${t}\`.*`).join(', ');
        const query = ` SELECT \`${service_config.main_table}\`.*FROM \`${service_config.main_table}\` ${build_joins(service_config)}
                        ${build_where_clause(request.query.filters || {}, service_mappings)}ORDER BY \`${service_config.main_table}\`.\`${service_config.primary_key}\` DESC LIMIT 50 OFFSET 0`;
        console.log('Details query:', query);  
        console.log('Params:', request.params.id);
        const [results] = await db_connection.query(query, [request.params.id]);
        if (results.length === 0) {
            return handle_error_response(response, 'Record not found', 404);
        }
        response.json({ ok: true, data: results[0] });
    } catch (error) {
        handle_error_response(response, `Details fetch failed: ${error.message}`);
    }
});
search_Router.get("/:service_name/facets/:field", initialize_service, async (request, response) => {
    try {
        const { field } = request.params;
        const { service_config } = request;
        const { mappings } = service_config;

        const column_name = mappings.var_to_column[field];
        if (!column_name) {
            return handle_error_response(response, `Field '${field}' not found.`, 404);
        }
        const table_name = mappings.var_to_table[field];

        if (request.query.range) {
            const query = build_range_facets(table_name, column_name, parseInt(request.query.range));
            const [ranges] = await db_connection.query(query);
            return response.json({ ok: true, facets: ranges });
        } else {
            const query = `SELECT DISTINCT ${column_name} AS value FROM ${table_name} WHERE ${column_name} IS NOT NULL ORDER BY value ASC LIMIT 200 `;
            const [values] = await db_connection.query(query);
            return response.json({ ok: true, facets: values.map(value => value.value) });
        }
    } catch (error) {
        handle_error_response(response, `Facets failed for field '${request.params.field}': ${error.message}`);
    }
});

export default search_Router;