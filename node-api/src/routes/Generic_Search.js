import { Router } from "express";
import db_connection from "../config/dbConfig.js";
import { initialize_Service, handle_Error_Response, build_Joins, build_Where_Clause, build_Range_Facets } from "../utils/Common_Utils.js"
const search_Router = Router();

// → Returns the service configuration & field mappings so the UI can build a search form.

search_Router.get("/:service_name/search-options", initialize_Service, (request, response) => {
    const { service_config, service_mappings } = request;
    response.json({ ok: true, data:{ service_config, service_mappings }});
});

// → Executes a search query on the main table (plus joins) using optional filters, sorted by primary key, and returns up to 50 results.
// Key Functionality #1 — Search – MULTI‑SEARCH Code  // Key Functionality #7 - FROM TO range handling


search_Router.get("/:service_name/search", initialize_Service, async (request, response) => {
  try {
    const { service_config, service_mappings } = request;

    const where_Sql = build_Where_Clause(request.query.filters || {}, service_mappings);

    // Build search query
    
    const query = `
      SELECT \`${service_config.main_table}\`.*
      FROM \`${service_config.main_table}\`
      ${build_Joins(service_config)}
      ${where_Sql}
      ORDER BY \`${service_config.main_table}\`.\`${service_config.primary_key}\` DESC
      LIMIT 50 OFFSET 0
    `.trim().replace(/\s+/g, ' ');

    console.log("Executing Query:", query);
    const [results] = await db_connection.query(query);

    // Dynamic count (#2)

    const count_Query = `
      SELECT COUNT(*) as totalCount
      FROM \`${service_config.main_table}\`
      ${build_Joins(service_config)}
      ${where_Sql}
    `.trim().replace(/\s+/g, ' ');

    const [count_Rows] = await db_connection.query(count_Query);

    response.json({ ok: true, totalCount: count_Rows[0].totalCount, data: results });

  } catch (error) {
    handle_Error_Response(response, `Search failed: ${error.message}`);
  }
});

// // Key Functionality #3 - Search - DETAILED RESULTS Code (Details Panels) → Fetches a single record’s details by ID (with joined tables if applicable).

search_Router.get("/:service_name/details/:id", initialize_Service, async (request, response) => {
  try {
    const { service_config } = request;
    const id = request.params.id;
 const main = service_config.main_table;
const primary_Key = service_config.primary_key;
const select_List = [
  `\`${main}\`.*`,
  `\`${main}\`.\`${primary_Key}\` AS \`${main}__${primary_Key}\``,
  ...(Array.isArray(service_config.join_tables)
    ? service_config.join_tables.map(t => `\`${t}\`.*`)
    : [])
].join(", ");

const query = `
 SELECT ${select_List}FROM \`${main}\` ${build_Joins(service_config)}WHERE \`${main}\`.\`${primary_Key}\` = ?LIMIT 1
`;
    console.log("Details query:", query, "with id:", id);
    const [results] = await db_connection.query(query, [id]);
    if (results.length === 0) {
      return handle_Error_Response(response, 'Record not found', 404);
    }
    response.json({ ok: true, data: results[0] });
  } catch (error) {
    handle_Error_Response(response, `Details fetch failed: ${error.message}`);
  }
});

// → Returns unique values (or numeric range buckets if ?range= provided) for a given field in the service’s mapping.

search_Router.get("/:service_name/facets/:field", initialize_Service, async (request, response) => {
  try {
    const { field } = request.params;
    const { service_mappings } = request;

    // Use logical field name → lookup real DB column & table

    const columnName = service_mappings.var_To_Column[field];
    const tableName = service_mappings.var_To_Table[field];

    if (!columnName || !tableName) {
      return handle_Error_Response(response, `Field '${field}' not configured`, 404);
    }

    // If numeric/measurement range bucket requested

    if (request.query.range) {
      const query = build_Range_Facets(tableName, columnName, parseInt(request.query.range));
      const [ranges] = await db_connection.query(query);
      return response.json({ ok: true, facets: ranges });
    }

    // Default: return DISTINCT values like options() used to

    const query = `
      SELECT DISTINCT \`${columnName}\` AS value
      FROM \`${tableName}\`
      WHERE \`${columnName}\` IS NOT NULL
      ORDER BY value ASC
      LIMIT 200
    `;
    const [rows] = await db_connection.query(query);
    return response.json({ ok: true, facets: rows.map(r => r.value) });

  } catch (error) {
    handle_Error_Response(
      response,
      `Facets failed for field '${request.params.field}': ${error.message}`
    );
  }
});
export default search_Router;
