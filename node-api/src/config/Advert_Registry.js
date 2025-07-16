// advertRegistry.js

import { Berth_Config } from "./Berth_Config.js";
import { Charter_Config } from "./Charter_Config.js";
import { ENGINES_ADVERT, UNIQUE_TABLE as ENGINE_TABLES } from "./Engine_Advert_Config.js";
import { Trailer_Config } from "./Trailer_Config.js";
import { Transport_Config } from "./Transport_Config.js"; // ✅ Required for unified search
// No need for transportVarToColumn or transportVarToTable now

// ✅ Helper: flatten the table config into [{ key, columnName, tableName }]
function extractAdvertConfigFromTables(tables = []) {
  return tables.flatMap((section) =>
    Object.entries(section.columns).map(([key, meta]) => ({
      key,
      columnName: meta.column_Name,
      tableName: section.table_Name,
    }))
  );
}

export const advertRegistry = {
  berth: {
    idField: "Berth_ID",
    mainTable: "Marina_Port",
    config: Berth_Config.config.flatMap(section =>
      Object.entries(section.columns).map(([key, value]) => ({
        key,
        columnName: value.column_Name,
        tableName: section.table_Name,
      }))
    ),
    joinTables: Berth_Config.join_tables,
  },

  charter: {
    idField: "Marisail_Charter_ID",
    mainTable: "Accommodation_Location",
    config: Charter_Config.config.flatMap(section =>
      Object.entries(section.columns).map(([key, value]) => ({
        key,
        columnName: value.columnName,
        tableName: section.table_Name,
      }))
    ),
    joinTables: [...new Set(Charter_Config.config.map(i => i.table_Name))],
  },

  engine: {
    idField: "Engine_ID",
    mainTable: "General",
    config: ENGINES_ADVERT,
    joinTables: ENGINE_TABLES,
  },

  trailer: {
    idField: "Trailer_ID",
    mainTable: "Trailers_ID",
    config: Trailer_Config.TRAILERS_ADVERT,
    joinTables: Trailer_Config.UNIQUE_TABLE,
  },

  transport: {
    idField: "Transport_Item_ID",                      // ✅ must match DB
    mainTable: "Job",                                  // ✅ correct main table
    config: extractAdvertConfigFromTables(Transport_Config.tables),  // ✅ flatten UI-friendly config
    joinTables: Transport_Config.join_tables,          // ✅ match detail JOINs
  },
};
