import { Form, Container, Row, Col } from "react-bootstrap";
import { useEffect, useState, useReducer } from "react";
import DropdownWithCheckBoxes from "../DropdownWithCheckBoxes2";
import RangeInput from "../RangeInput";
import Loader from "../Loader";
import BerthCard from "../BerthCard";
import ResetBar from "../ResetBar";
import { varToDb, varToScreen } from "./Berth_Search_Info";
import { v4 as uuidv4 } from "uuid";
import { setAllFilters, getAllFilters } from "../../store/filtersSlice";
import { useSelector, useDispatch } from "react-redux";
const apiUrl = import.meta.env.VITE_BACKEND_URL;

export default function BerthSearch() {
  const allFilters = useSelector(getAllFilters);
  const dispatch = useDispatch();
  const [selectedRadios, setSelectedRadios] = useState({});
  const [page, setPage] = useState(0);
  const [fromValue, setFromValue] = useState("");
  const [toValue, setToValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [allSelectedOptions, setAllSelectedOptions] = useState({});
  const [selectedTable, setSelectedTable] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("");

  const [fetching, setFetching] = useState(true);

  const toggleReducer = (state, action) => {
    switch (action.type) {
      case "TOGGLE":
        return {
          ...state,
          [action.key]: !state[action.key],
        };
      default:
        return state;
    }
  };

  const [openStates, dispatchToggle] = useReducer(toggleReducer, {});
  const toggleAccordion = (key) => {
    dispatchToggle({ type: "TOGGLE", key });
  };

  // State definitions
  const [siteDetails, setSiteDetails] = useState({
    siteDetails: [],
    termsAndConditions: [],
    type: [],
    marinaName: [],
    location: [],
    ownership: [],
    yearEstablished: [],
    operatingHours: [],
    seasonalOperation: [],
    languageServices: [],
  });

  const [generalInformation, setGeneralInformation] = useState({
    dockTypes: [],
    numberOfDocks: [],
    boatSlipSizes: [],
    numberOfBerthsAvailable: [],
    length: [],
    beam: [],
    draft: [],
    slipWidth: [],
    slipLength: [],
    mooringType: [],
    tideRange: [],
  });

  const [amenitiesAndServices, setAmenitiesAndServices] = useState({
    electricityAvailable: [],
    waterSupply: [],
    wifiAvailability: [],
    carParking: [],
  });

  const [familyFacilities, setFamilyFacilities] = useState({
    laundryFacilities: [],
    restaurantsAndCafes: [],
    restaurant: [],
    bar: [],
    shoppingFacilities: [],
    retailShops: [],
    hospitalityServices: [],
    clubhouseAccess: [],
    swimmingPool: [],
    fitnessCenter: [],
    marinaStore: [],
    chandlery: [],
    restroomAndShowers: [],
    laundryServices: [],
    gymFacilities: [],
    familyFriendlyAmenities: [],
    petFriendlyServices: [],
  });

  const [communityAndSocial, setCommunityAndSocial] = useState({
    yachtClubMembership: [],
  });

  const [services, setServices] = useState({
    docksideTrolley: [],
    fuelTypesAvailable: [],
    fuelDock: [],
    electricalHookupSpecifications: [],
  });

  const [repairAndMaintenance, setRepairAndMaintenance] = useState({
    boatLiftSpecifications: [],
  });

  const [accessibility, setAccessibility] = useState({
    handicapAccessibleSlips: [],
    proximityToHandicapParking: [],
    accessibleFacilities: [],
    assistanceServicesForDisabled: [],
    signageAndDirections: [],
    accessibleRestroomsAndShowers: [],
  });

  const [connectivityAndTransportation, setConnectivityAndTransportation] =
    useState({
      taxiServices: [],
    });

  const [environmentalConsiderations, setEnvironmentalConsiderations] =
    useState({
      wasteDisposal: [],
      waterHookupSpecifications: [],
    });

  const [securityAndSafety, setSecurityAndSafety] = useState({
    fireSafetyEquipment: [],
    firstAidKits: [],
    securityPatrol: [],
    cctvSurveillance: [],
  });

  const [financialInformation, setFinancialInformation] = useState({
    currency: [],
  });

  const [pricingAndLeaseTerms, setPricingAndLeaseTerms] = useState({
    pricePerAnnum: [],
    pricePerMonth: [],
    pricePerWeek: [],
    availability: [],
    annualLeaseRenewable: [],
    cancellationPolicy: [],
  });

  const [notDefined, setNotDefined] = useState({
    priceLabel: [],
    priceDrop: [],
    country: [],
    addressDetails: [],
    distance: [],
  });

  const filters = {
    siteDetails,
    generalInformation,
    amenitiesAndServices,
    familyFacilities,
    communityAndSocial,
    services,
    repairAndMaintenance,
    accessibility,
    connectivityAndTransportation,
    environmentalConsiderations,
    securityAndSafety,
    financialInformation,
    pricingAndLeaseTerms,
    notDefined,
  };

  const setStateFunctions = {
    siteDetails: setSiteDetails,
    generalInformation: setGeneralInformation,
    amenitiesAndServices: setAmenitiesAndServices,
    familyFacilities: setFamilyFacilities,
    communityAndSocial: setCommunityAndSocial,
    services: setServices,
    repairAndMaintenance: setRepairAndMaintenance,
    accessibility: setAccessibility,
    connectivityAndTransportation: setConnectivityAndTransportation,
    environmentalConsiderations: setEnvironmentalConsiderations,
    securityAndSafety: setSecurityAndSafety,
    financialInformation: setFinancialInformation,
    pricingAndLeaseTerms: setPricingAndLeaseTerms,
    notDefined: setNotDefined,
  };

  const handleRadioChange = (key2, value) => {
    setSelectedRadios((prev) => ({ ...prev, [key2]: value }));
  };

  const removeTag = (tag) => {
    setAllSelectedOptions((prev) => {
      const newOptions = { ...prev };
      delete newOptions[tag];
      return newOptions;
    });
  };

  const resetTags = () => {
    setAllSelectedOptions({});
  };

  const setFilters = (key, data) => {
    const setStateFunction = setStateFunctions[key];
    if (setStateFunction) {
      setStateFunction((prev) => ({
        ...prev,
        ...data,
      }));
    } else {
      console.error(`No setState function found for key: ${key}`);
    }
  };

  // const URL = apiUrl + "/search_berth/";
  const URL = apiUrl;

  const fetchDropdownData = async (tableKey, columnKey, search, offSet) => {
    if (varToScreen[columnKey]?.type === "range" || tableKey === "notDefined")
      return;
    try {
      if (!varToScreen[columnKey]) {
        console.error(`Missing varToScreen mapping for ${columnKey}`);
        return;
      }
      console.log("/berths Put");
      setFetching(true);
      const response = await fetch(`${URL}berths`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteDetailsTable: tableKey,
          siteDetailsColumn: columnKey,
          searchString: search,
          offSet: offSet,
          appliedFilters: allSelectedOptions,
        }),
      });
      setFetching(false);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data?.ok || !data?.siteDetails?.data) {
        console.error("Invalid response format:", data);
        return;
      }

      // Clean and validate the data
      var cleanData = data.siteDetails.data
        .filter(Boolean) // Remove null/undefined values
        .map((value) => value); // Convert to string and trim whitespace

      // Update the state with the cleaned data
      // console.log(data,"Clean********************************")
      const setStateFunction = setStateFunctions[tableKey];
      if (setStateFunction) {
        // console.log("***********",cleanData,filters[tableKey][columnKey].length,offSet, offSet ==0)
        setStateFunction((prev) => ({
          ...prev,
          [columnKey]:
            offSet !== 0 ? [...prev[columnKey], ...cleanData] : cleanData,
        }));
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const [berths, setBerths] = useState([]);

  // Fetch berth data when filters or page changes
  const removeFilter = (key, filter) => {
    const oldFilter = allSelectedOptions[key] || []; // Ensure it doesn't break if key is undefined
    const newFilter = oldFilter.filter((currFilter) => currFilter !== filter);

    setAllSelectedOptions((prev) => ({
      ...prev,
      [key]: newFilter, // Use newFilter instead of filter
    }));
  };

  useEffect(() => {
    const fetchBerthData = async () => {
      setLoading(true);
      try {
        // const response = await fetch(`${URL}berthsData`, {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify({
        //     selectedOptions: allSelectedOptions, // Only names are sent here
        //     page: page,
        //   }),
        // });

        const response = await fetch(`${URL}/generic_search/berth/search`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            selectedOptions: allSelectedOptions, // Only names are sent here
            page: page,
          }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data?.ok && typeof data?.res?.[0] === 'object') {
          setBerths(data.res);
          setLoading(false);
        } else {
          console.error("Invalid berth data format:", data);
          setBerths([]);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching berth data:", err);
        setBerths([]);
        setLoading(false);
      } finally {
        console.error("Error fetching berth data:", err);
        setLoading(false);
      }
    };

    fetchBerthData();
  }, [allSelectedOptions, page, URL]);
  console.log("berths data:", berths);
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
          <Row>
            <h4 className="py-3">Search For Berth</h4>
          </Row>

          <Row>
            {Object.keys(filters).map((key) => {
              return (
                <fieldset key={key} className="mb-4">
                  <legend className="fieldset-legend">
                    <h6
                      style={{
                        padding: "15px 0px",

                        width: "100%",
                        display: "flex", // Use flex display
                        flexDirection: "row", // Arrange elements in a row
                        justifyContent: "space-between", // Space elements evenly
                        alignItems: "center", // Align vertically
                      }}
                    >
                      <span>{varToScreen[key]?.displayText}</span>
                     
                    </h6>
                  </legend>
                  {Object.keys(filters[key]).map((key2) => {
                    const uniqueKey = `${key}-${key2}`; // Unique key for each filter
                    return (
                      <Row key={uniqueKey} className="row-margin">
                        <Col md={12}>
                          <Form.Group>
                            {varToScreen[key2]?.type !== "range" ? (
                              <DropdownWithCheckBoxes
                                onOpen={(search, offSet) =>
                                  fetchDropdownData(
                                    key,
                                    key2,
                                    search,
                                    offSet,
                                    allSelectedOptions
                                  )
                                }
                                varToDb={varToDb}
                                heading={key2}
                                title={varToScreen[key2]?.displayText}
                                options={filters[key][key2] || []}
                                selectedOptions={allSelectedOptions}
                                setSelectedOptions={setAllSelectedOptions}
                                fetching={fetching}
                              />
                            ) : (
                              <RangeInput
                                key2={key2.replace(/\s+/g, " ").trim()}
                                title={varToScreen[key2]?.displayText}
                                fromValue={fromValue}
                                toValue={toValue}
                                setFromValue={setFromValue}
                                radioOptions={varToScreen[key2]?.radioOptions}
                                setToValue={setToValue}
                                selectedRadio={
                                  selectedRadios[key2] ||
                                  varToScreen[key2]?.radioOptions[0]?.value
                                }
                                onRadioChange={(value) =>
                                  handleRadioChange(key2, value)
                                }
                                isOpen={!!openStates[key2]}
                                toggleAccordion={() => toggleAccordion(key2)}
                              />
                            )}
                          </Form.Group>
                        </Col>
                      </Row>
                    );
                  })}
                </fieldset>
              );
            })}
          </Row>
        </Col>
        <Col md={9}>
          <Row>
            <Col md={12}>
              <h1
                style={{
                  fontSize: "28.8px",
                  fontWeight: "200",
                  padding: "20px",
                }}
              >
                Berths For Sale
              </h1>
            </Col>
          </Row>
          {loading ? (
            <Loader />
          ) : (
            <Row>
              {berths.length === 0 ? (
                <Col md={12}>
                  <p>No Results Found</p>
                </Col>
              ) : (
                berths.map((berth) => (
                  <Col key={uuidv4()} md={4}>
                    <BerthCard {...berth} />
                  </Col>
                ))
              )}
            </Row>
          )}
          <Row style={{ marginBottom: "20px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                width: "100%",
                marginTop: "20px",
              }}
            >
              <button onClick={() => setPage(page - 1)} disabled={page === 0}>
                Previous
              </button>
              <span>Page {page + 1}</span>
              <button onClick={() => setPage(page + 1)}>Next</button>
            </div>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
