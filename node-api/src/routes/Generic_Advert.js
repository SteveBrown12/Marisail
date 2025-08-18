import { Router } from "express";
import db_connection from "../config/dbConfig.js";
import {  initialize_Service,  handle_Error_Response,  execute_Operation_With_Retry,
} from "../utils/Common_Utils.js";
const advert_router = Router();

// Key Functionality #7 - Both - Dual, Measurement, Numeric – ‘FROM TO’ CODE

const normalize_From_To_Fields = (body, pairs) => {
  const normalized_Fields = { ...body };
  for (const pair of pairs) {
    const from_Value = body[pair.fromKey];
    const to_Value = body[pair.toKey];
    if (from_Value !== undefined && pair.min_Variable ) normalized_Fields[pair.min_Variable ] = from_Value;
    if (to_Value !== undefined && pair.max_Variable ) normalized_Fields[pair.max_Variable ] = to_Value;
  }
  return normalized_Fields;
};

// Key Functionality #5 - Advert - MANDATORY FIELDS ERROR MESSAGE Code
 
const validate_Mandatory_Fields = (request, response, next) => {
  try {
    const { tables } = request.service_config || {};
    const missing_Fields = [];
    (tables || []).forEach((table) => {
      Object.entries(table.columns || {}).forEach(([key, config]) => {
        if (
          config.mandatory &&
          (request.body[key] === undefined || request.body[key] === null || request.body[key] === "")
        ) {
          missing_Fields.push(key);
        }
      });
    });
    if (missing_Fields.length > 0) { return handle_Error_Response(   response,   `Missing mandatory fields: ${missing_Fields.join(", ")}`,  400   );
    }
    return next();
  } catch (error) {
    return handle_Error_Response( response, `Validation error: ${error.message}`,500);
  }
};

//  * OPTIONS route (for select/dropdown lists)
 
advert_router.get("/:service_name/search-options", initialize_Service, (request, response) => {
  try {
    const { service_config, service_mappings } = request;
 console.log("Service config and mappings:", service_config, service_mappings);
    const sorted_Tables = (service_config.tables || []).map(table => {
      let columns_Object = table.columns || {};
      let columns_Array = Array.isArray(columns_Object) ? columns_Object : Object.values(columns_Object);
      columns_Array = columns_Array.sort((a, b) => {
        if (a.mandatory && !b.mandatory) return -1;
        if (!a.mandatory && b.mandatory) return 1;
        if (a.display_Text && b.display_Text) {
          return a.display_Text.localeCompare(b.display_Text);
        }
        return 0;
      });
      if (!Array.isArray(table.columns)) {
        const sorted_Object = {};
        columns_Array.forEach(col => {
          const origKey = Object.keys(table.columns)
            .find(k => table.columns[k] === col);
          if (origKey) sorted_Object[origKey] = col;
        });
        return { ...table, columns: sorted_Object };
      }
      return { ...table, columns: columns_Array };
    });
    response.json({
      ok: true,
      data: {
        ...service_config,
        tables: sorted_Tables
      },
      service_mappings
    });
  } catch (err) {
    handle_Error_Response(response, `Config fetch failed: ${err.message}`);
  }
});

// Key Functionality #4 - Advert - AUTOFILL Sections Based On Section 1 (Trailer, Engine, Vessel)

