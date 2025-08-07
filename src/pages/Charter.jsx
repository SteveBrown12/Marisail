import PropTypes from "prop-types";
import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Container, Row, Col } from "react-bootstrap";

// Components
import Loader from "../components/Loader";
import SubmitButton from "../components/SubmitButton";
import ResetBar from "../components/ResetBar";
import RangeInput from "../components/RangeInput";
import DropdownWithRadio from "../components/DropdownWithRadio";
import DropdownWithCheckBoxes from "../components/DropdownWithCheckBoxes2";
import InputComponentDynamic from "../components/InputComponentDynamic";
import CharterCard from "../components/CharterCard";

// Config
import { keyToExpectedValueMap, typeDef } from "../info/Charter_Advert_Info";
import { varToDb, varToScreen } from "../info/Charter_Search_Info";

// Services
import { makeString } from "../services/common_functions";
import FormFieldCard from "../services/FormFieldCard";


const apiUrl = import.meta.env.VITE_BACKEND_URL;

function CharterAdvert() {
  const navigate = useNavigate();
  const [error, setError] = useState({});
  const hasFetched = useRef(false);
  const [engines, setEngines] = useState("");
  const [openKey, setOpenKey] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allSelectedOptions, setAllSelectedOptions] = useState({});
  const [guestAccomodation, setGuestAccomodation] = useState({
    marisailVesselId: "",
    marisailCharterId: "",
    guestCapacity: "",
    bedroomConfiguration: "",
    bathroomConfiguration: "",
    crewAccommodations: "",
    accessibilityInformation: "",
    cleaningAndMaintenanceProcedures: "",
    vesselDecorAndSetupRequests: "",
  });
  const [locationDetails, setLocationDetails] = useState({
    boardingPortArrivalTime: "",
    boardingPortDepartureTime: "",
    summerCruisingAreas: "",
    boardingPort: "",
    winterCruisingAreas: "",
    disembarkationPort: "",
    embarkationAndDisembarkationLogistics: "",
    disembarkationPortArrivalTime: "",
    dockingAndMooringInstructions: "",
  });
  const [guestRequirements, setGuestRequirements] = useState({
    skipperIncluded: "",
    crewIncluded: "",
    crewUniformPreferences: "",
    localCuisinePreferences: "",
    cateringRequired: "",
    carParkingAvailable: "",
    specialRequirementsRequests: "",
  });
  const [
    charterAgreementTermsAndConditions,
    setCharterAgreementTermsAndConditions,
  ] = useState({
    smokingPolicy: "",
    petFriendlyPolicy: "",
    localRegulationsAndRestrictions: "",
    charterAgreementTermsAndConditions: "",
    environmentalPolicies: "",
    waterConservationMeasures: "",
    wasteManagementProtocols: "",
    alcoholPolicy: "",
    photographyAndVideographyPolicies: "",
  });
  const [guestSafety, setGuestSafety] = useState({
    weatherContingencyPlans: "",
    emergencyProcedures: "",
    medicalFacilitiesOnboard: "",
    emergencyContacts: "",
    weatherForecastServices: "",
    securityMeasures: "",
    guestOrientationAndSafetyBriefing: "",
    insuranceGuestsAndPersonalBelongings: "",
    insuranceCoverageDetails: "",
  });
  const [costs, setCosts] = useState({
    summerRatePerNight: "",
    winterRatePerWeek: "",
    winterRatePerNight: "",
    summerRatePerWeek: "",
    securityDepositAmount: "",
    totalPrice: "",
    refundableDeposit: "",
    additionalFuelCosts: "",
    additionalFees: "",
    fuelIncluded: "",
    lateCheckInOutFees: "",
    vat: "",
  });
  const [availableDates, setAvailableDates] = useState({
    minimumNightsPolicy: "",
    datesAvailable: "",
    cancellationPolicy: "",
  });
  const [dates, setDates] = useState({
    startDate: "",
    endDate: "",
    numberNights: "",
  });
  const [paymentTerms, setPaymentTerms] = useState({
    paymentTerms: "",
    currency: "",
    preferredPaymentMethods: "",
    invoiceAndReceiptProcedures: "",
    calculatePriceAndPay: "",
    priceLabel: "",
    priceDrop: "",
  });

 
  const sections = {
    guestAccomodation,
    locationDetails,
    charterAgreementTermsAndConditions,
    guestSafety,
    costs,
    guestRequirements,
    availableDates,
    dates,
    paymentTerms,
  };

  const setStateFunctions = {
    guestAccomodation: setGuestAccomodation,
    locationDetails: setLocationDetails,
    guestRequirements: setGuestRequirements,
    charterAgreementTermsAndConditions: setCharterAgreementTermsAndConditions,
    guestSafety: setGuestSafety,
    costs: setCosts,
    availableDates: setAvailableDates,
    dates: setDates,
    paymentTerms: setPaymentTerms,
  };

  const handleOptionSelect = (category, field, selectedOption) => {
    setAllSelectedOptions((prevState) => {
      const updatedOptions = {
        ...prevState,
        [category]: {
          ...prevState[category],
          [field]: selectedOption,
        },
      };

      return updatedOptions;
    });

  };
  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      // if (checkRequired()) {
      console.log("001 Form is valid, submitting...");
      localStorage.setItem("CharterData", JSON.stringify(allSelectedOptions));
      navigate("/view-charter");
     
    } catch (error) {
      console.error(error);
    }
  };
  function setPageData(key, newData) {
    const setStateFunction = setStateFunctions[key];
    if (setStateFunction) {
      setStateFunction((prevState) => ({
        ...prevState,
        ...newData,
      }));
    } else {
      console.error(`No setState function found for key: ${key}`);
    }
  }

  const cacheKey = "charterFilterData";
  const URL = apiUrl + "/advert_charter/";


  const fetchDistinctData = useCallback(
    async (sectionKey, fieldKey) => {
      try {
        setLoading(true);

        // Prepare request payload based on the opened section & field
        const requestBody = {
          sectionKey: sectionKey, // The section (e.g., "amenitiesAndServices")
          fieldKey: fieldKey, // The specific field/column (e.g., "wifiAvailability")
        };

        // Call API for only the relevant section & field
        const response = await fetch(`${URL}charter`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        const data = await response.json();
        console.log("data :>> ", data);

        // Update state only for the specific field
        setPageData(sectionKey, data.res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [URL, sections, setPageData]
  );


  const handleInputChange = (title, fieldKey, newValue) => {
    setEngines((prevCharter) => ({
      ...prevCharter,
      [title]: {
        ...prevCharter[title],
        [fieldKey]: newValue,
      },
    }));
  };

  const errorDisplay = (fieldName) => {
    return (
      <div style={{ color: "red", paddingLeft: 10 }}>
        {fieldName} field is required
      </div>
    );
  };

  const handleDropdownOpen = (sectionKey, fieldKey) => {
    setOpenKey(fieldKey);

    // Fetch data only if not already loaded
    if (
      !sections[sectionKey][fieldKey] ||
      sections[sectionKey][fieldKey].length === 0
    ) {
      fetchDistinctData(sectionKey, fieldKey);
    }
  };

  return (
    <Container className="mb-5">
      {loading ? (
        <Loader />
      ) : (
        <Form onSubmit={handleSubmit}>
          <Row>
            {Object.keys(sections).map((title) => (
              <Col md={6} key={title} className="mt-2">
                <legend className="fieldset-legend">
                  <h6 style={{ padding: "15px 10px 0px 10px" }}>
                    {makeString(title, keyToExpectedValueMap)}
                  </h6>
                </legend>
                {Object.keys(sections[title]).map((fieldKey) => {
                  const field = typeDef[title][fieldKey];
                  if (field && field.type === "radio") {
                    return (
                      <Col
                        md={12}
                        className="mr-3"
                        key={fieldKey}
                        style={{ width: 480 }}
                      >
                        <Col xs={3} md={12}>
                          <DropdownWithRadio
                            heading={fieldKey}
                            title={makeString(fieldKey, keyToExpectedValueMap)}
                            options={sections[title][fieldKey]}
                            selectedOption={
                              allSelectedOptions[title]?.[fieldKey] || ""
                            }
                            setSelectedOption={(selectedOption) =>
                              handleOptionSelect(
                                title,
                                fieldKey,
                                selectedOption
                              )
                            }
                            isMandatory={field.mandatory}
                            setOpenKey={() =>
                              handleDropdownOpen(title, fieldKey)
                            }
                            openKey={openKey}
                          />
                          {error[`${fieldKey}`] && (
                            <div>
                              {errorDisplay(
                                makeString(fieldKey, keyToExpectedValueMap)
                              )}
                            </div>
                          )}
                        </Col>
                      </Col>
                    );
                  } else if (field && field.type === "number") {
                    return (
                      <Col
                        md={12}
                        className="mr-3"
                        key={fieldKey}
                        style={{ width: 480 }}
                      >
                        <InputComponentDynamic
                          label={makeString(fieldKey, keyToExpectedValueMap)}
                          value={engines[title]?.[fieldKey] || ""}
                          setValue={(e) =>
                            handleInputChange(title, fieldKey, e.target.value)
                          }
                          formType="number"
                          openKey={openKey}
                          setOpenKey={() => handleDropdownOpen(title, fieldKey)}
                          isMandatory={field.mandatory}
                        />
                        {error[`${fieldKey}`] && (
                          <div>
                            {errorDisplay(
                              makeString(fieldKey, keyToExpectedValueMap)
                            )}
                          </div>
                        )}
                      </Col>
                    );
                  }
                  return null;
                })}
              </Col>
            ))}
            <FormFieldCard countryVisible={true} dateVisible={true} />
          </Row>
          <SubmitButton
            text="Submit"
            name="advert_charter_submit"
            onClick={handleSubmit}
          />
        </Form>
      )}
    </Container>
  );
}


function CharterSearch() {
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [allSelectedOptions, setAllSelectedOptions] = useState([]);
  const [selectedRadios, setSelectedRadios] = useState({});
  const [fetching, setFetching] = useState(true);

  const [guestAccommodation, setGuestAccommodation] = useState({
    guestCapacity: [],
    bedroomConfiguration: [],
    crewAccommodations: [],
    accessibilityInformation: [],
    cleaningAndMaintenanceProcedures: [],
    vesselDecorAndSetupRequests: [],
  });

  const [locationDetails, setLocationDetails] = useState({
    summerCruisingAreas: [],
    boardingPort: [],
    winterCruisingAreas: [],
    disembarkationPort: [],
  });

  const [guestRequirements, setGuestRequirements] = useState({
    skipperIncluded: [],
    crewIncluded: [],
    crewUniformPreferences: [],
    localCuisinePreferences: [],
    cateringRequired: [],
    carParkingAvailable: [],
    specialRequirementsRequests: [],
  });

  const [charterAgreementTermsConditions, setCharterAgreementTermsConditions] =
    useState({
      smokingPolicy: [],
      petFriendlyPolicy: [],
      localRegulationsRestrictions: [],
      charterAgreementTermsConditions: [],
      environmentalPolicies: [],
      waterConservationMeasures: [],
      wasteManagementProtocols: [],
      alcoholPolicy: [],
      photographyVideographyPolicies: [],
    });

  const [guestSafety, setguestSafety] = useState({
    weatherContingencyPlans: [],
    emergencyProcedures: [],
    medicalFacilitiesOnboard: [],
    weatherForecastServices: [],
    securityMeasures: [],
    guestOrientationSafetyBriefing: [],
    insuranceForGuestsPersonalBelongings: [],
    insuranceCoverageDetails: [],
  });

  const [costs, setCosts] = useState({
    summerRatePerNight: [],
    winterRatePerNight: [],
    winterRatePerWeek: [],
    summerRatePerWeek: [],
    securityDepositAmount: [],
    totalPrice: [],
    refundableDeposit: [],
    fuelIncluded: [],
    lateCheckInCheckOutFees: [],
    vat: [],
  });

  const [availableDates, setAvailableDates] = useState({
    minimumNightsPolicy: [],
    datesAvailable: [],
  });

  const [dates, setDates] = useState({
    startDate: [],
    endDate: [],
  });

  const [notDefined, setNotDefined] = useState({
    priceLabel: [],
    priceDrop: [],
  });

  const filters = {
    // identification,
    guestAccommodation,
    locationDetails,
    guestRequirements,
    charterAgreementTermsConditions,
    guestSafety,
    costs,
    availableDates,
    dates,
    notDefined,
  };

  const setStateFunctions = {
    // identification: setIdentification,
    guestAccommodation: setGuestAccommodation,
    locationDetails: setLocationDetails,
    guestRequirements: setGuestRequirements,
    charterAgreementTermsConditions: setCharterAgreementTermsConditions,
    guestSafety: setguestSafety,
    costs: setCosts,
    availableDates: setAvailableDates,
    dates: setDates,
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

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const URL = apiUrl + "/search_charter/";

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
      const response = await fetch(`${apiUrl + "/search_berth/"}charters`, {
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

      var cleanData = data.siteDetails.data
        .filter(Boolean)
        .map((value) => value);
      const setStateFunction = setStateFunctions[tableKey];
      if (setStateFunction) {
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

  const [trailers, setTrailers] = useState([]);

  useEffect(() => {
    setLoading(true);
    let currInfo = {
      selectedOptions: allSelectedOptions,
      page: page,
    };
    const fetchTrailerData = async () => {
      try {
        const response = await fetch(`${URL}charterData`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(currInfo),
        });

        const data = await response.json();
        // console.log(data);
        setTrailers(data.res[0]);
        // console.log("trailers", trailers);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);

        console.log("done");
      }
    };

    fetchTrailerData();
  }, [allSelectedOptions, page, URL]);

  return (
    <Container>
      <Row>
        <ResetBar
          selectedTags={allSelectedOptions}
          removeTag={removeTag}
          resetTags={resetTags}
        />
      </Row>
      <Row>
        <Col md={3}>
          <Row>
            <h4 className="py-3">Search For Charter</h4>
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
                Charters For Sale
              </h1>
            </Col>
          </Row>
          {loading ? (
            // <p>Loading...</p>
            <Loader />
          ) : (
            <Row>
              {trailers.length === 0 ? (
                <Col md={12}>
                  <p>No Results Found</p>
                </Col>
              ) : (
                trailers.map((trailer) => {
                  return (
                    <Col key={trailer} md={4}>
                      {/* <h1>{trailer.m}</h1> */}
                      <CharterCard {...trailer} />
                    </Col>
                  );
                })
              )}
            </Row>
          )}
          {/* {!loading ? <Pagination totalPages={pagination.totalPages} /> : <></>} */}

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
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 0}
              >
                Previous
              </button>
              {/* Page {page} of {pagination.totalPages} */}
              <span>Page {page + 1}</span>
              {/* <button
                key={page}
                className="active"
                // onClick={() => updatePage(page)}
              >
                {page}
              </button> */}
              <button
                onClick={() => handlePageChange(page + 1)}
                // disabled={page === pagination.totalPages}
              >
                Next
              </button>
            </div>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}



const Charters = ({ type }) => {
  return (
    <main
      style={{
        minHeight: `100vh`,
        overflow: "hidden",
      }}
    >
      {type === "advert" ? <CharterAdvert /> : <CharterSearch />}
    </main>
  );
};

Charters.propTypes = {
  type: PropTypes.string.isRequired,
};

export default Charters;