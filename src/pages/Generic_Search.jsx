import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Loader } from "../components/Common_Utils";
import { DropdownWithCheckBoxes, RangeInput, DatePickerField, DateTimePickerField} from "../components/Generic_Components";
import { BerthCard, CharterCard, TrailerCard, TransportCard, EngineCard } from "../components/Services_Cards";

const api_Url = import.meta.env.VITE_BACKEND_URL;

export default function GenericSearch() {
  const { serviceName: service_Name } = useParams();

  const [filters_Loading, set_Filters_Loading] = useState(false);
  const [filters_Error, set_Filters_Error] = useState("");

  const [results_Loading, set_Results_Loading] = useState(false);
  const [results_Error, set_Results_Error] = useState("");

  const [fetching_Options, set_Fetching_Options] = useState({});
  const [config, set_Config] = useState(null);
  const [mapping, set_Mapping] = useState(null);
  const [filters_Data, set_Filters_Data] = useState({});
  const [all_Selected_Options, set_All_Selected_Options] = useState({});
  const [results, set_Results] = useState([]);
  const [open_Dropdown, set_Open_Dropdown] = useState(null);

  const UI_KEY_SEP = "||";
  const build_Ui_Key = (table_Name, field_Key) => `${table_Name}${UI_KEY_SEP}${field_Key}`;

  const normalize_Facets = (facets) => {
    if (!Array.isArray(facets)) return [];
    return facets.map((option) => {
      if (option === null || option === undefined) {
        return { value: option, label: String(option) };
      }
      if (typeof option === "string" || typeof option === "number" || typeof option === "boolean") {
        return { value: option, label: String(option) };
      }
      const value_Candidates = ["value", "id", "key", "code", "name"];
      const label_Candidates = ["label", "name", "text", "display", "value"];
      const value = value_Candidates.map((key) => option[key]).find((val) => val !== undefined);
      const label = label_Candidates.map((key) => option[key]).find((val) => val !== undefined);
      return {
        ...option,
        value: value !== undefined ? value : option,
        label: label !== undefined ? String(label) : String(value !== undefined ? value : JSON.stringify(option)),
      };
    });
  };

  const ui_Key_To_Field = (ui_Key) => {
    const index = ui_Key.lastIndexOf(UI_KEY_SEP);
    if (index === -1) return { tableName: null, fieldName: ui_Key };
    return {
      tableName: ui_Key.slice(0, index),
      fieldName: ui_Key.slice(index + UI_KEY_SEP.length),
    };
  };

  const fetch_Search_Options = useCallback(async () => {
    if (!service_Name) return;
    set_Filters_Loading(true);
    set_Filters_Error("");

    try {
      const response = await axios.get(`${api_Url}/search/${service_Name}/search-options`);
      if (response.data.ok) {
        set_Config(response.data.data.service_config);
        set_Mapping(response.data.data.service_mappings);
      } else {
        set_Filters_Error("Failed to load search options");
      }
    } catch (error) {
      console.error(error);
      set_Filters_Error("Error loading search options");
    } finally {
      set_Filters_Loading(false);
    }
  }, [service_Name]);

  const fetch_Dropdown_Data = async (ui_Key, field_Key) => {
    if (!service_Name || !field_Key || !ui_Key) return;
    set_Fetching_Options((previous_Options) => ({ ...previous_Options, [ui_Key]: true }));
    try {
      const mapped_Filters = map_Filters_To_Db_Keys(all_Selected_Options);
      const response = await axios.get(`${api_Url}/search/${service_Name}/facets/${field_Key}`, {
        params: { filters: mapped_Filters },
      });
      if (response.data.ok) {
        const raw_Facets = response.data.facets ?? [];
        const cloned_Normalized = normalize_Facets(raw_Facets).map((option) => ({ ...option }));
        set_Filters_Data((previous_Data) => ({ ...previous_Data, [ui_Key]: cloned_Normalized }));
      } else {
        set_Filters_Data((previous_Data) => ({ ...previous_Data, [ui_Key]: [] }));
      }
    } catch (error) {
      console.error(`Error fetching facets for ${field_Key}:`, error);
      set_Filters_Data((previous_Data) => ({ ...previous_Data, [ui_Key]: [] }));
    } finally {
      set_Fetching_Options((previous_Options) => ({ ...previous_Options, [ui_Key]: false }));
    }
  };

  const map_Filters_To_Db_Keys = (raw_Filters) => {
    const mapped_Filters = {};
    Object.keys(raw_Filters).forEach((ui_Key) => {
      const { fieldName: field_Name } = ui_Key_To_Field(ui_Key);
      const db_Key = mapping?.var_to_column?.[field_Name] || field_Name;
      mapped_Filters[db_Key] = raw_Filters[ui_Key];
    });
    return mapped_Filters;
  };

  const fetch_Results = useCallback(async () => {
    if (!service_Name || !config) return;
    set_Results_Loading(true);
    set_Results_Error("");

    try {
      const mapped_Filters = map_Filters_To_Db_Keys(all_Selected_Options);
      const response = await axios.get(`${api_Url}/search/${service_Name}/search`, {
        params: { filters: mapped_Filters },
      });
      if (response.data.ok) {
        set_Results(response.data.data || []);
      } else {
        set_Results_Error("Search failed");
      }
    } catch (error) {
      console.error(error);
      set_Results_Error("Error during search");
    } finally {
      set_Results_Loading(false);
    }
  }, [all_Selected_Options, service_Name, config, mapping]);

  useEffect(() => { fetch_Search_Options(); }, [fetch_Search_Options]);

  useEffect(() => { if (config) fetch_Results(); }, [all_Selected_Options, fetch_Results, config]);

  const handle_Multi_Select_Change = (table_Name, field, selected_Values) => {
    const ui_Key = `${table_Name}${UI_KEY_SEP}${field}`;
    set_All_Selected_Options((previous_Options) => ({ ...previous_Options, [ui_Key]: selected_Values }));
  };

  const handle_Range_Change = (table_Name, field, min, max) => {
    const ui_Key = `${table_Name}${UI_KEY_SEP}${field}`;
    set_All_Selected_Options((previous_Options) => ({ ...previous_Options, [ui_Key]: { from: min, to: max } }));
  };

  const handle_Text_Change = (table_Name, field, value) => {
    const ui_Key = `${table_Name}${UI_KEY_SEP}${field}`;
    set_All_Selected_Options((previous_Options) => ({ ...previous_Options, [ui_Key]: value }));
  };

  let table_Counter = 0;

  return (
    <div className="my-4 px-4">
      <div className="flex flex-col md:flex-row gap-4">
        
        {/* Sidebar Filters */}
        <div className="md:w-1/6 min-w-[300px] bg-white p-4">
          <h4 className="text-[25px] capitalize font-bold pb-2 mb-2">
            Search for {service_Name}
          </h4>

          {filters_Loading && <Loader />}
          {filters_Error && <div className="bg-red-100 text-red-700 p-3 rounded">{filters_Error}</div>}

          {!filters_Loading && !filters_Error && config?.tables?.map((table) => {
            const table_Columns = Array.isArray(table.columns)
              ? table.columns
              : table.columns
              ? Object.values(table.columns)
              : [];
            table_Counter += 1;
            return (
              <div key={`${table.table_Name}-${table_Counter}`} className="mb-6">
                <h6 className="text-blue-600 text-[20px] font-bold pb-1 mb-2">
                  {table.section_Heading}
                </h6>

                {table_Columns.map((column) => {
                  const backend_Field_Key = column.column_Name;
                  const ui_Key = build_Ui_Key(table.table_Name, backend_Field_Key);
                  const label = column.display_Text || backend_Field_Key;
                  
                  if (column.searchable === false) return null;
                  switch (column.type) {
                    case "radio":
                      return (
                        <div className="flex flex-col p-0 bg-transparent w-full max-w-full overflow-hidden mb-2" key={ui_Key}>
                          <DropdownWithCheckBoxes
                            title={label}
                            options={filters_Data[ui_Key] ? [...filters_Data[ui_Key]] : []}
                            selected={all_Selected_Options[ui_Key] || []}
                            onChange={(values) =>
                              handle_Multi_Select_Change(table.table_Name, backend_Field_Key, values)
                            }
                            onOpen={() => {
                              set_Open_Dropdown(ui_Key);
                              fetch_Dropdown_Data(ui_Key, backend_Field_Key);
                            }}
                            open={open_Dropdown === ui_Key}
                            onClose={() => set_Open_Dropdown(null)}
                            fetching={!!fetching_Options[ui_Key]}
                            placeholder={`Select ${label}`}
                          />
                        </div>
                      );
                    
                    case "number": 
                      return (
                        <div className="flex flex-col p-0 bg-transparent w-full max-w-full overflow-hidden mb-2" key={ui_Key}>
                          <RangeInput
                            title={label}
                            min={column.min || ""}
                            max={column.max || ""}
                            radioOptions={column.radioOptions || column.radio_Options}
                            valueFrom={all_Selected_Options[ui_Key]?.from || ""}
                            valueTo={all_Selected_Options[ui_Key]?.to || ""}
                            onChange={(min, max) =>
                              handle_Range_Change(table.table_Name, backend_Field_Key, min, max)
                            }
                          />
                        </div>
                      );

                    case "dual":
                      return (
                        <div className="flex flex-col p-0 bg-transparent w-full max-w-full overflow-hidden mb-2" key={ui_Key}>
                          <RangeInput
                            title={label}
                            min={column.min || ""}
                            max={column.max || ""}
                            valueFrom={all_Selected_Options[ui_Key]?.from || ""}
                            valueTo={all_Selected_Options[ui_Key]?.to || ""}
                            radioOptions={column.radioOptions || column.radio_Options}
                            onChange={(min, max) =>
                              handle_Range_Change(table.table_Name, backend_Field_Key, min, max)
                            }
                          />
                        </div>
                      );

                    case "date":
                      return (
                        <div className="flex flex-col p-0 bg-transparent w-full max-w-full overflow-hidden mb-2" key={ui_Key}>
                          <DatePickerField
                            title={label}
                            value={all_Selected_Options[ui_Key] || {}}
                            onChange={(range) =>
                              handle_Text_Change(
                                table.table_Name,
                                backend_Field_Key,
                                range
                              )
                            }
                          />
                        </div>
                      );

                    case "timestamp":
                      return (
                        <div className="flex flex-col p-0 bg-transparent w-full max-w-full overflow-hidden mb-2" key={ui_Key}>
                          <DateTimePickerField
                            title={label}
                            value={all_Selected_Options[ui_Key] || {}}
                            onChange={(range) =>
                              handle_Text_Change(
                                table.table_Name,
                                backend_Field_Key,
                                range
                              )
                            }
                          />
                        </div>
                      );

                    default:
                      return (
                        <div className="mb-2" key={ui_Key}>
                          <label className="font-medium block mb-1">{label}</label>
                        </div>
                      );
                  }
                })}
              </div>
            );
          })}
        </div>

        {/* Results */}
        <div className="md:w-5/6">

          {/* Active Filters Summary */}
          {Object.keys(all_Selected_Options).length > 0 && (
            <div className="mb-3 p-3 border rounded bg-gray-50 shadow-sm">
              <strong className="text-gray-600">Active Filters:</strong>
              <div className="flex flex-wrap mt-2">
                {Object.entries(all_Selected_Options).map(([ui_Key, value]) => {
                  if (!value || (Array.isArray(value) && value.length === 0)) return null;
                  const { fieldName: field_Name } = ui_Key_To_Field(ui_Key);

                  let display_Value;
                  if (typeof value === "object" && value.from !== undefined) {
                    display_Value = `${value.from || ""} - ${value.to || ""}`;
                  } else if (Array.isArray(value)) {
                    display_Value = value
                      .map((val) => {
                        if (val && typeof val === "object") return val.label ?? val.value ?? JSON.stringify(val);
                        return String(val);
                      })
                      .join(", ");
                  } else {
                    display_Value = String(value);
                  }

                  return (
                    <span
                      key={ui_Key}
                      className="bg-blue-600 text-white px-2 py-1 rounded flex items-center shadow-sm text-sm mr-2 mb-2"
                    >
                      {field_Name.replace(/_/g, " ")}: {display_Value}
                      <button
                        type="button"
                        className="ml-2 text-xs"
                        onClick={() =>
                          set_All_Selected_Options((previous_Options) => {
                            const updated_Options = { ...previous_Options };
                            delete updated_Options[ui_Key];
                            return updated_Options;
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
                  onClick={() => set_All_Selected_Options({})}
                >
                  Clear All
                </button>
              </div>
            </div>
          )}

          {results_Loading && <Loader />}
          {results_Error && <div className="bg-red-100 text-red-700 p-3 rounded">{results_Error}</div>}

          {!results_Loading && !results_Error && results.length === 0 && (
            <p className="text-gray-500 italic">No results found</p>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-10">
            {results.map((item, index) => {
              if (service_Name === 'berth') {
                return <BerthCard key={index} item={item} />;
              } else if (service_Name === 'transport') {
                return <TransportCard key={index} item={item} />;
              } else if (service_Name === 'charter') {
                return <CharterCard key={index} item={item} />;
              } else if (service_Name === 'trailer') {
                return <TrailerCard key={index} item={item} />;
              } else if (service_Name === 'engine') {
                return <EngineCard key={index} item={item} />;
              }
              return null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}