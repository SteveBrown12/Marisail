export const TRANSPORT_ADVERT = [
    {
        key: "marisailTransportId",
        columnName: "Transport_Item_ID",
        tableName: "Job",
    },
    { key: "category", columnName: "Category", tableName: "Job" },
    { key: "title", columnName: "Title", tableName: "Job" },
    { key: "description", columnName: "Description", tableName: "Job" },
    { key: "postedDate", columnName: "Posted_Date", tableName: "Job" },
    { key: "deadlineDate", columnName: "Deadline_Date", tableName: "Job" },
    { key: "timescale", columnName: "Timescale", tableName: "Job" },
    { key: "preferredDate", columnName: "Preferred_Date", tableName: "Job" },
    {
        key: "haulierToDepartureDistance",
        columnName: "Collection_Delivery_Distance",
        tableName: "Job",
    },
    {
        key: "departureToDestinationDistance",
        columnName: "Departure_Destination",
        tableName: "Job",
    },
    { key: "returnJourney", columnName: "Return_Journey", tableName: "Job" },
    {
        key: "roundTripDistance",
        columnName: "Round_Trip_Distance",
        tableName: "Job",
    },
    { key: "international", columnName: "International", tableName: "Job" },
    { key: "ferryRequired", columnName: "Ferry_Required", tableName: "Job" },
    {
        key: "specialHandlingRequirements",
        columnName: "Special_Handling",
        tableName: "Job",
    },
    {
        key: "departureLoadingEquipmentNeeded",
        columnName: "Loading_Equipment",
        tableName: "Job",
    },
    {
        key: "destinationUnloadingEquipmentNeeded",
        columnName: "Unloading_Equipment",
        tableName: "Job",
    },
    { key: "freightClass", columnName: "Freight_Class", tableName: "Job" },
    {
        key: "overweightPermitNeeded",
        columnName: "Overweight_Permit",
        tableName: "Job",
    },
    {
        key: "oversizePermitNeeded",
        columnName: "Oversize_Permit",
        tableName: "Job",
    },
    { key: "numberQuotes", columnName: "Number_Quotes", tableName: "Job" },
    // { key: "map", columnName: "Map", tableName: "" },
    { key: "jobDone", columnName: "Job_Done_Date", tableName: "Job" },
    { key: "jobDoneDate", columnName: "Job_Done_Date", tableName: "Job" },

    { key: "itemNumber", columnName: "Item_Number", tableName: "Vessel_Details" },
    {
        key: "totalNumberItems",
        columnName: "Total_Number_Items",
        tableName: "Vessel_Details",
    },
    { key: "photos", columnName: "Photos", tableName: "Vessel_Details" },
    {
        key: "previousInsuranceClaims",
        columnName: "Insurance_Claims",
        tableName: "Vessel_Details",
    },
    {
        key: "existingDamage",
        columnName: "Existing_Damage",
        tableName: "Vessel_Details",
    },
    {
        key: "damageDescription",
        columnName: "Damage_Description",
        tableName: "Vessel_Details",
    },
    {
        key: "vesselInsuranceType",
        columnName: "Vessel_Insurance_Type",
        tableName: "Vessel_Details",
    },
    {
        key: "vesselInsuranceNotes",
        columnName: "Vessel_Insurance_Notes",
        tableName: "Vessel_Details",
    },

    { key: "customerType", columnName: "Customer_Type", tableName: "Contacts" },
    { key: "customerID", columnName: "Customer_ID", tableName: "Contacts" },
    { key: "customerName", columnName: "Customer_Name", tableName: "Contacts" },
    {
        key: "customerCompanyName",
        columnName: "Customer_Company_Name",
        tableName: "Contacts",
    },
    {
        key: "collectionDepartureNamedContact",
        columnName: "Collection_Contact",
        tableName: "Contacts",
    },
    {
        key: "collectionDepartureMobile",
        columnName: "Collection_Mobile",
        tableName: "Contacts",
    },
    {
        key: "deliveryDestinationNamedContact",
        columnName: "Delivery_Contact",
        tableName: "Contacts",
    },
    {
        key: "collectionDepartureAddress",
        columnName: "Collection_Address",
        tableName: "Contacts",
    },
    {
        key: "deliveryDestinationMobile",
        columnName: "Delivery_Mobile",
        tableName: "Contacts",
    },
    {
        key: "deliveryDestinationAddress",
        columnName: "Delivery_Address",
        tableName: "Contacts",
    },
    {
        key: "emergencyContactInformation",
        columnName: "Emergency_Contacts",
        tableName: "Contacts",
    },
    {
        key: "preferredCommunicationMethod",
        columnName: "Preferred_Communication",
        tableName: "Customer",
    },

    { key: "quote", columnName: "Quote_Value", tableName: "Quotes" },
    {
        key: "quoteDescription",
        columnName: "Quote_Description",
        tableName: "Quotes",
    },
    { key: "quoteDate", columnName: "Quote_Date", tableName: "Quotes" },
    { key: "declineDate", columnName: "Decline_Date", tableName: "Quotes" },
    { key: "withdrawDate", columnName: "Withdraw_Date", tableName: "Quotes" },
    { key: "quoteStatus", columnName: "Quote_Status", tableName: "Quotes" },
    // { key: "declineQuote", columnName: "", tableName: "" },
    // { key: "withdrawQuote", columnName: "", tableName: "" },

    { key: "questionDate", columnName: "Question_Date", tableName: "Questions" },
    { key: "answerDate", columnName: "Answer_Date", tableName: "Questions" },
    {
        key: "transportProviderQuestions",
        columnName: "Transport_Provider_Questions",
        tableName: "Questions",
    },
    {
        key: "customerAnswers",
        columnName: "Customer_Answers",
        tableName: "Questions",
    },
    { key: "writeQuestion", columnName: "", tableName: "Questions" },
    { key: "answerQuestion", columnName: "", tableName: "Questions" },
    // { key: "customerConfirmsCompletion", columnName: "", tableName: "" },
    // { key: "addItem", columnName: "", tableName: "" },

    {
        key: "customerFeedbackNotes",
        columnName: "Customer_Feedback_Notes",
        tableName: "Reviews",
    },
    {
        key: "customerFeedbackScore",
        columnName: "Customer_Feedback_Score",
        tableName: "Reviews",
    },
    { key: "positive", columnName: "Positive", tableName: "Reviews" },
    { key: "neutral", columnName: "Neutral", tableName: "Reviews" },
    { key: "negative", columnName: "Negative", tableName: "Reviews" },
    { key: "reviews", columnName: "Reviews", tableName: "Reviews" },
    { key: "rating", columnName: "Rating", tableName: "Reviews" },
    { key: "itemTitle", columnName: "Item_Title", tableName: "Reviews" },
    { key: "leftBy", columnName: "Left_By", tableName: "Reviews" },
    { key: "comments", columnName: "Comments", tableName: "Reviews" },
    { key: "date", columnName: "Date", tableName: "Reviews" },
    // { key: "customerGivesFeedbackNotes", columnName: "", tableName: "" },
    // { key: "customerGivesFeedbackScore", columnName: "", tableName: "" },
    { key: "seeMyQuotes", columnName: "See_My_Quotes", tableName: "Reviews" },

    { key: "haulierID", columnName: "Haulier_ID", tableName: "Haulier" },
    {
        key: "haulierAddress",
        columnName: "Haulier_Address",
        tableName: "Haulier",
    },
    { key: "haulierName", columnName: "Haulier_Name", tableName: "Haulier" },
    {
        key: "haulierNumberJobs",
        columnName: "Haulier_Number_Jobs",
        tableName: "Haulier",
    },
    {
        key: "haulierTotalCustomerScore",
        columnName: "Total_Customer_Score",
        tableName: "Haulier",
    },
    {
        key: "registeredSince",
        columnName: "Registered_Since",
        tableName: "Haulier",
    },
    {
        key: "numberVehicles",
        columnName: "Number_Vehicles",
        tableName: "Haulier",
    },
    { key: "numberDrivers", columnName: "Number_Drivers", tableName: "Haulier" },
    { key: "verified", columnName: "Verified", tableName: "Haulier" },
    { key: "vehicleType", columnName: "Vehicle_Type", tableName: "Haulier" },
    {
        key: "vehicleCapacity",
        columnName: "Vehicle_Capacity",
        tableName: "Haulier",
    },

    {
        key: "customerServiceContactInformation",
        columnName: "Customer_Service",
        tableName: "Haulier",
    },
    {
        key: "realTimeTracking",
        columnName: "Real_Time Tracking",
        tableName: "Haulier",
    },
    {
        key: "electronicProofOfDelivery",
        columnName: "Real_Time_Tracking",
        tableName: "Haulier",
    },
    {
        key: "automatedAlertsAndNotifications",
        columnName: "Electronic_POD",
        tableName: "Haulier",
    },
    {
        key: "trackingSystem",
        columnName: "Tracking_System",
        tableName: "Haulier",
    },
    {
        key: "deliveryWindow",
        columnName: "Delivery_Window",
        tableName: "Haulier",
    },
    {
        key: "deliveryConfirmation",
        columnName: "Delivery_Confirmation",
        tableName: "Haulier",
    },

    {
        key: "safetyCertifications",
        columnName: "Safety_Certifications",
        tableName: "Compliance",
    },
    {
        key: "environmentalRegulationsCompliance",
        columnName: "Environmental_Regulations",
        tableName: "Compliance",
    },
    {
        key: "hazardousMaterialsHandling",
        columnName: "Hazardous_Materials",
        tableName: "Compliance",
    },
    {
        key: "safetyTrainingPrograms",
        columnName: "Safety_Training",
        tableName: "Compliance",
    },
    {
        key: "accidentReportingProcedures",
        columnName: "Accident_Reporting",
        tableName: "Compliance",
    },
    {
        key: "healthAndSafetyPolicies",
        columnName: "Health_Safety",
        tableName: "Compliance",
    },
    { key: "safetyAudits", columnName: "Safety_Audits", tableName: "Compliance" },
    {
        key: "riskAssessments",
        columnName: "Risk_Assessments",
        tableName: "Compliance",
    },
    {
        key: "incidentManagement",
        columnName: "Incident_Management",
        tableName: "Compliance",
    },
    {
        key: "complianceRecords",
        columnName: "Compliance_Records",
        tableName: "Compliance",
    },
    { key: "permitsAndLicenses", columnName: "Permits", tableName: "Compliance" },
    {
        key: "transportRegulationsCompliance",
        columnName: "Transport_Regulations",
        tableName: "Compliance",
    },

    {
        key: "paymentTerms",
        columnName: "Payment_Terms",
        tableName: "Transport_Payment",
    },
    {
        key: "serviceLevelAgreement",
        columnName: "SLA",
        tableName: "Transport_Payment",
    },
    {
        key: "acceptedPaymentMethods",
        columnName: "Payment_Methods",
        tableName: "Transport_Payment",
    },
    {
        key: "cancellationPolicy",
        columnName: "Cancellation_Policy",
        tableName: "Transport_Payment",
    },
    { key: "currency", columnName: "Currency", tableName: "Transport_Payment" },
    {
        key: "invoiceTime",
        columnName: "Invoice_Time",
        tableName: "Transport_Payment",
    },
    {
        key: "latePaymentFees",
        columnName: "Late_Fees",
        tableName: "Transport_Payment",
    },
    {
        key: "billingContactInformation",
        columnName: "Billing_Contact",
        tableName: "Transport_Payment",
    },
    {
        key: "disputeResolutionTerms",
        columnName: "Dispute_Resolution_Terms",
        tableName: "Transport_Payment",
    },
    {
        key: "liabilityCoverage",
        columnName: "Liability_Coverage",
        tableName: "Transport_Payment",
    },
    {
        key: "insurancePolicy",
        columnName: "Insurance_Policy",
        tableName: "Transport_Payment",
    },
    {
        key: "insuranceCoverage",
        columnName: "Insurance_Coverage",
        tableName: "Transport_Payment",
    },
    {
        key: "insuranceProvider",
        columnName: "Insurance_Provider",
        tableName: "Transport_Payment",
    },
    {
        key: "insuranceClaimProcess",
        columnName: "Claim_Process",
        tableName: "Transport_Payment",
    },

    {
        key: "paymentTerms",
        columnName: "Payment_Terms",
        tableName: "Transport_Payment",
    },
    { key: "currency", columnName: "Currency", tableName: "Transport_Payment" },
    {
        key: "preferredPaymentMethods",
        columnName: "Preferred_Payment",
        tableName: "Transport_Payment",
    },
    {
        key: "invoiceAndReceiptProcedures",
        columnName: "Invoice_Receipt",
        tableName: "Transport_Payment",
    },

    {
        key: "calculatePriceAndPay",
        columnName: "Calculate",
        tableName: "Transportation_Sales",
    },
    {
        key: "priceLabel",
        columnName: "Price_Label",
        tableName: "Transportation_Sales",
    },
    {
        key: "priceDrop",
        columnName: "Price_Drop",
        tableName: "Transportation_Sales",
    },
    {
        key: "currency",
        columnName: "Currency",
        tableName: "Transportation_Sales",
    },
    { key: "vat", columnName: "VAT", tableName: "Transportation_Sales" },
];

export const UNIQUE_TABLE = [
    "Job",
    "Vessel_Details",
    "Contacts",
    "Customer",
    "Quotes",
    "Questions",
    "Reviews",
    "Haulier",
    "Compliance",
    "Transport_Payment",
    "Transportation_Sales"
];