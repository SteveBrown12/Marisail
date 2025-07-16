export const Charter_Config = {
  schema_name: "Charter",
  main_table: "Accomodation",
  primary_key: "Charter_ID",
  join_tables: [
    "Charter_Costs", "Charter_Date", "Charter_Food", "Charter_Insurance", "Charter_Location",
    "Charter_Payment", "Charter_Policy", "Charter_Requirements", "Charter_Safety",
    "Costs", "Crew", "Charter_Dates", "Food", "Policy", "Requirements", "Sales"
  ],
  config: [
    {
      table_Name: "Accomodation",
      section_Heading: "General Information",
      columns: {
        vesselID: { columnName: "Vessel_ID", displayText: "Vessel ID", type: "radio", mandatory: true, searchable: true },
        charterID: { columnName: "Charter_ID", displayText: "Charter ID", type: "radio", mandatory: true, searchable: true },
        guestCapacity: { columnName: "Guest_Capacity", displayText: "Guest Capacity", type: "radio", mandatory: true, searchable: true },
        bedroomConfiguration: { columnName: "Bedroom_Configuration", displayText: "Bedroom Configuration", type: "radio", mandatory: true, searchable: true },
        bathroomConfiguration: { columnName: "Bathroom_Configuration", displayText: "Bathroom Configuration", type: "radio", mandatory: true, searchable: false },
        crewAccommodations: { columnName: "Crew_Accommodation", displayText: "Crew Accommodation", type: "radio", mandatory: true, searchable: true },
        accessibilityInformation: { columnName: "Accessibility_Information", displayText: "Accessibility Information", type: "radio", mandatory: true, searchable: true },
        cleaningAndMaintenanceProcedures: { columnName: "Maintenance_Procedures", displayText: "Maintenance Procedures", type: "radio", mandatory: true, searchable: true },
        vesselDecorAndSetupRequests: { columnName: "Yacht_Decor", displayText: "Vessel Decor", type: "radio", mandatory: true, searchable: false },
      }
    },
    {
      table_Name: "Charter_Location",
      section_Heading: "Charter Logistics",
      columns: {
        boardingPortArrivalTime: { columnName: "Arrival_Time", displayText: "Boarding Arrival Time", type: "timestamp", mandatory: true, searchable: false },
        boardingPortDepartureTime: { columnName: "Departure_Time", displayText: "Boarding Departure Time", type: "timestamp", mandatory: true, searchable: false },
        summerCruisingAreas: { columnName: "Summer_Cruising_Area", displayText: "Summer Cruising Areas", type: "radio", mandatory: true, searchable: true },
        boardingPort: { columnName: "Boarding_Port", displayText: "Boarding Port", type: "radio", mandatory: true, searchable: true },
        winterCruisingAreas: { columnName: "Winter_Cruising_Area", displayText: "Winter Cruising Areas", type: "radio", mandatory: true, searchable: true },
        disembarkationPort: { columnName: "Disembarkation_Port", displayText: "Disembarkation Port", type: "radio", mandatory: true, searchable: true },
        embarkationAndDisembarkationLogistics: { columnName: "Logistics", displayText: "Embarkation & Disembarkation", type: "radio", mandatory: true, searchable: false },
        disembarkationPortArrivalTime: { columnName: "Disembarkation_Arrival_Time", displayText: "Disembarkation Arrival Time", type: "timestamp", mandatory: true, searchable: false },
        dockingAndMooringInstructions: { columnName: "Mooring_Instructions", displayText: "Mooring Instructions", type: "radio", mandatory: true, searchable: true },
      }
    },
    {
      table_Name: "Requirements",
      section_Heading: "Customer Requirements",
      columns: {
        skipperIncluded: { columnName: "Captain_Included", displayText: "Captain Included?", type: "radio", mandatory: true, searchable: true, radioOptions: ["Yes", "No"] },
        crewIncluded: { columnName: "Crew_Included", displayText: "Crew Included?", type: "radio", mandatory: true, searchable: true, radioOptions: ["Yes", "No"] },
        crewUniformPreferences: { columnName: "Crew_Uniform", displayText: "Crew Uniform Preferences", type: "radio", mandatory: true, searchable: true },
        localCuisinePreferences: { columnName: "Cuisine_Preferences", displayText: "Cuisine Preferences", type: "radio", mandatory: true, searchable: true },
        cateringRequired: { columnName: "Catering_Required", displayText: "Catering Required?", type: "radio", mandatory: true, searchable: true, radioOptions: ["Yes", "No"] },
        carParkingAvailable: { columnName: "Car_Parking", displayText: "Car Parking Available?", type: "radio", mandatory: true, searchable: true, radioOptions: ["Yes", "No"] },
        specialRequirementsRequests: { columnName: "Special_Requirements", displayText: "Special Requirements", type: "radio", mandatory: true, searchable: false },
      }
    },
    {
      table_Name: "Policy",
      section_Heading: "Policy Information",
      columns: {
        smokingPolicy: { columnName: "Smoking_Policy", displayText: "Smoking Policy", type: "radio", mandatory: true, searchable: true },
        petFriendlyPolicy: { columnName: "Pet_Policy", displayText: "Pet Policy", type: "radio", mandatory: true, searchable: true },
        localRegulationsAndRestrictions: { columnName: "Local_Regulations", displayText: "Local Regulations", type: "radio", mandatory: true, searchable: true },
        charterAgreementTermsAndConditions: { columnName: "Charter_TCs", displayText: "Charter T&Cs", type: "radio", mandatory: true, searchable: true },
        environmentalPolicies: { columnName: "Environmental_Policies", displayText: "Environmental Policies", type: "radio", mandatory: true, searchable: true },
        waterConservationMeasures: { columnName: "Water_Conservation", displayText: "Water Conservation Measures", type: "radio", mandatory: true, searchable: true },
        wasteManagementProtocols: { columnName: "Waste_Management", displayText: "Waste Management Protocols", type: "radio", mandatory: true, searchable: true },
        alcoholPolicy: { columnName: "Alcohol", displayText: "Alcohol Policy", type: "radio", mandatory: true, searchable: true },
        photographyPolicy: { columnName: "Photography_Policies", displayText: "Photography Policies", type: "radio", mandatory: true, searchable: true },
      }
    },
    {
      table_Name: "Charter_Safety",
      section_Heading: "Safety & Security",
      columns: {
        weatherContingencyPlans: { columnName: "Weather_Contingency", displayText: "Weather Contingency Plans", type: "radio", mandatory: true, searchable: true },
        emergencyProcedures: { columnName: "Emergency_Procedures", displayText: "Emergency Procedures", type: "radio", mandatory: true, searchable: true },
        medicalFacilitiesOnboard: { columnName: "Medical_Facilities", displayText: "Medical Facilities Onboard", type: "radio", mandatory: true, searchable: true },
        emergencyContacts: { columnName: "Emergency_Contacts", displayText: "Emergency Contacts", type: "radio", mandatory: true, searchable: false },
        weatherForecastServices: { columnName: "Weather_Forecast", displayText: "Weather Forecast Services", type: "radio", mandatory: true, searchable: true },
        securityMeasures: { columnName: "Security_Measures", displayText: "Security Measures", type: "radio", mandatory: true, searchable: true },
        guestOrientationAndSafetyBriefing: { columnName: "Safety_Briefing", displayText: "Guest Safety Briefing", type: "radio", mandatory: true, searchable: true },
      }
    },
    {
      table_Name: "Charter_Costs",
      section_Heading: "Cost Details",
      columns: {
        summerRatePerWeek: { columnName: "Summerrate_Per_Week", displayText: "Summer Rate Per Week", type: "radio", mandatory: true, searchable: true },
        summerRatePerNight: { columnName: "Summerrate_Per_Night", displayText: "Summer Rate Per Night", type: "radio", mandatory: true, searchable: true },
        winterRatePerWeek: { columnName: "Winterrate_Per_week", displayText: "Winter Rate Per week", type: "radio", mandatory: true, searchable: true },
        winterRatePerNight: { columnName: "Winterrate_Per_Night", displayText: "Winter Rate Per Night", type: "radio", mandatory: true, searchable: true },
        securityDepositAmount: { columnName: "Deposit_Amount", displayText: "Deposit Amount", type: "radio", mandatory: true, searchable: true },
        totalPrice: { columnName: "Total_Price", displayText: "Total Price", type: "radio", mandatory: true, searchable: true },
        refundableDeposit: { columnName: "Refundable_Deposit", displayText: "Refundable Deposit?", type: "radio", mandatory: true, searchable: true, radioOptions: ["Yes", "No"] },
        additionalFuelCosts: { columnName: "Additional_Fuel", displayText: "Additional Fuel Costs?", type: "radio", mandatory: true, searchable: false, radioOptions: ["Yes", "No"] },
        additionalFees: { columnName: "Additional_Fees", displayText: "Additional Fees", type: "radio", mandatory: true, searchable: false },
        fuelIncluded: { columnName: "Fuel_Included", displayText: "Fuel Included?", type: "radio", mandatory: true, searchable: true, radioOptions: ["Yes", "No"] },
        lateCheckInCheckOutFees: { columnName: "Late_Fees", displayText: "Late Fees", type: "radio", mandatory: true, searchable: true },
        insuranceForGuestsPersonalBelongings: { columnName: "Guest_Insurance", displayText: "Guest Insurance Available", type: "radio", mandatory: true, searchable: true },
        insuranceCoverageDetails: { columnName: "Insurance_Coverage", displayText: "Insurance Coverage", type: "radio", mandatory: true, searchable: true },
      }
    },
    {
      table_Name: "Charter_Dates",
      section_Heading: "Charter Dates",
      columns: {
        minimumNightsPolicy: { columnName: "Minimum_Nights", displayText: "Minimum Nights Policy", type: "radio", mandatory: true, searchable: true },
        datesAvailable: { columnName: "Dates_Available", displayText: "Dates Available", type: "date", mandatory: true, searchable: true },
        cancellationPolicy: { columnName: "Cancellation_Policy", displayText: "Cancellation Policy", type: "radio", mandatory: true, searchable: false },
        startDate: { columnName: "Start_Date", displayText: "Start Date", type: "date", mandatory: true, searchable: true },
        endDate: { columnName: "End_Date", displayText: "End Date", type: "date", mandatory: true, searchable: true },
        numberNights: { columnName: "Number_Nights", displayText: "Number Nights", type: "radio", mandatory: true, searchable: true },
      }
    },
    {
      table_Name: "Charter_Payment",
      section_Heading: "Payment Information",
      columns: {
        paymentTerms: { columnName: "Payment_Terms", displayText: "Payment Terms", type: "radio", mandatory: true, searchable: false },
        paymentCurrency: { columnName: "Currency", displayText: "Payment Currency", type: "radio", mandatory: true, searchable: false },
        preferredPaymentMethods: { columnName: "Preferred_Payment", displayText: "Preferred Payment Method", type: "radio", mandatory: true, searchable: false },
        invoiceReceiptProcedures: { columnName: "Invoice_Receipt", displayText: "Invoice Receipting Procedures", type: "radio", mandatory: true, searchable: false },
      }
    },
    {
      table_Name: "Sales",
      section_Heading: "Sales Information",
      columns: {
        priceLabel: { columnName: "Price_Label", displayText: "Price Label", type: "radio", mandatory: true, searchable: true },
        priceDrop: { columnName: "Price_Drop", displayText: "Price Drop", type: "radio", mandatory: true, searchable: true },
        salesCurrency: { columnName: "Currency", displayText: "Currency", type: "radio", mandatory: true, searchable: false },
        vat: { columnName: "VAT", displayText: "VAT", type: "radio", mandatory: false, searchable: false },
      }
    }
  ]
};
