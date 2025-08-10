import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";
import DropdownWithCheckBoxes from "../components/DropdownWithCheckBoxes2";
import RangeInput from "../components/RangeInput";
import DatePickerField from "../components/DatePickerField";

const apiUrl = import.meta.env.VITE_BACKEND_URL;
// separator between tableName and fieldName in UI keys
const UI_KEY_SEP = "||";

export default function GenericSearch() {
  const { serviceName } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fetchingOptions, setFetchingOptions] = useState({}); // per-dropdown loading state
  const [config, setConfig] = useState(null);
  const [mapping, setMapping] = useState(null);
  const [filtersData, setFiltersData] = useState({}); // keyed by uiKey
  const [allSelectedOptions, setAllSelectedOptions] = useState({}); // keyed by uiKey
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);

  // --- Helpers ---
  const normalizeFacets = (facets) => {
    if (!Array.isArray(facets)) return [];

    return facets.map((opt) => {
      // primitive values -> make { value, label }
      if (opt === null || opt === undefined) {
        return { value: opt, label: String(opt) };
      }
      if (typeof opt === "string" || typeof opt === "number" || typeof opt === "boolean") {
        return { value: opt, label: String(opt) };
      }

      // object -> try to pick sensible keys for value/label
      const valueCandidates = ["value", "id", "key", "code", "name"];
      const labelCandidates = ["label", "name", "text", "display", "value"];
      const value = valueCandidates.map((k) => opt[k]).find((v) => v !== undefined);
      const label = labelCandidates.map((k) => opt[k]).find((v) => v !== undefined);

      return {
        // preserve original object fields too (useful if dropdown shows counts etc)
        ...opt,
        value: value !== undefined ? value : opt, // fallback to the whole object
        label: label !== undefined ? String(label) : String(value !== undefined ? value : JSON.stringify(opt)),
      };
    });
  };

  const uiKeyToField = (uiKey) => {
    // split by last occurrence of UI_KEY_SEP to safely handle separator in table names
    const idx = uiKey.lastIndexOf(UI_KEY_SEP);
    if (idx === -1) return { tableName: null, fieldName: uiKey };
    return {
      tableName: uiKey.slice(0, idx),
      fieldName: uiKey.slice(idx + UI_KEY_SEP.length),
    };
  };

  // --- API calls ---
  const fetchSearchOptions = useCallback(async () => {
    if (!serviceName) return;
    setLoading(true);
    try {
      const res = await axios.get(`${apiUrl}/${serviceName}/search-options`);
      if (res.data.ok) {
        setConfig(res.data.data.service_config);
        setMapping(res.data.data.service_mappings);
      } else {
        setError("Failed to load search options");
      }
    } catch (err) {
      console.error(err);
      setError("Error loading search options");
    } finally {
      setLoading(false);
    }
  }, [serviceName]);

  // uiKey = `${tableName}${UI_KEY_SEP}${fieldKey}`
  // fieldKey is the backend field used in the facets endpoint
  const fetchDropdownData = async (uiKey, fieldKey) => {
    if (!serviceName || !fieldKey || !uiKey) return;
    // set loading for this uiKey
    setFetchingOptions((prev) => ({ ...prev, [uiKey]: true }));
    try {
      const res = await axios.get(`${apiUrl}/${serviceName}/facets/${fieldKey}`);
      if (res.data.ok) {
        const rawFacets = res.data.facets ?? [];
        // deep-clone + normalize so each dropdown gets its own shaped objects
        const clonedNormalized = normalizeFacets(rawFacets).map((o) => ({ ...o }));
        setFiltersData((prev) => ({ ...prev, [uiKey]: clonedNormalized }));
      } else {
        // if backend returns ok:false, set empty
        setFiltersData((prev) => ({ ...prev, [uiKey]: [] }));
      }
    } catch (err) {
      console.error(`Error fetching facets for ${fieldKey}:`, err);
      setFiltersData((prev) => ({ ...prev, [uiKey]: [] }));
    } finally {
      setFetchingOptions((prev) => ({ ...prev, [uiKey]: false }));
    }
  };

  // map UI-keyed filters back to db keys (strip table prefix)
  const mapFiltersToDbKeys = (rawFilters) => {
    const mapped = {};
    Object.keys(rawFilters).forEach((uiKey) => {
      const { fieldName } = uiKeyToField(uiKey);
      const dbKey = mapping?.var_to_column?.[fieldName] || fieldName;
      mapped[dbKey] = rawFilters[uiKey];
    });
    return mapped;
  };

  const fetchResults = useCallback(async () => {
    if (!serviceName || !config) return;
    setLoading(true);
    try {
      const mappedFilters = mapFiltersToDbKeys(allSelectedOptions);
      const res = await axios.get(`${apiUrl}/${serviceName}/search`, {
        params: { filters: mappedFilters },
      });
      if (res.data.ok) {
        setResults(res.data.data || []);
      } else {
        setError("Search failed");
      }
    } catch (err) {
      console.error(err);
      setError("Error during search");
    } finally {
      setLoading(false);
    }
  }, [allSelectedOptions, serviceName, config, mapping]);

  // --- lifecycle ---
  useEffect(() => {
    fetchSearchOptions();
  }, [fetchSearchOptions]);

  useEffect(() => {
    if (config) fetchResults();
  }, [allSelectedOptions, fetchResults, config]);

  // --- Handlers ---
  const handleMultiSelectChange = (tableName, field, selectedValues) => {
    const uiKey = `${tableName}${UI_KEY_SEP}${field}`;
    setAllSelectedOptions((prev) => ({ ...prev, [uiKey]: selectedValues }));
  };

  const handleRangeChange = (tableName, field, min, max) => {
    const uiKey = `${tableName}${UI_KEY_SEP}${field}`;
    setAllSelectedOptions((prev) => ({ ...prev, [uiKey]: { from: min, to: max } }));
  };

  const handleTextChange = (tableName, field, value) => {
    const uiKey = `${tableName}${UI_KEY_SEP}${field}`;
    setAllSelectedOptions((prev) => ({ ...prev, [uiKey]: value }));
  };

  const handleDetailsClick = (id) => {
    navigate(`/details/${serviceName}/${id}`);
  };

  // --- render ---
  if (loading && !config) return <Loader />;
  if (error) return <div className="alert alert-danger">{error}</div>;
  let a = 0; //using for generate unique key
  return (
    <div className="container-fluid my-4">
      <div className="row">
        {/* Sidebar Filters */}
        <div className="col-md-3 border-end bg-white shadow-sm p-3">
          <h4 className="mb-4 text-capitalize fw-bold pb-2">
            <i className="bi bi-search me-2">Search {serviceName}</i>
          </h4>

          {config?.tables?.map((table) => {
            const tableColumns = Array.isArray(table.columns)
              ? table.columns
              : table.columns
              ? Object.values(table.columns)
              : [];
            a += 1;
            return (
              <div key={`${table.table_Name}-${a}`} className="mb-4">
                <h6 className="text-primary fw-semibold border-bottom pb-1 mb-3 text-center">
                  {table.section_Heading}
                </h6>

                {tableColumns
                  .map((col) => {
                    const uiKey = `${table.table_Name}${UI_KEY_SEP}${col.column_Name}`;
                    const backendFieldKey = col.column_Name;
                    const label = col.display_Text || backendFieldKey;

                    switch (col.type) {
                      case "radio":
                        return (
                          <div className="mb-3" key={uiKey}>
                            <DropdownWithCheckBoxes
                              title={label}
                              options={filtersData[uiKey] ? [...filtersData[uiKey]] : []}
                              selected={allSelectedOptions[uiKey] || []}
                              onChange={(vals) =>
                                handleMultiSelectChange(
                                  table.table_Name,
                                  backendFieldKey,
                                  vals
                                )
                              }
                              onOpen={() => {
                                setOpenDropdown(uiKey); // close any others and open this one
                                fetchDropdownData(uiKey, backendFieldKey)
                              }}
                              open={openDropdown === uiKey}
                              onClose={() => setOpenDropdown(null)}
                              fetching={!!fetchingOptions[uiKey]}
                              placeholder={`Select ${label}`}
                            />
                          </div>
                        );

                      case "number":
                        return (
                          <div className="mb-3" key={uiKey}>
                            <RangeInput
                              title={label}
                              min={col.min || ""}
                              max={col.max || ""}
                              valueFrom={allSelectedOptions[uiKey]?.from || ""}
                              valueTo={allSelectedOptions[uiKey]?.to || ""}
                              onChange={(min, max) =>
                                handleRangeChange(
                                  table.table_Name,
                                  backendFieldKey,
                                  min,
                                  max
                                )
                              }
                            />
                          </div>
                        );

                      case "date":
                        return (
                          <div className="mb-3" key={uiKey}>
                            <label className="form-label fw-medium">{label}</label>
                            <DatePickerField
                              mode="range"
                              value={allSelectedOptions[uiKey] || {}}
                              onChange={(range) =>
                                handleRangeChange(
                                  table.table_Name,
                                  backendFieldKey,
                                  range?.from || "",
                                  range?.to || ""
                                )
                              }
                              style={{ width: "100%" }}
                            />
                          </div>
                        );

                      default:
                        return (
                          <div className="mb-3" key={uiKey}>
                            <label className="form-label fw-medium">{label}</label>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder={label}
                              value={allSelectedOptions[uiKey] || ""}
                              onChange={(e) =>
                                handleTextChange(
                                  table.table_Name,
                                  backendFieldKey,
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        );
                    }
                  })}
              </div>
            );
          })}
        </div>

        {/* Results */}
        <div className="col-md-9">
          <h4 className="fw-bold mb-3">
            <i className="bi bi-list-ul me-2"></i> Results ({results.length})
          </h4>

          {/* Active Filters Summary */}
          {Object.keys(allSelectedOptions).length > 0 && (
            <div className="mb-3 p-3 border rounded bg-light shadow-sm">
              <strong className="text-secondary">Active Filters:</strong>
              <div className="d-flex flex-wrap mt-2">
                {Object.entries(allSelectedOptions).map(([uiKey, value]) => {
                  if (!value || (Array.isArray(value) && value.length === 0)) return null;
                  const { fieldName } = uiKeyToField(uiKey);

                  let displayValue;
                  if (typeof value === "object" && value.from !== undefined) {
                    displayValue = `${value.from || ""} - ${value.to || ""}`;
                  } else if (Array.isArray(value)) {
                    // if selected values are objects, try to pick their label/value
                    displayValue = value
                      .map((v) => {
                        if (v && typeof v === "object") return v.label ?? v.value ?? JSON.stringify(v);
                        return String(v);
                      })
                      .join(", ");
                  } else {
                    displayValue = String(value);
                  }

                  return (
                    <span
                      key={uiKey}
                      className="badge bg-primary text-white me-2 mb-2 d-flex align-items-center shadow-sm"
                      style={{ fontSize: "0.9rem" }}
                    >
                      {fieldName}: {displayValue}
                      <button
                        type="button"
                        className="btn-close btn-close-white ms-2"
                        style={{ fontSize: "0.6rem" }}
                        onClick={() =>
                          setAllSelectedOptions((prev) => {
                            const updated = { ...prev };
                            delete updated[uiKey];
                            return updated;
                          })
                        }
                      />
                    </span>
                  );
                })}

                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger ms-2"
                  onClick={() => setAllSelectedOptions({})}
                >
                  Clear All
                </button>
              </div>
            </div>
          )}

          {loading && <Loader />}
          {!loading && results.length === 0 && (
            <p className="text-muted fst-italic">No results found</p>
          )}

          <div className="row">
            {results.map((item, idx) => (
              <div className="col-md-4 mb-3" key={item.id || idx}>
                <div
                  className="card h-100 shadow-sm border-1 hover-shadow"
                  onClick={() => handleDetailsClick(item.id)}
                  style={{ cursor: "pointer", transition: "0.3s" }}
                >
                  <div className="card-body">
                    {Object.entries(item).slice(0, 5).map(([key, value]) => (
                      <>
                        {value && (
                          <p key={key} className="mb-1">
                            <strong className="text-capitalize">{key}:</strong> {String(value)}
                          </p>
                          )
                        }
                      </>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
