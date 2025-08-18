import React, { useEffect, useState, useCallback } from "react";
import DropdownWithCheckBoxes from "../components/DropdownWithCheckBoxes2";
import RangeInput from "../components/RangeInput";
import Loader from "../components/Loader";
import DatePickerField from "../components/DatePickerField";
import axios from "axios";
import { useParams } from "react-router-dom";
import FormUtilities from "../utils/Form_Utilities";
import { Section_Positions } from "../utils/Section_Position";

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
      const res = await axios.get(`${API_BASE}/search/${serviceName}/search-options`);
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
      const res = await axios.get(`${API_BASE}/search/${serviceName}/facets/${fieldKey}`);
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
    <div className="flex justify-center items-center">
      <div className="w-full p-4">
        <div className="bg-white shadow-sm rounded-xl p-4">
          <h4 className="text-[25px] capitalize font-bold pb-2 mb-2 pl-[60px]">
            Advertise {serviceName}
          </h4>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex justify-items-center">
              { 
                [...(serviceConfig?.tables || [])].sort((a, b) => {
                  const posA = Section_Positions[serviceName]?.find(t => t.table_Name === a.table_Name)?.position || 0;
                  const posB = Section_Positions[serviceName]?.find(t => t.table_Name === b.table_Name)?.position || 0;
                  return posA - posB; }
                ).map((table) => {

                const tableColumns = Array.isArray(table.columns)
                  ? table.columns
                  : table.columns
                  ? Object.values(table.columns)
                  : [];
                  
                return (
                  <div key={table.table_Name} className="p-4 min-w-[300px] w-1/3 xl:w-[380px]">
                    {/* Table Heading */}
                    <h6 className="text-blue-600 text-[20px] font-bold pb-1 mb-2">
                      {table.section_Heading}
                    </h6> 

                    {/* Cards Container */}
                    <div>
                      {tableColumns.map((col) => {
                        const fieldKey = col.column_Name;
                        const uiKey = buildUiKey(table.table_Name, fieldKey);
                        const label = col.display_Text || fieldKey;

                        return (
                          <div
                            key={uiKey}
                            className="flex flex-col p-0 bg-transparent"
                          >
                            {/* Field Rendering */}
                            {(() => {
                              switch (col.type) {
                                case "radio":
                                  return (
                                    <>
                                      <DropdownWithCheckBoxes
                                        title={label}
                                        mandatory={col.mandatory}
                                        options={
                                          filtersData[uiKey]
                                            ? [...filtersData[uiKey]]
                                            : []
                                        }
                                        selected={formState[uiKey] || []}
                                        onChange={(vals) =>
                                          setFormState((prev) => ({
                                            ...prev,
                                            [uiKey]: vals,
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
                                        advert={true}
                                        onAddOption={(newOpt) => {
                                          setFiltersData((prev) => ({
                                            ...prev,
                                            [uiKey]: [...(prev[uiKey] || []), newOpt],
                                          }));
                                          setFormState((prev) => ({
                                            ...prev,
                                            [uiKey]: [...(prev[uiKey] || []), newOpt.value], // auto-select string value
                                          }));
                                        }}
                                      />
                                      {errors[uiKey] && (
                                        <div className="text-red-500 text-sm mt-1">
                                          {errors[uiKey]}
                                        </div>
                                      )}
                                    </>
                                  );

                                case "number":
                                  // Requirement #5 - Numeric Value Fields Now Come Back As Ranges Of Values [From To] For Search
                                  // Key Functionality #7 - Both - Dual, Measurement, Numeric – ‘From To’ Code
                                  return (
                                    <>
                                      <RangeInput
                                        title={label}
                                        mandatory={col.mandatory}
                                        min={col.min || ""}
                                        max={col.max || ""}
                                        valueFrom={
                                          formState[fieldKey]?.from || ""
                                        }
                                        valueTo={formState[fieldKey]?.to || ""}
                                        onChange={(min, max) =>
                                          setFormState((prev) => ({
                                            ...prev,
                                            [fieldKey]: { from: min, to: max },
                                          }))
                                        }
                                      />
                                      {errors[fieldKey] && (
                                        <div className="text-red-500 text-sm mt-1">
                                          {errors[fieldKey]}
                                        </div>
                                      )}
                                    </>
                                  );

                                case "dual":
                                  // Requirement #6 - Dual Values For Real-Numbers And Measurement Fields Get Converted By Calculation
                                  // Key Functionality #7 - Both - Dual, Measurement, Numeric – ‘From To’ Code
                                  // Requirement #4 - Measurement Fields Now Come Back As A Range Of Values [From To] For Search
                                  return (
                                    <div className="mb-2" key={fieldKey}>
                                      <RangeInput
                                        title={label}
                                        mandatory={col.mandatory}
                                        min={col.min || ""}
                                        max={col.max || ""}
                                        valueFrom={formState[fieldKey]?.from || ""}
                                        valueTo={formState[fieldKey]?.to || ""}
                                        radioOptions={col.radioOptions}
                                        onChange={(min, max) =>
                                          setFormState((prev) => ({
                                            ...prev,
                                            [fieldKey]: { from: min, to: max },
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
                                    <>
                                      <label className="block mb-1 font-medium">
                                        <span className="truncate">
                                          {label}
                                          {col.mandatory && <span className="text-red-500 ml-1">*</span>}
                                        </span>
                                      </label>
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
                                        className="w-full"
                                      />
                                      {errors[fieldKey] && (
                                        <div className="text-red-500 text-sm">
                                          {errors[fieldKey]}
                                        </div>
                                      )}
                                    </>
                                  );

                                default:
                                  return (
                                    <>
                                      <label className="block mb-1 font-medium">
                                        <span className="truncate">
                                          {label}
                                          {col.mandatory && <span className="text-red-500 ml-1">*</span>}
                                        </span>
                                      </label>
                                      <input
                                        type="text"
                                        placeholder={label}
                                        value={formState[fieldKey] || ""}
                                        onChange={(e) =>
                                          setFormState((prev) => ({
                                            ...prev,
                                            [fieldKey]: e.target.value,
                                          }))
                                        }
                                        className="border border-gray-300 rounded-md p-2 w-full"
                                      />
                                      {errors[fieldKey] && (
                                        <div className="text-red-500 text-sm mt-1">
                                          {errors[fieldKey]}
                                        </div>
                                      )}
                                    </>
                                  );
                              }
                            })()}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Submit Button */}
            <div className="mt-6 flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-full disabled:opacity-50 flex items-center"
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

            {/* Autofill Status */}
            {autofillLoading && (
              <div className="text-gray-500 mt-2 italic">Autofilling...</div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
