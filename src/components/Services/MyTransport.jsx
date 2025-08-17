import { Form, Container, Row, Col } from "react-bootstrap";
import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom"; 
import DropdownWithRadio from "../DropdownWithRadio";
import Loader from "../Loader";
import SubmitButton from "../SubmitButton";
import { keyToExpectedValueMap, typeDef } from "../Transport/Transport_Advert_Info";
import { makeString, convertUnitsInFormData } from "../../services/common_functions";
import DatePickerComponent from "../DatePickerComponent";
import InputComponentDual from "../InputComponentDual";

const apiUrl = import.meta.env.VITE_BACKEND_URL;

export default function MyTransport() {
    // Retrieve the user object from localStorage
    const storedUser = localStorage.getItem("user");
    const formData = localStorage.getItem("TransportData");
    // let user;
    let advertiseTransportData;
    // Parse the JSON string back into an object
    if (storedUser && formData) {
        advertiseTransportData = JSON.parse(formData);
    }
    const navigate = useNavigate(); 
    const [error, setError] = useState({});
    const hasFetched = useRef(false);
    const [transport, setTransport] = useState("");
    const [openKey, setOpenKey] = useState(null);
    const [loading, setLoading] = useState(false);
    const [allSelectedOptions, setAllSelectedOptions] = useState({});
    console.log("001 testing data--",advertiseTransportData?.jobDescription?.marisailTransportId?.value);
    
    const [jobDescription, setJobDescription] = useState({
        marisailTransportId: advertiseTransportData?.jobDescription?.marisailTransportId?.value || "",
        category: advertiseTransportData?.jobDescription?.category?.value || "",
        title: advertiseTransportData?.jobDescription?.title?.value || "",
        description: advertiseTransportData?.jobDescription?.description?.value || "",
        postedDate: advertiseTransportData?.jobDescription?.postedDate?.value || new Date(),
        deadlineDate: advertiseTransportData?.jobDescription?.deadlineDate?.value || "",
        timescale: advertiseTransportData?.jobDescription?.timescale?.value || "",
        preferredDate: advertiseTransportData?.jobDescription?.preferredDate?.value || "",
        haulierToDepartureDistance: advertiseTransportData?.jobDescription?.haulierToDepartureDistance?.value || "",
        departureToDestinationDistance: advertiseTransportData?.jobDescription?.departureToDestinationDistance?.value || "",
        returnJourney: advertiseTransportData?.jobDescription?.returnJourney?.value || "",
        roundTripDistance: advertiseTransportData?.jobDescription?.roundTripDistance?.value || "",
        international: advertiseTransportData?.jobDescription?.international?.value || "",
        ferryRequired: advertiseTransportData?.jobDescription?.ferryRequired?.value || "",
        specialHandlingRequirements: advertiseTransportData?.jobDescription?.specialHandlingRequirements?.value || "",
        departureLoadingEquipmentNeeded: advertiseTransportData?.jobDescription?.departureLoadingEquipmentNeeded?.value || "",
        destinationUnloadingEquipmentNeeded: advertiseTransportData?.jobDescription?.destinationUnloadingEquipmentNeeded?.value || "",
        freightClass: advertiseTransportData?.jobDescription?.freightClass?.value || "",
        overweightPermitNeeded: advertiseTransportData?.jobDescription?.overweightPermitNeeded?.value || "",
        oversizePermitNeeded: advertiseTransportData?.jobDescription?.oversizePermitNeeded?.value || "",
        numberQuotes: advertiseTransportData?.jobDescription?.numberQuotes?.value || "",
        map: advertiseTransportData?.jobDescription?.map?.value || "",
        jobDone: advertiseTransportData?.jobDescription?.jobDone?.value|| "",
        jobDoneDate: advertiseTransportData?.jobDescription?.jobDoneDate?.value || "",
    });    
    const [vesselDetails, setVesselDetails] = useState({
        itemNumber: advertiseTransportData?.vesselDetails?.itemNumber?.value || "",
        totalNumberItems: advertiseTransportData?.vesselDetails?.totalNumberItems?.value || "",
        photos: advertiseTransportData?.vesselDetails?.photos?.value || "",
        previousInsuranceClaims: advertiseTransportData?.vesselDetails?.previousInsuranceClaims?.value || "",
        existingDamage: advertiseTransportData?.vesselDetails?.existingDamage?.value || "",
        damageDescription: advertiseTransportData?.vesselDetails?.damageDescription?.value || "",
        vesselInsuranceType: advertiseTransportData?.vesselDetails?.vesselInsuranceType?.value || "",
        vesselInsuranceNotes: advertiseTransportData?.vesselDetails?.vesselInsuranceNotes?.value || "",
        boatDetails: advertiseTransportData?.vesselDetails?.boatDetails?.value || "",
    });    
    const [customerContactDetails, setCustomerDetails] = useState({
        customerType: advertiseTransportData?.customerContactDetails?.customerType?.value || "",
        customerId: advertiseTransportData?.customerContactDetails?.customerId?.value || "",
        customerName: advertiseTransportData?.customerContactDetails?.customerName?.value || "",
        customerCompanyName: advertiseTransportData?.customerContactDetails?.customerCompanyName?.value || "",
        collectionDepartureNamedContact: advertiseTransportData?.customerContactDetails?.collectionDepartureNamedContact?.value || "",
        collectionDepartureMobile: advertiseTransportData?.customerContactDetails?.collectionDepartureMobile?.value || "",
        deliveryDestinationNamedContact: advertiseTransportData?.customerContactDetails?.deliveryDestinationNamedContact?.value || "",
        collectionDepartureAddress: advertiseTransportData?.customerContactDetails?.collectionDepartureAddress?.value || "",
        deliveryDestinationMobile: advertiseTransportData?.customerContactDetails?.deliveryDestinationMobile?.value || "",
        deliveryDestinationAddress: advertiseTransportData?.customerContactDetails?.deliveryDestinationAddress?.value || "",
        emergencyContactInformation: advertiseTransportData?.customerContactDetails?.emergencyContactInformation?.value || "",
        preferredCommunicationMethod: advertiseTransportData?.customerContactDetails?.preferredCommunicationMethod?.value || "",
    });
    const [transportQuotes, setTransportQuotes] = useState({
        quote: advertiseTransportData?.transportQuotes?.quote?.value || "",
        quoteDescription: advertiseTransportData?.transportQuotes?.quoteDescription?.value || "",
        quoteDate: advertiseTransportData?.transportQuotes?.quoteDate?.value || "",
        declineDate: advertiseTransportData?.transportQuotes?.declineDate?.value || "",
        withdrawDate: advertiseTransportData?.transportQuotes?.withdrawDate?.value || "",
        quoteStatus: advertiseTransportData?.transportQuotes?.quoteStatus?.value || "",
        declineQuote: advertiseTransportData?.transportQuotes?.declineQuote?.value || "",
        withdrawQuote: advertiseTransportData?.transportQuotes?.withdrawQuote?.value || "",
    });    
    const [qAndA, setQAndA] = useState({
        questionDate: advertiseTransportData?.qAndA?.questionDate?.value || "",
        answerDate: advertiseTransportData?.qAndA?.answerDate?.value || "",
        transportProviderQuestions: advertiseTransportData?.qAndA?.transportProviderQuestions?.value || "",
        customerAnswers: advertiseTransportData?.qAndA?.customerAnswers?.value || "",
        writeQuestion: advertiseTransportData?.qAndA?.writeQuestion?.value || "",
        answerQuestion: advertiseTransportData?.qAndA?.answerQuestion?.value || "",
        customerConfirmsCompletion: advertiseTransportData?.qAndA?.customerConfirmsCompletion?.value || "",
        addItem: advertiseTransportData?.qAndA?.addItem?.value || "",
    });    
    const [feedback, setFeedback] = useState({
        customerFeedbackNotes: advertiseTransportData?.feedback?.customerFeedbackNotes?.value || "",
        customerFeedbackScore: advertiseTransportData?.feedback?.customerFeedbackScore?.value || "",
        positive: advertiseTransportData?.feedback?.positive?.value || "",
        neutral: advertiseTransportData?.feedback?.neutral?.value || "",
        negative: advertiseTransportData?.feedback?.negative?.value || "",
        reviews: advertiseTransportData?.feedback?.reviews?.value || "",
        rating: advertiseTransportData?.feedback?.rating?.value || "",
        itemTitle: advertiseTransportData?.feedback?.itemTitle?.value || "",
        leftBy: advertiseTransportData?.feedback?.leftBy?.value || "",
        comments: advertiseTransportData?.feedback?.comments?.value || "",
        date: advertiseTransportData?.feedback?.date?.value || "",
        customerGivesFeedbackNotes: advertiseTransportData?.feedback?.customerGivesFeedbackNotes?.value || "",
        customerGivesFeedbackScore: advertiseTransportData?.feedback?.customerGivesFeedbackScore?.value || "",
        seeMyQuotes: advertiseTransportData?.feedback?.seeMyQuotes?.value || "",
    });
    const [haulierDates, setHaulierDates] = useState({
        haulierId: advertiseTransportData?.haulierDates?.haulierId?.value || "",
        haulierAddress: advertiseTransportData?.haulierDates?.haulierAddress?.value || "",
        haulierName: advertiseTransportData?.haulierDates?.haulierName?.value || "",
        haulierNumberJobs: advertiseTransportData?.haulierDates?.haulierNumberJobs?.value || "",
        haulierTotalCustomerScore: advertiseTransportData?.haulierDates?.haulierTotalCustomerScore?.value || "",
        registeredSince: advertiseTransportData?.haulierDates?.registeredSince?.value || "",
        numberVehicles: advertiseTransportData?.haulierDates?.numberVehicles?.value || "",
        numberDrivers: advertiseTransportData?.haulierDates?.numberDrivers?.value || "",
        verified: advertiseTransportData?.haulierDates?.verified?.value || "",
        vehicleType: advertiseTransportData?.haulierDates?.vehicleType?.value || "",
        vehicleCapacity: advertiseTransportData?.haulierDates?.vehicleCapacity?.value || "",
    });    
    const [haulierCommunications, setHaulierCommunications] = useState({
        customerServiceContactInformation: advertiseTransportData?.haulierCommunications?.customerServiceContactInformation?.value || "",
        realTimeTracking: advertiseTransportData?.haulierCommunications?.realTimeTracking?.value || "",
        electronicProofOfDelivery: advertiseTransportData?.haulierCommunications?.electronicProofOfDelivery?.value || "",
        automatedAlertsAndNotifications: advertiseTransportData?.haulierCommunications?.automatedAlertsAndNotifications?.value || "",
        trackingSystem: advertiseTransportData?.haulierCommunications?.trackingSystem?.value || "",
        deliveryWindow: advertiseTransportData?.haulierCommunications?.deliveryWindow?.value || "",
        deliveryConfirmation: advertiseTransportData?.haulierCommunications?.deliveryConfirmation?.value || "",
    });    
    const [haulierSafetyAndCompliance, setHaulierSafetyAndCompliance] = useState({
        safetyCertifications: advertiseTransportData?.haulierSafetyAndCompliance?.safetyCertifications?.value || "",
        environmentalRegulationsCompliance: advertiseTransportData?.haulierSafetyAndCompliance?.environmentalRegulationsCompliance?.value || "",
        hazardousMaterialsHandling: advertiseTransportData?.haulierSafetyAndCompliance?.hazardousMaterialsHandling?.value || "",
        safetyTrainingPrograms: advertiseTransportData?.haulierSafetyAndCompliance?.safetyTrainingPrograms?.value || "",
        accidentReportingProcedures: advertiseTransportData?.haulierSafetyAndCompliance?.accidentReportingProcedures?.value || "",
        healthAndSafetyPolicies: advertiseTransportData?.haulierSafetyAndCompliance?.healthAndSafetyPolicies?.value || "",
        safetyAudits: advertiseTransportData?.haulierSafetyAndCompliance?.safetyAudits?.value || "",
        riskAssessments: advertiseTransportData?.haulierSafetyAndCompliance?.riskAssessments?.value || "",
        incidentManagement: advertiseTransportData?.haulierSafetyAndCompliance?.incidentManagement?.value || "",
        complianceRecords: advertiseTransportData?.haulierSafetyAndCompliance?.complianceRecords?.value || "",
        permitsAndLicenses: advertiseTransportData?.haulierSafetyAndCompliance?.permitsAndLicenses?.value || "",
        transportRegulationsCompliance: advertiseTransportData?.haulierSafetyAndCompliance?.transportRegulationsCompliance?.value || "",
    });
    const [paymentAndInsurance, setPaymentAndInsurance] = useState({
        serviceLevelAgreement: advertiseTransportData?.paymentAndInsurance?.serviceLevelAgreement?.value || "",
        acceptedPaymentMethods: advertiseTransportData?.paymentAndInsurance?.acceptedPaymentMethods?.value || "",
        cancellationPolicy: advertiseTransportData?.paymentAndInsurance?.cancellationPolicy?.value || "",
        invoiceTime: advertiseTransportData?.paymentAndInsurance?.invoiceTime?.value || "",
        latePaymentFees: advertiseTransportData?.paymentAndInsurance?.latePaymentFees?.value || "",
        billingContactInformation: advertiseTransportData?.paymentAndInsurance?.billingContactInformation?.value || "",
        disputeResolutionTerms: advertiseTransportData?.paymentAndInsurance?.disputeResolutionTerms?.value || "",
        liabilityCoverage: advertiseTransportData?.paymentAndInsurance?.liabilityCoverage?.value || "",
        insurancePolicy: advertiseTransportData?.paymentAndInsurance?.insurancePolicy?.value || "",
        insuranceCoverage: advertiseTransportData?.paymentAndInsurance?.insuranceCoverage?.value || "",
        insuranceProvider: advertiseTransportData?.paymentAndInsurance?.insuranceProvider?.value || "",
        insuranceClaimProcess: advertiseTransportData?.paymentAndInsurance?.insuranceClaimProcess?.value || "",
    });    
    const [paymentTerms, setPaymentTerms] = useState({
        paymentTerms: advertiseTransportData?.paymentTerms?.paymentTerms?.value || "",
        currency: advertiseTransportData?.paymentTerms?.currency?.value || "",
        preferredPaymentMethods: advertiseTransportData?.paymentTerms?.preferredPaymentMethods?.value || "",
        invoiceAndReceiptProcedures: advertiseTransportData?.paymentTerms?.invoiceAndReceiptProcedures?.value || "",
        calculatePriceAndPay: advertiseTransportData?.paymentTerms?.calculatePriceAndPay?.value || "",
        priceLabel: advertiseTransportData?.paymentTerms?.priceLabel?.value || "",
        priceDrop: advertiseTransportData?.paymentTerms?.priceDrop?.value || "",
        vat: advertiseTransportData?.paymentTerms?.vat?.value || "",
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

    const setPageData = useCallback((key, newData) => {
        const setStateFunction = setStateFunctions[key];
        if (setStateFunction) {
            setStateFunction((prevState) => ({
                ...prevState,
                ...newData,
            }));
        } else {
            console.error(`No setState function found for key: ` + JSON.stringify(key));
        }
    }, [setStateFunctions]);

    const cacheKey = "transportFilterData";
    const URL = apiUrl +"/advert_transport/";

    const fetchDistinctData = useCallback(async () => {
        try {
            setLoading(true);
            const promises = Object.keys(sections).map(async (key) => {
                const response = await fetch(`${URL}transport`, {
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
    }, [sections, URL, setPageData]);

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
                                                    selectedOption={allSelectedOptions[title]?.[fieldKey]?.unit || ""}
                                                    setSelectedOption={(inputValue, radioValue) =>
                                                        handleDualInputChange(title, fieldKey, inputValue, radioValue)
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
