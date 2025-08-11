//
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
    var_to_column: berth_Var_To_Column,
    var_to_table: berth_Var_To_Table,
    unique_tables: berth_Unique_Table,
  },
  charter: {
    var_to_column: charter_Var_To_Column,
    var_to_table: charter_Var_To_Table,
    unique_tables: charter_Unique_Table,
  },
  trailer: {
    var_to_column: trailer_Var_To_Column,
    var_to_table: trailer_Var_To_Table,
    unique_tables: trailer_Unique_Table,
  },
  transport: {
    var_to_column: transport_Var_To_Column,
    var_to_table: transport_Var_To_Table,
    unique_tables: transport_Unique_Table,
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

      const table_Config = (config.tables || []).find(t => t.table_Name === table_Name);
      if (!table_Config) continue; // No column config to check

      // Retrieve actual columns from DB table

      const [db_Columns] = await connection.query(`SHOW COLUMNS FROM \`${table_Name}\``);
      const db_Column_Names = db_Columns.map(col => col.Field);

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

export const join_table_check = async (service_Config) => {
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

export const initialize_service = async (request, response, next) => {
  try {
    const service_name = request.params.service_name.toLowerCase();
    const service_config = SERVICES[service_name];
    const service_mappings = SERVICE_MAPPINGS[service_name];

    // load_service_config
    
    if (!service_config) {
      return handle_error_response(
        response,
        `Service '${service_name}' not found. Check SERVICES export.`,
        404
      );
    }
    await join_table_check(service_config);

    // We validate the loaded config against the database before proceeding.
    
    await validate_Schema(service_config);

    request.service_config = service_config;
    request.service_mappings = service_mappings;

    next();
  } catch (error) {

    // This will now catch both config loading errors AND schema validation errors.
    
    handle_error_response(
      response,
      `Service initialization failed: ${error.message}`,
      500
    );
  }
};
export const handle_error_response = (response, message, status = 500) => {
  console.error(`[Error] ${message}`);
  response.status(status).json({ ok: false, message });
};

// SHARED QUERY BUILDERS 

export const build_joins = (main_table_info) => {
  console.log('=== DEBUGGING build_joins ===');
  console.log('main_table_info:', main_table_info);
  console.log('join_tables:', main_table_info?.join_tables);
  console.log( 'join_tables is array:', Array.isArray(main_table_info?.join_tables) );
  if (!main_table_info?.join_tables) {
    console.error('❌ join_tables is undefined in build_joins!');
    return '';
  }
  return main_table_info.join_tables
    .map(
      (table) =>
        `LEFT JOIN ${table} ON ${main_table_info.main_table}.${main_table_info.primary_key} = ${table}.${main_table_info.primary_key}`
    )
    .join('\n');
};

export const build_where_clause = (filters, mappings) => {

  // This object maps our simple URL operators to real SQL operators.

  const operator_Map = { eq: '=', neq: '!=',gt: '>',gte: '>=',lt: '<',lte: '<=', in: 'IN',nin: 'NOT IN'};

  const conditions = Object.entries(filters || {})
    .map(([key, value]) => {
      const column_name = mappings.var_to_column[key];
      if (!column_name) return null; 

      // Check if the value is an object for complex operators

      if (typeof value === 'object' && !Array.isArray(value)) {
        const operator = Object.keys(value)[0]; // e.g., 'gte'
        const filter_Value = Object.values(value)[0]; // e.g., '1990'
        const sql_Operator = operator_Map[operator];

        if (!sql_Operator) return null; 
        if (sql_Operator === 'IN' || sql_Operator === 'NOT IN') {

          // Handle comma-separated strings for IN and NOT IN clauses

          const list = filter_Value
            .split(',')
            .map((item) => db_connection.escape(item.trim()));
          return `\`${column_name}\` ${sql_Operator} (${list.join(', ')})`;
        } else {

          // Handle all other operators

          return `\`${column_name}\` ${sql_Operator} ${db_connection.escape(
            filter_Value
          )}`;
        }
      } else {
        const escaped_Value = db_connection.escape(`%${value}%`);
        return `\`${column_name}\` LIKE ${escaped_Value}`;
      }
    })
    .filter(Boolean);

  return conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
};

export const build_range_facets = (
  table_name,
  column_name,
  bucket_Size = 1000
) => {
  return `
        SELECT
            CONCAT(
                FLOOR(${column_name}/${bucket_Size})*${bucket_Size},'-',
                FLOOR(${column_name}/${bucket_Size})*${bucket_Size} + ${bucket_Size} - 1
            ) AS \`range\`,
            COUNT(*) AS count
        FROM ${table_name}
        WHERE ${column_name} IS NOT NULL
        GROUP BY 1
        ORDER BY FLOOR(${column_name}/${bucket_Size})
    `;
};

// RETRY UTILITY

export const execute_operation_with_retry = async (
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
