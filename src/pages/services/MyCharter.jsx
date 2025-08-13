import { useEffect, useState, useRef } from "react";
import DropdownWithRadio from "../../components/DropdownWithRadio";
import Loader from "../../components/Loader";
import InputComponentDynamic from "../../components/InputComponentDynamic";
import SubmitButton from "../../components/SubmitButton";
import { keyToExpectedValueMap, typeDef } from "./Charter_Advert_Info";
import { makeString } from "../../utils/common_functions";
const apiUrl = import.meta.env.VITE_BACKEND_URL;

export default function MyCharter() {
  const storedUser = localStorage.getItem("user");
  const formData = localStorage.getItem("CharterData");
  let charterData;
  if (storedUser && formData) {
    charterData = JSON.parse(formData);
  }
  const [error, setError] = useState({});
  const hasFetched = useRef(false);
  const [engines, setEngines] = useState("");
  const [openKey, setOpenKey] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allSelectedOptions, setAllSelectedOptions] = useState({});
  const [guestAccomodation, setGuestAccomodation] = useState({
    marisailVesselId: charterData?.marisailVesselId || "",
    marisailCharterId: charterData?.marisailCharterId || "",
    guestCapacity: charterData?.guestCapacity || "",
    bedroomConfiguration: charterData?.bedroomConfiguration || "",
    bathroomConfiguration: charterData?.bathroomConfiguration || "",
    crewAccommodations: charterData?.crewAccommodations || "",
    accessibilityInformation: charterData?.accessibilityInformation || "",
    cleaningAndMaintenanceProcedures:
      charterData?.cleaningAndMaintenanceProcedures || "",
    vesselDecorAndSetupRequests: charterData?.vesselDecorAndSetupRequests || "",
  });

  const [locationDetails, setLocationDetails] = useState({
    boardingPortArrivalTime: charterData?.boardingPortArrivalTime || "",
    boardingPortDepartureTime: charterData?.boardingPortDepartureTime || "",
    summerCruisingAreas: charterData?.summerCruisingAreas || "",
    boardingPort: charterData?.boardingPort || "",
    winterCruisingAreas: charterData?.winterCruisingAreas || "",
    disembarkationPort: charterData?.disembarkationPort || "",
    embarkationAndDisembarkationLogistics:
      charterData?.embarkationAndDisembarkationLogistics || "",
    disembarkationPortArrivalTime:
      charterData?.disembarkationPortArrivalTime || "",
    dockingAndMooringInstructions:
      charterData?.dockingAndMooringInstructions || "",
  });

  const [guestRequirements, setGuestRequirements] = useState({
    skipperIncluded: charterData?.skipperIncluded || "",
    crewIncluded: charterData?.crewIncluded || "",
    crewUniformPreferences: charterData?.crewUniformPreferences || "",
    localCuisinePreferences: charterData?.localCuisinePreferences || "",
    cateringRequired: charterData?.cateringRequired || "",
    carParkingAvailable: charterData?.carParkingAvailable || "",
    specialRequirementsRequests: charterData?.specialRequirementsRequests || "",
  });

  const [
    charterAgreementTermsAndConditions,
    setCharterAgreementTermsAndConditions,
  ] = useState({
    smokingPolicy: charterData?.smokingPolicy || "",
    petFriendlyPolicy: charterData?.petFriendlyPolicy || "",
    localRegulationsAndRestrictions:
      charterData?.localRegulationsAndRestrictions || "",
    charterAgreementTermsAndConditions:
      charterData?.charterAgreementTermsAndConditions || "",
    environmentalPolicies: charterData?.environmentalPolicies || "",
    waterConservationMeasures: charterData?.waterConservationMeasures || "",
    wasteManagementProtocols: charterData?.wasteManagementProtocols || "",
    alcoholPolicy: charterData?.alcoholPolicy || "",
    photographyAndVideographyPolicies:
      charterData?.photographyAndVideographyPolicies || "",
  });

  const [guestSafety, setGuestSafety] = useState({
    weatherContingencyPlans: charterData?.weatherContingencyPlans || "",
    emergencyProcedures: charterData?.emergencyProcedures || "",
    medicalFacilitiesOnboard: charterData?.medicalFacilitiesOnboard || "",
    emergencyContacts: charterData?.emergencyContacts || "",
    weatherForecastServices: charterData?.weatherForecastServices || "",
    securityMeasures: charterData?.securityMeasures || "",
    guestOrientationAndSafetyBriefing:
      charterData?.guestOrientationAndSafetyBriefing || "",
    insuranceGuestsAndPersonalBelongings:
      charterData?.insuranceGuestsAndPersonalBelongings || "",
    insuranceCoverageDetails: charterData?.insuranceCoverageDetails || "",
  });

  const [costs, setCosts] = useState({
    summerRatePerNight: charterData?.summerRatePerNight || "",
    winterRatePerWeek: charterData?.winterRatePerWeek || "",
    winterRatePerNight: charterData?.winterRatePerNight || "",
    summerRatePerWeek: charterData?.summerRatePerWeek || "",
    securityDepositAmount: charterData?.securityDepositAmount || "",
    totalPrice: charterData?.totalPrice || "",
    refundableDeposit: charterData?.refundableDeposit || "",
    additionalFuelCosts: charterData?.additionalFuelCosts || "",
    additionalFees: charterData?.additionalFees || "",
    fuelIncluded: charterData?.fuelIncluded || "",
    lateCheckInOutFees: charterData?.lateCheckInOutFees || "",
    vat: charterData?.vat || "",
  });

  const [availableDates, setAvailableDates] = useState({
    minimumNightsPolicy: charterData?.minimumNightsPolicy || "",
    datesAvailable: charterData?.datesAvailable || "",
    cancellationPolicy: charterData?.cancellationPolicy || "",
  });

  const [dates, setDates] = useState({
    startDate: charterData?.startDate || "",
    endDate: charterData?.endDate || "",
    numberNights: charterData?.numberNights || "",
  });

  const [paymentTerms, setPaymentTerms] = useState({
    paymentTerms: charterData?.paymentTerms || "",
    currency: charterData?.currency || "",
    preferredPaymentMethods: charterData?.preferredPaymentMethods || "",
    invoiceAndReceiptProcedures: charterData?.invoiceAndReceiptProcedures || "",
    calculatePriceAndPay: charterData?.calculatePriceAndPay || "",
    priceLabel: charterData?.priceLabel || "",
    priceDrop: charterData?.priceDrop || "",
  });

  const checkRequired = () => {
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
  };

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
      if (checkRequired()) {
        // If no errors, proceed with form submission logic
        console.log("001 Form is valid, submitting...");
        // localStorage.setItem("advertise_engine", JSON.stringify(form));
      } else {
        console.warn(error);
      }
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

  const fetchDistinctData = async () => {
    try {
      setLoading(true);
      const promises = Object.keys(sections).map(async (key) => {
        const response = await fetch(`${URL}charter`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sections[key]),
        });
        const data = await response.json();
        return { key, data: data.res };
      });
      const results = await Promise.all(promises);
      results.forEach(({ key, data }) => {
        setPageData(key, data);
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      console.log("done");
    }
  };

  useEffect(() => {
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      setPageData(JSON.parse(cachedData));
    } else {
      if (!hasFetched.current) {
        fetchDistinctData();
        hasFetched.current = true;
      }
    }
  }, [setPageData]);

  const handleInputChange = (title, fieldKey, newValue) => {
    setEngines((prevTrailers) => ({
      ...prevTrailers,
      [title]: {
        ...prevTrailers[title],
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

  return (
    <div className="mb-5">
      {loading ? (
        <Loader />
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap -mx-2">
            {Object.keys(sections).map((title) => (
              <div key={title} className="w-full md:w-1/2 mt-2 px-2">
                <legend className="fieldset-legend">
                  <h6 className="pt-[15px] pr-[10px] pb-0 pl-[10px]">
                    {makeString(title, keyToExpectedValueMap)}
                  </h6>
                </legend>

                {Object.keys(sections[title]).map((fieldKey) => {
                  const field = typeDef[title][fieldKey];

                  if (field && field.type === "radio") {
                    return (
                      <div
                        key={fieldKey}
                        className="mr-3 w-[480px] max-w-full"
                      >
                        <div className="w-full xs:w-3/12 md:w-full">
                          <DropdownWithRadio
                            heading={fieldKey}
                            title={makeString(fieldKey, keyToExpectedValueMap)}
                            options={sections[title][fieldKey]}
                            selectedOption={
                              allSelectedOptions[title]?.[fieldKey] ||
                              charterData[title]?.[fieldKey] ||
                              ""
                            }
                            setSelectedOption={(selectedOption) =>
                              handleOptionSelect(title, fieldKey, selectedOption)
                            }
                            isMandatory={field.mandatory}
                            setOpenKey={setOpenKey}
                            openKey={openKey}
                          />
                          {error[`${fieldKey}`] && (
                            <div>
                              {errorDisplay(
                                makeString(fieldKey, keyToExpectedValueMap)
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  } else if (field && field.type === "number") {
                    return (
                      <div
                        key={fieldKey}
                        className="mr-3 w-[480px] max-w-full"
                      >
                        <InputComponentDynamic
                          label={makeString(fieldKey, keyToExpectedValueMap)}
                          value={engines[title]?.[fieldKey] || ""}
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
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            ))}
          </div>

          <SubmitButton
            text="Submit"
            name="advert_charter_submit"
            onClick={handleSubmit}
          />
        </form>
      )}
    </div>
  );
}
