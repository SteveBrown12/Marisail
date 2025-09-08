import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Loader } from "../components/Common_Utils";
import { DropdownWithCheckBoxes, RangeInput, DatePickerField, DateTimePickerField} from "../components/Generic_Components";
import { BerthCard, CharterCard, TrailerCard, TransportCard, EngineCard } from "../components/Services_Cards";
import { ViewControls, Pagination, BerthListItem, CharterListItem, TrailerListItem, TransportListItem, EngineListItem } from "../components/ControlPanel";

const api_Url = import.meta.env.VITE_BACKEND_URL;

const renderServiceComponent = (serviceName, viewMode, item, index) => {
  const key = item.Berth_ID || item.Trailer_ID || item.Transport_ID || item.engine_id || item.Charter_ID || index;

  if (viewMode === 'list') {
    switch (serviceName) {
      case 'berth': return <BerthListItem key={key} item={item} />;
      case 'transport': return <TransportListItem key={key} item={item} />;
      case 'charter': return <CharterListItem key={key} item={item} />;
      case 'trailer': return <TrailerListItem key={key} item={item} />;
      case 'engine': return <EngineListItem key={key} item={item} />;
      default: return null;
    }
  } else { // Grid view
    switch (serviceName) {
      case 'berth': return <BerthCard key={key} item={item} />;
      case 'transport': return <TransportCard key={key} item={item} />;
      case 'charter': return <CharterCard key={key} item={item} />;
      case 'trailer': return <TrailerCard key={key} item={item} />;
      case 'engine': return <EngineCard key={key} item={item} />;
      default: return null;
    }
  }
};

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
  
  const [viewMode, setViewMode] = useState('grid');
  const [sortConfig, setSortConfig] = useState({ key: 'default', direction: 'asc' });
  const [pagination, setPagination] = useState({ currentPage: 1, itemsPerPage: 10 });

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

  const processedResults = useMemo(() => {
    let sortableItems = [...results];
    if (sortConfig.key !== 'default') {
      sortableItems.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [results, sortConfig]);

  const paginatedResults = useMemo(() => {
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    return processedResults.slice(startIndex, startIndex + pagination.itemsPerPage);
  }, [processedResults, pagination]);

  const totalPages = Math.ceil(processedResults.length / pagination.itemsPerPage);

  const handleSortChange = (key) => {
    setSortConfig({ key, direction: 'asc' });
    setPagination(p => ({ ...p, currentPage: 1 }));
  };
  const handleItemsPerPageChange = (value) => {
    setPagination({ currentPage: 1, itemsPerPage: value });
  };
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
        setPagination(p => ({ ...p, currentPage: page }));
    }
  };
  
  const sortOptions = useMemo(() => {
    const options = {
      berth: [ { value: 'Price_PA', label: 'Price (Yearly)' }, { value: 'Year_Established', label: 'Year Established' }, { value: 'Location', label: 'Location' } ],
      trailer: [ { value: 'Asking_Price', label: 'Asking Price' }, { value: 'Year', label: 'Year' }, { value: 'Make', label: 'Make' } ],
      transport: [ { value: 'Quote_Value', label: 'Quote Value' }, { value: 'Posted_Date', label: 'Posted Date' }, { value: 'Category', label: 'Category' } ],
      charter: [ { value: 'Summerrate_Per_Week', label: 'Price (Weekly)' }, { value: 'Guest_Capacity', label: 'Guest Capacity' } ],
      engine: [ { value: 'asking_price', label: 'Asking Price' }, { value: 'Engine_Model_Year', label: 'Year' }, { value: 'Engine_Make', label: 'Make' } ],
    };
    return options[service_Name] || [];
  }, [service_Name]);

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
            <div className="mb-3 p-3 border rounded bg-gray-50 shadow-sm">{/* ... */}</div>
          )}

          {/* --- CONTROL PANEL MOVED TO TOP --- */}
          {!results_Loading && !results_Error && processedResults.length > 0 && (
              <div className="mb-4 p-4 border rounded-lg flex justify-between items-center bg-white shadow-sm w-[55rem]">
                <ViewControls
                    viewMode={viewMode}
                    onViewChange={setViewMode}
                    sortOptions={sortOptions}
                    sortConfig={sortConfig}
                    onSortChange={handleSortChange}
                    itemsPerPage={pagination.itemsPerPage}
                    onItemsPerPageChange={handleItemsPerPageChange}
                />
                <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
              </div>
          )}

          {results_Loading && <Loader />}
          {results_Error && <div className="bg-red-100 text-red-700 p-3 rounded">{results_Error}</div>}

          {!results_Loading && !results_Error && processedResults.length === 0 && (
            <p className="text-gray-500 italic">No results found</p>
          )}

          {!results_Loading && !results_Error && paginatedResults.length > 0 && (
            <>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-10">
                  {paginatedResults.map((item, index) => renderServiceComponent(service_Name, 'grid', item, index))}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {paginatedResults.map((item, index) => renderServiceComponent(service_Name, 'list', item, index))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}