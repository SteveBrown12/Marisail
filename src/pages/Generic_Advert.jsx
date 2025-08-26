import React, { useEffect, useState, useCallback } from "react";
import DropdownWithCheckBoxes from "../components/DropdownWithCheckBoxes";
import InputComponent from "../components/InputComponent";
import Loader from "../components/Loader";
import DatePickerField from "../components/DatePickerField";
import DateTimePickerField from "../components/DateTimePickerField";
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
  const [mmYKeys, setMmYKeys] = useState({ make: null, model: null, year: null });
  const [openDropdown, setOpenDropdown] = useState(null);

  const UI_KEY_SEP = "||";
  const buildUiKey = (tableName, fieldKey) => `${tableName}${UI_KEY_SEP}${fieldKey}`;

  const init = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/advert/${serviceName}/search-options`);
      if (res.data.ok) {
        const { data , service_mappings } = res.data;
        setServiceConfig(data);
        setServiceMappings(service_mappings);
        setFormState({});

        // Derive varNames for make, model, year to power autofill
        const mm = { make: null, model: null, year: null };
        const v2c = service_mappings?.var_To_Column || {};
        Object.keys(v2c).forEach((vn) => {
          const vnl = vn.toLowerCase();
          const col = String(v2c[vn] || "").toLowerCase();
          if (!mm.make && (vnl === "make" || col === "make")) mm.make = vn;
          if (!mm.model && (vnl === "model" || col === "model")) mm.model = vn;
          if (!mm.year && (vnl === "year" || col === "year")) mm.year = vn;
        });
        setMmYKeys(mm);
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

  // Helper to get field type by varName from config
  const getFieldType = useCallback((varName) => {
    for (const table of serviceConfig?.tables || []) {
      if (table?.columns && table.columns[varName]) return table.columns[varName].type;
    }
    return null;
  }, [serviceConfig]);

  // Key Functionality #4 - Advert - AUTOFILL Sections Based On Section 1 (Trailer, Engine, Vessel)
  // Requirement #7 - Autofill – Code Automatically Tries To Autocomplete The Entire Form - For Engine, Trailer, Vessel With Have Make, Model, Year.
  useEffect(() => {
    const allowed = ["engine", "trailer", "vessel"];
    if (!allowed.includes(String(serviceName || "").toLowerCase())) return;
    if (!mmYKeys.make || !mmYKeys.model || !mmYKeys.year) return;
    const rawMake = formState[mmYKeys.make];
    const rawModel = formState[mmYKeys.model];
    const rawYear = formState[mmYKeys.year];
    if (!rawMake || !rawModel || !rawYear) return;

    // Normalize values for backend
    const make = Array.isArray(rawMake) ? rawMake[0] : rawMake;
    const model = Array.isArray(rawModel) ? rawModel[0] : rawModel;
    const year = typeof rawYear === "object" && rawYear !== null && "value" in rawYear ? rawYear.value : (Array.isArray(rawYear) ? rawYear[0] : rawYear);
    if (!make || !model || !year) return;

    let cancelled = false;
    const doAutofill = async () => {
      setAutofillLoading(true);
      try {
        const res = await fetch(`${API_BASE}/advert/${serviceName}/autofill`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ make, model, year })
        });
        const js = await res.json();
        if (cancelled) return;
        if (js?.ok && js.data) {
          setFormState((prev) => {
            const updates = { ...prev };
            Object.entries(js.data).forEach(([vn, v]) => {
              const t = getFieldType(vn);
              if (t === "radio") {
                updates[vn] = Array.isArray(v) ? v : [v];
              } else if (t === "dual" || t === "number") {
                updates[vn] = typeof v === "object" && v && "value" in v ? v : { value: v };
              } else if (v !== undefined) {
                updates[vn] = v;
              }
            });
            return updates;
          });
        }
      } catch (err) {
        console.error("autofill error", err);
      } finally {
        setAutofillLoading(false);
      }
    };
    const timer = setTimeout(doAutofill, 300);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [serviceName, mmYKeys, getFieldType]);

  // Key Functionality #5 - Advert - MANDATORY FIELDS ERROR MESSAGE Code
  // Requirement #9 - Mandatory Fields (For Advertising) Marked – With Error Message.
  const validate = () => {
    if (!serviceConfig) return true;
    const errs = FormUtilities.validateMandatoryFields(
      serviceConfig.tables,
      formState
    );
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Key Functionality #6 - Advert – SUBMIT BUTTON UPDATES DATABASE with form data entered and new ID.
  // Requirement #8 - Submit Buttons Actually Updates Db Properly.
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
      const newId = js.new_Id || js.new_id || js.data?.new_Id || js.data?.new_id;
      window.location.href = `/detail/${serviceName}/${newId}`;
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

                const tableEntries = table.columns ? Object.entries(table.columns) : [];
                  
                return (
                  <div key={table.table_Name} className="p-4 min-w-[300px] w-1/3 xl:w-[380px]">
                    {/* Table Heading */}
                    <h6 className="text-blue-600 text-[20px] font-bold pb-1 mb-2">
                      {table.section_Heading}
                    </h6> 

                    {/* Cards Container */}
                    <div>
                      {tableEntries.map(([varName, col]) => {
                        const fieldKey = varName; // use varName as the frontend key
                        const uiKey = buildUiKey(table.table_Name, fieldKey);
                        const label = col.display_Text || fieldKey;

                        return (
                          <div
                            key={uiKey}
                            className="flex flex-col p-0 bg-transparent w-full max-w-full overflow-hidden"
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
                                        selected={formState[fieldKey] || []}
                                        onChange={(vals) =>
                                          setFormState((prev) => ({
                                            ...prev,
                                            [fieldKey]: vals,
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
                                            [fieldKey]: [...(prev[fieldKey] || []), newOpt.value],
                                          }));
                                        }}
                                      />
                                      {errors[fieldKey] && (
                                        <div className="text-red-500 text-sm mb-2">
                                          {errors[fieldKey]}
                                        </div>
                                      )}
                                      {formState[fieldKey] && (
                                        <div className="text-green-800 text-[16px] font-bold mb-2">
                                          {formState[fieldKey]}
                                        </div>
                                      )}
                                    </>
                                  );

                                case "number":
                                  // Requirement #5 - Numeric Value Fields Now Come Back As Ranges Of Values [From To] For Search
                                  // Key Functionality #7 - Both - Dual, Measurement, Numeric – ‘From To’ Code
                                  return (
                                    <>
                                      <InputComponent
                                        title={label}
                                        mandatory={col.mandatory}
                                        min={col.min || ""}
                                        max={col.max || ""}
                                        radioOptions={col.radioOptions || col.radio_Options}
                                        value={formState[fieldKey]?.value || ""}
                                        onChange={(value) =>
                                          setFormState((prev) => ({
                                            ...prev,
                                            [fieldKey]: { value: value },
                                          }))
                                        }
                                      />
                                      {errors[fieldKey] && (
                                        <div className="text-red-500 text-sm mb-2">
                                          {errors[fieldKey]}
                                        </div>
                                      )}
                                      {formState[fieldKey]?.value && (
                                        <div className="text-green-800 text-[16px] font-bold mb-2">
                                          {formState[fieldKey].value}
                                        </div>
                                      )}
                                    </>
                                  );

                                case "dual":
                                  // Requirement #6 - Dual Values For Real-Numbers And Measurement Fields Get Converted By Calculation
                                  // Key Functionality #7 - Both - Dual, Measurement, Numeric – ‘From To’ Code
                                  // Requirement #4 - Measurement Fields Now Come Back As A Range Of Values [From To] For Search
                                  return (
                                    <>
                                      <InputComponent
                                        title={label}
                                        mandatory={col.mandatory}
                                        min={col.min || ""}
                                        max={col.max || ""}
                                        value={formState[fieldKey]?.value || ""}
                                        radioOptions={col.radioOptions || col.radio_Options}
                                        onChange={(value) =>
                                          setFormState((prev) => ({
                                            ...prev,
                                            [fieldKey]: { value: value },
                                          }))
                                        }
                                      />
                                      {errors[fieldKey] && (
                                        <div className="text-red-500 text-sm mb-2">
                                          {errors[fieldKey]}
                                        </div>
                                      )}
                                      {formState[fieldKey]?.value && (
                                        <div className="text-green-800 text-[16px] font-bold mb-2">
                                          {formState[fieldKey].value}
                                        </div>
                                      )}
                                    </>
                                  );

                                case "date":
                                  return (
                                    <>
                                      <DatePickerField
                                        title={label}
                                        mandatory={col.mandatory}
                                        mode="single"
                                        value={formState[fieldKey] || ""}
                                        onChange={(iso) =>
                                          setFormState((prev) => ({
                                            ...prev,
                                            [fieldKey]: iso,
                                          }))
                                        }
                                        placeholder="dd-mm-yyyy"
                                      />
                                      {errors[fieldKey] && (
                                        <div className="text-red-500 text-sm mb-2">
                                          {errors[fieldKey]}
                                        </div>
                                      )}
                                      {formState[fieldKey] && (
                                        <div className="text-green-800 text-[16px] font-bold mb-2">
                                          {formState[fieldKey]}
                                        </div>
                                      )}
                                    </>
                                  );

                                case "timestamp":
                                  return (
                                    <>
                                      <DateTimePickerField
                                        title={label}
                                        mandatory={col.mandatory}
                                        mode="single"
                                        value={formState[fieldKey] || ""}
                                        onChange={(iso) =>
                                          setFormState((prev) => ({
                                            ...prev,
                                            [fieldKey]: iso,
                                          }))
                                        }
                                        placeholder="dd-mm-yyyy"
                                      />
                                      {errors[fieldKey] && (
                                        <div className="text-red-500 text-sm mb-2">
                                          {errors[fieldKey]}
                                        </div>
                                      )}
                                      {formState[fieldKey] && (
                                        <div className="text-green-800 text-[16px] font-bold mb-2">
                                          {formState[fieldKey]}
                                        </div>
                                      )}
                                    </>
                                  );

                                default:
                                  //only label for unknown types
                                  return (
                                    <>
                                      <label className="block mb-1 font-medium">
                                        <span className="truncate">
                                          {label}
                                          {col.mandatory && <span className="text-red-500 ml-1">*</span>}
                                        </span>
                                      </label>
                                      {errors[fieldKey] && (
                                        <div className="text-red-500 text-sm mb-2">
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
