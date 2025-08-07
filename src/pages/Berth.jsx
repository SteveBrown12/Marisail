import PropTypes from "prop-types";

import { useEffect, useState, useRef, useCallback, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { Container, Row, Col, Form } from "react-bootstrap";

import Loader from "../components/Loader";
import SubmitButton from "../components/SubmitButton";
import DropdownWithRadio from "../components/DropdownWithRadio";
import DropdownWithCheckBoxes from "../components/DropdownWithCheckBoxes2";
import RangeInput from "../components/RangeInput";
import BerthCard from "../components/BerthCard";
import ResetBar from "../components/ResetBar";
import InputComponentDynamic from "../components/InputComponentDynamic";
import InputComponentDual from "../components/InputComponentDual";

import { keyToExpectedValueMap, typeDef } from "../info/Berth_Advert_Info";
import { varToDb, varToScreen } from "../info/Berth_Search_Info";

import {
  makeString,
  convertUnitsInFormData,
} from "../services/common_functions";
import FormFieldCard from "../services/FormFieldCard";

import { setAllFilters, getAllFilters } from "../store/filtersSlice";


const apiUrl = import.meta.env.VITE_BACKEND_URL;

function BerthAdvert() {
    const navigate = useNavigate();
    const [berths, setBerths] = useState("");
    const [error, setError] = useState({});
    const hasFetched = useRef(false);
    const [openKey, setOpenKey] = useState(null);
    const [loading, setLoading] = useState(false);
    const [allSelectedOptions, setAllSelectedOptions] = useState({});
    const [siteDetails, setSiteDetails] = useState({
        marisailBerthId: "",
        siteDetails: "",
        termsAndConditions: "",
        type: "",
        marinaPortHarborName: "",
        location: "",
        ownership: "",
        yearEstablished: "",
        operatingHours: "",
        contactDetails: "",
        seasonalOperation: "",
        languageServices: "",
    });
     const [generalInformation, setGeneralInformation] = useState({
          dockTypes: "",
          numberOfDocks: "",
          boatSlipSizes: "",
          numberBerthsAvailable: "",
          length: "",
          beam: "",
          draft: "",
          slipWidth: "",
          slipDepth: "",
          slipLength: "",
          mooringType: "",
          tideRange: "",
     });
    const [amenitiesAndServices, setAmenitiesAndServices] = useState({
        storage: "",
        electricityAvailable: "",
        waterSupply: "",
        wifiAvailability: "",
        carParking: "",
        conciergeServices: "",
        businessServices: "",
        conferenceRooms: "",
    });
    const [familyFacilities, setFamilyFacilities] = useState({
        laundryFacilities: "",
        restaurantsAndCafes: "",
        restaurant: "",
        bar: "",
        shoppingFacilities: "",
        retailShops: "",
        hospitalityServices: "",
        recreationalFacilities: "",
        clubhouseAccess: "",
        swimmingPool: "",
        fitnessCenter: "",
        marinaStore: "",
        chandlery: "",
        restroomsAndShowers: "",
        laundryServices: "",
        gymFacilities: "",
        sanitationFacilities: "",
        guestAccommodationOptions: "",
        familyFriendlyAmenities: "",
        petFriendlyServices: "",
        iceAvailability: "",
        picnicAndBBQAreas: "",
        childrensPlayArea: "",
    });
    const [surroundingArea, setSurroundingArea] = useState({
        localAttractions: "",
        restaurants: "",
        accommodation: "",
        shopping: "",
        transportationOptions: "",
        medicalFacilitiesNearby: "",
        localServices: "",
        communityResources: "",
    });
    const [additionalFeatures, setAdditionalFeatures] = useState({
        charterServices: "",
        yachtBrokerageServices: "",
        boatShowParticipation: "",
        loyaltyPrograms: "",
        referralPrograms: "",
        vip_MembershipOptions: "",
    });
    const [communityAndSocial, setCommunityAndSocial] = useState({
        annualEvents: "",
        educationalPrograms: "",
        communityEvents: "",
        socialEvents: "",
        sportsActivities: "",
        culturalEvents: "",
        seasonalActivities: "",
        yachtClubMembership: "",
        regattasAndCompetitions: "",
        workshopsAndClasses: "",
        communityBulletinBoard: "",
        networkingEvents: "",
        memberDiscounts: "",
        dockTypes: "",
        numberOfDocks: "",
        boatSlipSizes: "",
        numberBerthsAvailable: "",
        length: "",
        beam: "",
        draft: "",
        slipWidth: "",
        slipDepth: "",
        slipLength: "",
        mooringType: "",
        tideRange: "",
    });
    const [services, setServices] = useState({
        pumpOutStation: "",
        docksideTrolley: "",
        powerSupply: "",
        shorePowerConnectionTypes: "",
        fuelTypesAvailable: "",
        fuelService: "",
        fuelDock: "",
        electricalHookupSpecifications: "",
    });
    const [repairAndMaintenance, setRepairAndMaintenance] = useState({
        boatYardServices: "",
        boatCleaningServices: "",
        boatMaintenanceAndRepair: "",
        chandleryServices: "",
        repairAndMaintenanceServices: "",
        haulOutServices: "",
        boatLiftSpecifications: "",
    });
    const [accessibility, setAccessibility] = useState({
        handicapAccessibleSlips: "",
        proximityToHandicapParking: "",
        accessibleFacilities: "",
        assistanceServicesForDisabled: "",
        signageAndDirections: "",
        accessibleRestroomsAndShowers: "",
        parkingFacilities: "",
        accessibilityFeatures: "",
        disabledAccessFacilities: "",
        publicTransportationLinks: "",
    });
    const [connectivityAndTransportation, setConnectivityAndTransportation] =
        useState({
            shuttleServices: "",
            transportServices: "",
            transportLinks: "",
            nearbyAirports: "",
            publicTransportLinks: "",
            taxiServices: "",
            bikeRentals: "",
            proximityToNearbyAttractions: "",
            carRentalServices: "",
            airportTransferServices: "",
            currency: "",
        mooringFees: "",
        serviceCharges: "",
        membershipPrograms: "",
        paymentMethods: "",
        pricingStructure: "",
        depositRequirements: "",
        cancellationPolicies: "",
        discountsAvailable: "",
        });
    const [environmentalConsiderations, setEnvironmentalConsiderations] =
        useState({
            environmentalCertifications: "",
            wasteDisposal: "",
            wasteManagementPolicies: "",
            waterQualityMonitoring: "",
            wasteDisposalServices: "",
            waterTreatmentSystems: "",
            waterConservationMeasures: "",
            waterHookupSpecifications: "",
            recyclingPrograms: "",
            ecoFriendlyCleaningProducts: "",
            pollutionControlMeasures: "",
            wildlifeConservationEfforts: "",
            greenBuildingCertifications: "",
            energySources: "",
            marineLifeProtectionMeasures: "",
            greenCertifications: "",
            ecoFriendlyProductsAvailability: "",
            sewageTreatmentPlants: "",
        });
    const [securityAndSafety, setSecurityAndSafety] = useState({
        fireSafetySystems: "",
        emergencyContactInformation: "",
        emergencyMedicalServices: "",
        emergencyEvacuationPlans: "",
        fireSafetyEquipment: "",
        firstAidKits: "",
        evacuationPlan: "",
        navigationAssistance: "",
        navigationAids: "",
        pilotageServices: "",
        harborEntranceDepth: "",
        tideInformationServices: "",
        dockingDepths: "",
        marinaBasinDepth: "",
        waveProtectionMeasures: "",
        weatherMonitoringServices: "",
        shelterAndProtection: "",
        prevailingWinds: "",
        seaConditions: "",
        breakwaterTypes: "",
        weatherShelters: "",
        stormPreparationServices: "",
        floatingDockAvailability: "",
        dockConstructionMaterial: "",
        pileAnchoringSystem: "",
        dockMaterial: "",
        security: "",
        securityPatrol: "",
        cctv_Surveillance: "",
        accessControlSystems: "",
        securityLighting: "",
    });
    const [legalAndCompliance, setLegalAndCompliance] = useState({
        permitsAndLicenses: "",
        customsAndImmigration: "",
        healthAndSafetyRegulations: "",
        environmentalRegulationsCompliance: "",
        portStateControlInspections: "",
        quarantineServices: "",
    });
    const [insuranceAndRegulations, setInsuranceAndRegulations] = useState({
        insuranceRequirements: "",
        liabilityInsuranceRequirements: "",
        proofOfOwnershipRequired: "",
        complianceWithLocalRegulations: "",
        safetyInspections: "",
        certificateOfSeaworthiness: "",
        dockUseRegulations: "",
        environmentalComplianceCertificates: "",
    });
    const [financialInformation, setFinancialInformation] = useState({
        currency: "",
        mooringFees: "",
        serviceCharges: "",
        membershipPrograms: "",
        paymentMethods: "",
        pricingStructure: "",
        depositRequirements: "",
        cancellationPolicies: "",
        discountsAvailable: "",
    });
    const [pricingAndLeaseTerms, setPricingAndLeaseTerms] = useState({
        pricePA: "",
        price_pcm: "",
        pricePerWeek: "",
        availability: "",
        annualLeaseRenewable: "",
        cancellationPolicy: "",
        latePaymentFees: "",
        insuranceRequirements: "",
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
        totalPrice: "",
    });
  
    const sections = {
        siteDetails,
        generalInformation,
        environmentalConsiderations,
        communityAndSocial,
        amenitiesAndServices,
        surroundingArea,
        securityAndSafety,
        familyFacilities,
        services,
        connectivityAndTransportation,
        additionalFeatures,
        repairAndMaintenance,
        accessibility,
        legalAndCompliance,
        financialInformation,
        insuranceAndRegulations,
        pricingAndLeaseTerms,
        paymentTerms,
    };

    const setStateFunctions = {
        siteDetails: setSiteDetails,
        generalInformation: setGeneralInformation,
        amenitiesAndServices: setAmenitiesAndServices,
        communityAndSocial: setCommunityAndSocial,
        familyFacilities: setFamilyFacilities,
        additionalFeatures: setAdditionalFeatures,
        surroundingArea: setSurroundingArea,
        services: setServices,
        repairAndMaintenance: setRepairAndMaintenance,
        accessibility: setAccessibility,
        connectivityAndTransportation: setConnectivityAndTransportation,
        environmentalConsiderations: setEnvironmentalConsiderations,
        securityAndSafety: setSecurityAndSafety,
        legalAndCompliance: setLegalAndCompliance,
        insuranceAndRegulations: setInsuranceAndRegulations,
        financialInformation: setFinancialInformation,
        pricingAndLeaseTerms: setPricingAndLeaseTerms,
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

            if (category === "siteDetails" && field === "type") {
                const { marisailBerthId, siteDetails, termsAndConditions, type } =
                    updatedOptions.siteDetails;
                fetchRelevantOptions(
                    marisailBerthId,
                    siteDetails,
                    termsAndConditions,
                    type
                );
            }

            return updatedOptions;
        });

        if (
            category === "siteDetails" &&
            (field === "marisailBerthId" ||
                field === "siteDetails" ||
                field === "termsAndConditions")
        ) {
            fetchSiteDetailsSectionOptions(category, selectedOption, field);
        }
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
    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            convertUnitsInFormData(allSelectedOptions);
            // if (checkRequired()) {
            console.log("001 Form is valid, submitting...");
            localStorage.setItem("BertData", JSON.stringify(allSelectedOptions));
            navigate("/view-berth");
            // localStorage.setItem("advertise_engine", JSON.stringify(form));
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
                console.error(`No setState function found for key: ${key}`);
            }
        },
        [setStateFunctions]
    );

    const cacheKey = "berthsFilterData";
    const URL = apiUrl + "/advert_berth/";

    const fetchDistinctData = useCallback(async () => {
        try {
            setLoading(true);
            const promises = Object.keys(sections).map(async (key) => {
                const response = await fetch(`${URL}berths`, {
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
        }
    }, [URL, sections, setPageData]);
    const fetchRelevantOptions = async (
        marisailBerthId,
        siteDetails,
        termsAndConditions,
        type
    ) => {
        try {
            setLoading(true);
            const requestBody = {
                marisailBerthId,
                siteDetails,
                termsAndConditions,
                type,
            };
            const response = await fetch(`${URL}relevant_data`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
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
            console.log("001 relevant data all options after--", allSelectedOptions);
        }
    };

    const fetchSiteDetailsSectionOptions = async (
        category,
        selectedOption,
        Key
    ) => {
        try {
            setLoading(true);
            const tableName = "berths_ID";
            const keyMapping = {
                marisailBerthId: {
                    fetchColumn: "siteDetails",
                    dependencies: ["marisailBerthId"],
                },
                siteDetails: {
                    fetchColumn: "termsAndConditions",
                    dependencies: ["marisailBerthId", "siteDetails"],
                },
                termsAndConditions: {
                    fetchColumn: "type",
                    dependencies: [
                        "marisailBerthId",
                        "siteDetails",
                        "termsAndConditions",
                    ],
                },
            };
            if (!keyMapping[Key]) {
                throw new Error(`Invalid key provided: ${Key}`);
            }
            const { fetchColumn, dependencies } = keyMapping[Key];
            const requestBody = dependencies.reduce((body, depKey) => {
                body[depKey] =
                    depKey === Key
                        ? selectedOption
                        : allSelectedOptions[category]?.[depKey];
                return body;
            }, {});

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
            console.error("Error fetching identification section options:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (title, fieldKey, newValue) => {
        console.log("001 title--", title);
        console.log("001 fieldKey--", fieldKey);
        console.log("001 newValue--", newValue);

        setBerths((prevBerths) => ({
            ...prevBerths,
            [title]: {
                ...prevBerths[title],
                [fieldKey]: newValue,
            },
        }));
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
    }, [setPageData, fetchDistinctData]);

    const errorDisplay = (fieldName) => {
        return (
            <div style={{ color: "red", paddingLeft: 10 }}>
                {fieldName} field is required
            </div>
        );
    };

    if(false){
        return <div>Test</div>
    }

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
                                                        options={sections[title][fieldKey] || []}
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
                                                        setOpenKey={setOpenKey}
                                                        openKey={openKey || ""}
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
                                                    value={berths[title]?.[fieldKey] || ""}
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
                                                    value={berths[title]?.[fieldKey] || ""}
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
                        name="advert_berth_submit"
                        onClick={handleSubmit}
                    />
                </Form>
            )}
        </Container>
    );
}



function BerthSearch() {
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

  const URL = apiUrl + "/search_berth/";

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
        const response = await fetch(`${URL}berthsData`, {
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
        if (data?.ok && Array.isArray(data?.res?.[0])) {
          setBerths(data.res[0]);
        } else {
          console.error("Invalid berth data format:", data);
          setBerths([]);
        }
      } catch (err) {
        console.error("Error fetching berth data:", err);
        setBerths([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBerthData();
  }, [allSelectedOptions, page, URL]);

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



const Berths = ({ type }) => {
  return (
    <main
      style={{
        minHeight: `100vh`,
        overflow: "hidden",
      }}
    >
      {type === "search" ? <BerthSearch /> : <BerthAdvert/>}
    </main>
  );
};

Berths.propTypes = {
  type: PropTypes.string.isRequired,
};

export default Berths;
