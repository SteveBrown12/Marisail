import { Form, Container, Row, Col } from "react-bootstrap";
import { useEffect, useState, useRef, useCallback } from "react";
import DropdownWithRadio from "../DropdownWithRadio";
import Loader from "../Loader";
import InputComponentDynamic from "../InputComponentDynamic";
import SubmitButton from "../SubmitButton";
import { keyToExpectedValueMap, typeDef } from "./Charter_Advert_Info";
import { makeString } from "../../services/common_functions";
import { useNavigate } from "react-router-dom";
import FormFieldCard from "../../services/FormFieldCard";
const apiUrl = import.meta.env.VITE_BACKEND_URL;

export default function CharterAdvert() {
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
