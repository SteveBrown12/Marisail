import db_connection from '../config/dbConfig.js';
import {
  SERVICES,
  berth_Var_To_Column,
  berth_Var_To_Table,
  berth_Unique_Table,
  charter_Var_To_Column,
  charter_Var_To_Table,
  charter_Unique_Table,
  trailer_Var_To_Column,
  trailer_Var_To_Table,
  trailer_Unique_Table,
  transport_Var_To_Column,
  transport_Var_To_Table,
  transport_Unique_Table,
} from '../config/All_Service_Config.js';

// CORE UTILITIES & MIDDLEWARE

const SERVICE_MAPPINGS = {
  berth: {
    var_To_Column: berth_Var_To_Column,
    var_To_Table: berth_Var_To_Table,
    unique_Tables: berth_Unique_Table,
  },
  charter: {
    var_To_Column: charter_Var_To_Column,
    var_To_Table: charter_Var_To_Table,
    unique_Tables: charter_Unique_Table,
  },
  trailer: {
    var_To_Column: trailer_Var_To_Column,
    var_To_Table: trailer_Var_To_Table,
    unique_Tables: trailer_Unique_Table,
  },
  transport: {
    var_To_Column: transport_Var_To_Column,
    var_To_Table: transport_Var_To_Table,
    unique_Tables: transport_Unique_Table,
  },
};

const validate_Schema = async (config) => {
  const errors = [];
  const connection = await db_connection.getConnection();
  try {

    // 1. Aggregate all tables to check: main table + join tables

    const tables_To_Check = [config.main_table, ...(config.join_tables || [])];

    for (const table_Name of tables_To_Check) {

      // Verify table existence

      const [table_Check_Result] = await connection.query(`SHOW TABLES LIKE ?`, [table_Name]);
      if (table_Check_Result.length === 0) {
        errors.push(`Configuration error: Table '${table_Name}' does not exist in the database.`);
        continue;
      }

      // Find the table config object for column validation

      const table_Config = (config.tables || []).find(table_Config_Obj => table_Config_Obj.table_Name === table_Name);
      if (!table_Config) continue;

      // Retrieve actual columns from DB table

      const [db_Columns] = await connection.query(`SHOW COLUMNS FROM \`${table_Name}\``);
      const db_Column_Names = db_Columns.map(column => column.Field);

      // Check each configured column exists in the DB table

      Object.entries(table_Config.columns || {}).forEach(([config_Key, column_Definition]) => {
        if (!db_Column_Names.includes(column_Definition.column_Name)) {
          errors.push(
            `Missing column '${column_Definition.column_Name}' for config key '${config_Key}' in table '${table_Name}'.`
          );
        }
      });
    }
  } finally {
    connection.release();
  }

  // Throw all errors as a single error if any missing

  if (errors.length > 0) {
    const numbered_Errors = errors.map((err, idx) => `${idx + 1}. ${err}`).join('\n');
    throw new Error(numbered_Errors);
  }
  console.log(`✅ Schema validated successfully for service: ${config.schema_name}`);
};

// Join Table Check

export const join_Table_Check = async (service_Config) => {
  if (
    !service_Config?.join_tables ||
    !Array.isArray(service_Config.join_tables)
  ) {
  }

  const connection = await db_connection.getConnection();
  try {
    const errors = [];
    for (const join_Table of service_Config.join_tables) {
      const [result] = await connection.query('SHOW TABLES LIKE ?', [
        join_Table,
      ]);
      if (result.length === 0) {
        errors.push(
          `Join table '${join_Table}' does not exist in the database.`
        );
      }
    }

    if (errors.length > 0) {
      throw new Error(errors.join('\n'));
    }
  } finally {
    connection.release();
  }
};


const load_Service_Config = (service_name) => {
  const config = SERVICES[service_name];
  const mappings = SERVICE_MAPPINGS[service_name];

  if (!config || !mappings) {
    throw new Error(
      `Service '${service_name}' not found. Check SERVICES and SERVICE_MAPPINGS exports.`
    );
  }

  return { service_config: config, service_mappings: mappings };
};