advert_router.post("/:service_name/autofill", initialize_Service, async (request, response) => {
  try {
    const service_name = request.params.service_name.toLowerCase();
    const { service_config, service_mappings } = request;
    const { main_table, primary_key, UNIQUE_TABLE = [] } = service_config;
    if (!["trailer", "engine", "vessel"].includes(service_name)) {
      return response.json({ ok: true, data: {} });
    }
    const { make, model, year } = request.body || {};
    if (!make || !model || !year) {
      return handle_Error_Response( response, "make, model, and year are required for autofill",400);
    }

    // Step 1: Get matching IDs from the main table

    const [id_Rows] = await db_connection.query(
      `SELECT \`${primary_key}\` AS id  FROM \`${main_table}\` WHERE make = ? AND model = ? AND year = ?`,
      [make, model, year] );
    if (!id_Rows.length) { console.log("No matching IDs found for given make/model/year");
      return response.json({ ok: true, data: {} });
    }
    const ids = id_Rows.map(r => r.id);
    console.log("Matched IDs:", ids);
    const autofill_Data = {};

    // Step 2: Loop through UNIQUE_TABLES

    for (const table_Name of UNIQUE_TABLE) {
      console.log(`--- Processing UNIQUE_TABLE: ${table_Name} ---`);
      const [columns] = await db_connection.query(`SHOW COLUMNS FROM \`${table_Name}\``);
      for (const column of columns) {
        if (column.Field === primary_key) continue; 

        // Step 3: Get most common value from this column for these IDs

        const query = `
          SELECT \`${column.Field}\` AS valFROM \`${table_Name}\`
          WHERE \`${primary_key}\` IN (?) AND \`${column.Field}\` IS NOT NULL
          GROUP BY val ORDER BY COUNT(*) DESC
          LIMIT 1
        `;
        const [rows] = await db_connection.query(query, [ids]);
        console.log(`Column: ${column.Field}, Query Result:`, rows);

        if (rows.length) {

          // Step 4: Map back to logicalFieldName using mappings

          const logical_Key = Object.keys(service_mappings.var_To_Column).find(
            key =>
              service_mappings.var_To_Column[key] === column.Field &&
              service_mappings.var_To_Table[key] === table_Name
          );
          if (logical_Key) {
            autofill_Data[logical_Key] = rows[0].val;
            console.log(`Mapped logical key: ${logical_Key} =>`, rows[0].val);
          }
        }
      }
    }

    console.log("Final Autofill Data:", autofill_Data);
    return response.json({ ok: true, data: autofill_Data });
  } catch (error) {
    return handle_Error_Response(response, `Autofill failed: ${error.message}`);
  }
});

//  * SUBMIT route (Key #6) * Transactional insert with retry, supports From-To hook (Key #7)
 
advert_router.post(  "/:service_name/submit",  initialize_Service,validate_Mandatory_Fields,
  async (request, response) => {
    const from_To_Pairs = []; 
    
    // Key Functionality #6 - Advert – SUBMIT BUTTON UPDATES DATABASE with form data entered and new ID.

    const normalized_Body = normalize_From_To_Fields(request.body || {}, from_To_Pairs);
    const submit_Operation = async () => {
      const connection = await db_connection.getConnection();
      try {
        await connection.beginTransaction();
        const { service_config, service_mappings } = request;
        const { main_table, primary_key } = service_config;
        const { var_To_Table, var_To_Column } = service_mappings;
        const data_By_Table = {};

        // Split body data into table-specific payloads

        for (const key in normalized_Body) {
          const table_Name = var_To_Table[key];
          const column_Name = var_To_Column[key];
          if (table_Name && column_Name) {
            if (!data_By_Table[table_Name]) data_By_Table[table_Name] = {};
            data_By_Table[table_Name][column_Name] = normalized_Body[key];
          }
        }

        // Insert into main table first

        const main_Data = data_By_Table[main_table];
        if (!main_Data || Object.keys(main_Data).length === 0) {
          throw new Error(`No data provided for the main table: ${main_table}`);
        }
        const [insert_result] = await connection.query(`INSERT INTO \`${main_table}\` SET ?`,  [main_Data]);
        const new_Id = insert_result.insertId;

        // Insert into join tables

        for (const table_Name of Object.keys(data_By_Table)) {
          if (table_Name !== main_table) {
            const join_data = { [primary_key]: new_Id, ...data_By_Table[table_Name] };
            await connection.query(`INSERT INTO \`${table_Name}\` SET ?`, [join_data]);
          }
        }
        await connection.commit();  return { new_Id };
      } catch (error) {  await connection.rollback(); throw error;
      } finally {
        connection.release();
      }
    };
    try {
      const { new_Id } = await execute_Operation_With_Retry(submit_Operation);
      return response.status(201) .json({ ok: true, message: "Submission successful", new_Id });
    } catch (error) {
      return handle_Error_Response( response, `Submit failed after multiple attempts: ${error.message}`);
    }
  }
);
export default advert_router;
