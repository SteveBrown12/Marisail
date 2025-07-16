import { Form, Container, Row, Col } from "react-bootstrap";
import { useEffect, useState, useReducer } from "react";
import DropdownWithCheckBoxes from "../DropdownWithCheckBoxes2";
import RangeInput from "../RangeInput";
import Loader from "../Loader";
import BerthCard from "../BerthCard";
import ResetBar from "../ResetBar";
import { v4 as uuidv4 } from "uuid";
import { useSelector, useDispatch } from "react-redux";
import { setAllFilters, getAllFilters } from "../../store/filtersSlice";
import { Berth_Config } from "../../../node-api/src/config/Berth_Config";
import { fetchBerthDropdownOptions } from "../../../node-api/src/utils/fetchBerthDropdownOptions";

const apiUrl = import.meta.env.VITE_BACKEND_URL;

// Map config tables to UI section keys
const tableNameToSectionKey = {
  Marina_Port: "siteDetails",
  Berth: "generalInformation",
};

const varToScreen = {};
const varToDb = {};

// Map Berth config
Berth_Config.config.forEach((section) => {
  const sectionKey = tableNameToSectionKey[section.table_Name] || "notDefined";
  Object.entries(section.columns).forEach(([key, value]) => {
    varToScreen[key] = { ...value, tableKey: sectionKey };
    varToDb[key] = value.column_Name;
  });
});

// Initial empty filter structure
const initialStateStructure = Object.entries(varToScreen).reduce((acc, [key, field]) => {
  const section = field.tableKey || "notDefined";
  if (!acc[section]) acc[section] = {};
  acc[section][key] = [];
  return acc;
}, {});

export default function BerthSearch() {
  const allFilters = useSelector(getAllFilters);
  const dispatch = useDispatch();

  const [selectedRadios, setSelectedRadios] = useState({});
  const [page, setPage] = useState(0);
  const [fromValue, setFromValue] = useState("");
  const [toValue, setToValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [allSelectedOptions, setAllSelectedOptions] = useState({});
  const [fetching, setFetching] = useState(false);
  const [berths, setBerths] = useState([]);

  const toggleReducer = (state, action) => {
    switch (action.type) {
      case "TOGGLE":
        return { ...state, [action.key]: !state[action.key] };
      default:
        return state;
    }
  };

  const [openStates, dispatchToggle] = useReducer(toggleReducer, {});
  const toggleAccordion = (key) => dispatchToggle({ type: "TOGGLE", key });

  const [filters, setFiltersState] = useState(initialStateStructure);

  const setStateFunctions = Object.keys(initialStateStructure).reduce((acc, key) => {
    acc[key] = (update) =>
      setFiltersState((prev) => ({
        ...prev,
        [key]: { ...prev[key], ...update },
      }));
    return acc;
  }, {});

  const removeTag = (sectionKey, fieldKey) => {
    setAllSelectedOptions((prev) => {
      const updated = { ...prev };
      if (updated[sectionKey]) {
        delete updated[sectionKey][fieldKey];
        if (Object.keys(updated[sectionKey]).length === 0) {
          delete updated[sectionKey];
        }
      }
      return updated;
    });
  };

  const resetTags = () => setAllSelectedOptions({});

  const removeFilter = (sectionKey, fieldKey, filterValue) => {
    const oldFilter = allSelectedOptions[sectionKey]?.[fieldKey] || [];
    const newFilter = oldFilter.filter((item) => item !== filterValue);
    setAllSelectedOptions((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        [fieldKey]: newFilter,
      },
    }));
  };

  // ✅ REUSABLE dropdown data fetcher
  const fetchDropdownData = async (tableKey, columnKey, search = "", offSet = 0) => {
    try {
      setFetching(true);

      const cleanData = await fetchBerthDropdownOptions({
        apiUrl,
        uiKey: columnKey,
        filters: allSelectedOptions,
        search,
        offSet,
      });

      const setStateFn = setStateFunctions[tableKey];
      if (setStateFn) {
        setStateFn({
          [columnKey]: offSet !== 0
            ? [...(filters[tableKey][columnKey] || []), ...cleanData]
            : cleanData,
        });
      }
    } catch (err) {
      console.error("❌ Dropdown fetch error:", err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    const fetchBerthData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${apiUrl}/berthRoutes/search/berth/list`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ selectedOptions: allSelectedOptions, page }),
        });
        const data = await response.json();
        if (data?.ok && Array.isArray(data.data)) {
          setBerths(data.data);
        } else {
          setBerths([]);
        }
      } catch (err) {
        console.error("❌ Error fetching berth list:", err);
        setBerths([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBerthData();
  }, [allSelectedOptions, page]);

  return (
    <Container>
      <Row>
        <ResetBar
          selectedTags={allSelectedOptions}
          removeTag={removeTag}
          resetTags={resetTags}
          removeFilter={removeFilter}
        />
      </Row>
      <Row>
        <Col md={3}>
          <Row><h4 className="py-3">Search For Berth</h4></Row>
          <Row>
            {Object.keys(filters).map((sectionKey) => (
              <fieldset key={sectionKey} className="mb-4">
                <legend className="fieldset-legend">
                  <h6 className="d-flex justify-content-between align-items-center py-3">
                    <span>{sectionKey}</span>
                  </h6>
                </legend>
                {Object.keys(filters[sectionKey]).map((fieldKey) => {
                  const field = varToScreen[fieldKey];
                  return (
                    <Row key={`${sectionKey}-${fieldKey}`} className="row-margin">
                      <Col md={12}>
                        <Form.Group>
                          {field?.type !== "range" ? (
                            <DropdownWithCheckBoxes
                              onOpen={(search, offSet) =>
                                fetchDropdownData(sectionKey, fieldKey, search, offSet)
                              }
                              varToDb={varToDb}
                              heading={fieldKey}
                              title={field?.displayText || fieldKey}
                              options={filters[sectionKey][fieldKey] || []}
                              selectedOptions={allSelectedOptions}
                              setSelectedOptions={setAllSelectedOptions}
                              fetching={fetching}
                            />
                          ) : (
                            <RangeInput
                              key2={fieldKey}
                              title={field?.displayText || fieldKey}
                              fromValue={fromValue}
                              toValue={toValue}
                              setFromValue={setFromValue}
                              setToValue={setToValue}
                              radioOptions={field?.radioOptions}
                              selectedRadio={selectedRadios[fieldKey] || field?.radioOptions?.[0]?.value}
                              onRadioChange={(val) => handleRadioChange(fieldKey, val)}
                              isOpen={!!openStates[fieldKey]}
                              toggleAccordion={() => toggleAccordion(fieldKey)}
                            />
                          )}
                        </Form.Group>
                      </Col>
                    </Row>
                  );
                })}
              </fieldset>
            ))}
          </Row>
        </Col>

        <Col md={9}>
          <Row>
            <Col md={12}><h1 className="py-3">Berths For Sale</h1></Col>
          </Row>
          {loading ? (
            <Loader />
          ) : (
            <Row>
              {berths.length === 0 ? (
                <Col md={12}><p>No Results Found</p></Col>
              ) : (
                berths.map((berth) => (
                  <Col key={uuidv4()} md={4}><BerthCard {...berth} /></Col>
                ))
              )}
            </Row>
          )}
          <Row style={{ marginBottom: "20px" }}>
            <div className="d-flex justify-content-center align-items-center gap-2 mt-4 w-100">
              <button onClick={() => setPage(page - 1)} disabled={page === 0}>Previous</button>
              <span>Page {page + 1}</span>
              <button onClick={() => setPage(page + 1)}>Next</button>
            </div>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