export const initialize_Service = async (request, response, next) => {
  try {
    const service_name = request.params.service_name.toLowerCase();
    const { service_config, service_mappings } = load_Service_Config(service_name);
    await join_Table_Check(service_config);
    await validate_Schema(service_config);
    request.service_config = service_config;
    request.service_mappings = service_mappings;
    next();
  } catch (error) {
    handle_Error_Response(
      response,
      `Service initialization failed: ${error.message}`,
      500
    );
  }
};
export const handle_Error_Response = (response, message, status = 500) => {
  console.error(`[Error] ${message}`);
  response.status(status).json({ ok: false, message });
};

// SHARED QUERY BUILDERS 

export const build_Joins = (main_Table_Info) => {
  console.log('=== DEBUGGING build_Joins ===');
  console.log('main_Table_Info:', main_Table_Info);
  console.log('join_tables:', main_Table_Info?.join_tables);
  console.log('join_tables is array:', Array.isArray(main_Table_Info?.join_tables));
  if (!main_Table_Info?.join_tables) {
    console.error('❌ join_tables is undefined in build_Joins!');
    return '';
  }
  return main_Table_Info.join_tables
    .map(
      (table) =>
        `LEFT JOIN ${table} ON ${main_Table_Info.main_table}.${main_Table_Info.primary_key} = ${table}.${main_Table_Info.primary_key}`
    )
    .join('\n');
};
export const build_Where_Clause = (filters, mappings) => {
  if (typeof filters === "string") {
    try { filters = JSON.parse(filters); }
    catch (e) { console.error("Invalid filters JSON:", filters); filters = {}; }
  }

  const operatorMap = { 
    eq: '=', neq: '!=', gt: '>', gte: '>=', 
    lt: '<', lte: '<=', in: 'IN', nin: 'NOT IN' 
  };

  const quote = (val) => `'${String(val).replace(/'/g, "''")}'`;
  const conditions = [];

  // 🔎 Utility: resolve mapping with fallback search
  const resolveMapping = (field) => {
    let column_Name = mappings.var_To_Column[field];
    let table_Name  = mappings.var_To_Table[field];

    // fallback search if direct not found
    if (!column_Name || !table_Name) {
      for (const [mapKey, cell] of Object.entries(mappings.var_To_Column)) {
        if (cell && cell.toLowerCase() === field.toLowerCase()) {
          column_Name = cell;
          table_Name  = mappings.var_To_Table[mapKey];
          break;
        }
      }
    }
    return { column: column_Name, table: table_Name };
  };

  // ---- KEYWORD SEARCH ----
  if (filters.keyword) {
    const keyword_Value = `%${filters.keyword}%`;

    const keyword_Conditions = Object.keys(mappings.var_To_Column).map((key) => {
      const { column, table } = resolveMapping(key);
      if (!column) return null;
      return table 
        ? `\`${table}\`.\`${column}\` LIKE ${quote(keyword_Value)}`
        : `\`${column}\` LIKE ${quote(keyword_Value)}`;
    }).filter(Boolean);

    if (keyword_Conditions.length > 0) {
      conditions.push(`(${keyword_Conditions.join(" OR ")})`);
    }
    delete filters.keyword;
  }

  // ---- HANDLE From / To ----
  Object.keys(filters).forEach(key => {
    if (key.endsWith("From") || key.endsWith("To")) {
      const base_Key = key.replace(/(From|To)$/, "");
      const { column, table } = resolveMapping(base_Key);
      if (column) {
        const qualified = table ? `\`${table}\`.\`${column}\`` : `\`${column}\``;
        const result = filters[key];
        if (result !== "" && result !== undefined && result !== null) {
          if (key.endsWith("From")) conditions.push(`${qualified} >= ${quote(result)}`);
          if (key.endsWith("To")) conditions.push(`${qualified} <= ${quote(result)}`);
        }
      }
      delete filters[key];
    }
  });

  // ---- OTHER FILTERS ----
  Object.entries(filters || {}).forEach(([key, value]) => {
    const { column, table } = resolveMapping(key);
    if (!column) {
      console.warn("⚠️ Unmapped filter key:", key);
      return;
    }

    const qualified = table ? `\`${table}\`.\`${column}\`` : `\`${column}\``;

    if (typeof value === "object" && !Array.isArray(value) && ('from' in value || 'to' in value)) {
      if (value.from !== undefined && value.from !== null && value.from !== "") {
        conditions.push(`${qualified} >= ${quote(value.from)}`);
      }
      if (value.to !== undefined && value.to !== null && value.to !== "") {
        conditions.push(`${qualified} <= ${quote(value.to)}`);
      }
    }
    else if (typeof value === "object" && !Array.isArray(value)) {
      Object.entries(value).forEach(([op, val]) => {
        const sqlOp = operatorMap[op];
        if (!sqlOp) return;
        if (sqlOp === "IN" || sqlOp === "NOT IN") {
          const list = Array.isArray(val) ? val : val.split(',');
          const escapedList = list.map(v => quote(v.trim()));
          conditions.push(`${qualified} ${sqlOp} (${escapedList.join(", ")})`);
        } else {
          conditions.push(`${qualified} ${sqlOp} ${quote(val)}`);
        }
      });
    }
    else if (Array.isArray(value)) {
      const escapedList = value.map(v => quote(v));
      conditions.push(`${qualified} IN (${escapedList.join(", ")})`);
    }
    else {
      conditions.push(`${qualified} LIKE ${quote(`%${value}%`)}`);
    }
  });
  return conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : '';
};

