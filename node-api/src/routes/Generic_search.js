import { Router } from "express";
import db_connection from "../config/dbConfig.js";
import { initialize_service, handle_error_response, build_joins, build_where_clause, build_range_facets } from "../utils/Common_Utils.js"
const search_Router = Router();

// → Returns the service configuration & field mappings so the UI can build a search form.

search_Router.get("/:service_name/search-options", initialize_service, (request, response) => {
    const { service_config, service_mappings } = request;
    response.json({ ok: true, data:{ service_config, service_mappings }});
});

// → Executes a search query on the main table (plus joins) using optional filters, sorted by primary key, and returns up to 50 results.

search_Router.get("/:service_name/search", initialize_service, async (request, response) => {
    try {
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

// → Fetches a single record’s details by ID (with joined tables if applicable).

search_Router.get("/:service_name/details/:id", initialize_service, async (request, response) => {
  try {
    const { service_config } = request;
    const id = request.params.id;
 const main = service_config.main_table;
const pk = service_config.primary_key;

const selectList = [
  `\`${main}\`.*`,
  // Preserve main PK in case it gets overwritten by join table PKs
  `\`${main}\`.\`${pk}\` AS \`${main}__${pk}\``,
  ...(Array.isArray(service_config.join_tables)
    ? service_config.join_tables.map(t => `\`${t}\`.*`)
    : [])
].join(", ");

const query = `
  SELECT ${selectList}
  FROM \`${main}\`
  ${build_joins(service_config)}
  WHERE \`${main}\`.\`${pk}\` = ?
  LIMIT 1
`;


    console.log("Details query:", query, "with id:", id);

    const [results] = await db_connection.query(query, [id]);

    if (results.length === 0) {
      return handle_error_response(response, 'Record not found', 404);
    }

    response.json({ ok: true, data: results[0] });
  } catch (error) {
    handle_error_response(response, `Details fetch failed: ${error.message}`);
  }
});

// → Returns unique values (or numeric range buckets if ?range= provided) for a given field in the service’s mapping.

search_Router.get("/:service_name/facets/:field", initialize_service, async (request, response) => {
    try {
        const { field } = request.params;
        const { service_mappings } = request;
        const column_Name = Object.keys(service_mappings.var_to_column)
                          .find(column_Name => service_mappings.var_to_column[column_Name] === field);
        if (!column_Name) {
            return handle_error_response(response, `Field '${field}' not found.`, 404);
        }
        const column_name = field;
        const table_name = service_mappings.var_to_table[column_Name];

        if (request.query.range) {
            const query = build_range_facets(table_name, column_name, parseInt(request.query.range));
            const [ranges] = await db_connection.query(query);
            return response.json({ ok: true, facets: ranges });
        } else {
            const query = `
                SELECT DISTINCT ${column_name} AS value 
                FROM ${table_name} 
                WHERE ${column_name} IS NOT NULL 
                ORDER BY value ASC 
                LIMIT 200
            `;
            const [values] = await db_connection.query(query);
            return response.json({ ok: true, facets: values.map(value => value.value) });
        }
    } catch (error) {
        handle_error_response(
            response, 
            `Facets failed for field '${request.params.field}': ${error.message}`
        );
    }
});


export default search_Router;