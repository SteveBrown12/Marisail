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
  const [config, setConfig] = useState(null);
  const [mapping, setMapping] = useState(null);
  const [filters, setFilters] = useState({});
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  // Fetch search config
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

  // Map UI filters to DB keys
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
      const mappedFilters = mapFiltersToDbKeys(filters);
      const res = await axios.get(`${apiUrl}/${serviceName}/search`, {
        params: { filters: mappedFilters },
      });
      if (res.data.ok) {
        setResults(res.data.data);
      } else {
        setError("Search failed");
      }
    } catch (err) {
      console.error(err);
      setError("Error during search");
    } finally {
      setLoading(false);
    }
  }, [filters, serviceName, config]);

  useEffect(() => {
    fetchSearchOptions();
  }, [fetchSearchOptions]);

  // Auto search whenever filters change
  useEffect(() => {
    if (config) {
      fetchResults();
    }
  }, [filters, fetchResults, config]);

  // Handlers
  const handleMultiSelectChange = (field, selectedValues) => {
    setFilters((prev) => ({ ...prev, [field]: selectedValues }));
  };

  const handleRangeChange = (field, min, max) => {
    setFilters((prev) => ({ ...prev, [field]: { from: min, to: max } }));
  };

  const handleTextChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleDetailsClick = (id) => {
    navigate(`/details/${serviceName}/${id}`);
  };

  if (loading && !config) return <Loader />;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container-fluid my-4">
      <h2 className="mb-4 text-capitalize">{serviceName.toUpperCase()} Search</h2>

      <div className="row">
        {/* Sidebar Filters */}
        <div className="col-md-3 border-end" style={{ maxHeight: "80vh", overflowY: "auto" }}>
          {config && config.tables && config.tables.map((table) => {
            const tableColumns = Array.isArray(table.columns)
              ? table.columns
              : table.columns
              ? Object.values(table.columns)
              : [];

            if (tableColumns.length === 0) return null;

            return (
              <div key={table.table_Name} className="mb-4">
                <h5 className="mb-3">{table.section_Heading}</h5>
                {tableColumns
                  .filter((col) => col.searchable)
                  .map((col) => {
                    const fieldKey = col.column_Name;
                    const label = col.label || fieldKey;

                    switch (col.type) {
                      case "radio":
                        return (
                          <div className="mb-3" key={fieldKey}>
                            <label className="form-label">{label}</label>
                            <DropdownWithCheckBoxes
                              options={col.radioOptions || []}
                              selected={filters[fieldKey] || []}
                              onChange={(vals) => handleMultiSelectChange(fieldKey, vals)}
                            />
                          </div>
                        );
                      case "number":
                        return (
                          <div className="mb-3" key={fieldKey}>
                            <label className="form-label">{label}</label>
                            <RangeInput
                              min={col.min || ""}
                              max={col.max || ""}
                              valueFrom={filters[fieldKey]?.from || ""}
                              valueTo={filters[fieldKey]?.to || ""}
                              onChange={(min, max) =>
                                handleRangeChange(fieldKey, min, max)
                              }
                            />
                          </div>
                        );
                      case "date":
                        return (
                          <div className="mb-3" key={fieldKey}>
                            <label className="form-label">{label}</label>
                            <input
                              type="date"
                              className="form-control"
                              value={filters[fieldKey] || ""}
                              onChange={(e) =>
                                handleTextChange(fieldKey, e.target.value)
                              }
                            />
                          </div>
                        );
                      default:
                        return (
                          <div className="mb-3" key={fieldKey}>
                            <label className="form-label">{label}</label>
                            <input
                              type="text"
                              className="form-control"
                              value={filters[fieldKey] || ""}
                              onChange={(e) =>
                                handleTextChange(fieldKey, e.target.value)
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
          <h4>Results ({results.length})</h4>
          {loading && <Loader />}
          {!loading && results.length === 0 && <p>No results found</p>}

          <div className="row">
            {results.map((item, idx) => {
              const keys = Object.keys(item);
              const primaryKey = keys.find(k => /id$/i.test(k)) || keys[0]; // Try to find an ID field

              return (
                <div
                  className="col-md-6 mb-4"
                  key={item[primaryKey] || idx}
                >
                  <div
                    className="card h-100 shadow-sm"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleDetailsClick(item[primaryKey])}
                  >
                    <div className="card-body">
                      <h5 className="card-title">
                        {item.Name || item.Title || item[keys[1]] || `Record #${idx + 1}`}
                      </h5>
                      <h6 className="card-subtitle mb-2 text-muted">
                        {primaryKey}: {item[primaryKey]}
                      </h6>

                      <div className="card-text">
                        {keys.slice(1, 8).map((key) => (
                          <p key={key} className="mb-1">
                            <strong>{key.replace(/_/g, " ")}:</strong> {String(item[key] ?? "N/A")}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