export const build_Range_Facets = (
  table_Name,
  column_Name,
  bucket_Size = 1000
) => {
  return `
        SELECT
            CONCAT(
                FLOOR(${column_Name}/${bucket_Size})*${bucket_Size},'-',
                FLOOR(${column_Name}/${bucket_Size})*${bucket_Size} + ${bucket_Size} - 1
            ) AS \`range\`,
            COUNT(*) AS count
        FROM ${table_Name}
        WHERE ${column_Name} IS NOT NULL
        GROUP BY 1
        ORDER BY FLOOR(${column_Name}/${bucket_Size})
    `;
};

// RETRY UTILITY

export const execute_Operation_With_Retry = async (
  operation,
  max_attempts = 3
) => {
  for (let attempt = 1; attempt <= max_attempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      console.error(`Operation failed on attempt ${attempt}: ${error.message}`);
      if (attempt >= max_attempts) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, 100 * attempt));
    }
  }
};

// Price Label, Price Drop, Total Price

export const calculate_Price_Label = async (details) => {
  const { make, model, year, condition, asking_Price } = details;

  //return early if we dont have unnecessary details.
  if (!make || !model || !year || !asking_Price) return 'Not Available';
  const connection = await db_connection.getConnection();
  try {
    const sql = `
    SELECT AVG(sold_price) as averageMarketPrice
    from Sales_History 
    WHERE make = ? AND model = ? AND year = ? AND sale_date >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
    `;
    const [rows] = await connection.execute(sql, [make, model, year]);
    const average_Market_Price = rows[0]?.averageMarketPrice;
    if(!average_Market_Price) return 'Unique Items';
    const percentage_Diff = ((asking_Price - average_Market_Price) / average_Market_Price) * 100;
    return percentage_Diff <= -20 ? 'Great Price' 
        : percentage_Diff < -10 ? 'Good Price' 
        : percentage_Diff <= 10 ? 'Fair Price' 
        : 'Higher Price'
          
  } catch (error) {
    console.error("Error Calculating Price Label " , error);
    return 'Calculation Error';
  }finally {
    if(connection) connection.release();
  }
}
