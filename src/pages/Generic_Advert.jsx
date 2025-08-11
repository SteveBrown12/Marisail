import React, { useEffect, useState, useCallback } from "react";
import DropdownWithCheckBoxes from "../components/DropdownWithCheckBoxes2";
import RangeInput from "../components/RangeInput";
import Loader from "../components/Loader";
import DatePickerField from "../components/DatePickerField";
import axios from "axios";
import { useParams } from "react-router-dom";
import FormUtilities from "./utils/Form_Utilities";

const API_BASE = import.meta.env.VITE_BACKEND_URL;

export default function GenericAdvert() {
  const { serviceName } = useParams();
  const [loading, setLoading] = useState(true);
  const [fetchingOptions, setFetchingOptions] = useState({});
  const [serviceConfig, setServiceConfig] = useState(null);
  const [serviceMappings, setServiceMappings] = useState(null);
  const [formState, setFormState] = useState({});
  const [errors, setErrors] = useState({});
  const [filtersData, setFiltersData] = useState({});
  const [autofillLoading, setAutofillLoading] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const init = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/${serviceName}/search-options`);
      if (res.data.ok) {
        const { service_config, service_mappings } = res.data.data;
        setServiceConfig(service_config);
        setServiceMappings(service_mappings);
        setFormState({});
      }
    } catch (e) {
      console.error("Init error", e);
    } finally {
      setLoading(false);
    }
  }, [serviceName]);

  useEffect(() => {
    if (!serviceName) return;
    init();
  }, [serviceName, init]);

  const UI_KEY_SEP = "||";
  const buildUiKey = (tableName, fieldKey) => `${tableName}${UI_KEY_SEP}${fieldKey}`;

  const fetchDropdownData = async (uiKey, fieldKey) => {
    if (!serviceName || !fieldKey || !uiKey) return;
    setFetchingOptions((prev) => ({ ...prev, [uiKey]: true }));
    try {
      const res = await axios.get(`${API_BASE}/${serviceName}/facets/${fieldKey}`);
      if (res.data.ok) {
        setFiltersData((prev) => ({
          ...prev,
          [uiKey]: [...(res.data.facets || [])],
        }));
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

  const validate = () => {
    if (!serviceConfig) return true;
    const errs = FormUtilities.validateMandatoryFields(
      serviceConfig.tables,
      formState
    );
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e && e.preventDefault();
    if (!validate()) return window.scrollTo({ top: 0, behavior: "smooth" });
    setLoading(true);
    try {
      const normalized = FormUtilities.normalizeFormForSubmit(
        formState,
        serviceMappings
      );
      const res = await fetch(`${API_BASE}/advert/${serviceName}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(normalized),
      });
      const js = await res.json();
      if (!js.ok) throw new Error(js.message || "submit failed");
      const newId = js.new_id || js.data?.new_id;
      window.location.href = `/details/${serviceName}/${newId}`;
    } catch (err) {
      console.error("submit error", err);
      alert("Submit failed. Check console for error.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="py-10">
      <div className="flex justify-center">
        <div className="w-full max-w-6xl">
          <div className="bg-white shadow-sm rounded-xl p-6">
            <h3 className="mb-6 font-bold text-primary-600">
              Advertise {serviceName.toUpperCase()}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6">
                {serviceConfig?.tables?.map((table) => {
                  const tableColumns = Array.isArray(table.columns)
                    ? table.columns
                    : table.columns
                    ? Object.values(table.columns)
                    : [];

                  return (
                    <div key={table.table_Name} className="mb-6">
                      <h5 className="mt-4 mb-3 border-b pb-2 text-gray-600">
                        {table.section_Heading}
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {tableColumns.map((col) => {
                          const fieldKey = col.column_Name;
                          const uiKey = buildUiKey(table.table_Name, fieldKey);
                          const label = col.display_Text || fieldKey;

                          switch (col.type) {
                            case "radio":
                              return (
                                <div key={uiKey}>
                                  <DropdownWithCheckBoxes
                                    title={label}
                                    options={filtersData[uiKey] ? [...filtersData[uiKey]] : []}
                                    selected={formState[uiKey] || []}
                                    onChange={(vals) =>
                                      setFormState((prev) => ({
                                        ...prev,
                                        [uiKey]: vals
                                      }))
                                    }
                                    onOpen={() => {
                                      setOpenDropdown(uiKey);
                                      fetchDropdownData(uiKey, fieldKey);
                                    }}
                                    onClose={() => setOpenDropdown(null)}
                                    open={openDropdown === uiKey}
                                    fetching={!!fetchingOptions[uiKey]}
                                    placeholder={`Select ${label}`}
                                  />
                                  {errors[uiKey] && (
                                    <div className="text-red-500 text-sm mt-1">
                                      {errors[uiKey]}
                                    </div>
                                  )}
                                </div>
                              );
                            case "number":
                              return (
                                <div key={fieldKey}>
                                  <RangeInput
                                    title={label}
                                    min={col.min || ""}
                                    max={col.max || ""}
                                    valueFrom={formState[fieldKey]?.from || ""}
                                    valueTo={formState[fieldKey]?.to || ""}
                                    onChange={(min, max) =>
                                      setFormState((prev) => ({
                                        ...prev,
                                        [fieldKey]: { from: min, to: max }
                                      }))
                                    }
                                  />
                                  {errors[fieldKey] && (
                                    <div className="text-red-500 text-sm mt-1">
                                      {errors[fieldKey]}
                                    </div>
                                  )}
                                </div>
                              );
                            case "date":
                              return (
                                <div key={fieldKey}>
                                  <label className="block mb-1">{label}</label>
                                  <DatePickerField
                                    mode="single"
                                    value={formState[fieldKey] || ""}
                                    onChange={(iso) =>
                                      setFormState((prev) => ({
                                        ...prev,
                                        [fieldKey]: iso,
                                      }))
                                    }
                                    placeholder="dd-mm-yyyy"
                                    className="w-56"
                                  />
                                  {errors[fieldKey] && (
                                    <div className="text-red-500 text-sm">{errors[fieldKey]}</div>
                                  )}
                                </div>
                              );
                            default:
                              return (
                                <div key={fieldKey}>
                                  <label className="font-medium block mb-1">{label}</label>
                                  <input
                                    type="text"
                                    placeholder={label}
                                    value={formState[fieldKey] || ""}
                                    onChange={(e) =>
                                      setFormState((prev) => ({
                                        ...prev,
                                        [fieldKey]: e.target.value
                                      }))
                                    }
                                    className="border border-gray-300 rounded-md p-2 w-full"
                                  />
                                  {errors[fieldKey] && (
                                    <div className="text-red-500 text-sm mt-1">
                                      {errors[fieldKey]}
                                    </div>
                                  )}
                                </div>
                              );
                          }
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-full disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <span className="inline-block animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4 mr-2 align-middle" />
                      Submitting...
                    </>
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>

              {autofillLoading && (
                <div className="text-gray-500 mt-2 italic">Autofilling...</div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
