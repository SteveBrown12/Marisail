import { Form, Container, Row, Col } from "react-bootstrap";
import { useEffect, useState, useRef } from "react";
import DropdownWithRadio from "../DropdownWithRadio";
import Loader from "../Loader";
import SubmitButton from "../SubmitButton";
import { keyToExpectedValueMap, typeDef } from "./BerthAdvertInfo";
import { makeString } from "../../services/common_functions";

export default function BerthAdvert() {
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
        location: "",
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
        conciergeServices: "",
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
        vipMembershipOptions: "",
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
    });
    const [services, setServices] = useState({
        pumpOutStation: "",
        docksideTrolley: "",
        powerSupply: "",
        waterSupply: "",
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
        safetyInspections: "",
        dockConstructionMaterial: "",
        pileAnchoringSystem: "",
        dockMaterial: "",
        security: "",
        securityPatrol: "",
        cctvSurveillance: "",
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
        pricePCM: "",
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
                        // if(field.value){
                        //   console.log("001 field value--",field);
                        // }
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
        siteDetails,
        communityAndSocial,
        environmentalConsiderations, //
        generalInformation,
        amenitiesAndServices,
        surroundingArea,
        securityAndSafety,
        familyFacilities,
        services,
        financialInformation,
        additionalFeatures,
        repairAndMaintenance,
        accessibility,
        legalAndCompliance,
        connectivityAndTransportation,
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
                const { marisailBerthId, siteDetails, termsAndConditions, type } = updatedOptions.siteDetails;
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
            (
                field === "marisailBerthId" ||
                field === "siteDetails" ||
                field === "termsAndConditions"
            )
        ) {
            fetchIdentificationSectionOptions(category, selectedOption, field);
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            if (checkRequired()) {
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

    const cacheKey = "berthsFilterData";
    const URL = "http://localhost:3001/api/advert_berth/";

    const fetchDistinctData = async () => {
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
    };
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

    const fetchIdentificationSectionOptions = async (category, selectedOption, Key) => {
        try {
            setLoading(true);
            const tableName = "berths_ID";
            const keyMapping = {
                marisailBerthId: { fetchColumn: "siteDetails", dependencies: ["marisailBerthId"] },
                siteDetails: { fetchColumn: "termsAndConditions", dependencies: ["marisailBerthId", "siteDetails"] },
                termsAndConditions: { fetchColumn: "type", dependencies: ["marisailBerthId", "siteDetails", "termsAndConditions"] },
            };
            if (!keyMapping[Key]) {
                throw new Error(`Invalid key provided: ${Key}`);
            }
            const { fetchColumn, dependencies } = keyMapping[Key];
            const requestBody = dependencies.reduce((body, depKey) => {
                body[depKey] = depKey === Key ? selectedOption : allSelectedOptions[category]?.[depKey];
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

    const errorDisplay = (fieldName) => {
        return <div style={{ color: "red" }}>{fieldName} field is required</div>;
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
                                    <h6 style={{ padding: "15px 0px 0px 0px" }}>
                                        {makeString(title, keyToExpectedValueMap)}
                                    </h6>
                                </legend>
                                {Object.keys(sections[title]).map((fieldKey) => {
                                    const field = typeDef[title][fieldKey];
                                    if (field && field.type === "radio") {
                                        return (
                                            <Col
                                                md={12}
                                                className="mt-4 mr-3"
                                                key={fieldKey}
                                                style={{ width: 480 }}
                                            >
                                                <Col xs={3} md={12} className="mb-2">
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
                                                </Col>
                                            </Col>
                                        );
                                    }
                                    return null;
                                })}
                            </Col>
                        ))}
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
