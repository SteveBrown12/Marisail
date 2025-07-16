// advertUtils.js

/**
 * Utility to build WHERE clause and SQL params from input body and config
 * Used for exact match filtering where UI sends one value per field
 *
 * @param {Object} body - the object to extract filters from (like requestBody or siteDetails)
 * @param {Array<{ key: string, columnName: string }>} config - field config list
 * @returns {Object} { clause: 'WHERE ...', params: [...] }
 */
export function buildFilterClause(body = {}, config = []) {
  const filters = [];  // holds SQL conditions like "column = ?"
  const params = [];   // holds corresponding values for prepared statement

  config.forEach(({ key, columnName }) => {
    const value = body[key];
    if (value !== undefined && value !== null && value !== "") {
      filters.push(`${columnName} = ?`);
      params.push(value);
    }
  });

  return {
    clause: filters.length ? `WHERE ${filters.join(" AND ")}` : "",
    params,
  };
}


// queryBuilder.js – shared SQL utilities for advert/search routes

/**
 * Builds a WHERE clause for multi-select filters (like checkboxes or dropdowns)
 * E.g. { color: ['red', 'blue'], size: ['L'] } becomes: WHERE color IN (?, ?) AND size IN (?)
 *
 * @param {Object} filters - user-selected filters
 * @param {Array<{ key: string, columnName: string }>} config - maps UI keys to DB column names
 * @returns {Object} { sql: 'WHERE ...', params: [...] }
 */
export function buildWhereMulti(filters = {}, config = []) {
  const clauses = [];  // holds SQL parts like "column IN (?, ?, ?)"
  const params = [];   // holds all values in same order

  for (const [key, values] of Object.entries(filters)) {
    if (!Array.isArray(values) || values.length === 0) continue;

    const column = config.find((f) => f.key === key)?.columnName;
    if (!column) continue;

    const placeholders = values.map(() => "?").join(", ");
    clauses.push(`\`${column}\` IN (${placeholders})`);  // escape column name
    params.push(...values);
  }

  return {
    sql: clauses.length ? "WHERE " + clauses.join(" AND ") : "",
    params,
  };
}

/**
 * Builds SQL LEFT JOIN clauses for all joined tables (excluding the main table)
 *
 * @param {string} mainTable - name of the base table (e.g. "Engine_General")
 * @param {string} idField - the shared ID field used to join (e.g. "Engine_ID")
 * @param {Array<string>} joinTables - all related tables to join
 * @returns {string} SQL string with LEFT JOINs
 */
export function buildJoins(mainTable, idField, joinTables = []) {
  return joinTables
    .filter((t) => t !== mainTable) // skip self join
    .map((t) => `LEFT JOIN \`${t}\` USING (${idField})`)
    .join("\n");
}

/**
 * Builds SELECT clause to include all columns from main + join tables
 *
 * @param {string} mainTable - base table to query from
 * @param {Array<string>} joinTables - other tables to include
 * @returns {string} SELECT clause with all fields like "main.*, join1.*, join2.*"
 */
export function buildSelectAll(mainTable, joinTables = []) {
  const selects = [];

  // ✅ Always force-select Berth_ID from Marina_Port if it's the main table
  if (mainTable === "Marina_Port") {
    selects.push("`Marina_Port`.`Berth_ID` AS `Berth_ID`");
  }

  selects.push(`\`${mainTable}\`.*`);

  joinTables.forEach((t) => {
    if (t !== mainTable) {
      selects.push(`\`${t}\`.*`);
    }
  });

  return selects.join(", ");
}

