import { Form, Container, Row, Col } from "react-bootstrap";
import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DropdownWithRadio from "../DropdownWithRadio";
import Loader from "../Loader";
import SubmitButton from "../SubmitButton";
import { keyToExpectedValueMap, typeDef } from "./TransportAdvertInfo";
import {
  makeString,
  convertUnitsInFormData,
} from "../../services/common_functions";
import DatePickerComponent from "../DatePickerComponent";
import InputComponentDual from "../InputComponentDual";
import FormFieldCard from "../../services/FormFieldCard";
import StripeBtn from "./StripeBtn";

const apiUrl = import.meta.env.VITE_BACKEND_URL;

export default function TransportAdvert() {
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

  /*const checkRequired = () => {
          const errors = {};
          Object.keys(typeDef).forEach((sectionKey) => {
              const section = typeDef[sectionKey];
              const sectionData = sections[sectionKey];
              Object.keys(section).forEach((fieldKey) => {
                  const field = section[fieldKey];
                  if (field.mandatory) {
                      const fieldValue = sectionData[fieldKey];
                      if (field.type === "radio") {
                          if (!field.value || String(field.value).trim() === "") {
                              errors[`${fieldKey}`] = true;
                          }
                      } else if (field.type === "number") {
                          if (
                              fieldValue === undefined ||
                              fieldValue === "" ||
                              isNaN(fieldValue)
                          ) {
                              errors[`${fieldKey}`] = true;
                          }
                      }
                  }
              });
          });
  
          setError(errors);
          return Object.keys(errors).length === 0;
      };*/

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
      console.log("001 Form is valid, submitting...", allSelectedOptions);
      localStorage.setItem("TransportData", JSON.stringify(allSelectedOptions));
      navigate("/view-transport");
      // console.log("001 Form data saved to localStorage:", allFormData);
      // } else {
      //     console.warn(error);
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

  //   const fetchDistinctData = useCallback(async () => {
  //     try {
  //       setLoading(true);
  //       const promises = Object.keys(sections).map(async (key) => {
  //         const response = await fetch(`${URL}transport`, {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify(sections[key]),
  //         });
  //         const data = await response.json();
  //         return { key, data: data.res };
  //       });
  //       const results = await Promise.all(promises);
  //       results.forEach(({ key, data }) => {
  //         setPageData(key, data);
  //       });
  //     } catch (err) {
  //       console.error(err);
  //     } finally {
  //       setLoading(false);
  //       console.log("done");
  //     }
  //   }, [sections, URL, setPageData]);

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

  /*const fetchRelevantOptions = async (marisailTransportId, category, title) => {
          try {
              setLoading(true);
              const requestBody = { marisailTransportId, category, title };
              const response = await fetch(`${URL}relevant_data`, {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ requestBody }),
              });
              const data = await response.json();
              const result = data?.result;
  
              if (result) {
                  const updatePromises = Object.keys(result).map((fieldKey) => {
                      if (Object.keys(requestBody).includes(fieldKey)) {
                          return Promise.resolve();
                      }
                      return Promise.all(
                          Object.keys(sections).map((sectionKey) => {
                              return new Promise((resolve) => {
                                  if (sections[sectionKey][fieldKey] !== undefined) {
                                      const fieldValue =
                                          Array.isArray(result[fieldKey]) &&
                                              result[fieldKey].length > 0
                                              ? result[fieldKey]?.[0]
                                              : sections[sectionKey][fieldKey];
  
                                      setAllSelectedOptions((prevState) => ({
                                          ...prevState,
                                          [sectionKey]: {
                                              ...prevState[sectionKey],
                                              [fieldKey]: [fieldValue],
                                          },
                                      }));
  
                                      resolve();
                                  } else {
                                      resolve();
                                  }
                              });
                          })
                      );
                  });
  
                  // Wait for all updates to complete
                  await Promise.all(updatePromises);
              }
          } catch (error) {
              console.error("Error fetching other section:", error);
          } finally {
              setLoading(false);
          }
      };
      const fetchJDSectionOptions = async (category, selectedOption, Key) => {
          try {
              setLoading(true);
              const tableName = "Job";
              const keyHierarchy = ["marisailTransportId", "category"];
  
              const currentKeyIndex = keyHierarchy.indexOf(Key);
              const fetchColumn = keyHierarchy[currentKeyIndex + 1];
              let requestBody = {};
              for (let i = 0; i <= currentKeyIndex; i++) {
                  const key = keyHierarchy[i];
                  requestBody[key] =
                      key === Key ? selectedOption : allSelectedOptions[category]?.[key];
              }
  
              if (!fetchColumn) {
                  throw new Error(
                      "No further data to fetch. All selections are complete."
                  );
              }
              const response = await fetch(`${URL}${tableName}/${fetchColumn}`, {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ requestBody }),
              });
  
              const data = await response.json();
              setPageData(category, {
                  ...sections[category],
                  [fetchColumn]: data.result,
              });
          } catch (error) {
              console.error("Error fetching data:", error);
          } finally {
              setLoading(false);
          }
      };*/

  //   useEffect(() => {
  //     const cachedData = localStorage.getItem(cacheKey);
  //     if (cachedData) {
  //       setPageData(JSON.parse(cachedData));
  //     } else {
  //       if (!hasFetched.current) {
  //         fetchDistinctData();
  //         hasFetched.current = true;
  //       }
  //     }
  //   }, [setPageData, fetchDistinctData]);

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
                        <DatePickerComponent
                          label={makeString(fieldKey, keyToExpectedValueMap)}
                          value={transport[title]?.[fieldKey] || new Date()}
                          setValue={(e) =>
                            handleInputChange(title, fieldKey, e.target.value)
                          }
                          formType="number"
                          setOpenKey={setOpenKey}
                          openKey={openKey}
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
       <StripeBtn></StripeBtn>
    </Container>
  );
}
