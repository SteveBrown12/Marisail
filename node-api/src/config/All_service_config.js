export const dual_Range = {
    feet_metres: [
        { label: "ft", value: "ft", id: "feet" },
        { label: "mtrs", value: "mtrs", id: "metres" },
    ],
    cm_mm: [
        { label: "cm", value: "cm", id: "centimetre" },
        { label: "mm", value: "mm", id: "millimetre" },
    ],
    cubic_ft_mtr: [
        { label: "Cubit ft", value: "Cubic ft", id: "cubicft" },
        { label: "Cubic mtr", value: "Cubic mtr", id: "cubicmtr" },
    ],
    gallon_per_min: [ // Corrected key to be a valid identifier
        { label: "Gallons /min", value: "Gallons / min", id: "gallons_per_min" }, // Corrected id
        { label: "Ltrs / min", value: "Ltrs / min", id: "ltrs_per_min" }, // Corrected id
    ],
    hp_kw: [
        { label: "Hp", value: "Hp", id: "hp" },
        { label: "Kw", value: "Kw", id: "kw" },
    ],
    ton_lbs_kg: [
        { label: "Ton", value: "Ton", id: "ton" },
        { label: "lbs", value: "lbs", id: "lbs" },
        { label: "Kgs", value: "Kgs", id: "kgs" },
    ],
    ltr_gallon: [
        { label: "Ltrs", value: "Ltrs", id: "ltrs" },
        { label: "Gallons", value: "Gallons", id: "gallons" },
    ],
    flow_and_efficiency: [ // Renamed for clarity and valid syntax
        { label: " Ltrs/min", value: " Ltrs/min", id: "ltrs_per_min_2" },
        { label: " Gall/min", value: " Gall/min", id: "gall_per_min" },
        { label: "G / KwH", value: "G / KwH", id: "g_kwh" },
    ],
    hour_day: [
        { label: "Hours", value: "Hours", id: "hours" },
        { label: "Days", value: "Days", id: "days" },
    ],
    mph_kph: [
        { label: "MpH", value: "MpH", id: "mph" },
        { label: "K/Hr", value: "K/Hr", id: "kph" }, // Corrected id
    ],
    mile_km_nm: [
        { label: "Miles", value: "Miles", id: "miles" },
        { label: "Km", value: "Km", id: "kilometre" },
        { label: "Nm", value: "Nm", id: "nautical_mile" },
    ],
    mcr: [{ label: "MCR", value: "MCR", id: "mcr" }],
    degree: [{ label: "degrees", value: "degrees", id: "degrees" }],
    rpm: [{ label: "RpM", value: "RpM", id: "rpm" }],
    db: [{ label: "dB", value: "dB", id: "db" }],
    kg_ton: [
         { label: "Kg", value: "Kg", id: 1 },
        { label: "Ton", value: "Ton", id: 2 }
  ]
};

// =================================================================
// BERTH CONFIGURATION (Now referencing the client's  object)
// =================================================================
// In All_Services_Config.js

