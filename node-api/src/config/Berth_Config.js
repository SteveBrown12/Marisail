export const Berth_Config = {
  schema_name: "Berth",
  main_table: "Marina_Port",
  primary_key: "Berth_ID",
  join_tables: [
    "Accessibility", "Amenities", "Berth", "Berth_Features", "Berth_Payment",
    "Berth_Sales", "Connectivity", "Environment", "Events", "Family", "Financial",
    "Insurance", "Legal", "Local_Area", "Operations", "Pricing", "Repairs", "Safety"
  ],
  config: [
     // ==========================
    // 🔹 Section 1: Site Details
    // ==========================
    {
      table_Name: "Marina_Port",
      section_Heading: "Berth Details",
      columns: {
        berthId: {
          column_Name: "Berth_ID",
          displayText: "Berth ID",
          type: "radio",
          mandatory: true,
          searchable: false,
          radioOptions: null,
        },
        siteDetails: {
          column_Name: "Site_Details",
          displayText: "Site Details",
          type: "radio",
          mandatory: true,
          searchable: true,
          radioOptions: null,
        },
        termsAndConditions: {
          column_Name: "Terms_Conditions",
          displayText: "Terms & Conditions",
          type: "radio",
          mandatory: true,
          searchable: true,
          radioOptions: null,
        },
        type: {
          column_Name: "Type",
          displayText: "Type",
          type: "radio",
          mandatory: true,
          searchable: true,
          radioOptions: null,
        },
        marinaName: {
          column_Name: "Name",
          displayText: "Name",
          type: "radio",
          mandatory: true,
          searchable: true,
          radioOptions: null,
        },
        location: {
          column_Name: "Location",
          displayText: "Location",
          type: "radio",
          mandatory: true,
          searchable: true,
          radioOptions: null,
        },
        ownership: {
          column_Name: "Ownership",
          displayText: "Ownership",
          type: "radio",
          mandatory: true,
          searchable: true,
          radioOptions: null,
        },
        yearEstablished: {
          column_Name: "Year_Established",
          displayText: "Year Established",
          type: "radio",
          mandatory: true,
          searchable: true,
          radioOptions: null,
        },
        operatingHours: {
          column_Name: "Operating_Hours",
          displayText: "Operating Hours",
          type: "radio",
          mandatory: true,
          searchable: true,
          radioOptions: null,
        },
        contactDetails: {
          column_Name: "Contact",
          displayText: "Contact",
          type: "radio",
          mandatory: true,
          searchable: true,
          radioOptions: null,
        },
        seasonalOperation: {
          column_Name: "Seasonal_Operation",
          displayText: "Seasonal Operation",
          type: "radio",
          mandatory: true,
          searchable: true,
          radioOptions: null,
        },
        languageServices: {
          column_Name: "Language",
          displayText: "Language",
          type: "radio",
          mandatory: true,
          searchable: true,
          radioOptions: null,
        },
      },
    },

    // ==============================
    // 🔹 Section 2: General Info
    // ==============================
    {
      table_Name: "Berth",
      section_Heading: "General Information",
      columns: {
        dockTypes: {
          column_Name: "Dock_Types",
          displayText: "Dock Types",
          type: "radio",
          mandatory: true,
          searchable: true,
          radioOptions: null,
        },
        numberOfDocks: {
          column_Name: "Number_Docks",
          displayText: "Number of Docks",
          type: "radio",
          mandatory: true,
          searchable: true,
          radioOptions: null,
        },
        boatSlipSizes: {
          column_Name: "Slip_Sizes",
          displayText: "Boat Slip Sizes",
          type: "radio",
          mandatory: true,
          searchable: true,
          radioOptions: null,
        },
        numberOfBerthsAvailable: {
          column_Name: "Berths_Available",
          displayText: "Berths Available",
          type: "radio",
          mandatory: true,
          searchable: true,
          radioOptions: null,
        },
        length: {
          column_Name: "Length",
          displayText: "Length",
          type: "dual",
          mandatory: true,
          searchable: true,
          radioOptions: [
            { label: "ft", value: "ft", id: 1 },
            { label: "mtrs", value: "mtrs", id: 2 },
          ],
        },
        beam: {
          column_Name: "Beam",
          displayText: "Beam",
          type: "dual",
          mandatory: true,
          searchable: true,
          radioOptions: [
            { label: "ft", value: "ft", id: 1 },
            { label: "mtrs", value: "mtrs", id: 2 },
          ],
        },
        draft: {
          column_Name: "Draft",
          displayText: "Draft",
          type: "dual",
          mandatory: true,
          searchable: true,
          radioOptions: [
            { label: "ft", value: "ft", id: 1 },
            { label: "mtrs", value: "mtrs", id: 2 },
          ],
        },
        slipWidth: {
          column_Name: "Slip_Width",
          displayText: "Slip Width",
          type: "dual",
          mandatory: true,
          searchable: true,
          radioOptions: [
            { label: "ft", value: "ft", id: 1 },
            { label: "mtrs", value: "mtrs", id: 2 },
          ],
        },
        slipDepth: {
          column_Name: "Slip_Depth",
          displayText: "Slip Depth",
          type: "dual",
          mandatory: true,
          searchable: true,
          radioOptions: [
            { label: "ft", value: "ft", id: 1 },
            { label: "mtrs", value: "mtrs", id: 2 },
          ],
        },
        slipLength: {
          column_Name: "Slip_Length",
          displayText: "Slip Length",
          type: "dual",
          mandatory: true,
          searchable: true,
          radioOptions: [
            { label: "ft", value: "ft", id: 1 },
            { label: "mtrs", value: "mtrs", id: 2 },
          ],
        },
        mooringType: {
          column_Name: "Mooring_Type",
          displayText: "Mooring Type",
          type: "radio",
          mandatory: true,
          searchable: true,
          radioOptions: null,
        },
        tideRange: {
          column_Name: "Tide_Range",
          displayText: "Tide Range",
          type: "radio",
          mandatory: true,
          searchable: true,
          radioOptions: null,
        },
      },
    },
    {
      table_Name: "Marina_Port",
      section_Heading: "Berth Details",
      columns: {
        berthId: { column_Name: "Berth_ID", displayText: "Berth ID", type: "radio", mandatory: true, searchable: false, radioOptions: null },
        siteDetails: { column_Name: "Site_Details", displayText: "Site Details", type: "radio", mandatory: true, searchable: true, radioOptions: null },
        termsAndConditions: { column_Name: "Terms_Conditions", displayText: "Terms & Conditions", type: "radio", mandatory: true, searchable: true, radioOptions: null },
        type: { column_Name: "Type", displayText: "Type", type: "radio", mandatory: true, searchable: true, radioOptions: null },
        marinaName: { column_Name: "Name", displayText: "Name", type: "radio", mandatory: true, searchable: true, radioOptions: null },
        location: { column_Name: "Location", displayText: "Location", type: "radio", mandatory: true, searchable: true, radioOptions: null },
        ownership: { column_Name: "Ownership", displayText: "Ownership", type: "radio", mandatory: true, searchable: true, radioOptions: null },
        yearEstablished: { column_Name: "Year_Established", displayText: "Year Established", type: "radio", mandatory: true, searchable: true, radioOptions: null },
        operatingHours: { column_Name: "Operating_Hours", displayText: "Operating Hours", type: "radio", mandatory: true, searchable: true, radioOptions: null },
        contactDetails: { column_Name: "Contact", displayText: "Contact", type: "radio", mandatory: true, searchable: true, radioOptions: null },
        seasonalOperation: { column_Name: "Seasonal_Operation", displayText: "Seasonal Operation", type: "radio", mandatory: true, searchable: true, radioOptions: null },
        languageServices: { column_Name: "Language", displayText: "Language", type: "radio", mandatory: true, searchable: true, radioOptions: null }
      }
    },
    {
      table_Name: "Berth",
      section_Heading: "General Information",
      columns: {
        dockTypes: { column_Name: "Dock_Types", displayText: "Dock Types", type: "radio", mandatory: true, searchable: true, radioOptions: null },
        numberOfDocks: { column_Name: "Number_Docks", displayText: "Number of Docks", type: "radio", mandatory: true, searchable: true, radioOptions: null },
        boatSlipSizes: { column_Name: "Slip_Sizes", displayText: "Boat Slip Sizes", type: "radio", mandatory: true, searchable: true, radioOptions: null },
        numberOfBerthsAvailable: { column_Name: "Berths_Available", displayText: "Berths Available", type: "radio", mandatory: true, searchable: true, radioOptions: null },
        length: { column_Name: "Length", displayText: "Length", type: "dual", mandatory: true, searchable: true, radioOptions: [ { label: "ft", value: "ft", id: 1 }, { label: "mtrs", value: "mtrs", id: 2 } ] },
        beam: { column_Name: "Beam", displayText: "Beam", type: "dual", mandatory: true, searchable: true, radioOptions: [ { label: "ft", value: "ft", id: 1 }, { label: "mtrs", value: "mtrs", id: 2 } ] },
        draft: { column_Name: "Draft", displayText: "Draft", type: "dual", mandatory: true, searchable: true, radioOptions: [ { label: "ft", value: "ft", id: 1 }, { label: "mtrs", value: "mtrs", id: 2 } ] },
        slipWidth: { column_Name: "Slip_Width", displayText: "Slip Width", type: "dual", mandatory: true, searchable: true, radioOptions: [ { label: "ft", value: "ft", id: 1 }, { label: "mtrs", value: "mtrs", id: 2 } ] },
        slipDepth: { column_Name: "Slip_Depth", displayText: "Slip Depth", type: "dual", mandatory: true, searchable: true, radioOptions: [ { label: "ft", value: "ft", id: 1 }, { label: "mtrs", value: "mtrs", id: 2 } ] },
        slipLength: { column_Name: "Slip_Length", displayText: "Slip Length", type: "dual", mandatory: true, searchable: true, radioOptions: [ { label: "ft", value: "ft", id: 1 }, { label: "mtrs", value: "mtrs", id: 2 } ] },
        mooringType: { column_Name: "Mooring_Type", displayText: "Mooring Type", type: "radio", mandatory: true, searchable: true, radioOptions: null },
        tideRange: { column_Name: "Tide_Range", displayText: "Tide Range", type: "radio", mandatory: true, searchable: true, radioOptions: null }
      }
    }
  ]
};


