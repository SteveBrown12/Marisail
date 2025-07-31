// // service_utils.js

// // import db_connection from "../config/dbConfig.js";
// // import { SERVICES } from "../config/All_service_config.js";

// // // ========================
// // // CORE UTILITIES & MIDDLEWARE
// // // ========================

// // // ... (initialize_service, handle_error_response, etc. remain the same) ...
// // export const initialize_service = (req, res, next) => {
// //     try {
// //         const service_name = req.params.service_name.toLowerCase();
// //         const service_config = SERVICES[service_name];
// //         if (!service_config) throw new Error(`Invalid service '${service_name}'`);
// //         req.service_config = service_config;
// //         next();
// //     } catch (err) {
// //         handle_error_response(res, err.message, 400);
// //     }
// // };

// // export const handle_error_response = (res, message, status = 500) => {
// //     console.error(`[Error] ${message}`);
// //     res.status(status).json({ ok: false, message });
// // };

// // // ========================
// // // NEW: SHARED QUERY BUILDERS
// // // ========================

// // export const build_joins = (config) => {
// //     return config.join_tables
// //         .map(table => `LEFT JOIN ${table} ON ${config.main_table}.${config.primary_key} = ${table}.${config.primary_key}`)
// //         .join('\n');
// // };
// // // http://localhost:3007/api/berth/search?filters[location]=Schneiderstad  was not working for a single location
// // // export const build_where_clause = (filters, mappings) => {
// // //     const conditions = Object.entries(filters)
// // //         .map(([key, values]) => {
// // //             const column_name = mappings.var_to_column[key];
// // //             if (!column_name) return null; // Ignore filters for unknown fields

// // //             // Ensure values is an array before mapping
// // //             const filter_values = Array.isArray(values) ? values : [values];
// // //             const escaped_values = filter_values.map(v => db_connection.escape(v)).join(',');

// // //             return `${column_name} IN (${escaped_values})`;
// // //         })
// // //         .filter(Boolean); // remove nulls
// // //     return conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
// // // };

// // // now working good for every location

// // export const build_where_clause = (filters, mappings) => {
// //     const conditions = Object.entries(filters)
// //         .map(([key, values]) => {
// //             const column_name = mappings.var_to_column[key];
// //             if (!column_name) return null;

// //             // THIS IS THE NEW, SMARTER LOGIC
// //             if (Array.isArray(values)) {
// //                 // If the filter sends an array (for multi-select), use the original "IN" logic.
// //                 // e.g., filters[type][]=Marina&filters[type][]=Port
// //                 const escaped_values = values.map(v => db_connection.escape(v)).join(',');
// //                 return `${column_name} IN (${escaped_values})`;
// //             } else {
// //                 // If the filter sends a single string (for text search), use the new "LIKE" logic.
// //                 // e.g., filters[location]=Schneiderstad
// //                 const escaped_value = db_connection.escape(`%${values}%`);
// //                 return `${column_name} LIKE ${escaped_value}`;
// //             } })
// //         .filter(Boolean);
// //     return conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
// // };

// // export const build_range_facets = (table_name, column_name, bucket_size = 1000) => {
// //     return `
// //         SELECT
// //             CONCAT(
// //                 FLOOR(${column_name}/${bucket_size})*${bucket_size},
// //                 '-',
// //                 FLOOR(${column_name}/${bucket_size})*${bucket_size} + ${bucket_size} - 1
// //             ) AS \`range\`,
// //             COUNT(*) AS count
// //         FROM ${table_name}
// //         WHERE ${column_name} IS NOT NULL
// //         GROUP BY 1
// //         ORDER BY FLOOR(${column_name}/${bucket_size})
// //     `;
// // };
// // export const execute_operation_with_retry = async (operation, max_attempts = 3) => {
// //     for (let attempt = 1; attempt <= max_attempts; attempt++) {
// //         try {
// //             return await operation(); // If it succeeds, return the result
// //         } catch (err) {
// //             console.error(`Operation failed on attempt ${attempt}: ${err.message}`);
// //             if (attempt >= max_attempts) {
// //                 throw err; // If it's the last attempt, throw the error
// //             }
// //             // Optional: wait a moment before retrying
// //             await new Promise(resolve => setTimeout(resolve, 100 * attempt));
// //         }
// //     }
// // };

