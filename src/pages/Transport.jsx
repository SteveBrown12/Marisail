import PropTypes from "prop-types";
import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Container, Row, Col } from "react-bootstrap";

// Components
import Loader from "../components/Loader";
import SubmitButton from "../components/SubmitButton";
import ResetBar from "../components/ResetBar";
import DropdownWithRadio from "../components/DropdownWithRadio";
import DropdownWithCheckBoxes from "../components/DropdownWithCheckBoxes2";
import InputComponentDual from "../components/InputComponentDual";
import DatePickerField from "../components/DatePickerField";
import TransportCard from "../components/TransportCard";

// Config
import { keyToExpectedValueMap, typeDef } from "../info/Transport_Advert_Info";
import { varToDb, varToScreen } from "../info/Transport_Search_Info";

// Services
import {
  makeString,
  convertUnitsInFormData,
} from "../services/common_functions";
import FormFieldCard from "../services/FormFieldCard";


const apiUrl = import.meta.env.VITE_BACKEND_URL;

function TransportAdvert() {
  const navigate = useNavigate();
  const [error, setError] = useState({});
  const hasFetched = useRef(false);
  const [transport, setTransport] = useState("");
  const [openKey, setOpenKey] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allSelectedOptions, setAllSelectedOptions] = useState({});
  const [jobDescription, setJobDescription] = useState({
    marisailTransportId: "",
    category: "",
    title: "",
    description: "",
    postedDate: new Date(),
    deadlineDate: "",
    timescale: "",
    preferredDate: "",
    haulierToDepartureDistance: "",
    departureToDestinationDistance: "",
    returnJourney: "",
    roundTripDistance: "",
    international: "",
    ferryRequired: "",
    specialHandlingRequirements: "",
    departureLoadingEquipmentNeeded: "",
    destinationUnloadingEquipmentNeeded: "",
    freightClass: "",
    overweightPermitNeeded: "",
    oversizePermitNeeded: "",
    numberQuotes: "",
    map: "",
    jobDone: "",
    jobDoneDate: "",
  });
  const [vesselDetails, setVesselDetails] = useState({
    itemNumber: "",
    totalNumberItems: "",
    photos: "",
    previousInsuranceClaims: "",
    existingDamage: "",
    damageDescription: "",
    vesselInsuranceType: "",
    vesselInsuranceNotes: "",
    boatDetails: "",
  });
  const [customerContactDetails, setCustomerDetails] = useState({
    customerType: "",
    customerId: "",
    customerName: "",
    customerCompanyName: "",
    collectionDepartureNamedContact: "",
    collectionDepartureMobile: "",
    deliveryDestinationNamedContact: "",
    collectionDepartureAddress: "",
    deliveryDestinationMobile: "",
    deliveryDestinationAddress: "",
    emergencyContactInformation: "",
    preferredCommunicationMethod: "",
  });
  const [transportQuotes, setTransportQuotes] = useState({
    quote: "",
    quoteDescription: "",
    quoteDate: "",
    declineDate: "",
    withdrawDate: "",
    quoteStatus: "",
    declineQuote: "",
    withdrawQuote: "",
  });
  const [qAndA, setQAndA] = useState({
    questionDate: "",
    answerDate: "",
    transportProviderQuestions: "",
    customerAnswers: "",
    writeQuestion: "",
    answerQuestion: "",
    customerConfirmsCompletion: "",
    addItem: "",
  });
  const [feedback, setFeedback] = useState({
    customerFeedbackNotes: "",
    customerFeedbackScore: "",
    positive: "",
    neutral: "",
    negative: "",
    reviews: "",
    rating: "",
    itemTitle: "",
    leftBy: "",
    comments: "",
    date: "",
    customerGivesFeedbackNotes: "",
    customerGivesFeedbackScore: "",
    seeMyQuotes: "",
  });
  const [haulierDates, setHaulierDates] = useState({
    haulierId: "",
    haulierAddress: "",
    haulierName: "",
    haulierNumberJobs: "",
    haulierTotalCustomerScore: "",
    registeredSince: "",
    numberVehicles: "",
    numberDrivers: "",
    verified: "",
    vehicleType: "",
    vehicleCapacity: "",
  });
  const [haulierCommunications, setHaulierCommunications] = useState({
    customerServiceContactInformation: "",
    realTimeTracking: "",
    electronicProofOfDelivery: "",
    automatedAlertsAndNotifications: "",
    trackingSystem: "",
    deliveryWindow: "",
    deliveryConfirmation: "",
  });
  const [haulierSafetyAndCompliance, setHaulierSafetyAndCompliance] = useState({
    safetyCertifications: "",
    environmentalRegulationsCompliance: "",
    hazardousMaterialsHandling: "",
    safetyTrainingPrograms: "",
    accidentReportingProcedures: "",
    healthAndSafetyPolicies: "",
    safetyAudits: "",
    riskAssessments: "",
    incidentManagement: "",
    complianceRecords: "",
    permitsAndLicenses: "",
    transportRegulationsCompliance: "",
  });
  const [paymentAndInsurance, setPaymentAndInsurance] = useState({
    serviceLevelAgreement: "",
    acceptedPaymentMethods: "",
    cancellationPolicy: "",
    invoiceTime: "",
    latePaymentFees: "",
    billingContactInformation: "",
    disputeResolutionTerms: "",
    liabilityCoverage: "",
    insurancePolicy: "",
    insuranceCoverage: "",
    insuranceProvider: "",
    insuranceClaimProcess: "",
  });
  const [paymentTerms, setPaymentTerms] = useState({
    paymentTerms: "",
    currency: "",
    preferredPaymentMethods: "",
    invoiceAndReceiptProcedures: "",
    calculatePriceAndPay: "",
    priceLabel: "",
    priceDrop: "",
    vat: "",
  });

  const sections = {
    jobDescription,
    feedback,
    vesselDetails,
    haulierCommunications,
    transportQuotes,
    qAndA,
    customerContactDetails,
    haulierSafetyAndCompliance,
    haulierDates,
    paymentAndInsurance,
    paymentTerms,
  };

  const setStateFunctions = {
    jobDescription: setJobDescription,
    vesselDetails: setVesselDetails,
    customerContactDetails: setCustomerDetails,
    transportQuotes: setTransportQuotes,
    qAndA: setQAndA,
    feedback: setFeedback,
    haulierDates: setHaulierDates,
    haulierCommunications: setHaulierCommunications,
    haulierSafetyAndCompliance: setHaulierSafetyAndCompliance,
    paymentAndInsurance: setPaymentAndInsurance,
    paymentTerms: setPaymentTerms,
  };
  const handleDualInputChange = (title, fieldKey, inputValue, radioValue) => {
    setAllSelectedOptions((prevState) => ({
      ...prevState,
      [title]: {
        ...prevState[title],
        [fieldKey]: { value: inputValue, unit: radioValue },
      },
    }));
  };
  const handleOptionSelect = (category, field, selectedOption) => {
    setAllSelectedOptions((prevState) => {
      const updatedOptions = {
        ...prevState,
        [category]: {
          ...prevState[category],
          [field]: { value: selectedOption, unit: null },
        },
      };
      return updatedOptions;
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      convertUnitsInFormData(allSelectedOptions);
      // if (checkRequired()) {
      // If no errors, proceed with form submission logic
      localStorage.setItem("TransportData", JSON.stringify(allSelectedOptions));
      navigate("/view-transport");
      // } else {
      // }
    } catch (error) {
      console.error(error);
    }
  };

  const setPageData = useCallback(
    (key, newData) => {
      const setStateFunction = setStateFunctions[key];
      if (setStateFunction) {
        setStateFunction((prevState) => ({
          ...prevState,
          ...newData,
        }));
      } else {
        console.error(
          `No setState function found for key: ` + JSON.stringify(key)
        );
      }
    },
    [setStateFunctions]
  );

  const cacheKey = "transportFilterData";
  const URL = apiUrl + "/advert_transport/";

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
        const response = await fetch(`${URL}transport`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        const data = await response.json();

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
    setTransport((oldValue) => ({
      ...oldValue,
      [title]: {
        ...oldValue[title],
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
                              allSelectedOptions[title]?.[fieldKey]?.value || ""
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
                  } else if (field && field.type === "date") {
                    return (
                      <Col
                        md={12}
                        className="mr-3"
                        key={fieldKey}
                        style={{ width: 480 }}
                      >
                        <label className="d-block mb-1">
                          {makeString(fieldKey, keyToExpectedValueMap)}
                          {field.mandatory && (
                            <span className="text-danger">&nbsp;*</span>
                          )}
                        </label>
                        <DatePickerField
                          mode="single"
                          value={transport[title]?.[fieldKey] || ""}
                          onChange={(iso) =>
                            handleInputChange(title, fieldKey, iso)
                          }
                          placeholder="dd-mm-yyyy"
                          style={{ width: 220 }}
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
                  } else if (field && field.type === "dual") {
                    return (
                      <Col
                        md={12}
                        className="mr-3"
                        key={fieldKey}
                        style={{ width: 480 }}
                      >
                        <InputComponentDual
                          label={makeString(fieldKey, keyToExpectedValueMap)}
                          value={transport[title]?.[fieldKey] || ""}
                          setValue={(e) =>
                            handleInputChange(title, fieldKey, e.target.value)
                          }
                          formType="number"
                          setOpenKey={setOpenKey}
                          openKey={openKey || ""}
                          isMandatory={field.mandatory}
                          radioOptions={field?.radioOptions}
                          selectedOption={
                            allSelectedOptions[title]?.[fieldKey]?.unit || ""
                          }
                          setSelectedOption={(inputValue, radioValue) =>
                            handleDualInputChange(
                              title,
                              fieldKey,
                              inputValue,
                              radioValue
                            )
                          }
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
            <FormFieldCard countryVisible={true} />
          </Row>
          <SubmitButton
            text="Submit"
            name="advert_transport_submit"
            onClick={handleSubmit}
          />
        </Form>
      )}
    </Container>
  );
}


function TransportSearch() {
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(true);
  const [allSelectedOptions, setAllSelectedOptions] = useState([]);

  const [jobDescription, setJobDescription] = useState({
    category: [],
    postedDate: [],
    deadlineDate: [],
    timescale: [],
    preferredDate: [],
    haulierToDepartureDistance: [],
    roundTripDistance: [],
    international: [],
    ferryRequired: [],
    specialHandlingRequirements: [],
    departureLoadingEquipmentNeeded: [],
    destinationUnloadingEquipmentNeeded: [],
    freightClass: [],
    overweightPermitNeeded: [],
    oversizePermitNeeded: [],
    numberQuotes: [],
  });

  const [vesselDetails, setVesselDetails] = useState({
    totalNumberItems: [],
    previousInsuranceClaims: [],
    existingDamage: [],
    boatDetails: [],
  });

  const [customerContactDetails, setCustomerContactDetails] = useState({
    customerType: [],
    customerCompanyName: [],
    collectionAddress: [],
  });

  const [notDefined, setNotDefined] = useState({
    priceLabel: [],
    priceDrop: [],
  });

  const filters = {
    jobDescription,
    vesselDetails,
    customerContactDetails,
    notDefined,
  };

  const setStateFunctions = {
    jobDescription: setJobDescription,
    vesselDetails: setVesselDetails,
    customerContactDetails: setCustomerContactDetails,
    notDefined: setNotDefined,
  };

  function removeTag(tag) {
    setAllSelectedOptions((prev) => {
      delete prev[tag];
      return { ...prev };
    });
  }

  function resetTags() {
    setAllSelectedOptions({});
  }

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const URL = apiUrl + "/search_transport/";

  const fetchDropdownData = async (tableKey, columnKey, search, offSet) => {
    if (varToScreen[columnKey]?.type === "range" || tableKey === "notDefined")
      return;

    try {
      if (!varToScreen[columnKey]) {
        console.error(`Missing varToScreen mapping for ${columnKey}`);
        return;
      }
      setFetching(true);
      const response = await fetch(`${apiUrl + "/search_berth/"}transports`, {
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

  const removeFilter = (key, filter) => {
    const oldFilter = allSelectedOptions[key] || []; // Ensure it doesn't break if key is undefined
    const newFilter = oldFilter.filter((currFilter) => currFilter !== filter);

    setAllSelectedOptions((prev) => ({
      ...prev,
      [key]: newFilter, // Use newFilter instead of filter
    }));
  };

  useEffect(() => {
    setLoading(true);
    let currInfo = {
      selectedOptions: allSelectedOptions,
      page: page,
    };
    const fetchTrailerData = async () => {
      try {
        const response = await fetch(`${URL}transportData`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(currInfo),
        });

        const data = await response.json();
        setTrailers(data.res[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrailerData();
  }, [allSelectedOptions, page]);

  return (
    <Container>
      <Row>
        <Col md={3}>
          <Row>
            <h4 className="py-3">Search For Transport</h4>
          </Row>
          <Row>
            <ResetBar
              selectedTags={allSelectedOptions}
              removeTag={removeTag}
              resetTags={resetTags}
              removeFilter={removeFilter}
            />
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
                Transport For Sale
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
                      <TransportCard {...trailer} />
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




const Transport = ({ type }) => {
  return (
    <main
      style={{
        minHeight: `100vh`,
        overflow: "hidden",
      }}
    >

      {type === "search" ? <TransportSearch /> : <TransportAdvert />}
    </main>
  );
};

Transport.propTypes = {
  type: PropTypes.string.isRequired,
};

export default Transport;
