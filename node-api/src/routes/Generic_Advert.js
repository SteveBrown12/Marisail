import { Router } from "express";
import db_connection from "../config/dbConfig.js";
import {  initialize_Service,  handle_Error_Response,  execute_Operation_With_Retry,
} from "../utils/Common_Utils.js";
const advert_router = Router();

//* From-To normalization hook (Key #7)  * Example: [{ fromKey: 'lengthFrom', toKey: 'lengthTo', min_Variable : 'minLength', max_Variable : 'maxLength' }]

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

//  * Mandatory fields validation (Key #5)
 
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
 
advert_router.get("/:service_name/options/:field",  initialize_Service,
  async (request, response) => {
    try {
      const { field } = request.params;
      const { service_config, service_mappings } = request;
      const column_Name = service_mappings?.var_To_Column?.[field];
      const table_name =
        service_mappings?.var_To_Table?.[field] || service_config?.main_table;
      if (!column_Name || !table_name) {
        return handle_Error_Response(response, `Field '${field}' not configured`, 404);
      }
      const [rows] = await db_connection.query(
        `SELECT DISTINCT \`${column_Name}\` AS value FROM \`${table_name}\` WHERE \`${column_Name}\` IS NOT NULL`      );
      return response.json({ ok: true, options: rows.map((r) => r.value) });
    } catch (error) {
      return handle_Error_Response(response, `Options fetch failed: ${error.message}`);
    }
  }
);

//  AUTOFILL route (Key #4) * Only applies to trailer, engine, vessel

advert_router.post(  "/:service_name/autofill",initialize_Service,
  async (request, response) => {
    try {
      const service_name = request.params.service_name.toLowerCase();
      const { service_config } = request;
      const { main_table, primary_key, join_tables = [] } = service_config;
      if (!["trailer", "engine", "vessel"].includes(service_name)) {
        return response.json({ ok: true, data: {} });
      }
      const { make, model, year } = request.body || {};
      if (!make || !model || !year) {
        return handle_Error_Response(   response,   "make, model, and year are required for autofill",   400 );
      }
      const select_List = [  `\`${main_table}\`.*`,  ...join_tables.map((table) => `\`${table}\`.*`),  `\`${main_table}\`.\`${primary_key}\` AS \`${main_table}__${primary_key}\``, ].join(", ");
      const join_SQL = join_tables .map((table) =>
            `LEFT JOIN \`${table}\`   ON \`${main_table}\`.\`${primary_key}\` = \`${table}\`.\`${primary_key}\`` ).join(" ");

      // NOTE: If make/model/year column names differ, adjust below WHERE

      const query = `  SELECT ${select_List} FROM \`${main_table}\` ${join_SQL} WHERE \`${main_table}\`.\`make\` = ?    AND \`${main_table}\`.\`model\` = ?     AND \`${main_table}\`.\`year\` = ?  LIMIT 1`;
      const [rows] = await db_connection.query(query, [make, model, year]);
      if (!rows || rows.length === 0) {
        return response.json({ ok: true, data: {} });
      }
      const row = rows;
      const alias_Key = `${main_table}__${primary_key}`;
      if (
        (row[primary_key] === null || row[primary_key] === undefined) &&  row[alias_Key] != null) 
        {  row[primary_key] = row[alias_Key];}
      delete row[alias_Key];
      return response.json({ ok: true, data: row || {} });
    } catch (error) {
      return handle_Error_Response(response, `Autofill failed: ${error.message}`);
    }
  }
);

//  * SUBMIT route (Key #6) * Transactional insert with retry, supports From-To hook (Key #7)
 
advert_router.post(  "/:service_name/submit",  initialize_Service,validate_Mandatory_Fields,
  async (request, response) => {
    const fromToPairs = []; 
    const normalizedBody = normalize_From_To_Fields(request.body || {}, fromToPairs);
    const submit_operation = async () => {
      const connection = await db_connection.getConnection();
      try {
        await connection.beginTransaction();
        const { service_config, service_mappings } = request;
        const { main_table, primary_key } = service_config;
        const { var_To_Table, var_To_Column } = service_mappings;
        const data_By_Table = {};

        // Split body data into table-specific payloads

        for (const key in normalizedBody) {
          const table_Name = var_To_Table[key];
          const column_Name = var_To_Column[key];
          if (table_Name && column_Name) {
            if (!data_By_Table[table_Name]) data_By_Table[table_Name] = {};
            data_By_Table[table_Name][column_Name] = normalizedBody[key];
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
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    };
    try {
      const { new_Id } = await execute_Operation_With_Retry(submit_operation);
      return response
        .status(201) .json({ ok: true, message: "Submission successful", new_Id });
    } catch (error) {
      return handle_Error_Response( response,
        `Submit failed after multiple attempts: ${error.message}`
      );
    }
  }
);
export default advert_router;