// // service_utils.js
// 
import db_connection from '../config/dbConfig.js';
import {
  SERVICES,
  berth_Var_To_Column,
  berth_Var_To_Table,
  berth_Unique_Table,
  // charter_Var_To_Column, charter_Var_To_Table, charter_Unique_Table,
  // trailer_Var_To_Column, trailer_Var_To_Table, trailer_Unique_Table,
  // transport_Var_To_Column, transport_Var_To_Table, transport_Unique_Table
} from '../config/All_service_config.js';

// ========================
// CORE UTILITIES & MIDDLEWARE
// ========================

// Create a lookup object for the mappings (internal use only)
const SERVICE_MAPPINGS = {
  berth: {
    var_to_column: berth_Var_To_Column,
    var_to_table: berth_Var_To_Table,
    unique_tables: berth_Unique_Table,
  },
  // charter: {
  //     var_to_column: charter_Var_To_Column,
  //     var_to_table: charter_Var_To_Table,
  //     unique_tables: charter_Unique_Table
  // },
  // trailer: {
  //     var_to_column: trailer_Var_To_Column,
  //     var_to_table: trailer_Var_To_Table,
  //     unique_tables: trailer_Unique_Table
  // },
  // transport: {
  //     var_to_column: transport_Var_To_Column,
  //     var_to_table: transport_Var_To_Table,
  //     unique_tables: transport_Unique_Table
  // }
};
const validate_Schema = async (config) => {
    const errors = [];
    const connection = await db_connection.getConnection();
    try {
        // 1. Check if the main_table exists.
        const [main_table_check] = await connection.query(`SHOW TABLES LIKE ?`, [config.main_table]);
        if (main_table_check.length === 0) {
            errors.push(`Configuration error: The main table '${config.main_table}' does not exist in the database.`);
        }

        // 2. Check if all join_tables exist.
        if (config.join_tables && config.join_tables.length > 0) {
            for (const table of config.join_tables) {
                const [join_table_check] = await connection.query(`SHOW TABLES LIKE ?`, [table]);
                if (join_table_check.length === 0) {
                    errors.push(`Configuration error: The join table '${table}' does not exist in the database.`);
                }
            }
        }
    } finally {
        // Always release the connection, even if there's an error.
        connection.release();
    }
    
    // 3. If any errors were found, throw a single, comprehensive error.
    if (errors.length > 0) {
        throw new Error(errors.join('\n'));
    }
    // If we reach here, the schema is valid.
    console.log(`✅ Schema validated successfully for service: ${config.schema_name}`);
};


// export const initialize_service = (req, res, next) => {
//   try {
//     const service_name = req.params.service_name.toLowerCase();
//     const service_config = SERVICES[service_name];
//     const service_mappings = SERVICE_MAPPINGS[service_name];
//     if (!service_config) {
//       return handle_error_response(
//         res,
//         `Service '${service_name}' not found. Check the SERVICES export in your config.`,
//         404
//       );
//     }

//     req.service_config = service_config;
//     req.service_mappings = service_mappings;

//     next();
//   } catch (err) {
//     handle_error_response(res, `Service initialization failed: ${err.message}`);
//   }
// };


export const initialize_service = async (req, res, next) => {
    try {
        const service_name = req.params.service_name.toLowerCase();
        
        const service_config = SERVICES[service_name];
        const service_mappings = SERVICE_MAPPINGS[service_name];

        if (!service_config) {
            return handle_error_response(res, `Service '${service_name}' not found. Check SERVICES export.`, 404);
        }
        
        // --- THIS IS THE NEW, CRITICAL LINE ---
        // We validate the loaded config against the database before proceeding.
        await validate_Schema(service_config);
        
        req.service_config = service_config;
        req.service_mappings = service_mappings;
        
        next();
    } catch (err) {
        // This will now catch both config loading errors AND schema validation errors.
        handle_error_response(res, `Service initialization failed: ${err.message}`, 500);
    }
};
export const handle_error_response = (res, message, status = 500) => {
  console.error(`[Error] ${message}`);
  res.status(status).json({ ok: false, message });
};

// ========================
// SHARED QUERY BUILDERS (Updated for new structure)
// ========================

