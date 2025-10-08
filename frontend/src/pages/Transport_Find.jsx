import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader } from "../components/Common_Utils";
import { DropdownWithCheckBoxes, RangeInput, DatePickerField, DateTimePickerField } from "../components/Generic_Components";

const API_BASE = import.meta.env.VITE_BACKEND_URL;

export default function TransportFind() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [filtersLoading, setFiltersLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({});
  const [totalCount, setTotalCount] = useState(0);
  const [searchableFields, setSearchableFields] = useState([]);
  const [fieldsBySection, setFieldsBySection] = useState({});
  
  // New states for dropdown data management (like GenericSearch)
  const [filtersData, setFiltersData] = useState({});
  const [allSelectedOptions, setAllSelectedOptions] = useState({});
  const [fetchingOptions, setFetchingOptions] = useState({});
  const [openDropdown, setOpenDropdown] = useState(null);
  const [config, setConfig] = useState(null);
  const [mapping, setMapping] = useState(null);

  const UI_KEY_SEP = "||";

  // Helper functions from GenericSearch
  const buildUiKey = (tableName, fieldKey) => `${tableName}${UI_KEY_SEP}${fieldKey}`;
  
  const normalizeFacets = (facets) => {
    if (!Array.isArray(facets)) return [];
    return facets
      .filter((option) => {
        // Filter out "0" values, null, undefined, and empty strings
        if (option === "0" || option === 0 || option === null || option === undefined || option === "") {
          return false;
        }
        return true;
      })
      .map((option) => {
        if (typeof option === "string" || typeof option === "number" || typeof option === "boolean") {
          return { value: option, label: String(option) };
        }
        const valueCandidates = ["value", "id", "key", "code", "name"];
        const labelCandidates = ["label", "name", "text", "display", "value"];
        const value = valueCandidates.map((key) => option[key]).find((val) => val !== undefined);
        const label = labelCandidates.map((key) => option[key]).find((val) => val !== undefined);
        return {
          ...option,
          value: value !== undefined ? value : option,
          label: label !== undefined ? String(label) : String(value !== undefined ? value : JSON.stringify(option)),
        };
      });
  };

  const uiKeyToField = (uiKey) => {
    const index = uiKey.lastIndexOf(UI_KEY_SEP);
    if (index === -1) return { tableName: null, fieldName: uiKey };
    return {
      tableName: uiKey.slice(0, index),
      fieldName: uiKey.slice(index + UI_KEY_SEP.length),
    };
  };

  const mapFiltersToDbKeys = (rawFilters) => {
    const mappedFilters = {};
    Object.keys(rawFilters).forEach((uiKey) => {
      const { fieldName } = uiKeyToField(uiKey);
      const dbKey = mapping?.var_to_column?.[fieldName] || fieldName;
      mappedFilters[dbKey] = rawFilters[uiKey];
    });
    return mappedFilters;
  };

  // Fetch dropdown data on hover/focus (like GenericSearch)
  const fetchDropdownData = async (uiKey, fieldKey) => {
    if (!fieldKey || !uiKey) return;
    
    setFetchingOptions((prev) => ({ ...prev, [uiKey]: true }));
    try {
      const mappedFilters = mapFiltersToDbKeys(allSelectedOptions);
      const response = await axios.get(`${API_BASE}/search/transport/facets/${fieldKey}`, {
        params: { filters: mappedFilters },
      });
      
      if (response.data.ok) {
        const rawFacets = response.data.facets ?? [];
        const normalizedFacets = normalizeFacets(rawFacets);
        setFiltersData((prev) => ({ ...prev, [uiKey]: normalizedFacets }));
      } else {
        setFiltersData((prev) => ({ ...prev, [uiKey]: [] }));
      }
    } catch (error) {
      console.error(`Error fetching facets for ${fieldKey}:`, error);
      setFiltersData((prev) => ({ ...prev, [uiKey]: [] }));
    } finally {
      setFetchingOptions((prev) => ({ ...prev, [uiKey]: false }));
    }
  };

  // Fetch filter configuration from API
  useEffect(() => {
    const fetchFilterConfig = async () => {
      try {
        setFiltersLoading(true);
        const response = await axios.get(`${API_BASE}/search/transport/search-options`);
        
        if (response.data?.ok) {
          const serviceConfig = response.data.data.service_config;
          const serviceMappings = response.data.data.service_mappings;
          
          setConfig(serviceConfig);
          setMapping(serviceMappings);
          
          const fields = extractSearchableFields(serviceConfig);
          setSearchableFields(fields);
          
          // Group fields by section
          const grouped = fields.reduce((acc, field) => {
            if (!acc[field.sectionHeading]) {
              acc[field.sectionHeading] = [];
            }
            acc[field.sectionHeading].push(field);
            return acc;
          }, {});
          setFieldsBySection(grouped);
        }
      } catch (error) {
        console.error("Failed to fetch filter config:", error);
      } finally {
        setFiltersLoading(false);
      }
    };

    fetchFilterConfig();
  }, []);

  const extractSearchableFields = (config) => {
    const fields = [];
    config.tables?.forEach(table => {
      Object.entries(table.columns || {}).forEach(([key, column]) => {
        if (column.searchable) {
          fields.push({
            tableName: table.table_Name,
            sectionHeading: table.section_Heading,
            fieldKey: key,
            columnName: column.column_Name,
            displayText: column.display_Text,
            type: column.type,
            options: column.radio_Options || [],
            mandatory: column.mandatory
          });
        }
      });
    });
    return fields;
  };

  const fetchJobs = useCallback(async () => {
    if (!config) return;
    
    try {
      setLoading(true);
      const mappedFilters = mapFiltersToDbKeys(allSelectedOptions);
      const response = await axios.get(`${API_BASE}/search/transport/search`, {
        params: { filters: mappedFilters },
      });
      
      if (response.data?.ok) {
        setJobs(response.data.data || []);
        setTotalCount(response.data.totalCount || 0);
      }
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setLoading(false);
    }
  }, [allSelectedOptions, config, mapping]);

  useEffect(() => {
    if (config) fetchJobs();
  }, [allSelectedOptions, fetchJobs, config]);

  // Handler functions like GenericSearch
  const handleMultiSelectChange = (tableName, field, selectedValues) => {
    const uiKey = buildUiKey(tableName, field);
    setAllSelectedOptions((prev) => ({ ...prev, [uiKey]: selectedValues }));
  };

  const handleRangeChange = (tableName, field, min, max) => {
    const uiKey = buildUiKey(tableName, field);
    setAllSelectedOptions((prev) => ({ ...prev, [uiKey]: { from: min, to: max } }));
  };

  const handleTextChange = (tableName, field, value) => {
    const uiKey = buildUiKey(tableName, field);
    setAllSelectedOptions((prev) => ({ ...prev, [uiKey]: value }));
  };

  const renderFilterField = (table, column) => {
    const backendFieldKey = column.column_Name;
    const uiKey = buildUiKey(table.table_Name, backendFieldKey);
    const label = column.display_Text || backendFieldKey;

    if (column.searchable === false) return null;

    switch (column.type) {
      case "radio":
        return (
          <div className="flex flex-col p-0 bg-transparent w-full max-w-full overflow-hidden mb-2" key={uiKey}>
            <DropdownWithCheckBoxes
              title={label}
              options={filtersData[uiKey] ? [...filtersData[uiKey]] : []}
              selected={allSelectedOptions[uiKey] || []}
              onChange={(values) => handleMultiSelectChange(table.table_Name, backendFieldKey, values)}
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
          <div className="flex flex-col p-0 bg-transparent w-full max-w-full overflow-hidden mb-2" key={uiKey}>
            <RangeInput
              title={label}
              min={column.min || ""}
              max={column.max || ""}
              radioOptions={column.radioOptions || column.radio_Options}
              valueFrom={allSelectedOptions[uiKey]?.from || ""}
              valueTo={allSelectedOptions[uiKey]?.to || ""}
              onChange={(min, max) => handleRangeChange(table.table_Name, backendFieldKey, min, max)}
            />
          </div>
        );

      case "dual":
        return (
          <div className="flex flex-col p-0 bg-transparent w-full max-w-full overflow-hidden mb-2" key={uiKey}>
            <RangeInput
              title={label}
              min={column.min || ""}
              max={column.max || ""}
              valueFrom={allSelectedOptions[uiKey]?.from || ""}
              valueTo={allSelectedOptions[uiKey]?.to || ""}
              radioOptions={column.radioOptions || column.radio_Options}
              onChange={(min, max) => handleRangeChange(table.table_Name, backendFieldKey, min, max)}
            />
          </div>
        );

      case "date":
        return (
          <div className="flex flex-col p-0 bg-transparent w-full max-w-full overflow-hidden mb-2" key={uiKey}>
            <DatePickerField
              title={label}
              value={allSelectedOptions[uiKey] || {}}
              onChange={(range) => handleTextChange(table.table_Name, backendFieldKey, range)}
            />
          </div>
        );

      case "timestamp":
        return (
          <div className="flex flex-col p-0 bg-transparent w-full max-w-full overflow-hidden mb-2" key={uiKey}>
            <DateTimePickerField
              title={label}
              value={allSelectedOptions[uiKey] || {}}
              onChange={(range) => handleTextChange(table.table_Name, backendFieldKey, range)}
            />
          </div>
        );

      default:
        return (
          <div className="mb-2" key={uiKey}>
            <label className="font-medium block mb-1">{label}</label>
          </div>
        );
    }
  };

  // Job Card with click navigation and conditional styling
  const TransportJobCard = ({ job }) => {
    const handleCardClick = () => {
      navigate(`/detail/transport/${job.Transport_ID}`);
    };

    // Check if job is completed - adjust field name based on your data structure
    const isCompleted = job.Status === "Completed" || job.Job_Status === "Completed" || job.completed === true;

    return (
      <div 
        onClick={handleCardClick}
        className={`cursor-pointer rounded-xl shadow-sm border p-6 hover:shadow-lg transition-all duration-200 ${
          isCompleted 
            ? "bg-green-50 border-green-200 hover:border-green-300" 
            : "bg-white border-gray-100 hover:border-blue-200"
        }`}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xs inline-block px-2 py-1 rounded ${
            isCompleted 
              ? "bg-green-100 text-green-700" 
              : "bg-blue-50 text-blue-700"
          }`}>
            {job.Category || "Transport"}
          </span>
          {job.International === "Yes" && (
            <span className="text-xs inline-block bg-amber-50 text-amber-700 px-2 py-1 rounded">
              International
            </span>
          )}
          {isCompleted && (
            <span className="text-xs inline-block bg-green-100 text-green-700 px-2 py-1 rounded font-medium">
              ✓ Completed
            </span>
          )}
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {job.Title || "Transport Job"}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {job.Description || "No description available."}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <span>📍</span>
            <span className="truncate">From: {job.Collection_Address || "Not specified"}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>📍</span>
            <span className="truncate">To: {job.Delivery_Address || "Not specified"}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>📏</span>
            <span>Distance: {job.Distance ? `${job.Distance} km` : job.Total_Distance ? `${job.Total_Distance} km` : "Not specified"}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>📅</span>
            <span>Deadline: {job.Deadline_Date ? new Date(job.Deadline_Date).toLocaleDateString() : "Not set"}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>💬</span>
            <span>Quotes: {job.Number_Quotes || 0}</span>
          </div>
        </div>

        <div className={`mt-3 text-xs font-medium ${
          isCompleted ? "text-green-600" : "text-blue-600"
        }`}>
          Click to view details →
        </div>
      </div>
    );
  };

  if (filtersLoading) {
    return (
      <div className="my-4 px-4">
        <Loader />
        <p className="text-center text-gray-500 mt-4">Loading search options...</p>
      </div>
    );
  }

  let tableCounter = 0;

  return (
    <div className="my-4 px-4">
      <div className="flex flex-col md:flex-row gap-4">
        
        {/* Sidebar Filters */}
        <div className="md:w-1/6 min-w-[300px] bg-white p-4">
          <h4 className="text-[25px] capitalize font-bold pb-2 mb-2">
            Search for Transport
          </h4>
          
          {config?.tables?.map((table) => {
            const tableColumns = Array.isArray(table.columns)
              ? table.columns
              : table.columns ? Object.values(table.columns) : [];
            tableCounter += 1;
            
            return (
              <div key={`${table.table_Name}-${tableCounter}`} className="mb-6">
                <h6 className="text-blue-600 text-[20px] font-bold pb-1 mb-2">
                  {table.section_Heading}
                </h6>
                {tableColumns.map((column) => renderFilterField(table, column))}
              </div>
            );
          })}
        </div>

        {/* Results Section */}
        <div className="md:w-5/6">
          {/* Active Filters Display */}
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
                      .map((val) => {
                        if (val && typeof val === "object") return val.label ?? val.value ?? JSON.stringify(val);
                        return String(val);
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
                      {fieldName.replace(/_/g, " ")}: {displayValue}
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
                  className="ml-2 px-2 py-1 mr-2 mb-2 border border-red-500 text-red-500 rounded text-sm"
                  onClick={() => setAllSelectedOptions({})}
                >
                  Clear All
                </button>
              </div>
            </div>
          )}

          {/* Loading and Results */}
          {loading && <Loader />}
          {!loading && jobs.length === 0 && (
            <p className="text-gray-500 italic">No results found</p>
          )}
          
          {/* Job Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {jobs.map((job, index) => (
              <TransportJobCard key={`${job.Transport_ID}-${index}`} job={job} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
