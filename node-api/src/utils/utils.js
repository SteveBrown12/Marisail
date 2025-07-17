import { SERVICES } from "../Config/All_Services_Config.js";
import db_connection from "../config/dbConfig.js";

// ========================
// MIDDLEWARE
// ========================

export const validate_fields = (request, callback, next) => {
  const missing = Object.entries(request.service_config.fields)
    .filter(([_, f]) => f.mandatory && !request.body[f.column_name])
    .map(([name]) => name);
  if (missing.length)
    send_error_response(callback, `Missing fields: ${missing.join(", ")}`, 400);
  else next();
};

// ========================
// QUERY BUILDERS
// ========================
export const build_joins = (config) =>
  config.join_tables
    .map(
      (tbl) =>
        `LEFT JOIN ${tbl} ON ${config.main_table}.${config.primary_key} = ${tbl}.${config.primary_key}`
    )
    .join("\n");

 const build_where = (filters, var_to_column) => {
  const conditions = [];
  Object.entries(filters).forEach(([key, values]) => {
    if (values && values.length > 0) {
      conditions.push(
        `${var_to_column[key]} IN (${values.map((val) => `'${val}'`).join(",")})`
      );
    }
  });
  return conditions.join(" AND ");
};

export const build_range_facets = (column, bucket_size) => {
  return `
    SELECT 
      CONCAT(
        FLOOR(${column}/${bucket_size})*${bucket_size}, 
        '-', 
        FLOOR(${column}/${bucket_size})*${bucket_size} + ${bucket_size}
      ) AS range,
      COUNT(*) AS count
    FROM ${table}
    GROUP BY FLOOR(${column}/${bucket_size})
  `;
};

// ========================
// TRANSACTION HANDLING
// ========================
export const execute_with_retry = async (operation, max_attempts = 3) => {
  let attempt = 0;
  while (attempt < max_attempts) {
    try {
      return await operation();
    } catch (err) {
      attempt++;
      if (attempt >= max_attempts) throw err;
      await new Promise((resolve) => setTimeout(resolve, 100 * attempt));
    }
  }
};


// ========================
// CORE UTILITIES
// ========================
export const get_service_config_by_name = (service_name) => {
  const config = SERVICES[service_name.toLowerCase()];
  if (!config) throw new Error(`Invalid service '${service_name}'`);
  return config;
};

export const send_error_response = (callback, message, status = 500) => {
  console.error(`[Search Error] ${message}`);
  callback.status(status).json({ ok: false, message });
};

export const check_service_schema = async (connection, config) => {
  const errors = [];
  // Main table check
  const [main_table] = await connection.query(
    `SHOW TABLES LIKE '${config.main_table}'`
  );
  if (!main_table.length)
    errors.push(`Main table '${config.main_table}' missing`);

  // Join tables check
  for (const table of config.join_tables) {
    const [join_table] = await connection.query(`SHOW TABLES LIKE '${table}'`);
    if (!join_table.length) errors.push(`Join table '${table}' missing`);
  }

  if (errors.length) throw new Error(errors.join("\n"));
};


export const convert_var_to_column = (config) => {
   return (config.tables ? Object.fromEntries(config.tables.flatMap(table => Object.entries(table.columns).map(([key, val]) => [key, val.column_Name]))) : {});
}

export const convert_var_to_table = (config) => {
   return (config.tables ? Object.fromEntries(config.tables.flatMap(table => Object.keys(table.columns).map(key => [key, table.table_Name]))) : {});
}

// ========================
// MIDDLEWARE
// ========================
export const initialize_service_middleware = async (request, callback, next) => {
  try {
    const config = get_service_config_by_name(request.params.service_name);
    await check_service_schema(db_connection, config);
    request.service_config = config;
    // Attach Var_To_Column and Var_To_Table directly for convenience
    request.Var_To_Column = convert_var_to_column(config);
    request.Var_To_Table = convert_var_to_table(config);
    next();
  } catch (err) {
    send_error_response(callback, err.message, 400);
  }
};
