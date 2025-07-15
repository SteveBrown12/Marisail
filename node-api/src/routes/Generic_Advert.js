import { Router } from "express";
import db_connection from "../config/dbConfig.js";
import { SERVICES,SERVICE_MAPPINGS } from "../Config/All_Services_Config.js";

const advert_router = Router();

// ========================
// CORE UTILITIES
// ========================
const load_service_config = (service_name) => {
  const config = SERVICE_MAPPINGS[service_name.toLowerCase()];
  if (!config) throw new Error(`Invalid service '${service_name}'`);
  return config;
};

const handle_error_response = (res, message, status = 500) => {
  console.error(`[Advert Error] ${message}`);
  res.status(status).json({ ok: false, message });
};

const validate_schema = async (connection, config) => {
  const errors = [];
  // Main table check
  const [main_table] = await connection.query(
    `SHOW TABLES LIKE '${config.main_table}'`
  );
  if (!main_table.length) errors.push(`Main table '${config.main_table}' missing`);
  
  // Join tables check
  for (const table of config.join_tables) {
    const [join_table] = await connection.query(
      `SHOW TABLES LIKE '${table}'`
    );
    if (!join_table.length) errors.push(`Join table '${table}' missing`);
  }
  
  if (errors.length) throw new Error(errors.join('\n'));
};

// const  checkEqualObjects = (obj1, obj2)=> {
//   const sortedStringify = (obj) => {
//     return JSON.stringify(obj, Object.keys(obj).sort());
//   };
//   return sortedStringify(obj1) === sortedStringify(obj2);
// }

function checkEqualObjects(obj1, obj2) {
  const obj1Keys = Object.keys(obj1);
  console.log("obj1Keys :",obj1Keys);
  console.log("obj2Keys :",Object.keys(obj2));
  return obj1Keys.every(key => key in obj2);
}


async function getColumnValues(columnDefinitions, connection) {
  const results = {};
  
  // Group columns by table to optimize queries
  const columnsByTable = {};
  Object.entries(columnDefinitions).forEach(([fieldKey, columnInfo]) => {
    if (!columnsByTable[columnInfo.tableName]) {
      columnsByTable[columnInfo.tableName] = [];
    }
    columnsByTable[columnInfo.tableName].push({
      fieldKey,
      columnName: columnInfo.column_Name,
      type: columnInfo.type
    });
  });

  // Process each table's columns
  for (const [tableName, columns] of Object.entries(columnsByTable)) {
    // First verify all columns exist in the table
    const columnCheck = await connection.query(
      `SELECT column_name 
       FROM information_schema.columns 
       WHERE table_name = ? 
       AND table_schema = 'marisail'
       AND column_name IN (?)`,
      [tableName, columns.map(c => c.columnName)]
    );

    const existingColumns = columnCheck[0].map(row => row.column_name);
    const validColumns = columns.filter(c => existingColumns.includes(c.columnName));

    if (validColumns.length === 0) continue;

    const selectClause = validColumns.map(c => 
      `${c.columnName} as ${c.columnName}` 
    ).join(', ');

    const whereClause = validColumns.map(c => 
      `${c.columnName} IS NOT NULL`
    ).join(' OR ');

    try {
      await Promise.all(
      validColumns.map(async ({fieldKey, columnName}) => {
        const [rows] = await connection.query(`
          SELECT DISTINCT ${columnName} as value
          FROM ${tableName}
          WHERE ${columnName} IS NOT NULL
        `);
        results[fieldKey] = rows.map(row => row.value);
      })
    );
    } catch (error) {
      console.error(`Error fetching data from ${tableName}:`, error);
      // Continue with next table even if one fails
    }
  }

  // console.log("Final results :",results);

  return results;
}

async function getColumnValuesNew(columnDefinitions, connection) {
  const results = {};
  
  // Group columns by table to optimize queries
  const columnsByTable = {};
  Object.entries(columnDefinitions).forEach(([fieldKey, columnInfo]) => {
    if (!columnsByTable[columnInfo.tableName]) {
      columnsByTable[columnInfo.tableName] = [];
    }
    columnsByTable[columnInfo.tableName].push({
      fieldKey,
      columnName: columnInfo.column_Name
    });
  });

  // Process each table's columns
  for (const [tableName, columns] of Object.entries(columnsByTable)) {
    // First verify all columns exist in the table
    const columnCheck = await connection.query(
      `SELECT column_name 
       FROM information_schema.columns 
       WHERE table_name = ? 
       AND table_schema = 'marisail'
       AND column_name IN (?)`,
      [tableName, columns.map(c => c.columnName)]
    );

    const existingColumns = columnCheck[0].map(row => row.column_name);
    const validColumns = columns.filter(c => existingColumns.includes(c.columnName));

    if (validColumns.length === 0) continue;

    try {
      await Promise.all(
        validColumns.map(async ({fieldKey, columnName}) => {
          const [rows] = await connection.query(
            `SELECT DISTINCT ${columnName} as value
             FROM ${tableName}
             WHERE ${columnName} IS NOT NULL
             GROUP BY ${columnName}`
          );
          // Format to match your /berths endpoint response
          results[fieldKey] = rows.map(row => Object.values(row)[0]);
        })
      );
    } catch (error) {
      console.error(`Error fetching data from ${tableName}:`, error);
    }
  }

  return results;
}


