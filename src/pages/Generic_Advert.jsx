import React, { useEffect, useState, useCallback } from "react";
import { Loader } from "../components/Common_Utils";
import {DropdownWithCheckBoxes, InputComponent, DatePickerField, DateTimePickerField} from "../components/Generic_Components";
import axios from "axios";
import { useParams } from "react-router-dom";
import FormUtilities from "../utils/Form_Utilities";
import { Section_Positions } from "../utils/Section_Position";

const API_BASE = import.meta.env.VITE_BACKEND_URL;

export default function GenericAdvert() {
  const { serviceName: service_Name } = useParams();
  const [loading, set_Loading] = useState(true);
  const [fetching_Options, set_Fetching_Options] = useState({});
  const [service_Config, set_Service_Config] = useState(null);
  const [service_Mappings, set_Service_Mappings] = useState(null);
  const [form_State, set_Form_State] = useState({});
  const [errors, set_Errors] = useState({});
  const [filters_Data, set_Filters_Data] = useState({});
  const [autofill_Loading, set_Autofill_Loading] = useState(false);
  const [make_Model_Year_Keys, set_Make_Model_Year_Keys] = useState({ make: null, model: null, year: null });
  const [open_Dropdown, set_Open_Dropdown] = useState(null);

  const UI_KEY_SEP = "||";
  const build_Ui_Key = (table_Name, field_Key) => `${table_Name}${UI_KEY_SEP}${field_Key}`;

  const initialize_Component = useCallback(async () => {
    set_Loading(true);
    try {
      const response = await axios.get(`${API_BASE}/advert/${service_Name}/search-options`);
      if (response.data.ok) {
        const { data: service_Data, service_mappings } = response.data;
        set_Service_Config(service_Data);
        set_Service_Mappings(service_mappings);
        set_Form_State({});

        // Derive varNames for make, model, year to power autofill

        const make_Model_Year_Object = { make: null, model: null, year: null };
        const variable_To_Column_Map = service_mappings?.var_To_Column || {};
        Object.keys(variable_To_Column_Map).forEach((variable_Name) => {
          const variable_Name_Lowercase = variable_Name.toLowerCase();
          const column_Name = String(variable_To_Column_Map[variable_Name] || "").toLowerCase();
          if (!make_Model_Year_Object.make && (variable_Name_Lowercase === "make" || column_Name === "make")) make_Model_Year_Object.make = variable_Name;
          if (!make_Model_Year_Object.model && (variable_Name_Lowercase === "model" || column_Name === "model")) make_Model_Year_Object.model = variable_Name;
          if (!make_Model_Year_Object.year && (variable_Name_Lowercase === "year" || column_Name === "year")) make_Model_Year_Object.year = variable_Name;
        });
        set_Make_Model_Year_Keys(make_Model_Year_Object);
      }
    } catch (error) {
      console.error("Init error", error);
    } finally {
      set_Loading(false);
    }
  }, [service_Name]);

  useEffect(() => { if (service_Name) initialize_Component(); }, [service_Name, initialize_Component]);

  const fetch_Dropdown_Data = async (ui_Key, field_Key) => {
    if (!service_Name || !field_Key || !ui_Key) return;
    set_Fetching_Options((previous_State) => ({ ...previous_State, [ui_Key]: true }));
    try {
      const response = await axios.get(`${API_BASE}/search/${service_Name}/facets/${field_Key}`);
      if (response.data.ok) {
        set_Filters_Data((previous_State) => ({
          ...previous_State,
          [ui_Key]: [...(response.data.facets || [])],
        }));
      } else {
        set_Filters_Data((previous_State) => ({ ...previous_State, [ui_Key]: [] }));
      }
    } catch (error) {
      console.error(`Error fetching facets for ${field_Key}:`, error);
      set_Filters_Data((previous_State) => ({ ...previous_State, [ui_Key]: [] }));
    } finally {
      set_Fetching_Options((previous_State) => ({ ...previous_State, [ui_Key]: false }));
    }
  };

  // Helper to get field type by varName from config

  const get_Field_Type = useCallback((variable_Name) => {
    for (const table of service_Config?.tables || []) {
      if (table?.columns && table.columns[variable_Name]) return table.columns[variable_Name].type;
    }
    return null;
  }, [service_Config]);

  useEffect(() => {
    const autofill_Allowed_Services = ["engine", "trailer", "vessel"];
    if (!autofill_Allowed_Services.includes(String(service_Name || "").toLowerCase())) return;
    if (!make_Model_Year_Keys.make || !make_Model_Year_Keys.model || !make_Model_Year_Keys.year) return;

    const raw_Make = form_State[make_Model_Year_Keys.make];
    const raw_Model = form_State[make_Model_Year_Keys.model];
    const raw_Year = form_State[make_Model_Year_Keys.year];
    if (!raw_Make || !raw_Model || !raw_Year) return;

    // Normalize values for backend

    const normalized_Make = Array.isArray(raw_Make) ? raw_Make[0] : raw_Make;
    const normalized_Model = Array.isArray(raw_Model) ? raw_Model[0] : raw_Model;
    const normalized_Year = typeof raw_Year === "object" && raw_Year !== null && "value" in raw_Year ? raw_Year.value : (Array.isArray(raw_Year) ? raw_Year[0] : raw_Year);
    if (!normalized_Make || !normalized_Model || !normalized_Year) return;

    let is_Cancelled = false;
    const execute_Autofill = async () => {
      set_Autofill_Loading(true);
      try {
        const response = await fetch(`${API_BASE}/advert/${service_Name}/autofill`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ make: normalized_Make, model: normalized_Model, year: normalized_Year })
        });
        const json_Response = await response.json();
        if (is_Cancelled) return;
        if (json_Response?.ok && json_Response.data) {
          set_Form_State((previous_State) => {
            const updated_Form_State = { ...previous_State };
            Object.entries(json_Response.data).forEach(([variable_Name, value]) => {
              const field_Type = get_Field_Type(variable_Name);
              if (field_Type === "radio") {
                updated_Form_State[variable_Name] = Array.isArray(value) ? value : [value];
              } else if (field_Type === "dual" || field_Type === "number") {
                updated_Form_State[variable_Name] = typeof value === "object" && value && "value" in value ? value : { value: value };
              } else if (value !== undefined) {
                updated_Form_State[variable_Name] = value;
              }
            });
            return updated_Form_State;
          });
        }
      } catch (error) {
        console.error("autofill error", error);
      } finally {
        set_Autofill_Loading(false);
      }
    };
    const autofill_Timer = setTimeout(execute_Autofill, 300);
    return () => { is_Cancelled = true; clearTimeout(autofill_Timer); };
  }, [service_Name, make_Model_Year_Keys, get_Field_Type, form_State]);

  // Key Functionality #5 - Advert - MANDATORY FIELDS ERROR MESSAGE Code
  // Requirement #9 - Mandatory Fields (For Advertising) Marked – With Error Message.

  const validate_Form = () => {
    if (!service_Config) return true;
    const errors_Object = FormUtilities.validateMandatoryFields(
      service_Config.tables,
      form_State
    );
    set_Errors(errors_Object);
    return Object.keys(errors_Object).length === 0;
  };


  // Key Functionality #6 - Advert – SUBMIT BUTTON UPDATES DATABASE with form data entered and new ID.
  // Requirement #8 - Submit Buttons Actually Updates Db Properly.

  const handle_Submit = async (event) => {
    if (event) event.preventDefault();
    if (!validate_Form()) return window.scrollTo({ top: 0, behavior: "smooth" });
    set_Loading(true);
    try {
      const normalized_Form_Data = FormUtilities.normalizeFormForSubmit(
        form_State,
        service_Mappings
      );
      const response = await fetch(`${API_BASE}/advert/${service_Name}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(normalized_Form_Data),
      });
      const json_Response = await response.json();
      if (!json_Response.ok) throw new Error(json_Response.message || "submit failed");
      const new_Advert_Id = json_Response.new_Id || json_Response.new_id || json_Response.data?.new_Id || json_Response.data?.new_id;
      window.location.href = `/detail/${service_Name}/${new_Advert_Id}`;
    } catch (error) {
      console.error("submit error", error);
      alert("Submit failed. Check console for error.");
    } finally {
      set_Loading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="flex justify-center items-center">
      <div className="w-full p-4">
        <div className="bg-white shadow-sm rounded-xl p-4">
          <h4 className="text-[25px] capitalize font-bold pb-2 mb-2 pl-[60px]">
            Advertise {service_Name}
          </h4>

          <form onSubmit={handle_Submit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 flex justify-items-center">
              {[...(service_Config?.tables || [])]
                .sort((table_A, table_B) => {
                  const position_A = Section_Positions[service_Name]?.find(t => t.table_Name === table_A.table_Name)?.position || 0;
                  const position_B = Section_Positions[service_Name]?.find(t => t.table_Name === table_B.table_Name)?.position || 0;
                  return position_A - position_B;
                })
                .map((table) => {
                  const table_Entries = table.columns ? Object.entries(table.columns) : [];

                  return (
                    <div key={table.table_Name} className="p-4 min-w-[300px] w-1/3 xl:w-[380px]">
                      <h6 className="text-blue-600 text-[20px] font-bold pb-1 mb-2">
                        {table.section_Heading}
                      </h6>

                      <div>
                        {table_Entries.map(([variable_Name, column_Config]) => {
                          const field_Key = variable_Name;
                          const ui_Key = build_Ui_Key(table.table_Name, field_Key);
                          const display_Label = column_Config.display_Text || field_Key;

                          return (
                            <div key={ui_Key} className="flex flex-col p-0 bg-transparent w-full max-w-full overflow-hidden">
                              {(() => {
                                switch (column_Config.type) {
                                  case "radio":
                                    return (
                                      <>
                                        <DropdownWithCheckBoxes
                                          title={display_Label}
                                          mandatory={column_Config.mandatory}
                                          options={filters_Data[ui_Key] ? [...filters_Data[ui_Key]] : []}
                                          selected={form_State[field_Key] || []}
                                          onChange={(values) =>
                                            set_Form_State((previous_State) => ({ ...previous_State, [field_Key]: values }))
                                          }
                                          onOpen={() => {
                                            set_Open_Dropdown(ui_Key);
                                            fetch_Dropdown_Data(ui_Key, field_Key);
                                          }}
                                          onClose={() => set_Open_Dropdown(null)}
                                          open={open_Dropdown === ui_Key}
                                          fetching={!!fetching_Options[ui_Key]}
                                          placeholder={`Select ${display_Label}`}
                                          advert={true}
                                          onAddOption={(new_Option) => {
                                            set_Filters_Data((previous_State) => ({
                                              ...previous_State,
                                              [ui_Key]: [...(previous_State[ui_Key] || []), new_Option],
                                            }));
                                            set_Form_State((previous_State) => ({
                                              ...previous_State,
                                              [field_Key]: [...(previous_State[field_Key] || []), new_Option.value],
                                            }));
                                          }}
                                        />
                                        {errors[field_Key] && (<div className="text-red-500 text-sm mb-2">{errors[field_Key]}</div>)}
                                        {/* {form_State[field_Key] && (<div className="text-green-800 text-[16px] font-bold mb-2">{form_State[field_Key]}</div>)} */}
                                      </>
                                    );

                                  // Requirement #5 - Numeric Value Fields Now Come Back As Ranges Of Values [From To] For Search
                                  // Key Functionality #7 - Both - Dual, Measurement, Numeric – ‘From To’ Code

                                  case "number":
                                    return (
                                      <>
                                        <InputComponent
                                          title={display_Label}
                                          mandatory={column_Config.mandatory}
                                          min={column_Config.min || ""}
                                          max={column_Config.max || ""}
                                          radioOptions={column_Config.radioOptions || column_Config.radio_Options}
                                          value={form_State[field_Key]?.value || ""}
                                          onChange={(value) =>
                                            set_Form_State((previous_State) => ({ ...previous_State, [field_Key]: { value: value } }))
                                          }
                                        />
                                        {errors[field_Key] && (<div className="text-red-500 text-sm mb-2">{errors[field_Key]}</div>)}
                                        {/* {form_State[field_Key]?.value && (<div className="text-green-800 text-[16px] font-bold mb-2">{form_State[field_Key].value}</div>)} */}
                                      </>
                                    );

                                  case "dual":

                                    // Requirement #6 - Dual Values For Real-Numbers And Measurement Fields Get Converted By Calculation
                                    // Key Functionality #7 - Both - Dual, Measurement, Numeric – ‘From To’ Code
                                    // Requirement #4 - Measurement Fields Now Come Back As A Range Of Values [From To] For Search


                                    return (
                                      <>
                                        <InputComponent
                                          title={display_Label}
                                          mandatory={column_Config.mandatory}
                                          min={column_Config.min || ""}
                                          max={column_Config.max || ""}
                                          value={form_State[field_Key]?.value || ""}
                                          radioOptions={column_Config.radioOptions || column_Config.radio_Options}
                                          onChange={(value) =>
                                            set_Form_State((previous_State) => ({ ...previous_State, [field_Key]: { value: value } }))
                                          }
                                        />
                                        {errors[field_Key] && (<div className="text-red-500 text-sm mb-2">{errors[field_Key]}</div>)}
                                        {/* {form_State[field_Key]?.value && (<div className="text-green-800 text-[16px] font-bold mb-2">{form_State[field_Key].value}</div>)} */}
                                      </>
                                    );

                                  case "date":
                                    return (
                                      <>
                                        <DatePickerField
                                          title={display_Label}
                                          mandatory={column_Config.mandatory}
                                          mode="single"
                                          value={form_State[field_Key] || ""}
                                          onChange={(iso_Date) =>
                                            set_Form_State((previous_State) => ({ ...previous_State, [field_Key]: iso_Date }))
                                          }
                                          placeholder="dd-mm-yyyy"
                                        />
                                        {errors[field_Key] && (<div className="text-red-500 text-sm mb-2">{errors[field_Key]}</div>)}
                                        {/* {form_State[field_Key] && (<div className="text-green-800 text-[16px] font-bold mb-2">{form_State[field_Key]}</div>)} */}
                                      </>
                                    );

                                  case "timestamp":
                                    return (
                                      <>
                                        <DateTimePickerField
                                          title={display_Label}
                                          mandatory={column_Config.mandatory}
                                          mode="single"
                                          value={form_State[field_Key] || ""}
                                          onChange={(iso_Date) =>
                                            set_Form_State((previous_State) => ({ ...previous_State, [field_Key]: iso_Date }))
                                          }
                                          placeholder="dd-mm-yyyy"
                                        />
                                        {errors[field_Key] && (<div className="text-red-500 text-sm mb-2">{errors[field_Key]}</div>)}
                                        {/* {form_State[field_Key] && (<div className="text-green-800 text-[16px] font-bold mb-2">{form_State[field_Key]}</div>)} */}
                                      </>
                                    );

                                  default:
                                    //only label for unknown types
                                    return (
                                      <>
                                        <label className="block mb-1 font-medium">
                                          <span className="truncate">
                                            {display_Label}
                                            {column_Config.mandatory && <span className="text-red-500 ml-1">*</span>}
                                          </span>
                                        </label>
                                        {errors[field_Key] && (<div className="text-red-500 text-sm mb-2">{errors[field_Key]}</div>)}
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
            
            {autofill_Loading && (
              <div className="text-gray-500 mt-2 italic">Autofilling...</div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}