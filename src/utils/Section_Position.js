// BERTH Sections
const Berth_Section_Position = [
  { table_Name: "Berth_Details", columns: 12, position: 1 },
  { table_Name: "Berth", columns: 13, position: 2 },
  { table_Name: "Amenities", columns: 9, position: 3 },
  { table_Name: "Family", columns: 13, position: 4 },
  { table_Name: "Local_Area", columns: 9, position: 5 },
  { table_Name: "Berth_Features", columns: 7, position: 6 },
  { table_Name: "Events", columns: 14, position: 7 },
  { table_Name: "Operations", columns: 9, position: 8 },
  { table_Name: "Repairs", columns: 7, position: 9 },
  { table_Name: "Accessibility", columns: 10, position: 10 },
  { table_Name: "Connectivity", columns: 11, position: 11 },
  { table_Name: "Environment", columns: 18, position: 12 },
  { table_Name: "Safety", columns: 32, position: 13 },
  { table_Name: "Legal", columns: 7, position: 14 },
  { table_Name: "Insurance", columns: 9, position: 15 },
  { table_Name: "Financial", columns: 9, position: 16 },
  { table_Name: "Pricing", columns: 5, position: 17 },
  { table_Name: "Berth_Payment", columns: 5, position: 18 },
  { table_Name: "Berth_Sales", columns: 4, position: 19 }
];


// TRAILER Sections
const Trailer_Section_Position = [
  { table_Name: "Trailer_ID", columns: 13, position: 1 },
  { table_Name: "Construction", columns: 19, position: 2 },
  { table_Name: "Trailer_Features", columns: 16, position: 3 },
  { table_Name: "Axles", columns: 10, position: 4 },
  { table_Name: "Tyres_Brakes", columns: 19, position: 5 },
  { table_Name: "Winches_Lighting", columns: 11, position: 6 },
  { table_Name: "Winches_Lighting", columns: 7, position: 7 },
  { table_Name: "Accessories", columns: 8, position: 8 },
  { table_Name: "Loading_Transport_Features", columns: 9, position: 9 },
  { table_Name: "Security_Features", columns: 4, position: 10 },
  { table_Name: "Corrosion_Resistance", columns: 2, position: 11 },
  { table_Name: "Performance_Handling", columns: 2, position: 12 },
  { table_Name: "Documentation", columns: 2, position: 13 },
  { table_Name: "Regulatory", columns: 4, position: 14 },
  { table_Name: "Tongue", columns: 6, position: 15 },
  { table_Name: "Trailer_Payment", columns: 4, position: 16 },
  { table_Name: "Trailer_Sales", columns: 4, position: 17 }
];


// CHARTER Sections
const Charter_Section_Position = [
  { table_Name: "Accomodation", columns: 9, position: 1 },
  { table_Name: "Charter_Location", columns: 9, position: 2 },
  { table_Name: "Requirements", columns: 7, position: 3 },
  { table_Name: "Policy", columns: 9, position: 4 },
  { table_Name: "Charter_Safety", columns: 8, position: 5 },
  { table_Name: "Charter_Costs", columns: 15, position: 6 },
  { table_Name: "Charter_Date", columns: 7, position: 7 },
  { table_Name: "Charter_Payment", columns: 4, position: 8 },
  { table_Name: "Sales", columns: 4, position: 9 }
];


// TRANSPORT Sections
const Transport_Section_Position = [
  { table_Name: "Job", columns: 23, position: 1 },
  { table_Name: "Vessel_Details", columns: 8, position: 2 },
  { table_Name: "Transportation_Contacts", columns: 13, position: 3 },
  { table_Name: "Transportation_Quotes", columns: 7, position: 4 },
  { table_Name: "Questions", columns: 5, position: 5 },
  { table_Name: "Reviews", columns: 11, position: 6 },
  { table_Name: "Haulier", columns: 18, position: 7 },
  { table_Name: "Compliance", columns: 13, position: 8 },
  { table_Name: "Transportation_Payment", columns: 15, position: 9 },
  { table_Name: "Transportation_Sales", columns: 4, position: 10 }
];

export const Section_Positions = {
  berth: Berth_Section_Position,
  trailer: Trailer_Section_Position,
  charter: Charter_Section_Position,
  transport: Transport_Section_Position,
};