function mapPayloadToSchema(payload, dbConfig) {
  // Get all possible schema keys from all tables
  const allSchemaKeys = dbConfig.tables.flatMap(table => 
    Object.keys(table.columns)
  );

  // Filter payload keys to only those that exist in schema
  const validPayloadKeys = Object.keys(payload).filter(key => 
    allSchemaKeys.includes(key)
  );

  // Find which tables contain the valid payload keys
  const relevantTables = dbConfig.tables.filter(table => {
    const tableKeys = Object.keys(table.columns);
    return validPayloadKeys.some(key => tableKeys.includes(key));
  });

  // Get full column definitions for matched keys
  const columnDefinitions = {};
  const matchedKeys = [];
  
  relevantTables.forEach(table => {
    validPayloadKeys.forEach(key => {
      if (table.columns[key]) {
        columnDefinitions[key] = {
          ...table.columns[key],
          tableName: table.table_Name,
          sectionHeading: table.section_Heading
        };
        matchedKeys.push(key);
      }
    });
  });

  // Calculate match percentage (optional)
  const matchPercentage = (matchedKeys.length / allSchemaKeys.length * 100).toFixed(1);

  return {
    matchedKeys,
    matchPercentage: `${matchPercentage}%`,
    tables: relevantTables,
    columnDefinitions,
    primaryKey: dbConfig.primary_key,
    schemaName: dbConfig.schema_name,
    payloadKeysCount: Object.keys(payload).length,
    matchedKeysCount: matchedKeys.length
  };
}



// ========================
// MIDDLEWARE
// ========================
const init_service = async (req, res, next) => {
  try {
    const config = load_service_config(req.params.service_name);
    await validate_schema(db_connection, config.dbConfig);
   
    const mainTableDetails = config.dbConfig.tables.find((item) => item.table_Name === config.dbConfig.main_table);
   

    req.service_config = config;
    req.body.schemaInfo = mapPayloadToSchema(req.body, config.dbConfig);
    next();
  } catch (err) {
    handle_error_response(res, err.message, 400);
  }
};

const validate_fields = (req, res, next) => {
  const missing = Object.entries(req.service_config.dbConfig.fields)
    .filter(([_, f]) => f.mandatory && !req.body[f.column_name])
    .map(([name]) => name);
  if (missing.length) handle_error_response(res, `Missing fields: ${missing.join(', ')}`, 400);
  else next();
};

// ========================
// TRANSACTION HANDLING
// ========================
const execute_with_retry = async (operation, max_attempts = 3) => {
  let attempt = 0;
  while (attempt < max_attempts) {
    try {
      return await operation();
    } catch (err) {
      attempt++;
      if (attempt >= max_attempts) throw err;
      await new Promise(resolve => setTimeout(resolve, 100 * attempt));
    }
  }
};

// ========================
// ROUTES
// ========================
advert_router.post("/:service_name/options", init_service, async (req, res) => {
  try {
    const {schemaInfo} = req.body;
    const columnValues = await getColumnValues(schemaInfo.columnDefinitions, db_connection);
    // await db_connection.end();

    return res.status(200).json({ 
      ok: true, 
      res: columnValues,
      metadata: {
        matchedKeys: schemaInfo.matchedKeys,
        matchPercentage: schemaInfo.matchPercentage
      }
    });
  } catch (err) {
    handle_error_response(res, `Options fetch failed: ${err.message}`);
  }
});

advert_router.post("/:service_name/autofill", init_service, async (req, res) => {
  try {
    const { service_name } = req.params;
    const { main_table, primary_key } = req.service_config;
    
    if (!["trailer", "engine", "vessel"].includes(service_name)) {
      return res.json({ ok: true, data: {} });
    }

    const query = `
      SELECT ${main_table}.* 
      FROM ${main_table}
      ${req.service_config.join_tables.map(t => 
        `LEFT JOIN ${t} ON ${main_table}.${primary_key} = ${t}.${primary_key}`
      ).join(' ')}
      WHERE make=? AND model=? AND year=?
      LIMIT 1
    `;

    const [data] = await db_connection.query(query, 
      [req.body.make, req.body.model, req.body.year]
    );

    res.json({ ok: true, data: data[0] || {} });
  } catch (err) {
    handle_error_response(res, `Autofill failed: ${err.message}`);
  }
});

advert_router.post("/:service_name/submit", init_service, validate_fields, async (req, res) => {
  try {
    const result = await execute_with_retry(async () => {
      const transaction = await db_connection.beginTransaction();
      try {
        const { main_table, primary_key, fields } = req.service_config;
        
        // Main table insert
        const main_data = {};
        Object.entries(fields).forEach(([key, config]) => {
          if (config.table_name === main_table && req.body[key] !== undefined) {
            main_data[config.column_name] = req.body[key];
          }
        });

        await transaction.query(
          `INSERT INTO ${main_table} (${Object.keys(main_data).join(', ')}) 
           VALUES (${Object.values(main_data).map(v => `'${v}'`).join(', ')})`
        );

        // Join tables insert
        const [[{ new_id }]] = await transaction.query(`SELECT LAST_INSERT_ID() AS new_id`);
        for (const table of req.service_config.join_tables) {
          const table_data = {};
          Object.entries(fields).forEach(([key, config]) => {
            if (config.table_name === table && req.body[key] !== undefined) {
              table_data[config.column_name] = req.body[key];
            }
          });

          if (Object.keys(table_data).length > 0) {
            await transaction.query(
              `INSERT INTO ${table} (${primary_key}, ${Object.keys(table_data).join(', ')}) 
               VALUES (?, ${Object.values(table_data).map(v => `'${v}'`).join(', ')})`,
              [new_id]
            );
          }
        }

        await transaction.commit();
        return { ok: true, new_id };
      } catch (err) {
        await transaction.rollback();
        throw err;
      }
    });

    res.json(result);
  } catch (err) {
    handle_error_response(res, `Submit failed: ${err.message}`);
  }
});

export default advert_router;