// export const build_joins = (main_table_info) => {
//     return main_table_info.join_tables
//         .map(table => `LEFT JOIN ${table} ON ${main_table_info.main_table}.${main_table_info.primary_key} = ${table}.${main_table_info.primary_key}`)
//         .join('\n');
// };
export const build_joins = (main_table_info) => {
  console.log('=== DEBUGGING build_joins ===');
  console.log('main_table_info:', main_table_info);
  console.log('join_tables:', main_table_info?.join_tables);
  console.log(
    'join_tables is array:',
    Array.isArray(main_table_info?.join_tables)
  );

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

// export const build_where_clause = (filters, mappings) => {
//   const conditions = Object.entries(filters)
//     .map(([key, values]) => {
//       const column_name = mappings.var_to_column[key];
//       if (!column_name) return null; // Ignore filters for unknown fields

//       // Smart logic for LIKE vs IN
//       if (Array.isArray(values)) {
//         const escaped_values = values
//           .map((v) => db_connection.escape(v))
//           .join(',');
//         return `${column_name} IN (${escaped_values})`;
//       } else {
//         const escaped_value = db_connection.escape(`%${values}%`);
//         return `${column_name} LIKE ${escaped_value}`;
//       }
//     })
//     .filter(Boolean);

//   return conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
// };

// In service_utils.js (or common_utils.js)

// This is the upgraded function.
export const build_where_clause = (filters, mappings) => {
  // This object maps our simple URL operators to real SQL operators.
  const OPERATOR_MAP = {
    eq: '=',
    neq: '!=',
    gt: '>',
    gte: '>=',
    lt: '<',
    lte: '<=',
    in: 'IN',
    nin: 'NOT IN',
  };

  const conditions = Object.entries(filters || {})
    .map(([key, value]) => {
      const column_name = mappings.var_to_column[key];
      if (!column_name) return null; // Ignore unknown fields

      // NEW: Check if the value is an object for complex operators
      if (typeof value === 'object' && !Array.isArray(value)) {
        const operator = Object.keys(value)[0]; // e.g., 'gte'
        const filterValue = Object.values(value)[0]; // e.g., '1990'
        const sqlOperator = OPERATOR_MAP[operator];

        if (!sqlOperator) return null; // Ignore unknown operators

        if (sqlOperator === 'IN' || sqlOperator === 'NOT IN') {
          // Handle comma-separated strings for IN and NOT IN clauses
          const list = filterValue
            .split(',')
            .map((item) => db_connection.escape(item.trim()));
          return `\`${column_name}\` ${sqlOperator} (${list.join(', ')})`;
        } else {
          // Handle all other operators
          return `\`${column_name}\` ${sqlOperator} ${db_connection.escape(
            filterValue
          )}`;
        }
      } else {
        // OLD LOGIC: Fallback to a LIKE search for simple key=value filters
        const escaped_value = db_connection.escape(`%${value}%`);
        return `\`${column_name}\` LIKE ${escaped_value}`;
      }
    })
    .filter(Boolean);

  return conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
};

export const build_range_facets = (
  table_name,
  column_name,
  bucket_size = 1000
) => {
  return `
        SELECT
            CONCAT(
                FLOOR(${column_name}/${bucket_size})*${bucket_size},
                '-',
                FLOOR(${column_name}/${bucket_size})*${bucket_size} + ${bucket_size} - 1
            ) AS \`range\`,
            COUNT(*) AS count
        FROM ${table_name}
        WHERE ${column_name} IS NOT NULL
        GROUP BY 1
        ORDER BY FLOOR(${column_name}/${bucket_size})
    `;
};

export // In generic_advert_router.js

// Th
const validate_mandatory_fields = (req, res, next) => {
  // 1. Get the .tables array from our stable config object.
  const { tables } = req.service_config;
  const missing_fields = [];
  tables.forEach((table) => {
    Object.entries(table.columns).forEach(([key, config]) => {
      if (
        config.mandatory &&
        (req.body[key] === undefined ||
          req.body[key] === null ||
          req.body[key] === '')
      ) {
        missing_fields.push(key);
      }
    });
  });
  if (missing_fields.length > 0) {
    return handle_error_response(
      res,
      `Missing mandatory fields: ${missing_fields.join(', ')}`,
      400
    );
  }
  next();
};

// ========================
// RETRY UTILITY
// ========================

export const execute_operation_with_retry = async (
  operation,
  max_attempts = 3
) => {
  for (let attempt = 1; attempt <= max_attempts; attempt++) {
    try {
      return await operation(); // If it succeeds, return the result
    } catch (err) {
      console.error(`Operation failed on attempt ${attempt}: ${err.message}`);
      if (attempt >= max_attempts) {
        throw err; // If it's the last attempt, throw the error
      }
      // Wait a moment before retrying
      await new Promise((resolve) => setTimeout(resolve, 100 * attempt));
    }
  }
};

