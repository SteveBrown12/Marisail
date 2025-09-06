// Form_Utilities.js
const FormUtilities = {
  // Validate mandatory fields at submit time using backend config schema
  validateMandatoryFields(tables, formState) {
    const errs = {};
    tables.forEach(table => {
      Object.entries(table.columns).forEach(([varName, cfg]) => {
        if (cfg.mandatory) {
          const val = formState[varName];
          const label = cfg.display_Text || cfg.displayText || varName;
          // Type-aware mandatory checks
          if (cfg.type === "dual") {
            // Expect object { value, unit }; value must be non-empty
            const v = val && typeof val === "object" ? val.value : undefined;
            if (v === undefined || v === null || String(v).trim() === "") {
              errs[varName] = `${label} is required`;
            }
          } else if (cfg.type === "radio") {
            // Expect array with at least one selection
            if (!Array.isArray(val) || val.length === 0) {
              errs[varName] = `${label} is required`;
            }
          } else {
            // Default string/number/text inputs
            const isEmptyString = typeof val === "string" && val.trim() === "";
            const isEmptyArray = Array.isArray(val) && val.length === 0;
            if (val === undefined || val === null || isEmptyString || isEmptyArray) {
              errs[varName] = `${label} is required`;
            }
          }
        }
      });
    });
    return errs;
  },

  // Normalize the form into var->value payload and convert dual inputs to a canonical single unit
  normalizeFormForSubmit(formState, mappings) {
    if (!mappings) return formState;
    // Flatten dual unit: convert to base unit if required (example: convert mtrs->ft)
    const normalized = {};
    Object.entries(formState).forEach(([k, v]) => {
      // if value is object with value+unit
      if (v && typeof v === "object" && v.value !== undefined && v.unit !== undefined) {
        // simple conversions — extend as required
        if (v.unit === "mtrs") {
          normalized[k] = Number(v.value) * 3.28084; // store as ft
        } else {
          normalized[k] = Number(v.value);
        }
      } else if (v && typeof v === "object" && v.value !== undefined) {
        // plain number/dual with only { value }
        normalized[k] = Number(v.value);
      } else if (Array.isArray(v)) {
        // For advert submit, use first selection if multiple picked
        normalized[k] = v.length > 0 ? v[0] : null;
      } else {
        normalized[k] = v;
      }
    });
    // If backend expects column names instead of var names, the backend submit route uses var_to_column mapping to do this, 
    // but to be safe we pass var names and backend Generic_Advert will map them.
    return normalized;
  },

  // Build search filters payload to match backend build_where_clause expectations
  buildSearchFilters(filters) {
    const payload = {};
    Object.entries(filters).forEach(([varName, info]) => {
      if (!info) return;
      if (info.type === "range") {
        payload[varName] = { from: info.selected?.from || null, to: info.selected?.to || null, unit: info.selected?.unit || null };
      } else {
        payload[varName] = info.selected || [];
      }
    });
    return payload;
  },
  /**
   * NEW HELPER FUNCTION
   * Finds the frontend variable name (key) for a given database column name.
   * @param {object} serviceConfig - The service configuration object.
   * @param {string} targetColumnName - The database column name to find (e.g., "Asking_Price").
   * @returns {string|null} The variable name (e.g., "askingPrice") or null if not found.
   */
  findKeyForColumn(serviceConfig, targetColumnName) {
    if (!serviceConfig || !serviceConfig.tables) {
      return null;
    }
    for (const table of serviceConfig.tables) {
      if (table.columns) {
        for (const [variableName, columnConfig] of Object.entries(table.columns)) {
          if (columnConfig.column_Name === targetColumnName) {
            return variableName; // Found the key
          }
        }
      }
    }
    return null; // Not found
  }
};

export default FormUtilities;
