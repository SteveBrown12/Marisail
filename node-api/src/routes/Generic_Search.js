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
// Key Functionality #1 — Search – MULTI‑SEARCH Code
// Key Functionality #7 - FROM TO range handling

search_Router.get("/:service_name/search", initialize_Service, async (request, response) => {
  try {
    const { service_config, service_mappings } = request;

    // Build WHERE clause from filters

    const where_Sql = build_Where_Clause(request.query.filters || {}, service_mappings);
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

    // --- Count query  Key Functionality #2 - Search - DYNAMIC SEARCH COUNTS Code

    const count_Query = `
      SELECT COUNT(*) as totalCount FROM \`${service_config.main_table}\`  ${build_Joins(service_config)}   ${where_Sql}`.trim().replace(/\s+/g, ' ');
    const [count_Rows] = await db_connection.query(count_Query);

    // Send back results and total count

    response.json({ok: true,totalCount: count_Rows[0].totalCount,data: results
    });

  } catch (error) {
    handle_Error_Response(response, `Search failed: ${error.message}`);
  }
});


// // Key Functionality #3 - Search - DETAILED RESULTS Code (Details Panels) → Fetches a single record’s details by ID (with joined tables if applicable).

// search_Router.get("/:service_name/details/:id", initialize_Service, async (request, response) => {
//   try {
// const { service_config } = request;
// const id = request.params.id;
// const main = service_config.main_table;
// const primary_Key = service_config.primary_key;
// const select_List = [
//   `\`${main}\`.*`,`\`${main}\`.\`${primary_Key}\` AS \`${main}__${primary_Key}\``,  ...(Array.isArray(service_config.join_tables)
//     ? service_config.join_tables.map(t => `\`${t}\`.*`) : [])
// ].join(", ");

// const query = `
//  SELECT ${select_List} FROM \`${main}\` ${build_Joins(service_config)} WHERE \`${main}\`.\`${primary_Key}\` = ? LIMIT 1
// `;
//     console.log("Details query:", query, "with id:", id);
//     const [results] = await db_connection.query(query, [id]);
//     if (results.length === 0) {
//       return handle_Error_Response(response, 'Record not found', 404);
//     }
//         let row = results[0];
//     const safe_Key = `${main}__${primary_Key}`;
//     if ((row[primary_Key] === null || row[primary_Key] === undefined) && row[safe_Key] != null) {
//       row[primary_Key] = row[safe_Key];
//     }
//     delete row[safe_Key];
//     response.json({ ok: true, data: results[0] });
//   } catch (error) {
//     handle_Error_Response(response, `Details fetch failed: ${error.message}`);
//   }
  
// });

search_Router.get("/:service_name/details/:id", initialize_Service, async (request, response) => {
  try {
    const { service_config, service_mappings } = request;
    const id = request.params.id;
    const main = service_config.main_table;
    const primary_Key = service_config.primary_key;

    // Build select list: main table fields + alias for primary key + join tables
    const select_List = [
      `\`${main}\`.*`,
      `\`${main}\`.\`${primary_Key}\` AS \`${main}__${primary_Key}\``,
      ...(Array.isArray(service_config.join_tables) ? service_config.join_tables.map(t => `\`${t}\`.*`) : [])
    ].join(", ");

    const query = `
      SELECT ${select_List}
      FROM \`${main}\`
      ${build_Joins(service_config)}
      WHERE \`${main}\`.\`${primary_Key}\` = ?
      LIMIT 1
    `;
    console.log("Details query:", query, "with id:", id);
    const [results] = await db_connection.query(query, [id]);
    if (results.length === 0) {
      return handle_Error_Response(response, 'Record not found', 404);
    }

    const flat_Row = results[0];
    const safe_Key = `${main}__${primary_Key}`;

    // Restore PK if overwritten by join tables
    if ((flat_Row[primary_Key] === null || flat_Row[primary_Key] === undefined) && flat_Row[safe_Key] != null) {
      flat_Row[primary_Key] = flat_Row[safe_Key];
    }
    delete flat_Row[safe_Key];

    // Structure response grouped by tables using your config
    const structured_Data = {};

    (service_config.tables || []).forEach(table => {
      const table_Name = table.table_Name;
      structured_Data[table_Name] = {};

      // Get columns as array whether originally object or array
      const collumns = Array.isArray(table.columns) ? table.columns : Object.values(table.columns || {});

      collumns.forEach(col => {
        const collumn_Name = col.column_Name;
        if (flat_Row.hasOwnProperty(collumn_Name)) {
          structured_Data[table_Name][collumn_Name] = flat_Row[collumn_Name];
        }
      });
    });

    return response.json({ ok: true, data: structured_Data });

  } catch (error) {
    handle_Error_Response(response, `Details fetch failed: ${error.message}`);
  }
});


// → Returns unique values (or numeric range buckets if ?range= provided) for a given field in the service’s mapping.

search_Router.get("/:service_name/facets/:field", initialize_Service, async (request, response) => {
  try {
    const { field } = request.params;
    const { service_mappings } = request;

    let column_Name = service_mappings.var_To_Column[field];
    let table_Name = service_mappings.var_To_Table[field];
    if (!column_Name || !table_Name) {
      for (const [key, cell] of Object.entries(service_mappings.var_To_Column)) {
        if (cell.toLowerCase() === field.toLowerCase()) {
          column_Name = cell;
          table_Name = service_mappings.var_To_Table[key];
          break;
        }
      }
    }

    if (!column_Name || !table_Name) {
      return handle_Error_Response(response, `Field '${field}' not configured`, 404);
    }
    if (request.query.range) {
      const query = build_Range_Facets(table_Name, column_Name, parseInt(request.query.range));
      const [ranges] = await db_connection.query(query);
      return response.json({ ok: true, facets: ranges });
    }

    // Query to get counts of each distinct value
    
    const facets_Query = `
      SELECT \`${column_Name}\` AS value, COUNT(*) AS count
      FROM \`${table_Name}\`
      WHERE \`${column_Name}\` IS NOT NULL
      GROUP BY \`${column_Name}\`
      ORDER BY value ASC
    `;
    const [facets] = await db_connection.query(facets_Query);

    // Query to get total count of records where column NOT NULL

    const totalCountQuery = `
      SELECT COUNT(*) AS totalCount
      FROM \`${table_Name}\`
      WHERE \`${column_Name}\` IS NOT NULL
    `;
    const [total_Rows] = await db_connection.query(totalCountQuery);
    const total_Count = total_Rows[0]?.totalCount ?? 0;

    return response.json({ ok: true,   total_Count,facets });
  } catch (error) {
    handle_Error_Response( response, `Facets failed for field '${request.params.field}': ${error.message}`  );
  }
});

export default search_Router;
