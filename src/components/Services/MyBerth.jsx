import { Form, Container, Row, Col } from "react-bootstrap";
import { useEffect, useState, useRef } from "react";
import DropdownWithRadio from "../DropdownWithRadio";
import Loader from "../Loader";
import SubmitButton from "../SubmitButton";
import { keyToExpectedValueMap, typeDef } from "../Berth/Berth_Advert_Info";
import { makeString } from "../../services/common_functions";
const apiUrl = import.meta.env.VITE_BACKEND_URL;

export default function MyBerth() {
    const storedUser = localStorage.getItem("user");
    const formData = localStorage.getItem("BerthData");
    let berthData;
    if (storedUser && formData) {
        berthData = JSON.parse(formData);
    }
    const [error, setError] = useState({});
    const hasFetched = useRef(false);
    const [openKey, setOpenKey] = useState(null);
    const [loading, setLoading] = useState(false);
    const [allSelectedOptions, setAllSelectedOptions] = useState({});
    const [siteDetails, setSiteDetails] = useState({
        marisailBerthId: berthData?.marisailBerthId || "",
        siteDetails: berthData?.siteDetails || "",
        termsAndConditions: berthData?.termsAndConditions || "",
        type: berthData?.type || "",
        marinaPortHarborName: berthData?.marinaPortHarborName || "",
        location: berthData?.location || "",
        ownership: berthData?.ownership || "",
        yearEstablished: berthData?.yearEstablished || "",
        operatingHours: berthData?.operatingHours || "",
        contactDetails: berthData?.contactDetails || "",
        seasonalOperation: berthData?.seasonalOperation || "",
        languageServices: berthData?.languageServices || "",
    });

    const [generalInformation, setGeneralInformation] = useState({
        dockTypes: berthData?.dockTypes || "",
        numberOfDocks: berthData?.numberOfDocks || "",
        boatSlipSizes: berthData?.boatSlipSizes || "",
        numberBerthsAvailable: berthData?.numberBerthsAvailable || "",
        length: berthData?.length || "",
        beam: berthData?.beam || "",
        draft: berthData?.draft || "",
        slipWidth: berthData?.slipWidth || "",
        slipDepth: berthData?.slipDepth || "",
        slipLength: berthData?.slipLength || "",
        mooringType: berthData?.mooringType || "",
        tideRange: berthData?.tideRange || "",
    });

    const [amenitiesAndServices, setAmenitiesAndServices] = useState({
        storage: berthData?.storage || "",
        electricityAvailable: berthData?.electricityAvailable || "",
        waterSupply: berthData?.waterSupply || "",
        wifiAvailability: berthData?.wifiAvailability || "",
        carParking: berthData?.carParking || "",
        conciergeServices: berthData?.conciergeServices || "",
        businessServices: berthData?.businessServices || "",
        conferenceRooms: berthData?.conferenceRooms || "",
    });

    const [familyFacilities, setFamilyFacilities] = useState({
        laundryFacilities: berthData?.laundryFacilities || "",
        restaurantsAndCafes: berthData?.restaurantsAndCafes || "",
        restaurant: berthData?.restaurant || "",
        bar: berthData?.bar || "",
        shoppingFacilities: berthData?.shoppingFacilities || "",
        retailShops: berthData?.retailShops || "",
        hospitalityServices: berthData?.hospitalityServices || "",
        recreationalFacilities: berthData?.recreationalFacilities || "",
        clubhouseAccess: berthData?.clubhouseAccess || "",
        swimmingPool: berthData?.swimmingPool || "",
        fitnessCenter: berthData?.fitnessCenter || "",
        marinaStore: berthData?.marinaStore || "",
        chandlery: berthData?.chandlery || "",
        restroomsAndShowers: berthData?.restroomsAndShowers || "",
        laundryServices: berthData?.laundryServices || "",
        gymFacilities: berthData?.gymFacilities || "",
        sanitationFacilities: berthData?.sanitationFacilities || "",
        guestAccommodationOptions: berthData?.guestAccommodationOptions || "",
        familyFriendlyAmenities: berthData?.familyFriendlyAmenities || "",
        petFriendlyServices: berthData?.petFriendlyServices || "",
        iceAvailability: berthData?.iceAvailability || "",
        picnicAndBBQAreas: berthData?.picnicAndBBQAreas || "",
        childrensPlayArea: berthData?.childrensPlayArea || "",
    });

    const [surroundingArea, setSurroundingArea] = useState({
        localAttractions: berthData?.localAttractions || "",
        restaurants: berthData?.restaurants || "",
        accommodation: berthData?.accommodation || "",
        shopping: berthData?.shopping || "",
        transportationOptions: berthData?.transportationOptions || "",
        medicalFacilitiesNearby: berthData?.medicalFacilitiesNearby || "",
        localServices: berthData?.localServices || "",
        communityResources: berthData?.communityResources || "",
    });

    const [additionalFeatures, setAdditionalFeatures] = useState({
        charterServices: berthData?.charterServices || "",
        yachtBrokerageServices: berthData?.yachtBrokerageServices || "",
        boatShowParticipation: berthData?.boatShowParticipation || "",
        loyaltyPrograms: berthData?.loyaltyPrograms || "",
        referralPrograms: berthData?.referralPrograms || "",
        vip_MembershipOptions: berthData?.vip_MembershipOptions || "",
    });

    const [communityAndSocial, setCommunityAndSocial] = useState({
        annualEvents: berthData?.annualEvents || "",
        educationalPrograms: berthData?.educationalPrograms || "",
        communityEvents: berthData?.communityEvents || "",
        socialEvents: berthData?.socialEvents || "",
        sportsActivities: berthData?.sportsActivities || "",
        culturalEvents: berthData?.culturalEvents || "",
        seasonalActivities: berthData?.seasonalActivities || "",
        yachtClubMembership: berthData?.yachtClubMembership || "",
        regattasAndCompetitions: berthData?.regattasAndCompetitions || "",
        workshopsAndClasses: berthData?.workshopsAndClasses || "",
        communityBulletinBoard: berthData?.communityBulletinBoard || "",
        networkingEvents: berthData?.networkingEvents || "",
        memberDiscounts: berthData?.memberDiscounts || "",
    });

    const [services, setServices] = useState({
        pumpOutStation: berthData?.pumpOutStation || "",
        docksideTrolley: berthData?.docksideTrolley || "",
        powerSupply: berthData?.powerSupply || "",
        shorePowerConnectionTypes: berthData?.shorePowerConnectionTypes || "",
        fuelTypesAvailable: berthData?.fuelTypesAvailable || "",
        fuelService: berthData?.fuelService || "",
        fuelDock: berthData?.fuelDock || "",
        electricalHookupSpecifications: berthData?.electricalHookupSpecifications || "",
    });

    const [repairAndMaintenance, setRepairAndMaintenance] = useState({
        boatYardServices: berthData?.boatYardServices || "",
        boatCleaningServices: berthData?.boatCleaningServices || "",
        boatMaintenanceAndRepair: berthData?.boatMaintenanceAndRepair || "",
        chandleryServices: berthData?.chandleryServices || "",
        repairAndMaintenanceServices: berthData?.repairAndMaintenanceServices || "",
        haulOutServices: berthData?.haulOutServices || "",
        boatLiftSpecifications: berthData?.boatLiftSpecifications || "",
    });

    const [accessibility, setAccessibility] = useState({
        handicapAccessibleSlips: berthData?.handicapAccessibleSlips || "",
        proximityToHandicapParking: berthData?.proximityToHandicapParking || "",
        accessibleFacilities: berthData?.accessibleFacilities || "",
        assistanceServicesForDisabled: berthData?.assistanceServicesForDisabled || "",
        signageAndDirections: berthData?.signageAndDirections || "",
        accessibleRestroomsAndShowers: berthData?.accessibleRestroomsAndShowers || "",
        parkingFacilities: berthData?.parkingFacilities || "",
        accessibilityFeatures: berthData?.accessibilityFeatures || "",
        disabledAccessFacilities: berthData?.disabledAccessFacilities || "",
        publicTransportationLinks: berthData?.publicTransportationLinks || "",
    });

    const [connectivityAndTransportation, setConnectivityAndTransportation] = useState({
        shuttleServices: berthData?.shuttleServices || "",
        transportServices: berthData?.transportServices || "",
        transportLinks: berthData?.transportLinks || "",
        nearbyAirports: berthData?.nearbyAirports || "",
        publicTransportLinks: berthData?.publicTransportLinks || "",
        taxiServices: berthData?.taxiServices || "",
        bikeRentals: berthData?.bikeRentals || "",
        proximityToNearbyAttractions: berthData?.proximityToNearbyAttractions || "",
        carRentalServices: berthData?.carRentalServices || "",
        airportTransferServices: berthData?.airportTransferServices || "",
    });

    const [environmentalConsiderations, setEnvironmentalConsiderations] = useState({
        environmentalCertifications: berthData?.environmentalCertifications || "",
        wasteDisposal: berthData?.wasteDisposal || "",
        wasteManagementPolicies: berthData?.wasteManagementPolicies || "",
        waterQualityMonitoring: berthData?.waterQualityMonitoring || "",
        wasteDisposalServices: berthData?.wasteDisposalServices || "",
        waterTreatmentSystems: berthData?.waterTreatmentSystems || "",
        waterConservationMeasures: berthData?.waterConservationMeasures || "",
        waterHookupSpecifications: berthData?.waterHookupSpecifications || "",
        recyclingPrograms: berthData?.recyclingPrograms || "",
        ecoFriendlyCleaningProducts: berthData?.ecoFriendlyCleaningProducts || "",
        pollutionControlMeasures: berthData?.pollutionControlMeasures || "",
        wildlifeConservationEfforts: berthData?.wildlifeConservationEfforts || "",
        greenBuildingCertifications: berthData?.greenBuildingCertifications || "",
        energySources: berthData?.energySources || "",
        marineLifeProtectionMeasures: berthData?.marineLifeProtectionMeasures || "",
        greenCertifications: berthData?.greenCertifications || "",
        ecoFriendlyProductsAvailability: berthData?.ecoFriendlyProductsAvailability || "",
        sewageTreatmentPlants: berthData?.sewageTreatmentPlants || "",
    });

    const [securityAndSafety, setSecurityAndSafety] = useState({
        fireSafetySystems: berthData?.fireSafetySystems || "",
        emergencyContactInformation: berthData?.emergencyContactInformation || "",
        emergencyMedicalServices: berthData?.emergencyMedicalServices || "",
        emergencyEvacuationPlans: berthData?.emergencyEvacuationPlans || "",
        fireSafetyEquipment: berthData?.fireSafetyEquipment || "",
        firstAidKits: berthData?.firstAidKits || "",
        evacuationPlan: berthData?.evacuationPlan || "",
        navigationAssistance: berthData?.navigationAssistance || "",
        navigationAids: berthData?.navigationAids || "",
        pilotageServices: berthData?.pilotageServices || "",
        harborEntranceDepth: berthData?.harborEntranceDepth || "",
        tideInformationServices: berthData?.tideInformationServices || "",
        dockingDepths: berthData?.dockingDepths || "",
        marinaBasinDepth: berthData?.marinaBasinDepth || "",
        waveProtectionMeasures: berthData?.waveProtectionMeasures || "",
        weatherMonitoringServices: berthData?.weatherMonitoringServices || "",
        shelterAndProtection: berthData?.shelterAndProtection || "",
        prevailingWinds: berthData?.prevailingWinds || "",
        seaConditions: berthData?.seaConditions || "",
        breakwaterTypes: berthData?.breakwaterTypes || "",
        weatherShelters: berthData?.weatherShelters || "",
        stormPreparationServices: berthData?.stormPreparationServices || "",
        floatingDockAvailability: berthData?.floatingDockAvailability || "",
        dockConstructionMaterial: berthData?.dockConstructionMaterial || "",
        pileAnchoringSystem: berthData
    })
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
    const URL = apiUrl +"/advert_berth/";

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
        return (
            <div style={{ color: "red", paddingLeft: 10 }}>
                {fieldName} field is required
            </div>
        );
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
                                                            allSelectedOptions[title]?.[fieldKey] || berthData[title]?.[fieldKey] || ""
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