// =================================================================
// BERTH CONFIGURATION (Minimal, Corrected, and Stable)
// =================================================================
export const Berth_Config = {
    // METADATA
    schema_name: "marisail",
    main_table: "Berth_Details",
    primary_key: "Berth_ID",
    join_tables: [
        "Berth", "Amenities", "Family", "Local_Area", "Berth_Features", 
        "Accessibility", "Berth_Payment", "Berth_Sales", "Connectivity", 
        "Environment", "Events", "Financial", "Insurance", "Legal", 
        "Operations", "Pricing", "Repairs", "Safety"
    ],
    // 2. TABLES: A dedicated array for table descriptions.
    tables: [
        {
            table_Name: "Berth_Details", // Corrected from Marina_Port
            section_Heading: "Berth Details",
            columns: {
                // All fields are now mandatory: true
                berthId: { column_Name: "Berth_ID", display_Text: "Berth ID", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                siteDetails: { column_Name: "Site_Details", display_Text: "Site Details", type: "radio", mandatory: true, searchable: true, radio_Options: null },
                termsAndConditions: { column_Name: "Terms_Conditions", display_Text: "Terms & Conditions", type: "radio", mandatory: true, searchable: true, radio_Options: null },
                type: { column_Name: "Type", display_Text: "Type", type: "radio", mandatory: true, searchable: true, radio_Options: null },
                marinaName: { column_Name: "Name", display_Text: "Name", type: "radio", mandatory: true, searchable: true, radio_Options: null },
                location: { column_Name: "Location", display_Text: "Location", type: "radio", mandatory: true, searchable: true, radio_Options: null },
                ownership: { column_Name: "Ownership", display_Text: "Ownership", type: "radio", mandatory: true, searchable: true, radio_Options: null },
                yearEstablished: { column_Name: "Year_Established", display_Text: "Year Established", type: "radio", mandatory: true, searchable: true, radio_Options: null },
                operatingHours: { column_Name: "Operating_Hours", display_Text: "Operating Hours", type: "radio", mandatory: true, searchable: true, radio_Options: null },
                contactDetails: { column_Name: "Contact", display_Text: "Contact", type: "radio", mandatory: true, searchable: true, radio_Options: null },
                seasonalOperation: { column_Name: "Seasonal_Operation", display_Text: "Seasonal Operation", type: "radio", mandatory: true, searchable: true, radio_Options: null },
                languageServices: { column_Name: "Language", display_Text: "Language", type: "radio", mandatory: true, searchable: true, radio_Options: null }
            }
        },
        // --- Table 2: Berth (The new, corrected table object) ---
        {
            table_Name: "Berth",
            section_Heading: "General Information",
            columns: {
                dockTypes: { column_Name: "Dock_Types", display_Text: "Dock Types", type: "radio", mandatory: true, searchable: true, radio_Options: null },
                numberOfDocks: { column_Name: "Number_Docks", display_Text: "Number Docks", type: "radio", mandatory: true, searchable: true, radio_Options: null },
                boatSlipSizes: { column_Name: "Slip_Sizes", display_Text: "Slip Sizes", type: "radio", mandatory: true, searchable: true, radio_Options: null },
                numberOfBerthsAvailable: { column_Name: "Berths_Available", display_Text: "Berths Available", type: "radio", mandatory: true, searchable: true, radio_Options: null },
                
                // Fields now correctly using the shared dual_Range object
                length: { column_Name: "Length", display_Text: "Length", type: "dual", mandatory: true, searchable: true, radio_Options: dual_Range.feet_metres },
                beam: { column_Name: "Beam", display_Text: "Beam", type: "dual", mandatory: true, searchable: true, radio_Options: dual_Range.feet_metres },
                draft: { column_Name: "Draft", display_Text: "Draft", type: "dual", mandatory: true, searchable: true, radio_Options: dual_Range.feet_metres },
                slipWidth: { column_Name: "Slip_Width", display_Text: "Slip Width", type: "dual", mandatory: true, searchable: true, radio_Options: dual_Range.feet_metres },
                slipDepth: { column_Name: "Slip_Depth", display_Text: "Slip Depth", type: "dual", mandatory: true, searchable: true, radio_Options: dual_Range.feet_metres },
                slipLength: { column_Name: "Slip_Length", display_Text: "Slip Length", type: "dual", mandatory: true, searchable: true, radio_Options: dual_Range.feet_metres },
                
                mooringType: { column_Name: "Mooring_Type", display_Text: "Mooring Type", type: "radio", mandatory: true, searchable: true, radio_Options: null },
                tideRange: { column_Name: "Tide_Range", display_Text: "Tide Range", type: "radio", mandatory: true, searchable: true, radio_Options: null }
            }
        },
          // --- NEW Table 3: Amenities (Corrected and Added) ---
        {
            table_Name: "Amenities",
            section_Heading: "Amenities & Services",
            columns: {
                electricityAvailable: { column_Name: "Electricity_Available", display_Text: "Electricity Available", type: "radio", mandatory: true, searchable: true, radio_Options: null },
                waterSupply: { column_Name: "Water_Supply", display_Text: "Water Supply", type: "radio", mandatory: true, searchable: true, radio_Options: null },
                wifiAvailability: { column_Name: "WiFi_Availability", display_Text: "WiFi Availability", type: "radio", mandatory: true, searchable: true, radio_Options: null },
                carParking: { column_Name: "Car_Parking", display_Text: "Car Parking", type: "radio", mandatory: true, searchable: true, radio_Options: null },
                storage: { column_Name: "Storage", display_Text: "Storage", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                conciergeServices: { column_Name: "Concierge", display_Text: "Concierge", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                businessServices: { column_Name: "Business", display_Text: "Business", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                conferenceRooms: { column_Name: "Conference_Rooms", display_Text: "Conference Rooms", type: "radio", mandatory: false, searchable: false, radio_Options: null }
            }
        },

        // --- NEW Table 4: Family (Corrected and Added) ---
        {
            table_Name: "Family",
            section_Heading: "Family Facilities",
            columns: {
                laundryFacilities: { column_Name: "Laundry_Facilities", display_Text: "Laundry Facilities", type: "radio", mandatory: true, searchable: true, radio_Options: null },
                restaurantsAndCafes: { column_Name: "Restaurants_Cafe", display_Text: "Restaurants & Cafes", type: "radio", mandatory: true, searchable: true, radio_Options: null },
                restaurant: { column_Name: "Restaurant", display_Text: "Restaurant", type: "radio", mandatory: true, searchable: true, radio_Options: null },
                bar: { column_Name: "Bar", display_Text: "Bar", type: "radio", mandatory: true, searchable: true, radio_Options: null },
                shoppingFacilities: { column_Name: "Shopping_Facilities", display_Text: "Shopping Facilities", type: "radio", mandatory: true, searchable: true, radio_Options: null },
                retailShops: { column_Name: "Retail_Shops", display_Text: "Retail Shops", type: "radio", mandatory: true, searchable: true, radio_Options: null },
                hospitalityServices: { column_Name: "Hospitality", display_Text: "Hospitality", type: "radio", mandatory: true, searchable: true, radio_Options: null },
                clubhouseAccess: { column_Name: "Clubhouse_Access", display_Text: "Clubhouse Access", type: "radio", mandatory: true, searchable: true, radio_Options: null },
                swimmingPool: { column_Name: "Swimming_Pool", display_Text: "Swimming Pool", type: "radio", mandatory: true, searchable: true, radio_Options: null },
                fitnessCenter: { column_Name: "Fitness_Center", display_Text: "Fitness Center", type: "radio", mandatory: true, searchable: true, radio_Options: null },
                marinaStore: { column_Name: "Marina_Store", display_Text: "Marina Store", type: "radio", mandatory: true, searchable: true, radio_Options: null },
                restroomsAndShowers: { column_Name: "Restrooms_Showers", display_Text: "Restrooms & Showers", type: "radio", mandatory: true, searchable: true, radio_Options: null },
                laundryServices: { column_Name: "Laundry", display_Text: "Laundry", type: "radio", mandatory: true, searchable: true, radio_Options: null },
                gymFacilities: { column_Name: "Gym_Facilities", display_Text: "Gym Facilities", type: "radio", mandatory: true, searchable: true, radio_Options: null },
                familyFriendlyAmenities: { column_Name: "Family_Friendly", display_Text: "Family Friendly", type: "radio", mandatory: true, searchable: true, radio_Options: null },
                petFriendlyServices: { column_Name: "Pet_Friendly", display_Text: "Pet Friendly", type: "radio", mandatory: true, searchable: true, radio_Options: null },
                recreationalFacilities: { column_Name: "Recreational_Facilities", display_Text: "Recreational Facilities", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                sanitationFacilities: { column_Name: "Sanitation_Facilities", display_Text: "Sanitation Facilities", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                guestAccommodationOptions: { column_Name: "Guest_Accommodation_Options", display_Text: "Guest Accommodation Options", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                iceAvailability: { column_Name: "Ice_Availability", display_Text: "Ice Availability", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                picnicAndBBQAreas: { column_Name: "Picnic_BBQ", display_Text: "Picnic & BBQ Areas", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                childrensPlayArea: { column_Name: "Childrens_Play", display_Text: "Childrens Play", type: "radio", mandatory: false, searchable: true, radio_Options: null },
                restroomsType: { column_Name: "Restrooms_Type", display_Text: "Restrooms Type", type: "radio", mandatory: false, searchable: true, radio_Options: null }
            }
        },
        
        // --- NEW Table 5: Local_Area (Corrected and Added) ---
        {
            table_Name: "Local_Area",
            section_Heading: "Local Area & Attractions",
            columns: {
                localAttractions: { column_Name: "Local_Attractions", display_Text: "Local Attractions", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                restaurants: { column_Name: "Restaurants", display_Text: "Restaurants", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                accommodation: { column_Name: "Accommodation", display_Text: "Accommodation", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                shopping: { column_Name: "Shopping", display_Text: "Shopping", type: "radio", mandatory: false, searchable: true, radio_Options: null },
                transportationOptions: { column_Name: "Transportation", display_Text: "Transportation", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                medicalFacilitiesNearby: { column_Name: "Medical_Facilities", display_Text: "Medical Facilities", type: "radio", mandatory: false, searchable: true, radio_Options: null },
                localServices: { column_Name: "Local", display_Text: "Local", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                communityResources: { column_Name: "Community_Resources", display_Text: "Community Resources", type: "radio", mandatory: false, searchable: false, radio_Options: null }
            }
        },

        // --- NEW Table 6: Berth_Features (Corrected and Added) ---
        {
            table_Name: "Berth_Features",
            section_Heading: "Additional Features",
            columns: {
                charterServices: { column_Name: "Charter", display_Text: "Charter", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                yachtBrokerageServices: { column_Name: "Yacht_Brokerage", display_Text: "Yacht Brokerage", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                boatShowParticipation: { column_Name: "Boat_Show", display_Text: "Boat Show", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                loyaltyPrograms: { column_Name: "Loyalty_Programs", display_Text: "Loyalty Programs", type: "radio", mandatory: false, searchable: true, radio_Options: null },
                referralPrograms: { column_Name: "Referral_Programs", display_Text: "Referral Programs", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                vip_MembershipOptions: { column_Name: "VIP_Membership", display_Text: "VIP Membership", type: "radio", mandatory: false, searchable: true, radio_Options: null }
            }
        },
        // --- NEW Table 7: Events (Corrected and Added) ---
        {
            table_Name: "Events",
            section_Heading: "Local Events",
            columns: {
                socialEvents: { column_Name: "Social_Events", display_Text: "Social Events", type: "radio", mandatory: true, searchable: true, radio_Options: null },
                annualEvents: { column_Name: "Annual_Events", display_Text: "Annual Events", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                educationalPrograms: { column_Name: "Educational_Programs", display_Text: "Educational Programs", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                communityEvents: { column_Name: "Community_Events", display_Text: "Community Events", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                sportsActivities: { column_Name: "Sports_Activities", display_Text: "Sports Activities", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                culturalEvents: { column_Name: "Cultural_Events", display_Text: "Cultural Events", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                seasonalActivities: { column_Name: "Seasonal_Activities", display_Text: "Seasonal Activities", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                yachtClubMembership: { column_Name: "Club_Membership", display_Text: "Club Membership", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                regattasAndCompetitions: { column_Name: "Regattas", display_Text: "Regattas & Competitions", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                communityBulletinBoard: { column_Name: "Bulletin_Board", display_Text: "Bulletin Board", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                workshopsAndClasses: { column_Name: "Workshops_Classes", display_Text: "Workshops & Classes", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                memberDiscounts: { column_Name: "Member_Discounts", display_Text: "Member Discounts", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                networkingEvents: { column_Name: "Networking_Events", display_Text: "Networking Events", type: "radio", mandatory: false, searchable: true, radio_Options: null }
            }
        },

        // --- NEW Table 8: Operations (Corrected and Added) ---
        {
            table_Name: "Operations",
            section_Heading: "Marina or Harbour Services",
            columns: {
                docksideTrolley: { column_Name: "Dockside_Trolley", display_Text: "Dockside Trolley", type: "radio", mandatory: true, searchable: true, radio_Options: null },
                fuelTypesAvailable: { column_Name: "Fuel_Types", display_Text: "Fuel Types", type: "radio", mandatory: true, searchable: true, radio_Options: null },
                fuelDock: { column_Name: "Fuel_Dock", display_Text: "Fuel Dock", type: "radio", mandatory: true, searchable: true, radio_Options: null },
                electricalHookupSpecifications: { column_Name: "Electrical_Hookup", display_Text: "Electrical Hookup", type: "radio", mandatory: true, searchable: true, radio_Options: null },
                pumpOutStation: { column_Name: "Pump_Station", display_Text: "Pump Station", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                powerSupply: { column_Name: "Power_Supply", display_Text: "Power Supply", type: "radio", mandatory: false, searchable: true, radio_Options: null },
                shorePowerConnectionTypes: { column_Name: "Power_Connection", display_Text: "Power Connection", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                fuelService: { column_Name: "Fuel_Service", display_Text: "Fuel Service", type: "radio", mandatory: false, searchable: true, radio_Options: null }
            }
        },

        // --- NEW Table 9: Repairs (Corrected and Added) ---
        {
            table_Name: "Repairs",
            section_Heading: "Maintenance & Repairs",
            columns: {
                boatLiftSpecifications: { column_Name: "Boat_Lift", display_Text: "Boat Lift", type: "radio", mandatory: true, searchable: true, radio_Options: null },
                boatYardServices: { column_Name: "Yard", display_Text: "Yard", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                boatCleaningServices: { column_Name: "Boat_Cleaning", display_Text: "Boat Cleaning", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                chandleryServices: { column_Name: "Chandlery", display_Text: "Chandlery Services", type: "radio", mandatory: false, searchable: true, radio_Options: null },
                repairAndMaintenanceServices: { column_Name: "Maintenance_Repair", display_Text: "Maintenance & Repair Services", type: "radio", mandatory: false, searchable: true, radio_Options: null },
                haulOutServices: { column_Name: "HaulOut", display_Text: "HaulOut", type: "radio", mandatory: false, searchable: false, radio_Options: null }
            }
        },

        // --- NEW Table 10: Accessibility (Corrected and Added) ---
        {
            table_Name: "Accessibility",
            section_Heading: "Accessibility",
            columns: {
                handicapAccessibleSlips: { column_Name: "Handicap_Slips", display_Text: "Handicap Slips", type: "radio", mandatory: true, searchable: true, radio_Options: null },
                proximityToHandicapParking: { column_Name: "Proximity_Parking", display_Text: "Proximity To Handicap Parking", type: "radio", mandatory: true, searchable: true, radio_Options: null },
                accessibleFacilities: { column_Name: "Accessible_Facilities", display_Text: "Accessible Facilities", type: "radio", mandatory: true, searchable: true, radio_Options: null },
                assistanceServicesForDisabled: { column_Name: "Assistance", display_Text: "Assistance", type: "radio", mandatory: true, searchable: true, radio_Options: null },
                signageAndDirections: { column_Name: "Signage_Directions", display_Text: "Signage & Directions", type: "radio", mandatory: true, searchable: true, radio_Options: null },
                accessibleRestroomsAndShowers: { column_Name: "Accessible_Restrooms", display_Text: "Accessible Restrooms", type: "radio", mandatory: true, searchable: true, radio_Options: null },
                parkingFacilities: { column_Name: "Parking_Facilities", display_Text: "Parking Facilities", type: "radio", mandatory: false, searchable: true, radio_Options: null },
                accessibilityFeatures: { column_Name: "Accessibility_Features", display_Text: "Accessibility Features", type: "radio", mandatory: false, searchable: true, radio_Options: null },
                disabledAccessFacilities: { column_Name: "Disabled_Facilities", display_Text: "Disabled Facilities", type: "radio", mandatory: false, searchable: true, radio_Options: null }
            }
        },
        // --- NEW Table 11: Connectivity (Corrected and Added) ---
        {
            table_Name: "Connectivity",
            section_Heading: "Connectivity & Transportation",
            columns: {
                taxiServices: { column_Name: "Taxi", display_Text: "Taxi Services", type: "radio", mandatory: true, searchable: true, radio_Options: null },
                shuttleServices: { column_Name: "Shuttle_Services", display_Text: "Shuttle Services", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                transportServices: { column_Name: "Transport", display_Text: "Transport Services", type: "radio", mandatory: false, searchable: true, radio_Options: null },
                transportLinks: { column_Name: "Transport_Links", display_Text: "Transport Links", type: "radio", mandatory: false, searchable: true, radio_Options: null },
                nearbyAirports: { column_Name: "Nearby_Airports", display_Text: "Nearby Airports", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                publicTransportLinks: { column_Name: "Public_Transport_Links", display_Text: "Public Transport Links", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                bikeRentals: { column_Name: "Bike_Rentals", display_Text: "Bike Rentals", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                proximityToNearbyAttractions: { column_Name: "Nearby_Attractions", display_Text: "Nearby Attractions", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                carRentalServices: { column_Name: "Car_Rental", display_Text: "Car Rental", type: "radio", mandatory: false, searchable: true, radio_Options: null },
                airportTransferServices: { column_Name: "Airport_Transfer", display_Text: "Airport Transfer", type: "radio", mandatory: false, searchable: false, radio_Options: null }
            }
        },

        // --- NEW Table 12: Environment (Corrected and Added) ---
        {
            table_Name: "Environment",
            section_Heading: "Environmental Considerations",
            columns: {
                waterHookupSpecifications: { column_Name: "Water_Hookup", display_Text: "Water Hookup", type: "radio", mandatory: true, searchable: false, radio_Options: null },
                environmentalCertifications: { column_Name: "Environmental_Certifications", display_Text: "Environmental Certifications", type: "radio", mandatory: false, searchable: true, radio_Options: null },
                wasteManagementPolicies: { column_Name: "Waste_Management", display_Text: "Waste Management", type: "radio", mandatory: false, searchable: true, radio_Options: null },
                waterQualityMonitoring: { column_Name: "Water_Quality", display_Text: "Water Quality", type: "radio", mandatory: false, searchable: true, radio_Options: null },
                wasteDisposalServices: { column_Name: "Waste_Disposal", display_Text: "Waste Disposal Services", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                waterTreatmentSystems: { column_Name: "Water_Treatment", display_Text: "Water Treatment", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                waterConservationMeasures: { column_Name: "Water_Conservation", display_Text: "Water Conservation", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                recyclingPrograms: { column_Name: "Recycling_Programs", display_Text: "Recycling Programs", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                ecoFriendlyCleaningProducts: { column_Name: "EcoCleaning_Products", display_Text: "EcoCleaning Products", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                pollutionControlMeasures: { column_Name: "Pollution_Control", display_Text: "Pollution Control", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                wildlifeConservationEfforts: { column_Name: "Wildlife_Conservation", display_Text: "Wildlife Conservation", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                greenBuildingCertifications: { column_Name: "Building_Certifications", display_Text: "Building Certifications", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                energySources: { column_Name: "Energy_Sources", display_Text: "Energy Sources", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                marineLifeProtectionMeasures: { column_Name: "Marine_Life", display_Text: "Marine Life", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                greenCertifications: { column_Name: "Green_Certifications", display_Text: "Green Certifications", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                ecoFriendlyProductsAvailability: { column_Name: "Eco_Friendly_Products", display_Text: "Eco Friendly Products", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                sewageTreatmentPlants: { column_Name: "Sewage_Treatment", display_Text: "Sewage Treatment", type: "radio", mandatory: false, searchable: false, radio_Options: null }
            }
        },

        // --- NEW Table 13: Safety (Corrected and Added) ---
        {
            table_Name: "Safety",
            section_Heading: "Safety & Security",
            columns: {
                fireSafetyEquipment: { column_Name: "Fire_Safety", display_Text: "Fire Safety Equipment", type: "radio", mandatory: true, searchable: true, radio_Options: null },
                firstAidKits: { column_Name: "First_Aid", display_Text: "First Aid", type: "radio", mandatory: true, searchable: true, radio_Options: null },
                securityPatrol: { column_Name: "Security_Patrol", display_Text: "Security Patrol", type: "radio", mandatory: true, searchable: false, radio_Options: null },
                cctv_Surveillance: { column_Name: "CCTV_Surveillance", display_Text: "CCTV Surveillance", type: "radio", mandatory: true, searchable: true, radio_Options: null },
                fireSafetySystems: { column_Name: "Fire_Safety_Systems", display_Text: "Fire Safety Systems", type: "radio", mandatory: false, searchable: true, radio_Options: null }, // <-- Critical fix applied here
                emergencyContactInformation: { column_Name: "Emergency_Contact", display_Text: "Emergency Contact", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                emergencyMedicalServices: { column_Name: "Emergency_Medical", display_Text: "Emergency Medical", type: "radio", mandatory: false, searchable: true, radio_Options: null },
                emergencyEvacuationPlans: { column_Name: "Emergency_Evacuation", display_Text: "Emergency Evacuation", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                evacuationPlan: { column_Name: "Evacuation_Plan", display_Text: "Evacuation Plan", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                navigationAssistance: { column_Name: "Navigation_Assistance", display_Text: "Navigation Assistance", type: "radio", mandatory: false, searchable: true, radio_Options: null },
                navigationAids: { column_Name: "Navigation_Aids", display_Text: "Navigation Aids", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                pilotageServices: { column_Name: "Pilotage", display_Text: "Pilotage", type: "radio", mandatory: false, searchable: true, radio_Options: null },
                harborEntranceDepth: { column_Name: "Harbor_Entrance_Depth", display_Text: "Harbor Entrance Depth", type: "radio", mandatory: false, searchable: true, radio_Options: null },
                tideInformationServices: { column_Name: "Tide", display_Text: "Tide Information", type: "radio", mandatory: false, searchable: true, radio_Options: null },
                dockingDepths: { column_Name: "Docking_Depths", display_Text: "Docking Depths", type: "radio", mandatory: false, searchable: true, radio_Options: null },
                dockConstructionMaterial: { column_Name: "Dock_Construction", display_Text: "Dock Construction", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                dockMaterial: { column_Name: "Dock_Material", display_Text: "Dock Material", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                marinaBasinDepth: { column_Name: "Marina_Basin", display_Text: "Marina Basin", type: "radio", mandatory: false, searchable: true, radio_Options: null },
                waveProtectionMeasures: { column_Name: "Wave_Protection", display_Text: "Wave Protection", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                weatherMonitoringServices: { column_Name: "Weather_Monitoring", display_Text: "Weather Monitoring", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                shelterAndProtection: { column_Name: "Shelter_Protection", display_Text: "Shelter & Protection", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                prevailingWinds: { column_Name: "Prevailing_Winds", display_Text: "Prevailing Winds", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                seaConditions: { column_Name: "Sea_Conditions", display_Text: "Sea Conditions", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                breakwaterTypes: { column_Name: "Breakwater_Types", display_Text: "Breakwater Types", type: "dual", mandatory: false, searchable: false, radio_Options: null },
                weatherShelters: { column_Name: "Weather_Shelters", display_Text: "Weather Shelters", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                stormPreparationServices: { column_Name: "Storm_Preparation", display_Text: "Storm Preparation", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                floatingDockAvailability: { column_Name: "Floating_Dock", display_Text: "Floating Dock", type: "radio", mandatory: false, searchable: true, radio_Options: null },
                pileAnchoringSystem: { column_Name: "Pile_Anchoring_System", display_Text: "Pile Anchoring System", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                security: { column_Name: "Security", display_Text: "Security", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                accessControlSystems: { column_Name: "Access_Control", display_Text: "Access Control", type: "radio", mandatory: false, searchable: true, radio_Options: null },
                securityLighting: { column_Name: "Security_Lighting", display_Text: "Security Lighting", type: "radio", mandatory: false, searchable: true, radio_Options: null }
            }
        },

        // --- NEW Table 14: Legal (Corrected and Added) ---
        {
            table_Name: "Legal",
            section_Heading: "Legal Restrictions",
            columns: {
                permitsAndLicenses: { column_Name: "Permits_Licenses", display_Text: "Permits & Licenses", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                customsAndImmigration: { column_Name: "Customs_Immigration", display_Text: "Customs & Immigration", type: "radio", mandatory: false, searchable: true, radio_Options: null },
                healthAndSafetyRegulations: { column_Name: "Health_Safety", display_Text: "Health & Safety Regulations", type: "radio", mandatory: false, searchable: true, radio_Options: null },
                environmentalRegulationsCompliance: { column_Name: "Environmental_Compliance", display_Text: "Environmental Compliance", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                portStateControlInspections: { column_Name: "Port_Control", display_Text: "Port Control", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                quarantineServices: { column_Name: "Quarantine", display_Text: "Quarantine", type: "radio", mandatory: false, searchable: false, radio_Options: null }
            }
        },
        {
            table_Name: "Insurance",
            section_Heading: "Insurance Regulations",
            columns: {
                insuranceRequirements: { column_Name: "Insurance", displayText: "Insurance Requirements", type: "radio", mandatory: false, searchable: true, radioOptions: null },
                liabilityInsuranceRequirements: { column_Name: "Liability_Insurance", displayText: "Liability Insurance Requirements", type: "radio", mandatory: false, searchable: true, radioOptions: null },
                proofOfOwnershipRequired: { column_Name: "POO_Required", displayText: "Proof of Ownership Required?", type: "radio", mandatory: false, searchable: false, radioOptions: null },
                complianceWithLocalRegulations: { column_Name: "Local_Compliance", displayText: "Compliance With Local Regulations?", type: "radio", mandatory: false, searchable: false, radioOptions: null },
                safetyInspections: { column_Name: "Safety_Inspections", displayText: "Safety Inspections", type: "radio", mandatory: false, searchable: false, radioOptions: null },
                certificateOfSeaworthiness: { column_Name: "Seaworthiness_Certificate", displayText: "Seaworthiness Certificate", type: "radio", mandatory: false, searchable: false, radioOptions: null },
                dockUseRegulations: { column_Name: "Dock_Use", displayText: "Dock Use", type: "radio", mandatory: false, searchable: false, radioOptions: null },
                environmentalComplianceCertificates: { column_Name: "Environmental_Compliance", displayText: "Environmental Compliance Certificates", type: "radio", mandatory: false, searchable: false, radioOptions: null }
            }
        },

        // --- NEW Table 16: Financial (Corrected and Added) ---
        {
            table_Name: "Financial",
            section_Heading: "Financial Information",
            columns: {
                mooringFees: { column_Name: "Mooring_Fees", displayText: "Mooring Fees", type: "radio", mandatory: false, searchable: true, radioOptions: null },
                serviceCharges: { column_Name: "Service_Charges", displayText: "Service Charges", type: "radio", mandatory: false, searchable: false, radioOptions: null },
                membershipPrograms: { column_Name: "Membership_Programs", displayText: "Membership Programs", type: "radio", mandatory: false, searchable: false, radioOptions: null },
                paymentMethods: { column_Name: "Payment_Methods", displayText: "Payment Methods", type: "radio", mandatory: false, searchable: true, radioOptions: null },
                pricingStructure: { column_Name: "Pricing_Structure", displayText: "Pricing Structure", type: "radio", mandatory: false, searchable: false, radioOptions: null },
                depositRequirements: { column_Name: "Deposit", displayText: "Deposit Requirements", type: "radio", mandatory: false, searchable: true, radioOptions: null },
                cancellationPolicies: { column_Name: "Cancellation_Policies", displayText: "Cancellation Policies", type: "radio", mandatory: false, searchable: true, radioOptions: null },
                discountsAvailable: { column_Name: "Discounts_Available", displayText: "Discounts Available", type: "radio", mandatory: false, searchable: false, radioOptions: null }
            }
        },

        // --- NEW Table 17: Pricing (Corrected and Added) ---
        {
            table_Name: "Pricing",
            section_Heading: "Pricing Information",
            columns: {
                pricePerAnnum: { column_Name: "Price_PA", displayText: "Price PA", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                price_pcm: { column_Name: "Price_PCM", displayText: "Price PCM", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                pricePerWeek: { column_Name: "Price_PW", displayText: "Price PW", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                availability: { column_Name: "Availability", displayText: "Availability", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                annualLeaseRenewable: { column_Name: "Lease_Renewable", displayText: "Lease Renewable", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                cancellationPolicy: { column_Name: "Cancellation_Policy", displayText: "Cancellation Policy", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                latePaymentFees: { column_Name: "Late_Fees", displayText: "Late Payment Fees", type: "radio", mandatory: true, searchable: true, radioOptions: null }
            }
        },

        // --- NEW Table 18: Berth_Payment (Corrected and Added) ---
        {
            table_Name: "Berth_Payment",
            section_Heading: "Billing & Payment Details",
            columns: {
                paymentTerms: { column_Name: "Payment_Terms", displayText: "Payment Terms", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                paymentCurrency: { column_Name: "Currency", displayText: "Payment Currency", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                preferredPaymentMethods: { column_Name: "Preferred_Payment", displayText: "Preferred Payment", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                invoiceReceiptProcedures: { column_Name: "Invoice_Receipt", displayText: "Invoice Receipt", type: "radio", mandatory: true, searchable: true, radioOptions: null }
            }
        },

        // --- NEW Table 19: Berth_Sales (Corrected and Added) ---
        {
            table_Name: "Berth_Sales",
            section_Heading: "Sales Information",
            columns: {
                priceLabel: { column_Name: "Price_Label", displayText: "Price Label", type: "radio", mandatory: false, searchable: true, radioOptions: null },
                priceDrop: { column_Name: "Price_Drop", displayText: "Price Drop", type: "radio", mandatory: false, searchable: true, radioOptions: null },
                salesCurrency: { column_Name: "Currency", displayText: "Sales Currency", type: "radio", mandatory: false, searchable: false, radioOptions: null },
                vat: { column_Name: "VAT", displayText: "VAT", type: "radio", mandatory: false, searchable: false, radioOptions: null }
            }
        }

    ]
};



// =================================================================
// CHARTER CONFIGURATION (Using our final, stable object structure)
// =================================================================
export const Charter_Config = {
    // METADATA
    schema_name: "marisail",
    main_table: "Accomodation",
    primary_key: "Charter_ID",
    join_tables: [
        "Charter_Costs", "Charter_Date", "Charter_Food", "Charter_Insurance",
        "Charter_Location", "Charter_Payment", "Charter_Policy", "Charter_Requirements",
        "Charter_Safety", "Costs", "Crew", "Charter_Dates", "Food", "Policy",
        "Requirements", "Sales"
    ],
    
    // TABLES ARRAY
    tables: [
        {
            table_Name: "Accomodation",
            section_Heading: "General Information",
            columns: {
                vesselID: { column_Name: "Vessel_ID", displayText: "Vessel ID", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                charterID: { column_Name: "Charter_ID", displayText: "Charter ID", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                guestCapacity: { column_Name: "Guest_Capacity", displayText: "Guest Capacity", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                bedroomConfiguration: { column_Name: "Bedroom_Configuration", displayText: "Bedroom Configuration", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                bathroomConfiguration: { column_Name: "Bathroom_Configuration", displayText: "Bathroom Configuration", type: "radio", mandatory: true, searchable: false, radioOptions: null },
                crewAccommodations: { column_Name: "Crew_Accommodation", displayText: "Crew Accommodation", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                accessibilityInformation: { column_Name: "Accessibility_Information", displayText: "Accessibility Information", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                cleaningAndMaintenanceProcedures: { column_Name: "Maintenance_Procedures", displayText: "Maintenance Procedures", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                vesselDecorAndSetupRequests: { column_Name: "Yacht_Decor", displayText: "Vessel Decor", type: "radio", mandatory: true, searchable: false, radioOptions: null }
            }
        },
        {
            table_Name: "Charter_Location",
            section_Heading: "Charter Logistics",
            columns: {
                boardingPortArrivalTime: { column_Name: "Arrival_Time", displayText: "Boarding Arrival Time", type: "timestamp", mandatory: true, searchable: false, radioOptions: null },
                boardingPortDepartureTime: { column_Name: "Departure_Time", displayText: "Boarding Departure Time", type: "timestamp", mandatory: true, searchable: false, radioOptions: null },
                summerCruisingAreas: { column_Name: "Summer_Cruising_Area", displayText: "Summer Cruising Areas", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                boardingPort: { column_Name: "Boarding_Port", displayText: "Boarding Port", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                winterCruisingAreas: { column_Name: "Winter_Cruising_Area", displayText: "Winter Cruising Areas", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                disembarkationPort: { column_Name: "Disembarkation_Port", displayText: "Disembarkation Port", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                embarkationAndDisembarkationLogistics: { column_Name: "Logistics", displayText: "Embarkation & Disembarkation", type: "radio", mandatory: true, searchable: false, radioOptions: null },
                disembarkationPortArrivalTime: { column_Name: "Disembarkation_Arrival_Time", displayText: "Disembarkation Arrival Time", type: "timestamp", mandatory: true, searchable: false, radioOptions: null },
                dockingAndMooringInstructions: { column_Name: "Mooring_Instructions", displayText: "Mooring Instructions", type: "radio", mandatory: true, searchable: true, radioOptions: null }
            }
        },
        {
            table_Name: "Requirements",
            section_Heading: "Customer Requirements",
            columns: {
                skipperIncluded: { column_Name: "Captain_Included", displayText: "Captain Included?", type: "radio", mandatory: true, searchable: true, radioOptions: ["Yes", "No"] },
                crewIncluded: { column_Name: "Crew_Included", displayText: "Crew Included?", type: "radio", mandatory: true, searchable: true, radioOptions: ["Yes", "No"] },
                crewUniformPreferences: { column_Name: "Crew_Uniform", displayText: "Crew Uniform Preferences", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                localCuisinePreferences: { column_Name: "Cuisine_Preferences", displayText: "Cuisine Preferences", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                cateringRequired: { column_Name: "Catering_Required", displayText: "Catering Required?", type: "radio", mandatory: true, searchable: true, radioOptions: ["Yes", "No"] },
                carParkingAvailable: { column_Name: "Car_Parking", displayText: "Car Parking Available?", type: "radio", mandatory: true, searchable: true, radioOptions: ["Yes", "No"] },
                specialRequirementsRequests: { column_Name: "Special_Requirements", displayText: "Special Requirements", type: "radio", mandatory: true, searchable: false, radioOptions: null }
            }
        },
        {
            table_Name: "Policy",
            section_Heading: "Policy Information",
            columns: {
                smokingPolicy: { column_Name: "Smoking_Policy", displayText: "Smoking Policy", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                petFriendlyPolicy: { column_Name: "Pet_Policy", displayText: "Pet Policy", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                localRegulationsAndRestrictions: { column_Name: "Local_Regulations", displayText: "Local Regulations", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                charterAgreementTermsAndConditions: { column_Name: "Charter_TCs", displayText: "Charter T&Cs", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                environmentalPolicies: { column_Name: "Environmental_Policies", displayText: "Environmental Policies", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                waterConservationMeasures: { column_Name: "Water_Conservation", displayText: "Water Conservation Measures", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                wasteManagementProtocols: { column_Name: "Waste_Management", displayText: "Waste Management Protocols", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                alcoholPolicy: { column_Name: "Alcohol", displayText: "Alcohol Policy", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                photographyPolicy: { column_Name: "Photography_Policies", displayText: "Photography Policies", type: "radio", mandatory: true, searchable: true, radioOptions: null }
            }
        },
        {
            table_Name: "Charter_Safety",
            section_Heading: "Safety & Security",
            columns: {
                weatherContingencyPlans: { column_Name: "Weather_Contingency", displayText: "Weather Contingency Plans", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                emergencyProcedures: { column_Name: "Emergency_Procedures", displayText: "Emergency Procedures", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                medicalFacilitiesOnboard: { column_Name: "Medical_Facilities", displayText: "Medical Facilities Onboard", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                emergencyContacts: { column_Name: "Emergency_Contacts", displayText: "Emergency Contacts", type: "radio", mandatory: true, searchable: false, radioOptions: null },
                weatherForecastServices: { column_Name: "Weather_Forecast", displayText: "Weather Forecast Services", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                securityMeasures: { column_Name: "Security_Measures", displayText: "Security Measures", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                guestOrientationAndSafetyBriefing: { column_Name: "Safety_Briefing", displayText: "Guest Safety Briefing", type: "radio", mandatory: true, searchable: true, radioOptions: null }
            }
        },
        {
            table_Name: "Charter_Costs",
            section_Heading: "Cost Details",
            columns: {
                summerRatePerWeek: { column_Name: "Summerrate_Per_Week", displayText: "Summer Rate Per Week", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                summerRatePerNight: { column_Name: "Summerrate_Per_Night", displayText: "Summer Rate Per Night", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                winterRatePerWeek: { column_Name: "Winterrate_Per_week", displayText: "Winter Rate Per week", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                winterRatePerNight: { column_Name: "Winterrate_Per_Night", displayText: "Winter Rate Per Night", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                securityDepositAmount: { column_Name: "Deposit_Amount", displayText: "Deposit Amount", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                totalPrice: { column_Name: "Total_Price", displayText: "Total Price", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                refundableDeposit: { column_Name: "Refundable_Deposit", displayText: "Refundable Deposit?", type: "radio", mandatory: true, searchable: true, radioOptions: ["Yes", "No"] },
                additionalFuelCosts: { column_Name: "Additional_Fuel", displayText: "Additional Fuel Costs?", type: "radio", mandatory: true, searchable: false, radioOptions: ["Yes", "No"] },
                additionalFees: { column_Name: "Additional_Fees", displayText: "Additional Fees", type: "radio", mandatory: true, searchable: false, radioOptions: null },
                fuelIncluded: { column_Name: "Fuel_Included", displayText: "Fuel Included?", type: "radio", mandatory: true, searchable: true, radioOptions: ["Yes", "No"] },
                lateCheckInCheckOutFees: { column_Name: "Late_Fees", displayText: "Late Fees", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                insuranceForGuestsPersonalBelongings: { column_Name: "Guest_Insurance", displayText: "Guest Insurance Available", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                insuranceCoverageDetails: { column_Name: "Insurance_Coverage", displayText: "Insurance Coverage", type: "radio", mandatory: true, searchable: true, radioOptions: null }
            }
        },
        {
            table_Name: "Charter_Dates",
            section_Heading: "Charter Dates",
            columns: {
                minimumNightsPolicy: { column_Name: "Minimum_Nights", displayText: "Minimum Nights Policy", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                datesAvailable: { column_Name: "Dates_Available", displayText: "Dates Available", type: "date", mandatory: true, searchable: true, radioOptions: null },
                cancellationPolicy: { column_Name: "Cancellation_Policy", displayText: "Cancellation Policy", type: "radio", mandatory: true, searchable: false, radioOptions: null },
                startDate: { column_Name: "Start_Date", displayText: "Start Date", type: "date", mandatory: true, searchable: true, radioOptions: null },
                endDate: { column_Name: "End_Date", displayText: "End Date", type: "date", mandatory: true, searchable: true, radioOptions: null },
                numberNights: { column_Name: "Number_Nights", displayText: "Number Nights", type: "radio", mandatory: true, searchable: true, radioOptions: null }
            }
        },
        {
            table_Name: "Charter_Payment",
            section_Heading: "Payment Information",
            columns: {
                paymentTerms: { column_Name: "Payment_Terms", displayText: "Payment Terms", type: "radio", mandatory: true, searchable: false, radioOptions: null },
                paymentCurrency: { column_Name: "Currency", displayText: "Payment Currency", type: "radio", mandatory: true, searchable: false, radioOptions: null },
                preferredPaymentMethods: { column_Name: "Preferred_Payment", displayText: "Preferred Payment Method", type: "radio", mandatory: true, searchable: false, radioOptions: null },
                invoiceReceiptProcedures: { column_Name: "Invoice_Receipt", displayText: "Invoice Receipting Procedures", type: "radio", mandatory: true, searchable: false, radioOptions: null }
            }
        },
        {
            table_Name: "Sales",
            section_Heading: "Sales Information",
            columns: {
                priceLabel: { column_Name: "Price_Label", displayText: "Price Label", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                priceDrop: { column_Name: "Price_Drop", displayText: "Price Drop", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                salesCurrency: { column_Name: "Currency", displayText: "Currency", type: "radio", mandatory: true, searchable: false, radioOptions: null },
                vat: { column_Name: "VAT", displayText: "VAT", type: "radio", mandatory: false, searchable: false, radioOptions: null }
            }
        }
    ]
};


// =================================================================
// TRAILER CONFIGURATION (New Service)
// =================================================================
export const Trailer_Config = {
    // METADATA
    schema_name: "marisail",
    main_table: "Trailer_ID",
    primary_key: "Trailer_ID",
    join_tables: [
        "Accessories", "Axles", "Construction", "Corrosion_Resistance", "Documentation",
        "Loading_Transport_Features", "Performance_Handling", "Regulatory",
        "Security_Features", "Tongue", "Trailer_Features", "Trailer_Payment",
        "Trailer_Sales", "Tyres_Brakes", "Winches_Lighting"
    ],

    // TABLES ARRAY
    tables: [
        {
            table_Name: "Trailer_ID",
            section_Heading: "Identification",
            columns: {
                manufacturer: { column_Name: "Manufacturer", displayText: "Manufacturer", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                make: { column_Name: "Make", displayText: "Make", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                model: { column_Name: "Model", displayText: "Model", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                year: { column_Name: "Year", displayText: "Year", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                askingPrice: { column_Name: "Asking_Price", displayText: "Asking Price", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                type: { column_Name: "Type", displayText: "Type", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                gvwr: { column_Name: "GVWR", displayText: "Gross Vehicle Weight Rating (GVWR)", type: "dual", mandatory: true, searchable: true, radioOptions: dual_Range.lbs_kgs },
                loadCapacity: { column_Name: "Load_Capacity", displayText: "Load Capacity", type: "dual", mandatory: true, searchable: true, radioOptions: dual_Range.lbs_kgs },
                length: { column_Name: "Length", displayText: "Length", type: "dual", mandatory: true, searchable: true, radioOptions: dual_Range.feet_metres },
                width: { column_Name: "Width", displayText: "Width", type: "dual", mandatory: true, searchable: true, radioOptions: dual_Range.feet_metres },
                totalHeight: { column_Name: "Total_Height", displayText: "Total Height", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                axleHeight: { column_Name: "Axle_Height", displayText: "Axle Height From Gound", type: "radio", mandatory: true, searchable: true, radioOptions: null }
            }
        },
        {
            table_Name: "Construction",
            section_Heading: "Construction Materials",
            columns: {
                frameMaterial: { column_Name: "Frame_Material", displayText: "Frame Material", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                frameCoating: { column_Name: "Frame_Coating", displayText: "Frame Coating", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                frameCrossmember: { column_Name: "Frame_Crossmember", displayText: "Frame Crossmember Type", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                floorMaterial: { column_Name: "Floor_Material", displayText: "Floor Material", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                sidesMaterial: { column_Name: "Sides_Material", displayText: "Sides Material", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                roofMaterial: { column_Name: "Roof_Material", displayText: "Roof Material", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                userFeatures: { column_Name: "User_Features", displayText: "User Features", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                tieDownPoints: { column_Name: "Tie_Down_Points", displayText: "Tie-Down Points", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                frameWeld: { column_Name: "Frame_Weld", displayText: "Frame Weld Type", type: "radio", mandatory: false, searchable: true, radioOptions: null },
                maximumApproach: { column_Name: "Maximum_Approach", displayText: "Maximum Angle of Approach", type: "radio", mandatory: false, searchable: false, radioOptions: null },
                greasePoints: { column_Name: "Grease_Points", displayText: "Grease Points", type: "radio", mandatory: false, searchable: false, radioOptions: null },
                bearing: { column_Name: "Bearing", displayText: "Bearing Type", type: "radio", mandatory: false, searchable: true, radioOptions: null },
                maintenanceSchedule: { column_Name: "Maintenance_Schedule", displayText: "Maintenance Schedule", type: "radio", mandatory: false, searchable: false, radioOptions: null },
                storage: { column_Name: "Storage", displayText: "Storage", type: "radio", mandatory: false, searchable: false, radioOptions: null },
                toolBox: { column_Name: "Tool_Box", displayText: "Tool Box", type: "radio", mandatory: false, searchable: false, radioOptions: null },
                bumper: { column_Name: "Bumper", displayText: "Bumper Type", type: "radio", mandatory: false, searchable: true, radioOptions: null }
            }
        },
        {
            table_Name: "Trailer_Features",
            section_Heading: "Maintenance Features",
            columns: {
                hydraulicTilt: { column_Name: "Hydraulic_Tilt", displayText: "Hydraulic Tilt", type: "radio", mandatory: true, searchable: false, radioOptions: null },
                extendableTongue: { column_Name: "Extendable_Tongue", displayText: "Extendable Tongue", type: "radio", mandatory: true, searchable: false, radioOptions: null },
                ramp: { column_Name: "Ramp", displayText: "Ramp Type", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                winchPost: { column_Name: "Winch_Post", displayText: "Winch Post", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                splashGuards: { column_Name: "Splash_Guards", displayText: "Splash Guards", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                fenders: { column_Name: "Fenders", displayText: "Fenders", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                sideRails: { column_Name: "Side_Rails", displayText: "Side Rails", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                color: { column_Name: "Color", displayText: "Color", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                deckHeight: { column_Name: "Deck_Height", displayText: "Adjustable Deck Height", type: "radio", mandatory: false, searchable: true, radioOptions: null },
                sidePanels: { column_Name: "Side_Panels", displayText: "Detachable Side Panels", type: "radio", mandatory: false, searchable: false, radioOptions: null },
                decals: { column_Name: "Decals", displayText: "Decals", type: "radio", mandatory: false, searchable: false, radioOptions: null },
                storageBox: { column_Name: "Storage_Box", displayText: "Storage Box", type: "radio", mandatory: false, searchable: false, radioOptions: null },
                lightingPackage: { column_Name: "Lighting_Package", displayText: "Lighting Package", type: "radio", mandatory: false, searchable: false, radioOptions: null },
                suspensionUpgrade: { column_Name: "Suspension_Upgrade", displayText: "Suspension Upgrade", type: "radio", mandatory: false, searchable: false, radioOptions: null }
            }
        },
        // Axles Table - compact single line object style
        {
         table_Name: 'Axles', section_Heading: 'Axles & Suspension',
            columns: {
            axle: { column_Name: 'Axle', displayText: 'Axle Type', type: 'radio', mandatory: true, searchable: true, radioOptions: null },
            axleCapacity: { column_Name: 'Axle_Capacity', displayText: 'Axle Capacity', type: 'dual', mandatory: true, searchable: true, radioOptions: dual_Range.ton_lbs_kg },
            axleHub: { column_Name: 'Axle_Hub', displayText: 'Axle Hub Size', type: 'dual', mandatory: true, searchable: true, radioOptions: dual_Range.cm_mm },
            axlePosition: { column_Name: 'Axle_Position', displayText: 'Axle Position', type: 'radio', mandatory: true, searchable: false, radioOptions: null },
            suspension: { column_Name: 'Suspension', displayText: 'Suspension Type', type: 'radio', mandatory: true, searchable: true, radioOptions: null },
            suspensionCapacity: { column_Name: 'Suspension_Capacity', displayText: 'Suspension Capacity', type: 'dual', mandatory: true, searchable: true, radioOptions: dual_Range.ton_lbs_kg },
            axleSeal: { column_Name: 'Axle_Seal', displayText: 'Axle Seal Type', type: 'radio', mandatory: false, searchable: true, radioOptions: null },
            dropAxleOption: { column_Name: 'Drop_Axle_Option', displayText: 'Drop Axle Option', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
            suspensionAdjustment: { column_Name: 'Suspension_Adjustment', displayText: 'Suspension Adjustment', type: 'radio', mandatory: false, searchable: false, radioOptions: null }
        }
        },

// Tyres_Brakes Table - compact single line object style
        {
        table_Name: 'Tyres_Brakes',
        section_Heading: 'Tyres, Wheels, Brakes & Safety',
        columns: {
            tyreSize: { column_Name: 'Tyre_Size', displayText: 'Tyre Size', type: 'dual', mandatory: true, searchable: true, radioOptions: dual_Range.cm_mm },
            tyreLoadRange: { column_Name: 'Tyre_Load_Range', displayText: 'Tyre Load Range', type: 'radio', mandatory: true, searchable: true, radioOptions: null },
            tyreType: { column_Name: 'Tyre_Type', displayText: 'Tyre Type', type: 'radio', mandatory: true, searchable: true, radioOptions: null },
            wheelType: { column_Name: 'Wheel_Type', displayText: 'Wheel Type', type: 'radio', mandatory: true, searchable: true, radioOptions: null },
            wheelBolt: { column_Name: 'Wheel_Bolt', displayText: 'Wheel Bolt Pattern', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
            hubLubrication: { column_Name: 'Hub_Lubrication', displayText: 'Hub Lubrication System', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
            brakeType: { column_Name: 'Brake_Type', displayText: 'Brake Type', type: 'radio', mandatory: true, searchable: true, radioOptions: null },
            brakeActuator: { column_Name: 'Brake_Actuator', displayText: 'Brake Actuator', type: 'radio', mandatory: true, searchable: false, radioOptions: null },
            brakeLine: { column_Name: 'Brake_Line', displayText: 'Brake Line Material', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
            brakeDrum: { column_Name: 'Brake_Drum', displayText: 'Brake Drum Diameter', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
            brakeFluid: { column_Name: 'Brake_Fluid', displayText: 'Brake Fluid Type', type: 'radio', mandatory: false, searchable: true, radioOptions: null },
            brakes: { column_Name: 'Brakes', displayText: 'Brakes', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
            couplerSize: { column_Name: 'Coupler_Size', displayText: 'Coupler Size', type: 'dual', mandatory: true, searchable: true, radioOptions: dual_Range.cm_mm },
            couplerType: { column_Name: 'Coupler_Type', displayText: 'Coupler Type', type: 'radio', mandatory: false, searchable: true, radioOptions: null },
            couplerLock: { column_Name: 'Coupler_Lock', displayText: 'Coupler Lock Type', type: 'radio', mandatory: false, searchable: true, radioOptions: null },
            hitchClass: { column_Name: 'Hitch_Class', displayText: 'Hitch Class', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
            hitchReceiver: { column_Name: 'Hitch_Receiver', displayText: 'Hitch Receiver Size', type: 'dual', mandatory: true, searchable: true, radioOptions: dual_Range.cm_mm },
            safetyChains: { column_Name: 'Safety_Chains', displayText: 'Safety Chains', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
            breakaway: { column_Name: 'Breakaway', displayText: 'Breakaway System', type: 'radio', mandatory: false, searchable: false, radioOptions: null }
        }
        },
// Winches_Lighting - Winch & Winch Accessories (11 fields)
            {
            table_Name: 'Winches_Lighting', section_Heading: 'Winch & Winch Accessories',
            columns: {
                winch: { column_Name: 'Winch_Type', displayText: 'Winch Type', type: 'radio', mandatory: true, searchable: true, radioOptions: null },
                winchCapacity: { column_Name: 'Winch_Capacity', displayText: 'Winch Capacity', type: 'dual', mandatory: true, searchable: true, radioOptions: dual_Range.lbs_kg },
                winchRopeLength: { column_Name: 'Winch_Rope_Length', displayText: 'Winch Rope Length', type: 'dual', mandatory: true, searchable: false, radioOptions: dual_Range.ft_mtrs },
                winchDrumMaterial: { column_Name: 'Winch_Drum_Material', displayText: 'Winch Drum Material', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                winchGearRatio: { column_Name: 'Winch_Gear_Ratio', displayText: 'Winch Gear Ratio', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                winchRemoteControl: { column_Name: 'Winch_Remote_Control', displayText: 'Winch Remote Control', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                winchBrake: { column_Name: 'Winch_Brake', displayText: 'Winch Brake Type', type: 'radio', mandatory: false, searchable: true, radioOptions: null },
                winchCable: { column_Name: 'Winch_Cable', displayText: 'Winch Cable Type', type: 'radio', mandatory: false, searchable: true, radioOptions: null },
                winchStrapLength: { column_Name: 'Winch_Strap_Length', displayText: 'Winch Strap Length', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                winchHandleLength: { column_Name: 'Winch_Handle_Length', displayText: 'Winch Handle Length', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                winchMounting: { column_Name: 'Winch_Mounting', displayText: 'Winch Mounting', type: 'radio', mandatory: false, searchable: false, radioOptions: null }
            }
            },

// Winches_Lighting - Lighting & Electrical (7 fields)
            {
            table_Name: 'Winches_Lighting', section_Heading: 'Lighting & Electrical',
            columns: {
                lighting: { column_Name: 'Lighting', displayText: 'Lighting', type: 'radio', mandatory: true, searchable: false, radioOptions: null },
                lightMountingPosition: { column_Name: 'Light_Mounting_Position', displayText: 'Light Mounting Position', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                light: { column_Name: 'Light_Type', displayText: 'Light Type', type: 'radio', mandatory: true, searchable: true, radioOptions: null },
                electricalConnector: { column_Name: 'Electrical_Connector', displayText: 'Electrical Connector Type', type: 'radio', mandatory: true, searchable: true, radioOptions: null },
                electricalWiring: { column_Name: 'Electrical_Wiring', displayText: 'Electrical Wiring Type', type: 'radio', mandatory: true, searchable: true, radioOptions: null },
                battery: { column_Name: 'Battery_Type', displayText: 'Battery Type', type: 'radio', mandatory: true, searchable: true, radioOptions: null },
                batteryCharger: { column_Name: 'Battery_Charger', displayText: 'Battery Charger Type', type: 'radio', mandatory: true, searchable: true, radioOptions: null }
            }
            },

// Accessories (7 fields)
            {
            table_Name: 'Accessories', section_Heading: 'Accessories',
            columns: {
                spareTyreCarrier: { column_Name: 'Spare_Tyre_Carrier', displayText: 'Spare Tyre Carrier', type: 'radio', mandatory: true, searchable: false, radioOptions: null },
                spareTyre: { column_Name: 'Spare_Tyre_Size', displayText: 'Spare Tyre Size', type: 'dual', mandatory: true, searchable: true, radioOptions: dual_Range.cm_mm },
                spareTyreLocation: { column_Name: 'Spare_Tyre_Mounting_Location', displayText: 'Spare Tyre Mounting Location', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                jack: { column_Name: 'Jack_Type', displayText: 'Jack Type', type: 'radio', mandatory: false, searchable: true, radioOptions: null },
                jackWheel: { column_Name: 'Jack_Wheel', displayText: 'Jack Wheel Type', type: 'radio', mandatory: false, searchable: true, radioOptions: null },
                jackCapacity: { column_Name: 'Jack_Capacity', displayText: 'Jack Capacity', type: 'dual', mandatory: true, searchable: true, radioOptions: dual_Range.lbs_kg },
                jackLiftHeight: { column_Name: 'Jack_Lift_Height', displayText: 'Jack Lift Height', type: 'radio', mandatory: false, searchable: true, radioOptions: null }
            }
            },

// Loading_Transport_Features (9 fields)
            {
            table_Name: 'Loading_Transport_Features', section_Heading: 'Loading & Transport Features',
            columns: {
                loading: { column_Name: 'Loading_System', displayText: 'Loading System', type: 'dual', mandatory: true, searchable: true, radioOptions: dual_Range.ft_mtrs },
                bunks: { column_Name: 'Bunks', displayText: 'Bunks', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                bunkMaterial: { column_Name: 'Bunk_Material', displayText: 'Bunk Material', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                bunkWidth: { column_Name: 'Bunk_Width', displayText: 'Bunk Width', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                bunkHeightAdjustment: { column_Name: 'Bunk_Height_Adjustment', displayText: 'Bunk Height Adjustment', type: 'radio', mandatory: false, searchable: true, radioOptions: null },
                bunkMountingBracket: { column_Name: 'Bunk_Mounting_Bracket_Material', displayText: 'Bunk Mounting Bracket Material', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                rollers: { column_Name: 'Rollers', displayText: 'Rollers', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                rollerMaterial: { column_Name: 'Roller_Material', displayText: 'Roller Material', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                rollerAxleDiameter: { column_Name: 'Roller_Axle_Diameter', displayText: 'Roller Axle Diameter', type: 'dual', mandatory: false, searchable: false, radioOptions: dual_Range.cm_mm }
            }
            },

// Security_Features (4 fields)
            {
            table_Name: 'Security_Features', section_Heading: 'Security Features',
            columns: {
                wheelLocks: { column_Name: 'Wheel_Locks', displayText: 'Wheel Locks', type: 'radio', mandatory: true, searchable: false, radioOptions: null },
                lock: { column_Name: 'Security_Lock', displayText: 'Security Lock', type: 'radio', mandatory: true, searchable: true, radioOptions: null },
                alarm: { column_Name: 'Alarm', displayText: 'Alarm System', type: 'radio', mandatory: true, searchable: false, radioOptions: null },
                gpsTrackingDevice: { column_Name: 'GPS_Tracking_Device', displayText: 'GPS Tracking Device', type: 'radio', mandatory: true, searchable: true, radioOptions: null }
            }
            },

// Corrosion_Resistance (2 fields)
            {
            table_Name: 'Corrosion_Resistance', section_Heading: 'Environmental & Corrosion Resistance',
            columns: {
                corrosionProtection: { column_Name: 'Corrosion_Protection', displayText: 'Corrosion Protection', type: 'radio', mandatory: true, searchable: true, radioOptions: null },
                rustInhibitors: { column_Name: 'Rust_Inhibitors', displayText: 'Rust Inhibitors', type: 'radio', mandatory: false, searchable: false, radioOptions: null }
            }
            },

// Performance_Handling (2 fields)
            {
            table_Name: 'Performance_Handling', section_Heading: 'Performance & Handling',
            columns: {
                maximumSpeedRating: { column_Name: 'Maximum_Speed_Rating', displayText: 'Maximum Speed Rating', type: 'radio', mandatory: true, searchable: false, radioOptions: null },
                turningRadius: { column_Name: 'Turning_Radius', displayText: 'Turning Radius', type: 'dual', mandatory: true, searchable: true, radioOptions: dual_Range.ft_mtrs }
            }
            },

// Tongue (6 fields)
            {
            table_Name: 'Tongue', section_Heading: 'Tongue',
            columns: {
                tongueMaterial: { column_Name: 'Tongue_Material', displayText: 'Tongue Material', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                tongueShape: { column_Name: 'Tongue_Shape', displayText: 'Tongue Shape', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                jackWheel: { column_Name: 'Jack_Wheel', displayText: 'Tongue Jack Wheel Size', type: 'dual', mandatory: true, searchable: true, radioOptions: dual_Range.cm_mm },
                jackType: { column_Name: 'Jack_Type', displayText: 'Tongue Jack Type', type: 'radio', mandatory: false, searchable: true, radioOptions: null },
                tongueWeight: { column_Name: 'Tongue_Weight', displayText: 'Tongue Weight', type: 'dual', mandatory: true, searchable: true, radioOptions: [{ label: 'Kg', value: 'Kg', id: 1 }, { label: 'Ton', value: 'Ton', id: 2 }] },
                tongueWeightRatio: { column_Name: 'Tongue_Weight_Ratio', displayText: 'Tongue Weight Ratio', type: 'radio', mandatory: false, searchable: false, radioOptions: null }
            }
            },

// Documentation (2 fields)
            {
            table_Name: 'Documentation', section_Heading: 'Documentation',
            columns: {
                ownersManual: { column_Name: 'Owners_Manual', displayText: "Owner's Manual", type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                warranty: { column_Name: 'Warranty', displayText: 'Warranty', type: 'radio', mandatory: false, searchable: false, radioOptions: null }
            }
            },

// Regulatory (4 fields)
            {
            table_Name: 'Regulatory', section_Heading: 'Regulatory Compliance',
            columns: {
                dotCompliance: { column_Name: 'DOT_Compliance', displayText: 'DOT Compliance', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                natmCertification: { column_Name: 'NATM_Certification', displayText: 'NATM Certification', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                euApproval: { column_Name: 'EU_Approval', displayText: 'EU Type Approval', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                adrCompliance: { column_Name: 'ADR_Compliance', displayText: 'ADR Compliance', type: 'radio', mandatory: false, searchable: false, radioOptions: null }
            }
            },
// Tongue (6 fields)
            {
            table_Name: 'Tongue', section_Heading: 'Tongue',
            columns: {
                tongueMaterial: { column_Name: 'Tongue_Material', displayText: 'Tongue Material', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                tongueShape: { column_Name: 'Tongue_Shape', displayText: 'Tongue Shape', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                jackWheel: { column_Name: 'Jack_Wheel', displayText: 'Tongue Jack Wheel Size', type: 'dual', mandatory: true, searchable: true, radioOptions: dual_Range.cm_mm },
                jackType: { column_Name: 'Jack_Type', displayText: 'Tongue Jack Type', type: 'radio', mandatory: false, searchable: true, radioOptions: null },
                tongueWeight: { column_Name: 'Tongue_Weight', displayText: 'Tongue Weight', type: 'dual', mandatory: true, searchable: true, radioOptions: dual_Range.lbs_kgs },
                tongueWeightRatio: { column_Name: 'Tongue_Weight_Ratio', displayText: 'Tongue Weight Ratio', type: 'radio', mandatory: false, searchable: false, radioOptions: null }
            }
            },

            // Documentation (2 fields)
            {
            table_Name: 'Documentation', section_Heading: 'Documentation',
            columns: {
                ownersManual: { column_Name: 'Owners_Manual', displayText: "Owner's Manual", type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                warranty: { column_Name: 'Warranty', displayText: 'Warranty', type: 'radio', mandatory: false, searchable: false, radioOptions: null }
            }
            },

// Regulatory (4 fields)
            {
            table_Name: 'Regulatory', section_Heading: 'Regulatory Compliance',
            columns: {
                dotCompliance: { column_Name: 'DOT_Compliance', displayText: 'DOT Compliance', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                natmCertification: { column_Name: 'NATM_Certification', displayText: 'NATM Certification', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                euApproval: { column_Name: 'EU_Approval', displayText: 'EU Type Approval', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                adrCompliance: { column_Name: 'ADR_Compliance', displayText: 'ADR Compliance', type: 'radio', mandatory: false, searchable: false, radioOptions: null }
            }
            },

// Trailer_Payment (4 fields)
            {
            table_Name: 'Trailer_Payment', section_Heading: 'Payment Terms',
            columns: {
                paymentTerms: { column_Name: 'Payment_Terms', displayText: 'Payment Terms', type: 'radio', mandatory: true, searchable: false, radioOptions: null },
                currency: { column_Name: 'Currency', displayText: 'Currency', type: 'radio', mandatory: true, searchable: false, radioOptions: null },
                preferredPayment: { column_Name: 'Preferred_Payment', displayText: 'Preferred Payment Methods', type: 'radio', mandatory: true, searchable: false, radioOptions: null },
                invoiceReceipt: { column_Name: 'Invoice_Receipt', displayText: 'Invoice & Receipt Procedures', type: 'radio', mandatory: true, searchable: false, radioOptions: null }
            }
            },

// Trailer_Sales (4 fields)
            {
            table_Name: 'Trailer_Sales', section_Heading: 'Trailer_Sales',
            columns: {
                priceLabel: { column_Name: 'Price_Label', displayText: 'Price Label', type: 'radio', mandatory: false, searchable: true, radioOptions: null },
                priceDrop: { column_Name: 'Price_Drop', displayText: 'Price Drop', type: 'radio', mandatory: false, searchable: true, radioOptions: null },
                currency: { column_Name: 'Currency', displayText: 'Currency', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                vat: { column_Name: 'VAT', displayText: 'VAT', type: 'radio', mandatory: false, searchable: false, radioOptions: null }
            }
            }



    ]
};
export const Transport_Config = [
        {
            schema_name: 'marisail',
            main_table: 'Job',
            primary_key: 'Transport_ID',
            join_tables: ['Compliance','Haulage','Haulier','Questions','Reviews', 'Transportation_Contacts','Transportation_Payment','Transportation_Quotes','Transportation_Sales',
            ],
        },

  // Table: Job Fields: 23
        {
            table_Name: 'Job',
            section_Heading: 'Job Description',
            columns: {
            transport_Id: { column_Name: 'Transport_ID', displayText: 'Transport Item ID', type: 'radio', mandatory: false, searchable: true, radioOptions: null },
            category: { column_Name: 'Category', displayText: 'Category', type: 'radio', mandatory: true, searchable: true, radioOptions: null },
            title: { column_Name: 'Title', displayText: 'Title', type: 'radio', mandatory: true, searchable: true, radioOptions: null },
            description: { column_Name: 'Description', displayText: 'Description', type: 'radio', mandatory: true, searchable: true, radioOptions: null },
            deadlineDate: { column_Name: 'Deadline_Date', displayText: 'Deadline Date', type: 'date', mandatory: true, searchable: true, radioOptions: null },
            timescale: { column_Name: 'Timescale', displayText: 'Timescale', type: 'date', mandatory: true, searchable: true, radioOptions: null },
            preferredDate: { column_Name: 'Preferred_Date', displayText: 'Preferred Date', type: 'date', mandatory: true, searchable: true, radioOptions: null },
            international: { column_Name: 'International', displayText: 'International', type: 'radio', mandatory: true, searchable: true, radioOptions: ['Yes', 'No'] },
            ferryRequired: { column_Name: 'Ferry_Required', displayText: 'Ferry Required', type: 'radio', mandatory: true, searchable: true, radioOptions: ['Yes', 'No'] },
            specialHandlingRequirements: { column_Name: 'Special_Handling', displayText: 'Special Handling', type: 'radio', mandatory: true, searchable: true, radioOptions: null },
            departureLoadingEquipmentNeeded: { column_Name: 'Loading_Equipment', displayText: 'Loading Equipment Required?', type: 'radio', mandatory: true, searchable: true, radioOptions: ['Yes', 'No'] },
            destinationUnloadingEquipmentNeeded: { column_Name: 'Unloading_Equipment', displayText: 'Unloading Equipment Required?', type: 'radio', mandatory: true, searchable: true, radioOptions: ['Yes', 'No'] },
            overweightPermitNeeded: { column_Name: 'Overweight_Permit', displayText: 'Overweight Permit Required?', type: 'radio', mandatory: true, searchable: true, radioOptions: ['Yes', 'No'] },
            oversizePermitNeeded: { column_Name: 'Oversize_Permit', displayText: 'Oversize Permit Required?', type: 'radio', mandatory: true, searchable: true, radioOptions: ['Yes', 'No'] },
            postedDate: { column_Name: 'Posted_Date', displayText: 'Posted Date', type: 'date', mandatory: false, searchable: true, radioOptions: null },
            haulierToDepartureDistance: { column_Name: 'Collection_Delivery_Distance', displayText: 'Collection Delivery Distance', type: 'radio', mandatory: false, searchable: true, radioOptions: null },
            departureToDestinationDistance: { column_Name: 'Departure_Destination', displayText: 'Departure Destination', type: 'radio', mandatory: false, searchable: true, radioOptions: null },
            returnJourney: { column_Name: 'Return_Journey', displayText: 'Return Journey', type: 'radio', mandatory: false, searchable: true, radioOptions: ['Yes', 'No'] },
            roundTripDistance: { column_Name: 'Round_Trip_Distance', displayText: 'Round Trip Distance', type: 'radio', mandatory: false, searchable: true, radioOptions: null },
            freightClass: { column_Name: 'Freight_Class', displayText: 'Freight Class', type: 'radio', mandatory: false, searchable: true, radioOptions: null },
            numberQuotes: { column_Name: 'Number_Quotes', displayText: 'Number Quotes', type: 'number', mandatory: false, searchable: true, radioOptions: null },
            jobDoneHaulier: { column_Name: 'Job_Done_Haulier', displayText: 'Job Done Date', type: 'radio', mandatory: false, searchable: true, radioOptions: null },
            jobDoneDate: { column_Name: 'Job_Done_Date_Haulier', displayText: 'Job Done Date', type: 'date', mandatory: false, searchable: true, radioOptions: null },
            },
        },

  // Table: Vessel_Details Fields: 8
        {
            table_Name: 'Vessel_Details',
            section_Heading: 'Vessel Details',
            columns: {
            itemNumber: { column_Name: 'Item_Number', displayText: 'Item Number', type: 'number', mandatory: true, searchable: true, radioOptions: null },
            totalNumberItems: { column_Name: 'Total_Number_Items', displayText: 'Total Number Items', type: 'number', mandatory: true, searchable: true, radioOptions: null },
            previousInsuranceClaims: { column_Name: 'Insurance_Claims', displayText: 'Previous Insurance Claims', type: 'radio', mandatory: true, searchable: true, radioOptions: ['Yes', 'No'] },
            existingDamage: { column_Name: 'Existing_Damage', displayText: 'Existing Damage', type: 'radio', mandatory: true, searchable: true, radioOptions: ['Yes', 'No'] },
            damageDescription: { column_Name: 'Damage_Description', displayText: 'Damage Description', type: 'radio', mandatory: true, searchable: true, radioOptions: null },
            vesselInsuranceType: { column_Name: 'Vessel_Insurance_Type', displayText: 'Vessel Insurance Type', type: 'radio', mandatory: true, searchable: true, radioOptions: null },
            vesselInsuranceNotes: { column_Name: 'Vessel_Insurance_Notes', displayText: 'Vessel Insurance Notes', type: 'radio', mandatory: true, searchable: true, radioOptions: null },
            },
        },

  // Table: Transportation_Contacts Fields: 12
        {
            table_Name: 'Transportation_Contacts',
            section_Heading: 'Contact Details',
            columns: {
            customerType: { column_Name: 'Customer_Type', displayText: 'Customer Type', type: 'radio', mandatory: true, searchable: true, radioOptions: null },
            customerID: { column_Name: 'Customer_ID', displayText: 'Customer ID', type: 'radio', mandatory: false, searchable: true, radioOptions: null },
            customerName: { column_Name: 'Customer_Name', displayText: 'Customer Name', type: 'radio', mandatory: false, searchable: true, radioOptions: null },
            customerCompanyName: { column_Name: 'Customer_Company_Name', displayText: 'Customer Company Name', type: 'radio', mandatory: false, searchable: true, radioOptions: null },
            collectionDepartureNamedContact: { column_Name: 'Collection_Contact', displayText: 'Collection Contact', type: 'radio', mandatory: false, searchable: true, radioOptions: null },
            collectionDepartureMobile: { column_Name: 'Collection_Mobile', displayText: 'Collection Mobile', type: 'radio', mandatory: false, searchable: true, radioOptions: null },
            deliveryDestinationNamedContact: { column_Name: 'Delivery_Contact', displayText: 'Delivery Contact', type: 'radio', mandatory: false, searchable: true, radioOptions: null },
            collectionDepartureAddress: { column_Name: 'Collection_Address', displayText: 'Collection Address', type: 'radio', mandatory: false, searchable: true, radioOptions: null },
            deliveryDestinationMobile: { column_Name: 'Delivery_Mobile', displayText: 'Delivery Mobile', type: 'radio', mandatory: false, searchable: true, radioOptions: null },
            deliveryDestinationAddress: { column_Name: 'Delivery_Address', displayText: 'Delivery Address', type: 'radio', mandatory: false, searchable: true, radioOptions: null },
            emergencyContactInformation: { column_Name: 'Emergency_Contacts', displayText: 'Emergency Contacts', type: 'radio', mandatory: false, searchable: true, radioOptions: null },
            preferredCommunicationMethod: { column_Name: 'Preferred_Communication', displayText: 'Preferred Communication', type: 'radio', mandatory: false, searchable: true, radioOptions: null },
            },
        },

  // Table: Transportation_Quotes Fields: 6
        {
            table_Name: 'Transportation_Quotes',
            section_Heading: 'Quote Details',
            columns: {
            quote: { column_Name: 'Quote_Value', displayText: 'Quote Value', type: 'radio', mandatory: true, searchable: false, radioOptions: null },
            quoteDescription: { column_Name: 'Quote_Description', displayText: 'Quote Description', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
            quoteDate: { column_Name: 'Quote_Date', displayText: 'Quote Date', type: 'date', mandatory: false, searchable: false, radioOptions: null },
            declineDate: { column_Name: 'Decline_Date', displayText: 'Decline Date', type: 'date', mandatory: false, searchable: false, radioOptions: null },
            withdrawDate: { column_Name: 'Withdraw_Date', displayText: 'Withdraw Date', type: 'date', mandatory: false, searchable: false, radioOptions: null },
            quoteStatus: { column_Name: 'Quote_Status', displayText: 'Quote Status', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
            },
        },

  // Table: Questions Fields: 6
        {
            table_Name: 'Questions',
            section_Heading: 'Customer Questions',
            columns: {
            questionDate: { column_Name: 'Question_Date', displayText: 'Question Date', type: 'date', mandatory: true, searchable: false, radioOptions: null },
            answerDate: { column_Name: 'Answer_Date', displayText: 'Answer Date', type: 'date', mandatory: true, searchable: false, radioOptions: null },
            transportProviderQuestions: { column_Name: 'Transport_Provider_Questions', displayText: 'Transport Provider Questions', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
            customerAnswers: { column_Name: 'Customer_Answers', displayText: 'Customer Answers', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
            },
        },
        // Table: Reviews (11 fields)
        {
        table_Name: 'Reviews',
        section_Heading: 'Customer Reviews',
        columns: {
            customerFeedbackNotes: { column_Name: 'Customer_Feedback_Notes', displayText: 'Customer Feedback Notes', type: 'radio', mandatory: true, searchable: false, radioOptions: null },
            customerFeedbackScore: { column_Name: 'Customer_Feedback_Score', displayText: 'Customer Feedback Score', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
            positive: { column_Name: 'Positive', displayText: 'Positive', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
            neutral: { column_Name: 'Neutral', displayText: 'Neutral', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
            negative: { column_Name: 'Negative', displayText: 'Negative', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
            reviews: { column_Name: 'Reviews', displayText: 'Reviews', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
            rating: { column_Name: 'Rating', displayText: 'Rating', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
            itemTitle: { column_Name: 'Item_Title', displayText: 'Item Title', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
            leftBy: { column_Name: 'Left_By', displayText: 'Left By', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
            comments: { column_Name: 'Comments', displayText: 'Comments', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
            date: { column_Name: 'Date', displayText: 'Date', type: 'date', mandatory: false, searchable: false, radioOptions: null },
            jobDoneCustomer: { column_Name: 'Job_Done_Customer', displayText: 'Job Done Date', type: 'radio', mandatory: false, searchable: true, radioOptions: null },
            jobDoneDate: { column_Name: 'Job_Done_Date_Customer', displayText: 'Job Done Date', type: 'date', mandatory: false, searchable: true, radioOptions: null }
        }
        },

// Table: Haulier (18 fields)
        {
        table_Name: 'Haulier',
        section_Heading: 'Haulier (Transport Provider) Details',
        columns: {
            haulierID: { column_Name: 'Haulier_ID', displayText: 'Haulier ID', type: 'radio', mandatory: true, searchable: false, radioOptions: null },
            haulierName: { column_Name: 'Haulier_Name', displayText: 'Haulier Name', type: 'radio', mandatory: true, searchable: false, radioOptions: null },
            haulierAddress: { column_Name: 'Haulier_Address', displayText: 'Haulier Address', type: 'radio', mandatory: true, searchable: false, radioOptions: null },
            haulierNumberJobs: { column_Name: 'Haulier_Number_Jobs', displayText: 'Haulier Number Jobs', type: 'number', mandatory: true, searchable: false, radioOptions: null },
            registeredSince: { column_Name: 'Registered_Since', displayText: 'Registered Since', type: 'radio', mandatory: true, searchable: false, radioOptions: null },
            numberVehicles: { column_Name: 'Number_Vehicles', displayText: 'Number Vehicles', type: 'number', mandatory: true, searchable: false, radioOptions: null },
            numberDrivers: { column_Name: 'Number_Drivers', displayText: 'Number Drivers', type: 'number', mandatory: true, searchable: false, radioOptions: null },
            verified: { column_Name: 'Verified', displayText: 'Verified', type: 'radio', mandatory: true, searchable: false, radioOptions: null },
            haulierTotalCustomerScore: { column_Name: 'Haulier_Total_Customer_Score', displayText: 'Total Customer Score', type: 'radio', mandatory: true, searchable: false, radioOptions: null },
            realTimeTracking: { column_Name: 'Real_Time_Tracking', displayText: 'Real Time Tracking', type: 'radio', mandatory: true, searchable: false, radioOptions: null },
            electronicProofOfDelivery: { column_Name: 'Electronic_POD', displayText: 'Electronic Proof of Delivery', type: 'radio', mandatory: true, searchable: false, radioOptions: null },
            automatedAlertsAndNotifications: { column_Name: 'Automated_Alerts_Notifications', displayText: 'Automated Alerts And Notifications', type: 'radio', mandatory: true, searchable: false, radioOptions: null },
            vehicleType: { column_Name: 'Vehicle_Type', displayText: 'Vehicle Type', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
            vehicleCapacity: { column_Name: 'Vehicle_Capacity', displayText: 'Vehicle Capacity', type: 'dual', mandatory: false, searchable: false, radioOptions: [{ label: 'Kg', value: 'Kg', id: 1 }, { label: 'Ton', value: 'Ton', id: 2 }] },
            customerServiceContactInformation: { column_Name: 'Customer_Service_Contactinfo', displayText: 'Customer Service', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
            trackingSystem: { column_Name: 'Tracking_System', displayText: 'Tracking System', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
            deliveryWindow: { column_Name: 'Delivery_Window', displayText: 'Delivery Window', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
            deliveryConfirmation: { column_Name: 'Delivery_Confirmation', displayText: 'Delivery Confirmation', type: 'radio', mandatory: false, searchable: false, radioOptions: null }
        }
        },

// Table: Compliance (12 fields)
        {
        table_Name: 'Compliance',
        section_Heading: 'Safety & Regulatory Compliance',
        columns: {
            safetyCertifications: { column_Name: 'Safety_Certifications', displayText: 'Safety Certifications', type: 'radio', mandatory: true, searchable: false, radioOptions: null },
            environmentalRegulationsCompliance: { column_Name: 'Environmental_Regulations', displayText: 'Environmental Regulation Compliance', type: 'radio', mandatory: true, searchable: false, radioOptions: null },
            hazardousMaterialsHandling: { column_Name: 'Hazardous_Materials', displayText: 'Hazardous Material Handling', type: 'radio', mandatory: true, searchable: false, radioOptions: null },
            safetyTrainingPrograms: { column_Name: 'Safety_Training', displayText: 'Safety Training', type: 'radio', mandatory: true, searchable: false, radioOptions: null },
            accidentReportingProcedures: { column_Name: 'Accident_Reporting', displayText: 'Accident Reporting Procedures', type: 'radio', mandatory: true, searchable: false, radioOptions: null },
            healthAndSafetyPolicies: { column_Name: 'Health_Safety', displayText: 'Health & Safety Policies', type: 'radio', mandatory: true, searchable: false, radioOptions: null },
            safetyAudits: { column_Name: 'Safety_Audits', displayText: 'Safety Audits', type: 'radio', mandatory: true, searchable: false, radioOptions: null },
            riskAssessments: { column_Name: 'Risk_Assessments', displayText: 'Risk Assessments', type: 'radio', mandatory: true, searchable: false, radioOptions: null },
            incidentManagement: { column_Name: 'Incident_Management', displayText: 'Incident Management', type: 'radio', mandatory: true, searchable: false, radioOptions: null },
            complianceRecords: { column_Name: 'Compliance_Records', displayText: 'Compliance Records', type: 'radio', mandatory: true, searchable: false, radioOptions: null },
            permitsAndLicenses: { column_Name: 'Permits', displayText: 'Permits', type: 'radio', mandatory: true, searchable: false, radioOptions: null },
            transportRegulationsCompliance: { column_Name: 'Transport_Regulations', displayText: 'Transport Regulations Compliance', type: 'radio', mandatory: true, searchable: false, radioOptions: null }
        }
        },

// Table: Transportation_Payment (15 fields)
        {
        table_Name: 'Transportation_Payment',
        section_Heading: 'Payment Details',
        columns: {
            paymentTerms: { column_Name: 'Payment_Terms', displayText: 'Payment Terms', type: 'radio', mandatory: true, searchable: true, radioOptions: null },
            acceptedPaymentMethods: { column_Name: 'Payment_Methods', displayText: 'Accepted Payment Methods', type: 'radio', mandatory: true, searchable: true, radioOptions: null },
            cancellationPolicy: { column_Name: 'Cancellation_Policy', displayText: 'Cancellation Policy', type: 'radio', mandatory: true, searchable: true, radioOptions: null },
            invoiceTime: { column_Name: 'Invoice_Time', displayText: 'Invoice Time', type: 'date', mandatory: true, searchable: true, radioOptions: null },
            latePaymentFees: { column_Name: 'Late_Fees', displayText: 'Late Payment Fees', type: 'radio', mandatory: true, searchable: true, radioOptions: null },
            disputeResolutionTerms: { column_Name: 'Dispute_Resolution_Terms', displayText: 'Dispute Resolution Terms', type: 'radio', mandatory: true, searchable: true, radioOptions: null },
            liabilityCoverage: { column_Name: 'Liability_Coverage', displayText: 'Liability Coverage', type: 'radio', mandatory: true, searchable: true, radioOptions: null },
            insurancePolicy: { column_Name: 'Insurance_Policy', displayText: 'Insurance Policy', type: 'radio', mandatory: true, searchable: true, radioOptions: null },
            insuranceCoverage: { column_Name: 'Insurance_Coverage', displayText: 'Insurance Coverage', type: 'radio', mandatory: true, searchable: true, radioOptions: null },
            insuranceProvider: { column_Name: 'Insurance_Provider', displayText: 'Insurance Provider', type: 'radio', mandatory: true, searchable: true, radioOptions: null },
            insuranceClaimProcess: { column_Name: 'Claim_Process', displayText: 'Insurance Claim Process', type: 'radio', mandatory: true, searchable: true, radioOptions: null },
            preferredPaymentMethods: { column_Name: 'Preferred_Payment', displayText: 'Preferred Payment Method', type: 'radio', mandatory: true, searchable: false, radioOptions: null },
            invoiceAndReceiptProcedures: { column_Name: 'Invoice_Receipt', displayText: 'Invoice & Receipting Procedures', type: 'radio', mandatory: true, searchable: false, radioOptions: null },
            serviceLevelAgreement: { column_Name: 'SLA', displayText: 'Service Level Agreement (SLA)', type: 'radio', mandatory: false, searchable: true, radioOptions: null },
            billingContactInformation: { column_Name: 'Billing_Contact', displayText: 'Billing Contact Information', type: 'radio', mandatory: false, searchable: true, radioOptions: null }
        }
        },

// Table: Transportation_Sales (4 fields)
        {
        table_Name: 'Transportation_Sales',
        section_Heading: 'Price Details',
        columns: {
            priceLabel: { column_Name: 'Price_Label', displayText: 'Price Label', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
            priceDrop: { column_Name: 'Price_Drop', displayText: 'Price Drop', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
            currency: { column_Name: 'Currency', displayText: 'Currency', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
            vat: { column_Name: 'VAT', displayText: 'VAT', type: 'radio', mandatory: false, searchable: false, radioOptions: null }
        }
        }

];



// =================================================================
// BERTH MAPPINGS (WITHOUT SAFETY CHECKS)
// =================================================================

const berth_Var_To_Column = {};
Berth_Config.tables.forEach(table => {
    Object.entries(table.columns).forEach(([var_Name, col_Info]) => {
        berth_Var_To_Column[var_Name] = col_Info.column_Name;
    });
});

const berth_Var_To_Table = {};
Berth_Config.tables.forEach(table => {
    Object.keys(table.columns).forEach(var_Name => {
        berth_Var_To_Table[var_Name] = table.table_Name;
    });
});
// const berth_Unique_Table = [...new Set(Berth_Config.map(table => table.table_Name))];
const berth_Unique_Table = [...new Set(Berth_Config.tables.map(table => table.table_Name).filter(Boolean))];
export { berth_Var_To_Column, berth_Var_To_Table, berth_Unique_Table };

const charter_Var_To_Column = {};
Charter_Config.tables.forEach(table => {
  Object.entries(table.columns).forEach(([var_Name, col_Info]) => {
    charter_Var_To_Column[var_Name] = col_Info.column_Name;
  });
});

const charter_Var_To_Table = {};
Charter_Config.tables.forEach(table => {
  Object.keys(table.columns).forEach(var_Name => {
    charter_Var_To_Table[var_Name] = table.table_Name;
  });
});

const charter_Unique_Table = [...new Set(Charter_Config.tables.map(table => table.table_Name).filter(Boolean))];

export { charter_Var_To_Column, charter_Var_To_Table, charter_Unique_Table };

// For Trailer_Config

// Trailer_Config mappings
const trailer_Var_To_Column = {};
Trailer_Config.tables.forEach(table => {
  Object.entries(table.columns).forEach(([var_Name, col_Info]) => {
    trailer_Var_To_Column[var_Name] = col_Info.column_Name;
  });
});

const trailer_Var_To_Table = {};
Trailer_Config.tables.forEach(table => {
  Object.keys(table.columns).forEach(var_Name => {
    trailer_Var_To_Table[var_Name] = table.table_Name;
  });
});

const trailer_Unique_Table = [...new Set(Trailer_Config.tables.map(table => table.table_Name).filter(Boolean))];

export { trailer_Var_To_Column, trailer_Var_To_Table, trailer_Unique_Table };


// Transport_Config mappings
const transport_Var_To_Column = {};
Transport_Config.forEach(table => {
  if (table.columns) {
    Object.entries(table.columns).forEach(([var_Name, col_Info]) => {
      transport_Var_To_Column[var_Name] = col_Info.column_Name;
    });
  }
});

const transport_Var_To_Table = {};
Transport_Config.forEach(table => {
  if (table.columns) {
    Object.keys(table.columns).forEach(var_Name => {
      transport_Var_To_Table[var_Name] = table.table_Name;
    });
  }
});

const transport_Unique_Table = [
  ...new Set(Transport_Config.map(table => table.table_Name).filter(Boolean))
];

export { transport_Var_To_Column, transport_Var_To_Table, transport_Unique_Table };
// Export the mappings


// // =================================================================
// MAIN SERVICES EXPORT (UNCHANGED)
// =================================================================
export const SERVICES = {
    berth: Berth_Config,
    trailer: Trailer_Config,
    charter: Charter_Config,
    transport: Transport_Config,
};