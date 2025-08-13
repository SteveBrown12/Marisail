import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";
import DropdownWithCheckBoxes from "../components/DropdownWithCheckBoxes2";
import RangeInput from "../components/RangeInput";
import DatePickerField from "../components/DatePickerField";

const apiUrl = import.meta.env.VITE_BACKEND_URL;
const UI_KEY_SEP = "||";

export default function GenericSearch() {
  const { serviceName } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fetchingOptions, setFetchingOptions] = useState({});
  const [config, setConfig] = useState(null);
  const [mapping, setMapping] = useState(null);
  const [filtersData, setFiltersData] = useState({});
  const [allSelectedOptions, setAllSelectedOptions] = useState({});
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);

  const normalizeFacets = (facets) => {
    if (!Array.isArray(facets)) return [];
    return facets.map((opt) => {
      if (opt === null || opt === undefined) {
        return { value: opt, label: String(opt) };
      }
      if (typeof opt === "string" || typeof opt === "number" || typeof opt === "boolean") {
        return { value: opt, label: String(opt) };
      }
      const valueCandidates = ["value", "id", "key", "code", "name"];
      const labelCandidates = ["label", "name", "text", "display", "value"];
      const value = valueCandidates.map((k) => opt[k]).find((v) => v !== undefined);
      const label = labelCandidates.map((k) => opt[k]).find((v) => v !== undefined);
      return {
        ...opt,
        value: value !== undefined ? value : opt,
        label: label !== undefined ? String(label) : String(value !== undefined ? value : JSON.stringify(opt)),
      };
    });
  };

  const uiKeyToField = (uiKey) => {
    const idx = uiKey.lastIndexOf(UI_KEY_SEP);
    if (idx === -1) return { tableName: null, fieldName: uiKey };
    return {
      tableName: uiKey.slice(0, idx),
      fieldName: uiKey.slice(idx + UI_KEY_SEP.length),
    };
  };

  const fetchSearchOptions = useCallback(async () => {
    if (!serviceName) return;
    setLoading(true);
    try {
      const res = await axios.get(`${apiUrl}/search/${serviceName}/search-options`);
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

  const fetchDropdownData = async (uiKey, fieldKey) => {
    if (!serviceName || !fieldKey || !uiKey) return;
    setFetchingOptions((prev) => ({ ...prev, [uiKey]: true }));
    try {
      const res = await axios.get(`${apiUrl}/search/${serviceName}/facets/${fieldKey}`);
      if (res.data.ok) {
        const rawFacets = res.data.facets ?? [];
        const clonedNormalized = normalizeFacets(rawFacets).map((o) => ({ ...o }));
        setFiltersData((prev) => ({ ...prev, [uiKey]: clonedNormalized }));
      } else {
        setFiltersData((prev) => ({ ...prev, [uiKey]: [] }));
      }
    } catch (err) {
      console.error(`Error fetching facets for ${fieldKey}:`, err);
      setFiltersData((prev) => ({ ...prev, [uiKey]: [] }));
    } finally {
      setFetchingOptions((prev) => ({ ...prev, [uiKey]: false }));
    }
  };

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
      const res = await axios.get(`${apiUrl}/search/${serviceName}/search`, {
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

  useEffect(() => {
    fetchSearchOptions();
  }, [fetchSearchOptions]);

  useEffect(() => {
    if (config) fetchResults();
  }, [allSelectedOptions, fetchResults, config]);

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

  if (loading && !config) return <Loader />;
  if (error) return <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>;

  let a = 0;

  return (
    <div className="my-4 px-4">
      <div className="flex flex-col md:flex-row gap-4">
        
        {/* Sidebar Filters */}
        <div className="md:w-1/4 bg-white p-4">
          <h4 className="text-[25px] capitalize font-bold pb-2 mb-2">
            Search for {serviceName}
          </h4>

          {config?.tables?.map((table) => {
            const tableColumns = Array.isArray(table.columns)
              ? table.columns
              : table.columns
              ? Object.values(table.columns)
              : [];
            a += 1;
            return (
              <div key={`${table.table_Name}-${a}`} className="mb-6">
                <h6 className="text-blue-600 text-[20px] font-bold pb-1 mb-2">
                  {table.section_Heading}
                </h6>

                {tableColumns.map((col) => {
                  const uiKey = `${table.table_Name}${UI_KEY_SEP}${col.column_Name}`;
                  const backendFieldKey = col.column_Name;
                  const label = col.display_Text || backendFieldKey;

                  switch (col.type) {
                    case "radio":
                      return (
                        <div className="mb-2" key={uiKey}>
                          <DropdownWithCheckBoxes
                            title={label}
                            options={filtersData[uiKey] ? [...filtersData[uiKey]] : []}
                            selected={allSelectedOptions[uiKey] || []}
                            onChange={(vals) =>
                              handleMultiSelectChange(table.table_Name, backendFieldKey, vals)
                            }
                            onOpen={() => {
                              setOpenDropdown(uiKey);
                              fetchDropdownData(uiKey, backendFieldKey);
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
                        <div className="mb-2" key={uiKey}>
                          <RangeInput
                            title={label}
                            min={col.min || ""}
                            max={col.max || ""}
                            valueFrom={allSelectedOptions[uiKey]?.from || ""}
                            valueTo={allSelectedOptions[uiKey]?.to || ""}
                            onChange={(min, max) =>
                              handleRangeChange(table.table_Name, backendFieldKey, min, max)
                            }
                          />
                        </div>
                      );

                    case "date":
                      return (
                        <div className="mb-2" key={uiKey}>
                          <label className="font-medium block mb-1">{label}</label>
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
                            className="w-full"
                          />
                        </div>
                      );

                    default:
                      return (
                        <div className="mb-2" key={uiKey}>
                          <label className="font-medium block mb-1">{label}</label>
                          <input
                            type="text"
                            className="border border-gray-300 rounded p-2 text-sm w-full"
                            placeholder={label}
                            value={allSelectedOptions[uiKey] || ""}
                            onChange={(e) =>
                              handleTextChange(table.table_Name, backendFieldKey, e.target.value)
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
        <div className="md:w-3/4">
          <h4 className="font-bold mb-3">Results ({results.length})</h4>

          {/* Active Filters Summary */}
          {Object.keys(allSelectedOptions).length > 0 && (
            <div className="mb-3 p-3 border rounded bg-gray-50 shadow-sm">
              <strong className="text-gray-600">Active Filters:</strong>
              <div className="flex flex-wrap mt-2">
                {Object.entries(allSelectedOptions).map(([uiKey, value]) => {
                  if (!value || (Array.isArray(value) && value.length === 0)) return null;
                  const { fieldName } = uiKeyToField(uiKey);

                  let displayValue;
                  if (typeof value === "object" && value.from !== undefined) {
                    displayValue = `${value.from || ""} - ${value.to || ""}`;
                  } else if (Array.isArray(value)) {
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
                      className="bg-blue-600 text-white px-2 py-1 rounded flex items-center shadow-sm text-sm mr-2 mb-2"
                    >
                      {fieldName}: {displayValue}
                      <button
                        type="button"
                        className="ml-2 text-xs"
                        onClick={() =>
                          setAllSelectedOptions((prev) => {
                            const updated = { ...prev };
                            delete updated[uiKey];
                            return updated;
                          })
                        }
                      >
                        ✕
                      </button>
                    </span>
                  );
                })}

                <button
                  type="button"
                  className="ml-2 px-2 py-1 border border-red-500 text-red-500 rounded text-sm"
                  onClick={() => setAllSelectedOptions({})}
                >
                  Clear All
                </button>
              </div>
            </div>
          )}

          {loading && <Loader />}
          {!loading && results.length === 0 && (
            <p className="text-gray-500 italic">No results found</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((item, idx) => (
              <div
                className="bg-white border rounded shadow-sm p-4 hover:shadow-md transition cursor-pointer"
                key={item.id || idx}
                onClick={() => handleDetailsClick(item.id)}
              >
                {Object.entries(item).slice(0, 5).map(([key, value]) =>
                  value ? (
                    <p key={key} className="mb-1">
                      <strong className="capitalize">{key}:</strong> {String(value)}
                    </p>
                  ) : null
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
