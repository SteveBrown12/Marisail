import { Form, Container, Row, Col } from "react-bootstrap";
import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DropdownWithRadio from "../DropdownWithRadio";
import Loader from "../Loader";
import SubmitButton from "../SubmitButton";
import { keyToExpectedValueMap, typeDef } from "./Transport_Advert_Info";
import {
  makeString,
  convertUnitsInFormData,
} from "../../services/common_functions";
import DatePickerComponent from "../DatePickerComponent";
import InputComponentDual from "../InputComponentDual";
import FormFieldCard from "../../services/FormFieldCard";

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
    </Container>
  );
}
