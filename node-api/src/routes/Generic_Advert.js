import { Router } from 'express';
import db_connection from '../config/dbConfig.js';
import {
  initialize_Service,
  handle_Error_Response,
  execute_Operation_With_Retry,
} from '../utils/common_Utils.js';
const advert_router = Router();

// Key Functionality #7 - Both - Dual, Measurement, Numeric – ‘FROM TO’ CODE

const normalize_From_To_Fields = (body, pairs) => {
  const normalized_Fields = { ...body };
  for (const pair of pairs) {
    const from_Value = body[pair.fromKey];
    const to_Value = body[pair.toKey];
    if (from_Value !== undefined && pair.min_Variable)
      normalized_Fields[pair.min_Variable] = from_Value;
    if (to_Value !== undefined && pair.max_Variable)
      normalized_Fields[pair.max_Variable] = to_Value;
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
          (request.body[key] === undefined ||
            request.body[key] === null ||
            request.body[key] === '')
        ) {
          missing_Fields.push(key);
        }
      });
    });
    if (missing_Fields.length > 0) {
      return handle_Error_Response(
        response,
        `Missing mandatory fields: ${missing_Fields.join(', ')}`,
        400
      );
    }
    return next();
  } catch (error) {
    return handle_Error_Response(
      response,
      `Validation error: ${error.message}`,
      500
    );
  }
};

//  * OPTIONS route (for select/dropdown lists)

