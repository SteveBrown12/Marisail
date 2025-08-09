import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";
import DropdownWithCheckBoxes from "../components/DropdownWithCheckBoxes2";
import RangeInput from "../components/RangeInput";

const apiUrl = import.meta.env.VITE_BACKEND_URL;

export default function GenericSearch() {
  const { serviceName } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fetchingOptions, setFetchingOptions] = useState(false);
  const [config, setConfig] = useState(null);
  const [mapping, setMapping] = useState(null);
  const [filtersData, setFiltersData] = useState({}); // available dropdown data
  const [allSelectedOptions, setAllSelectedOptions] = useState({});
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  // Fetch service search config (field structure)
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

  // Lazy load dropdown data from backend /facets/:field
  const fetchDropdownData = async (fieldKey) => {
    if (!serviceName || !fieldKey) return;
    setFetchingOptions(true);
    try {
      const res = await axios.get(`${apiUrl}/${serviceName}/facets/${fieldKey}`);
      if (res.data.ok) {
        setFiltersData((prev) => ({
          ...prev,
          [fieldKey]: res.data.facets || [],
        }));
      }
    } catch (err) {
      console.error(`Error fetching facets for ${fieldKey}:`, err);
    } finally {
      setFetchingOptions(false);
    }
  };

  // Map UI filters to DB keys for backend query
  const mapFiltersToDbKeys = (rawFilters) => {
    if (!mapping?.var_to_column) return rawFilters;
    const mapped = {};
    Object.keys(rawFilters).forEach((key) => {
      const dbKey = mapping.var_to_column[key] || key;
      mapped[dbKey] = rawFilters[key];
    });
    return mapped;
  };

  // Fetch search results
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
  }, [allSelectedOptions, serviceName, config]);

  // Load config once
  useEffect(() => {
    fetchSearchOptions();
  }, [fetchSearchOptions]);

  // Auto search whenever filters change
  useEffect(() => {
    if (config) fetchResults();
  }, [allSelectedOptions, fetchResults, config]);

  // Handlers
  const handleMultiSelectChange = (field, selectedValues) => {
    setAllSelectedOptions((prev) => ({ ...prev, [field]: selectedValues }));
  };

  const handleRangeChange = (field, min, max) => {
    setAllSelectedOptions((prev) => ({ ...prev, [field]: { from: min, to: max } }));
  };

  const handleTextChange = (field, value) => {
    setAllSelectedOptions((prev) => ({ ...prev, [field]: value }));
  };

  const handleDetailsClick = (id) => {
    navigate(`/details/${serviceName}/${id}`);
  };

  if (loading && !config) return <Loader />;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container-fluid my-4">
      <div className="row">
        {/* Sidebar Filters */}
        <div className="col-md-3 border-end">
          <h4 className="mb-4 text-capitalize">Search {serviceName}</h4>
          {config?.tables?.map((table) => {
            const tableColumns = Array.isArray(table.columns)
              ? table.columns
              : table.columns
              ? Object.values(table.columns)
              : [];

            return (
              <div key={table.table_Name} className="mb-4">
                <h6>{table.section_Heading}</h6>
                {tableColumns
                  .filter((col) => col.searchable)
                  .map((col) => {
                    const fieldKey = col.column_Name;
                    const label = col.display_Text || fieldKey;
                    
                    switch (col.type) {
                      case "radio":
                        return (
                          <DropdownWithCheckBoxes
                            title={label}
                            key={fieldKey}
                            options={filtersData[fieldKey] || []}
                            selected={allSelectedOptions[fieldKey] || []}
                            onChange={(vals) => handleMultiSelectChange(fieldKey, vals)}
                            onOpen={() => fetchDropdownData(fieldKey)}
                            fetching={fetchingOptions}
                            placeholder={`Select ${label}`}
                          />
                        );
                      case "number":
                        return (
                          <RangeInput
                            title={label}
                            key={fieldKey}
                            min={col.min || ""}
                            max={col.max || ""}
                            valueFrom={allSelectedOptions[fieldKey]?.from || ""}
                            valueTo={allSelectedOptions[fieldKey]?.to || ""}
                            onChange={(min, max) => handleRangeChange(fieldKey, min, max)}
                          />
                        );
                      case "date":
                        return (
                          <>
                            <label>{label}</label>
                            <input
                              key={fieldKey}
                              type="date"
                              className="form-control mb-2"
                              value={allSelectedOptions[fieldKey] || ""}
                              onChange={(e) => handleTextChange(fieldKey, e.target.value)}
                            />
                          </>
                        );
                      default:
                        return (
                          <>
                            <label>{label}</label>
                            <input
                              key={fieldKey}
                              type="text"
                              className="form-control mb-2"
                              placeholder={label}
                              value={allSelectedOptions[fieldKey] || ""}
                              onChange={(e) => handleTextChange(fieldKey, e.target.value)}
                            />
                          </>
                        );
                    }
                  })}
              </div>
            );
          })}
        </div>

        {/* Results */}
<div className="col-md-9">
  <h4>Results ({results.length})</h4>

  {/* Active Filters Summary */}
  {Object.keys(allSelectedOptions).length > 0 && (
    <div className="mb-3 p-2 border rounded bg-light">
      <strong>Active Filters:</strong>
      <div className="d-flex flex-wrap mt-2">
        {Object.entries(allSelectedOptions).map(([key, value]) => {
          if (!value || (Array.isArray(value) && value.length === 0)) return null;

          let displayValue;
          if (typeof value === "object" && value.from !== undefined) {
            displayValue = `${value.from || ""} - ${value.to || ""}`;
          } else if (Array.isArray(value)) {
            displayValue = value.join(", ");
          } else {
            displayValue = String(value);
          }

          return (
            <span
              key={key}
              className="badge bg-primary text-white me-2 mb-2 d-flex align-items-center"
              style={{ fontSize: "0.9rem" }}
            >
              {key}: {displayValue}
              <button
                type="button"
                className="btn-close btn-close-white ms-2"
                style={{ fontSize: "0.6rem" }}
                onClick={() =>
                  setAllSelectedOptions((prev) => {
                    const updated = { ...prev };
                    delete updated[key];
                    return updated;
                  })
                }
              ></button>
            </span>
          );
        })}

        {/* Clear All Button */}
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
  {!loading && results.length === 0 && <p>No results found</p>}

  <div className="row">
    {results.map((item, idx) => (
      <div className="col-md-4 mb-3" key={item.id || idx}>
        <div
          className="card h-100"
          onClick={() => handleDetailsClick(item.id)}
          style={{ cursor: "pointer" }}
        >
          <div className="card-body">
            {Object.entries(item).map(([key, value]) => (
              <p key={key} className="mb-1">
                <strong>{key}:</strong> {String(value)}
              </p>
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
