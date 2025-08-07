export const varToScreen = {
  // Job Description
  jobDescription: {
    type: "text",
    displayText: "Job Description",
    radioOptions: null,
  },
  marisailTransportID: {
    type: "text",
    displayText: "Marisail Transport ID",
    radioOptions: null,
  },
  dataSource: {
    type: "select",
    displayText: "Data Source",
    radioOptions: null,
  },
  category: { type: "select", displayText: "Category", radioOptions: null },
  title: { type: "text", displayText: "Title", radioOptions: null },
  description: {
    type: "textarea",
    displayText: "Description",
    radioOptions: null,
  },
  postedDate: { type: "date", displayText: "Posted Date", radioOptions: null },
  deadlineDate: {
    type: "date",
    displayText: "Deadline Date",
    radioOptions: null,
  },
  timescale: { type: "text", displayText: "Timescale", radioOptions: null },
  preferredDate: {
    type: "date",
    displayText: "Preferred Date",
    radioOptions: null,
  },
  haulierToDepartureDistance: {
    type: "number",
    displayText: "Haulier To Departure Distance",
    radioOptions: null,
  },
  departureToDestinationDistance: {
    type: "number",
    displayText: "Departure To Destination Distance",
    radioOptions: null,
  },
  returnJourney: {
    type: "radio",
    displayText: "Return Journey",
    radioOptions: ["Yes", "No"],
  },
  roundTripDistance: {
    type: "number",
    displayText: "Round Trip Distance",
    radioOptions: null,
  },
  international: {
    type: "radio",
    displayText: "International",
    radioOptions: ["Yes", "No"],
  },
  ferryRequired: {
    type: "radio",
    displayText: "Ferry Required?",
    radioOptions: ["Yes", "No"],
  },
  specialHandlingRequirements: {
    type: "text",
    displayText: "Special Handling Requirements",
    radioOptions: null,
  },
  departureLoadingEquipmentNeeded: {
    type: "radio",
    displayText: "Departure Loading Equipment Needed?",
    radioOptions: ["Yes", "No"],
  },
  destinationUnloadingEquipmentNeeded: {
    type: "radio",
    displayText: "Destination Unloading Equipment Needed",
    radioOptions: ["Yes", "No"],
  },
  freightClass: {
    type: "select",
    displayText: "Freight Class",
    radioOptions: null,
  },
  overweightPermitNeeded: {
    type: "radio",
    displayText: "Overweight Permit Needed?",
    radioOptions: ["Yes", "No"],
  },
  oversizePermitNeeded: {
    type: "radio",
    displayText: "Oversize Permit Needed?",
    radioOptions: ["Yes", "No"],
  },
  numberQuotes: {
    type: "number",
    displayText: "Number Quotes",
    radioOptions: null,
  },
  map: { type: "map", displayText: "Map", radioOptions: null },
  jobDone: {
    type: "radio",
    displayText: "Job Done",
    radioOptions: ["Yes", "No"],
  },
  jobDoneDate: {
    type: "date",
    displayText: "Job Done Date",
    radioOptions: null,
  },

  // Vessel Details
  vesselDetails: {
    type: "section",
    displayText: "Vessel Details",
    radioOptions: null,
  },
  itemNumber: {
    type: "number",
    displayText: "Item Number",
    radioOptions: null,
  },
  totalNumberItems: {
    type: "number",
    displayText: "Total Number Items",
    radioOptions: null,
  },
  photos: { type: "file", displayText: "Photos", radioOptions: null },
  previousInsuranceClaims: {
    type: "radio",
    displayText: "Previous Insurance Claims",
    radioOptions: ["Yes", "No"],
  },
  existingDamage: {
    type: "radio",
    displayText: "Existing Damage?",
    radioOptions: ["Yes", "No"],
  },
  damageDescription: {
    type: "textarea",
    displayText: "Damage Description",
    radioOptions: null,
  },
  vesselInsuranceType: {
    type: "select",
    displayText: "Vessel Insurance Type",
    radioOptions: null,
  },
  vesselInsuranceNotes: {
    type: "textarea",
    displayText: "Vessel Insurance Notes",
    radioOptions: null,
  },

  // Customer Contact Details
  customerContactDetails: {
    type: "section",
    displayText: "Customer Contact Details",
    radioOptions: null,
  },
  customerType: {
    type: "select",
    displayText: "Customer Type",
    radioOptions: null,
  },
  customerID: { type: "text", displayText: "Customer ID", radioOptions: null },
  customerName: {
    type: "text",
    displayText: "Customer Name",
    radioOptions: null,
  },
  customerCompanyName: {
    type: "text",
    displayText: "Customer Company Name",
    radioOptions: null,
  },
  collectionNamedContact: {
    type: "text",
    displayText: "Collection (Departure) Named Contact",
    radioOptions: null,
  },
  collectionMobile: {
    type: "text",
    displayText: "Collection (Departure) Mobile",
    radioOptions: null,
  },
  deliveryNamedContact: {
    type: "text",
    displayText: "Delivery (Destination) Named Contact",
    radioOptions: null,
  },
  collectionAddress: {
    type: "textarea",
    displayText: "Collection (Departure) Address",
    radioOptions: null,
  },
  deliveryMobile: {
    type: "text",
    displayText: "Delivery (Destination) Mobile",
    radioOptions: null,
  },
  deliveryAddress: {
    type: "textarea",
    displayText: "Delivery (Destination) Address",
    radioOptions: null,
  },
  emergencyContactInformation: {
    type: "text",
    displayText: "Emergency Contact Information",
    radioOptions: null,
  },
  preferredCommunicationMethod: {
    type: "select",
    displayText: "Preferred Communication Method",
    radioOptions: null,
  },

  // Payment & Insurance
  paymentInsurance: {
    type: "section",
    displayText: "Payment & Insurance",
    radioOptions: null,
  },
  paymentTerms: {
    type: "select",
    displayText: "Payment Terms",
    radioOptions: null,
  },
  serviceLevelAgreement: {
    type: "textarea",
    displayText: "Service Level Agreement (SLA)",
    radioOptions: null,
  },
  acceptedPaymentMethods: {
    type: "select",
    displayText: "Accepted Payment Methods",
    radioOptions: null,
  },
  cancellationPolicy: {
    type: "textarea",
    displayText: "Cancellation Policy",
    radioOptions: null,
  },
  currency: { type: "select", displayText: "Currency", radioOptions: null },
  invoiceTime: {
    type: "text",
    displayText: "Invoice Time",
    radioOptions: null,
  },
  latePaymentFees: {
    type: "text",
    displayText: "Late Payment Fees",
    radioOptions: null,
  },
  billingContactInformation: {
    type: "text",
    displayText: "Billing Contact Information",
    radioOptions: null,
  },
  disputeResolutionTerms: {
    type: "textarea",
    displayText: "Dispute Resolution Terms",
    radioOptions: null,
  },
  liabilityCoverage: {
    type: "text",
    displayText: "Liability Coverage",
    radioOptions: null,
  },
  insurancePolicy: {
    type: "text",
    displayText: "Insurance Policy",
    radioOptions: null,
  },
  insuranceCoverage: {
    type: "text",
    displayText: "Insurance Coverage",
    radioOptions: null,
  },
  insuranceProvider: {
    type: "text",
    displayText: "Insurance Provider",
    radioOptions: null,
  },
  insuranceClaimProcess: {
    type: "textarea",
    displayText: "Insurance Claim Process",
    radioOptions: null,
  },
};