advert_router.get(
  '/:service_name/search-options',
  initialize_Service,
  (request, response) => {
    try {
      const { service_config, service_mappings } = request;
      console.log(
        'Service config and mappings:',
        service_config,
        service_mappings
      );
      const sorted_Tables = (service_config.tables || []).map((table) => {
        let columns_Object = table.columns || {};
        let columns_Array = Array.isArray(columns_Object)
          ? columns_Object
          : Object.values(columns_Object);
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
          columns_Array.forEach((col) => {
            const origKey = Object.keys(table.columns).find(
              (k) => table.columns[k] === col
            );
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
          tables: sorted_Tables,
        },
        service_mappings,
      });
    } catch (err) {
      handle_Error_Response(response, `Config fetch failed: ${err.message}`);
    }
  }
);

// Key Functionality #4 - Advert - AUTOFILL Sections Based On Section 1 (Trailer, Engine, Vessel)

advert_router.post(
  '/:service_name/autofill',
  initialize_Service,
  async (request, response) => {
    try {
      const service_name = request.params.service_name.toLowerCase();
      const { service_config, service_mappings } = request;
      const { main_table, primary_key, UNIQUE_TABLE = [] } = service_config;
      if (!['trailer', 'engine', 'vessel'].includes(service_name)) {
        return response.json({ ok: true, data: {} });
      }
      const { make, model, year } = request.body || {};
      if (!make || !model || !year) {
        return handle_Error_Response(
          response,
          'make, model, and year are required for autofill',
          400
        );
      }

      // Step 1: Get matching IDs from the main table

      const [id_Rows] = await db_connection.query(
        `SELECT \`${primary_key}\` AS id  FROM \`${main_table}\` WHERE make = ? AND model = ? AND year = ?`,
        [make, model, year]
      );
      if (!id_Rows.length) {
        console.log('No matching IDs found for given make/model/year');
        return response.json({ ok: true, data: {} });
      }
      const ids = id_Rows.map((r) => r.id);
      console.log('Matched IDs:', ids);
      const autofill_Data = {};

      // Step 2: Loop through UNIQUE_TABLES

      for (const table_Name of UNIQUE_TABLE) {
        console.log(`--- Processing UNIQUE_TABLE: ${table_Name} ---`);
        const [columns] = await db_connection.query(
          `SHOW COLUMNS FROM \`${table_Name}\``
        );
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

            const logical_Key = Object.keys(
              service_mappings.var_To_Column
            ).find(
              (key) =>
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

      console.log('Final Autofill Data:', autofill_Data);
      return response.json({ ok: true, data: autofill_Data });
    } catch (error) {
      return handle_Error_Response(
        response,
        `Autofill failed: ${error.message}`
      );
    }
  }
);

//  * SUBMIT route (Key #6) * Transactional insert with retry, supports From-To hook (Key #7)

advert_router.post(
  '/:service_name/submit',
  initialize_Service,
  validate_Mandatory_Fields,
  async (request, response) => {
    const from_To_Pairs = [];

    // Key Functionality #6 - Advert – SUBMIT BUTTON UPDATES DATABASE with form data entered and new ID.

    const normalized_Body = normalize_From_To_Fields(
      request.body || {},
      from_To_Pairs
    );
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
        const [insert_result] = await connection.query(
          `INSERT INTO \`${main_table}\` SET ?`,
          [main_Data]
        );
        const new_Id = insert_result.insertId;

        // Insert into join tables

        for (const table_Name of Object.keys(data_By_Table)) {
          if (table_Name !== main_table) {
            const join_data = {
              [primary_key]: new_Id,
              ...data_By_Table[table_Name],
            };
            await connection.query(`INSERT INTO \`${table_Name}\` SET ?`, [
              join_data,
            ]);
          }
        }
        await connection.commit();
        return { new_Id };
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    };
    try {
      const { new_Id } = await execute_Operation_With_Retry(submit_Operation);
      return response
        .status(201)
        .json({ ok: true, message: 'Submission successful', new_Id });
    } catch (error) {
      return handle_Error_Response(
        response,
        `Submit failed after multiple attempts: ${error.message}`
      );
    }
  }
);


//New route for price label calculation
advert_router.post("/:service_name/calculate-price-label", initialize_Service, async (request, response) => {
  try {
    const { service_name } = request.params;
    const { main_table } = request.service_config;
    const body = request.body;

    let price_label = "Not available"; // Default label

    // --- Logic for Trailer, Boat, and Engine Services ---
    if (['trailer', 'boat', 'engine'].includes(service_name)) {
      const { askingPrice, make, model, year } = body;
      if (!askingPrice || !make || !model || !year) {
        return response.json({ ok: true, price_label: "" });
      }

      const query = `
                SELECT AVG(Asking_Price) as averagePrice
                FROM ${main_table}
                WHERE
                    Make = ? AND
                    Model = ? AND
                    Year = ?
            `;

      const [rows] = await db_connection.query(query, [make, model, year]);

      if (rows.length > 0 && rows[0].averagePrice) {
        const average_price = parseFloat(rows[0].averagePrice);
        const user_price = parseFloat(askingPrice);
        const percentage_diff = ((user_price - average_price) / average_price) * 100;

        if (percentage_diff < -20) price_label = "Fantastic Price";
        else if (percentage_diff < -10) price_label = "Very Good Price";
        else if (percentage_diff <= 10) price_label = "Fair Price";
        else if (percentage_diff > 20) price_label = "Very High Price";
        else if (percentage_diff > 10) price_label = "Higher Price";
        else price_label = "Fair Price";
      } else {
        price_label = "Not enough data";
      }
    }
    // --- Logic for Berth Service ---
    else if (service_name === 'berth') {
      const { length, beam, pricePA, pricePCM, pricePW } = body;
      const cleanPrice = (price) => {
          if (!price) return null;
          return parseFloat(String(price).replace(/^01jan/, ''));
      };
      const user_price_pa = cleanPrice(pricePA);
      const user_price_pcm = cleanPrice(pricePCM);
      const user_price_pw = cleanPrice(pricePW);

      if (!length || !beam || (!user_price_pa && !user_price_pcm && !user_price_pw)) {
          return response.json({ ok: true, price_label: "" });
      }
      const user_area = parseFloat(length) * parseFloat(beam);
      let user_annual_price = user_price_pa || (user_price_pcm * 12) || (user_price_pw * 52);
      let area_category;
      if (user_area <= 15) area_category = 'small';
      else if (user_area <= 30) area_category = 'medium';
      else if (user_area <= 50) area_category = 'large';
      else if (user_area <= 100) area_category = 'xlarge';
      else area_category = 'xxlarge';

      const query = `
          SELECT
              AVG(COALESCE(p.Price_PA, p.Price_PCM * 12, p.Price_PW * 52)) as averagePrice
          FROM Berth_Details bd
          JOIN Berth b ON bd.Berth_ID = b.Berth_ID
          JOIN Pricing p ON bd.Berth_ID = p.Berth_ID
          WHERE 
              CASE
                  WHEN (b.Length * b.Beam) <= 15 THEN 'small'
                  WHEN (b.Length * b.Beam) <= 30 THEN 'medium'
                  WHEN (b.Length * b.Beam) <= 50 THEN 'large'
                  WHEN (b.Length * b.Beam) <= 100 THEN 'xlarge'
                  ELSE 'xxlarge'
              END = ?
      `;
      const [rows] = await db_connection.query(query, [area_category]);
      if (rows.length > 0 && rows[0].averagePrice) {
          const average_price = parseFloat(rows[0].averagePrice);
          const percentage_diff = ((user_annual_price - average_price) / average_price) * 100;
          if (percentage_diff < -20) price_label = "Fantastic Price";
          else if (percentage_diff < -10) price_label = "Very Good Price";
          else if (percentage_diff <= 10) price_label = "Fair Price";
          else if (percentage_diff > 20) price_label = "Very High Price";
          else if (percentage_diff > 10) price_label = "Higher Price";
          else price_label = "Fair Price";
      } else {
          price_label = "Not enough data for this size";
      }
    }
    // --- Logic for Charter Service ---
    else if (service_name === 'charter') {
      const { guestCapacity, summerRatePerWeek, winterRatePerWeek, summerRatePerNight, winterRatePerNight, totalPrice } = body;
      const user_weekly_price = parseFloat(summerRatePerWeek) || parseFloat(winterRatePerWeek) || (parseFloat(summerRatePerNight) * 7) || (parseFloat(winterRatePerNight) * 7) || parseFloat(totalPrice);
      if (!guestCapacity || !user_weekly_price) {
        return response.json({ ok: true, price_label: "" });
      }
      const query = `
          SELECT 
              AVG(COALESCE(
                  cc.Summerrate_Per_Week, cc.Winterrate_Per_week, 
                  cc.Summerrate_Per_Night * 7, cc.Winterrate_Per_Night * 7, 
                  cc.Total_Price
              )) as averagePrice
          FROM Accomodation a
          JOIN Charter_Costs cc ON a.Charter_ID = cc.Charter_ID
          WHERE a.Guest_Capacity = ?
      `;
      const [rows] = await db_connection.query(query, [guestCapacity]);
      if (rows.length > 0 && rows[0].averagePrice) {
        const average_price = parseFloat(rows[0].averagePrice);
        const percentage_diff = ((user_weekly_price - average_price) / average_price) * 100;
        if (percentage_diff < -20) price_label = "Fantastic Price";
        else if (percentage_diff < -10) price_label = "Very Good Price";
        else if (percentage_diff <= 10) price_label = "Fair Price";
        else if (percentage_diff > 20) price_label = "Very High Price";
        else if (percentage_diff > 10) price_label = "Higher Price";
        else price_label = "Fair Price";
      } else {
        price_label = "Not enough data for this capacity";
      }
    }
    // --- Logic for Transport Service ---
    else if (service_name === 'transport') {
      const { roundTripDistance, quoteValue } = body;
      if (!roundTripDistance || !quoteValue) {
        return response.json({ ok: true, price_label: "" });
      }
      const distance = parseFloat(roundTripDistance);
      let distance_category;
      if (distance <= 100) distance_category = 'short';
      else if (distance <= 500) distance_category = 'medium';
      else if (distance <= 1000) distance_category = 'long';
      else distance_category = 'xlong';

      const query = `
          SELECT AVG(tq.Quote_Value) as averagePrice
          FROM Job j
          JOIN Transportation_Quotes tq ON j.Transport_ID = tq.Transport_ID
          WHERE 
              CASE
                  WHEN j.Round_Trip_Distance <= 100 THEN 'short'
                  WHEN j.Round_Trip_Distance <= 500 THEN 'medium'
                  WHEN j.Round_Trip_Distance <= 1000 THEN 'long'
                  ELSE 'xlong'
              END = ?
      `;
      const [rows] = await db_connection.query(query, [distance_category]);
      if (rows.length > 0 && rows[0].averagePrice) {
          const average_price = parseFloat(rows[0].averagePrice);
          const user_price = parseFloat(quoteValue);
          const percentage_diff = ((user_price - average_price) / average_price) * 100;
          if (percentage_diff < -20) price_label = "Fantastic Price";
          else if (percentage_diff < -10) price_label = "Very Good Price";
          else if (percentage_diff <= 10) price_label = "Fair Price";
          else if (percentage_diff > 20) price_label = "Very High Price";
          else if (percentage_diff > 10) price_label = "Higher Price";
          else price_label = "Fair Price";
      } else {
        price_label = "Not enough data for this distance";
      }
    }
    
    return response.json({ ok: true, price_label: price_label });

  } catch (error) {
    console.error(`Price label calculation failed: ${error.message}`);
    return response.json({ ok: true, price_label: "" });
  }
});




export default advert_router;