export const varToDb = {
  // Job Description
  marisailTransportID: "Transport_Item_ID",
  dataSource: "Data_Source",
  category: "Category",
  title: "Title",
  description: "Description",
  postedDate: "Posted_Date",
  deadlineDate: "Deadline_Date",
  timescale: "Timescale",
  preferredDate: "Preferred_Date",
  haulierToDepartureDistance: "Collection_Delivery_Distance",
  departureToDestinationDistance: "Departure_Destination",
  returnJourney: "Return_Journey",
  roundTripDistance: "Round_Trip_Distance",
  international: "International",
  ferryRequired: "Ferry_Required?",
  specialHandlingRequirements: "Special_Handling",
  departureLoadingEquipmentNeeded: "Loading_Equipment",
  destinationUnloadingEquipmentNeeded: "Unloading_Equipment",
  freightClass: "Freight_Class",
  overweightPermitNeeded: "Overweight_Permit",
  oversizePermitNeeded: "Oversize_Permit",
  numberQuotes: "Number_Quotes",
  map: "Map",
  jobDone: "Job_Done",
  jobDoneDate: "Job_Done_Date",

  // Vessel Details
  itemNumber: "Item_Number",
  totalNumberItems: "Total_Number_Items",
  photos: "Photos",
  previousInsuranceClaims: "Insurance_Claims",
  existingDamage: "Existing_Damage",
  damageDescription: "Damage_Description",
  vesselInsuranceType: "Vessel_Insurance_Type",
  vesselInsuranceNotes: "Vessel_Insurance_Notes",

  // Customer Contact Details
  customerType: "Customer_Type",
  customerID: "Customer_ID",
  customerName: "Customer_Name",
  customerCompanyName: "Customer_Company_Name",
  collectionNamedContact: "Collection_Contact",
  collectionMobile: "Collection_Mobile",
  deliveryNamedContact: "Delivery_Contact",
  collectionAddress: "Collection_Address",
  deliveryMobile: "Delivery_Mobile",
  deliveryAddress: "Delivery_Address",
  emergencyContactInformation: "Emergency_Contacts",
  preferredCommunicationMethod: "Preferred_Communication",

  // Transport Quotes
  quote: "Quote_Value",
  quoteDescription: "Quote_Description",
  quoteDate: "Quote_Date",
  declineDate: "Decline_Date",
  withdrawDate: "Withdraw_Date",
  quoteStatus: "Quote_Status",

  // Q&A
  questionDate: "Question_Date",
  answerDate: "Answer_Date",
  transportProviderQuestions: "Transport_Provider_Questions",
  customerAnswers: "Customer_Answers",

  // Feedback
  customerFeedbackNotes: "Customer_Feedback_Notes",
  customerFeedbackScore: "Customer_Feedback_Score",
  positive: "Positive",
  neutral: "Neutral",
  negative: "Negative",
  reviews: "Reviews",
  rating: "Rating",
  itemTitle: "Item_Title",
  leftBy: "Left_By",
  comments: "Comments",
  date: "Date",
  seeMyQuotes: "See_My_Quotes",

  // Haulier Details
  haulierID: "Haulier_ID",
  haulierAddress: "Haulier_Address",
  haulierName: "Haulier_Name",
  haulierNumberJobs: "Haulier_Number_Jobs",
  haulierTotalCustomerScore: "Haulier_Total_Customer_Score",
  registeredSince: "Registered_Since",
  numberVehicles: "Number_Vehicles",
  numberDrivers: "Number_Drivers",
  verified: "Verified",
  vehicleType: "Vehicle_Type",
  vehicleCapacity: "Vehicle_Capacity",

  // Haulier Communications
  customerServiceContactInformation: "Customer_Service",
  realTimeTracking: "Real_Time_Tracking",
  electronicProofOfDelivery: "Electronic_POD",
  automatedAlertsNotifications: "Automated_Alerts",
  trackingSystem: "Tracking_System",
  deliveryWindow: "Delivery_Window",
  deliveryConfirmation: "Delivery_Confirmation",

  // Haulier Safety & Compliance
  safetyCertifications: "Safety_Certifications",
  environmentalRegulationsCompliance: "Environmental_Regulations",
  hazardousMaterialsHandling: "Hazardous_Materials",
  safetyTrainingPrograms: "Safety_Training",
  accidentReportingProcedures: "Accident_Reporting",
  healthSafetyPolicies: "Health_Safety",
  safetyAudits: "Safety_Audits",
  riskAssessments: "Risk_Assessments",
  incidentManagement: "Incident_Management",
  complianceRecords: "Compliance_Records",
  permitsLicenses: "Permits",
  transportRegulationsCompliance: "Transport_Regulations",

  // Payment & Insurance
  paymentTerms: "Payment_Terms",
  serviceLevelAgreement: "SLA",
  acceptedPaymentMethods: "Payment_Methods",
  cancellationPolicy: "Cancellation_Policy",
  currency: "Currency",
  invoiceTime: "Invoice_Time",
  latePaymentFees: "Late_Fees",
  billingContactInformation: "Billing_Contact",
  disputeResolutionTerms: "Dispute_Resolution",
  liabilityCoverage: "Liability_Coverage",
  insurancePolicy: "Insurance_Policy",
  insuranceCoverage: "Insurance_Coverage",
  insuranceProvider: "Insurance_Provider",
  insuranceClaimProcess: "Claim_Process",

  // Payment Terms
  // paymentTerms: "Payment_Terms",
  // currency: "Currency",
  preferredPaymentMethods: "Preferred_Payment",
  invoiceReceiptProcedures: "Invoice_Receipt",

  // Calculate Price & Pay
  calculatePricePay: "Calculate",
  priceLabel: "Price_Label",
  priceDrop: "Price_Drop",
  // currency: "Currency",
  vat: "VAT",
};
