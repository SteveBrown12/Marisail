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
    gallon_per_min: [ 
        { label: "Gallons /min", value: "Gallons / min", id: "gallons_per_min" }, 
        { label: "Ltrs / min", value: "Ltrs / min", id: "ltrs_per_min" }, 
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
    flow_and_efficiency: [ 
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
        { label: "K/Hr", value: "K/Hr", id: "kph" }, 
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

// BERTH CONFIGURATION 

export const Berth_Config = {
    schema_name: "marisail",
    main_table: "Berth_Details",
    primary_key: "Berth_ID",
    join_tables: [ "Berth", "Amenities", "Family", "Local_Area", "Berth_Features", "Accessibility", "Berth_Payment", "Berth_Sales", "Connectivity",  "Environment", "Events", "Financial", "Insurance", "Legal", "Operations", "Pricing", "Repairs", "Safety" ],
    tables: [
        {

            // Table: Berth_Details Fields: 12

            table_Name: "Berth_Details", 
            section_Heading: "Berth Details",
            columns: {
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
            },        
        },
        {

            // Table: Berth Fields: 13

            table_Name: "Berth",
            section_Heading: "General Information",
            columns: {
                dockTypes: { column_Name: "Dock_Types", display_Text: "Dock Types", type: "radio", mandatory: true, searchable: true, radio_Options: null },
                numberOfDocks: { column_Name: "Number_Docks", display_Text: "Number Docks", type: "radio", mandatory: true, searchable: true, radio_Options: null },
                boatSlipSizes: { column_Name: "Slip_Sizes", display_Text: "Slip Sizes", type: "radio", mandatory: true, searchable: true, radio_Options: null },
                numberOfBerthsAvailable: { column_Name: "Berths_Available", display_Text: "Berths Available", type: "radio", mandatory: true, searchable: true, radio_Options: null },
                length: { column_Name: "Length", display_Text: "Length", type: "dual", mandatory: true, searchable: true, radio_Options: dual_Range.feet_metres },
                beam: { column_Name: "Beam", display_Text: "Beam", type: "dual", mandatory: true, searchable: true, radio_Options: dual_Range.feet_metres },
                draft: { column_Name: "Draft", display_Text: "Draft", type: "dual", mandatory: true, searchable: true, radio_Options: dual_Range.feet_metres },
                slipWidth: { column_Name: "Slip_Width", display_Text: "Slip Width", type: "dual", mandatory: true, searchable: true, radio_Options: dual_Range.feet_metres },
                slipDepth: { column_Name: "Slip_Depth", display_Text: "Slip Depth", type: "dual", mandatory: true, searchable: true, radio_Options: dual_Range.feet_metres },
                slipLength: { column_Name: "Slip_Length", display_Text: "Slip Length", type: "dual", mandatory: true, searchable: true, radio_Options: dual_Range.feet_metres },
                mooringType: { column_Name: "Mooring_Type", display_Text: "Mooring Type", type: "radio", mandatory: true, searchable: true, radio_Options: null },
                tideRange: { column_Name: "Tide_Range", display_Text: "Tide Range", type: "radio", mandatory: true, searchable: true, radio_Options: null }
            },
        },
        {

             // Table: Amenities Fields: 9

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
            },
        },
        {

            // Table: Family Fields: 23

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
            },
        },
        {

            // Table: Local_Area Fields: 9

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
            },
        },
        {

            // Table: Berth_Features Fields: 7

            table_Name: "Berth_Features",
            section_Heading: "Additional Features",
            columns: {
                charterServices: { column_Name: "Charter", display_Text: "Charter", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                yachtBrokerageServices: { column_Name: "Yacht_Brokerage", display_Text: "Yacht Brokerage", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                boatShowParticipation: { column_Name: "Boat_Show", display_Text: "Boat Show", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                loyaltyPrograms: { column_Name: "Loyalty_Programs", display_Text: "Loyalty Programs", type: "radio", mandatory: false, searchable: true, radio_Options: null },
                referralPrograms: { column_Name: "Referral_Programs", display_Text: "Referral Programs", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                vip_MembershipOptions: { column_Name: "VIP_Membership", display_Text: "VIP Membership", type: "radio", mandatory: false, searchable: true, radio_Options: null }
            },
        },
        {

            // Table: Events Fields: 14

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
            },
        },
        {

            // Table: Operations Fields: 9
            
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
            },
        },
        {
            
            // Table: Repairs Fields: 7

            table_Name: "Repairs",
            section_Heading: "Maintenance & Repairs",
            columns: {
                boatLiftSpecifications: { column_Name: "Boat_Lift", display_Text: "Boat Lift", type: "radio", mandatory: true, searchable: true, radio_Options: null },
                boatYardServices: { column_Name: "Yard", display_Text: "Yard", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                boatCleaningServices: { column_Name: "Boat_Cleaning", display_Text: "Boat Cleaning", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                chandleryServices: { column_Name: "Chandlery", display_Text: "Chandlery Services", type: "radio", mandatory: false, searchable: true, radio_Options: null },
                repairAndMaintenanceServices: { column_Name: "Maintenance_Repair", display_Text: "Maintenance & Repair Services", type: "radio", mandatory: false, searchable: true, radio_Options: null },
                haulOutServices: { column_Name: "HaulOut", display_Text: "HaulOut", type: "radio", mandatory: false, searchable: false, radio_Options: null }
            },
        },
        {

            // Table: Accessibility Fields: 10

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
            },
        },
        {

            // Table: Connectivity Fields: 11

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
            },
        },
        {

            // Table: Environment Fields: 18

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
            },
        },
        {

            
            // Table: Safety_Procedures Fields: 32

            table_Name: "Safety",
            section_Heading: "Safety & Security",
            columns: {
                fireSafetyEquipment: { column_Name: "Fire_Safety", display_Text: "Fire Safety Equipment", type: "radio", mandatory: true, searchable: true, radio_Options: null },
                firstAidKits: { column_Name: "First_Aid", display_Text: "First Aid", type: "radio", mandatory: true, searchable: true, radio_Options: null },
                securityPatrol: { column_Name: "Security_Patrol", display_Text: "Security Patrol", type: "radio", mandatory: true, searchable: false, radio_Options: null },
                cctv_Surveillance: { column_Name: "CCTV_Surveillance", display_Text: "CCTV Surveillance", type: "radio", mandatory: true, searchable: true, radio_Options: null },
                fireSafetySystems: { column_Name: "Fire_Safety", display_Text: "Fire Safety ", type: "radio", mandatory: false, searchable: true, radio_Options: null }, // <-- Critical fix applied here
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
            },
        },
        {

            // Table: Legal Fields: 7

            table_Name: "Legal",
            section_Heading: "Legal Restrictions",
            columns: {
                permitsAndLicenses: { column_Name: "Permits_Licenses", display_Text: "Permits & Licenses", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                customsAndImmigration: { column_Name: "Customs_Immigration", display_Text: "Customs & Immigration", type: "radio", mandatory: false, searchable: true, radio_Options: null },
                healthAndSafetyRegulations: { column_Name: "Health_Safety", display_Text: "Health & Safety Regulations", type: "radio", mandatory: false, searchable: true, radio_Options: null },
                environmentalRegulationsCompliance: { column_Name: "Environmental_Compliance", display_Text: "Environmental Compliance", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                portStateControlInspections: { column_Name: "Port_Control", display_Text: "Port Control", type: "radio", mandatory: false, searchable: false, radio_Options: null },
                quarantineServices: { column_Name: "Quarantine", display_Text: "Quarantine", type: "radio", mandatory: false, searchable: false, radio_Options: null }
            },
        },
        {

            // Table: Insurance Fields: 9

            table_Name: "Insurance",
            section_Heading: "Insurance Regulations",
            columns: {
                insuranceRequirements: { column_Name: "Insurance", display_Text: "Insurance Requirements", type: "radio", mandatory: false, searchable: true, radioOptions: null },
                liabilityInsuranceRequirements: { column_Name: "Liability_Insurance", display_Text: "Liability Insurance Requirements", type: "radio", mandatory: false, searchable: true, radioOptions: null },
                proofOfOwnershipRequired: { column_Name: "POO_Required", display_Text: "Proof of Ownership Required?", type: "radio", mandatory: false, searchable: false, radioOptions: null },
                complianceWithLocalRegulations: { column_Name: "Local_Compliance", display_Text: "Compliance With Local Regulations?", type: "radio", mandatory: false, searchable: false, radioOptions: null },
                safetyInspections: { column_Name: "Safety_Inspections", display_Text: "Safety Inspections", type: "radio", mandatory: false, searchable: false, radioOptions: null },
                certificateOfSeaworthiness: { column_Name: "Seaworthiness_Certificate", display_Text: "Seaworthiness Certificate", type: "radio", mandatory: false, searchable: false, radioOptions: null },
                dockUseRegulations: { column_Name: "Dock_Use", display_Text: "Dock Use", type: "radio", mandatory: false, searchable: false, radioOptions: null },
                environmentalComplianceCertificates: { column_Name: "Environmental_Compliance", display_Text: "Environmental Compliance Certificates", type: "radio", mandatory: false, searchable: false, radioOptions: null }
            },
        },
        {

            // Table: Pricing Fields: 9

            table_Name: "Financial",
            section_Heading: "Financial Information",
            columns: {
                mooringFees: { column_Name: "Mooring_Fees", display_Text: "Mooring Fees", type: "radio", mandatory: false, searchable: true, radioOptions: null },
                serviceCharges: { column_Name: "Service_Charges", display_Text: "Service Charges", type: "radio", mandatory: false, searchable: false, radioOptions: null },
                membershipPrograms: { column_Name: "Membership_Programs", display_Text: "Membership Programs", type: "radio", mandatory: false, searchable: false, radioOptions: null },
                paymentMethods: { column_Name: "Payment_Methods", display_Text: "Payment Methods", type: "radio", mandatory: false, searchable: true, radioOptions: null },
                pricingStructure: { column_Name: "Pricing_Structure", display_Text: "Pricing Structure", type: "radio", mandatory: false, searchable: false, radioOptions: null },
                depositRequirements: { column_Name: "Deposit", display_Text: "Deposit Requirements", type: "radio", mandatory: false, searchable: true, radioOptions: null },
                cancellationPolicies: { column_Name: "Cancellation_Policies", display_Text: "Cancellation Policies", type: "radio", mandatory: false, searchable: true, radioOptions: null },
                discountsAvailable: { column_Name: "Discounts_Available", display_Text: "Discounts Available", type: "radio", mandatory: false, searchable: false, radioOptions: null }
            },
        },
        {

            // Table: Berth_Payment Fields: 5

            table_Name: "Pricing",
            section_Heading: "Pricing Information",
            columns: {
                pricePerAnnum: { column_Name: "Price_PA", display_Text: "Price PA", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                price_pcm: { column_Name: "Price_PCM", display_Text: "Price PCM", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                pricePerWeek: { column_Name: "Price_PW", display_Text: "Price PW", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                availability: { column_Name: "Availability", display_Text: "Availability", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                annualLeaseRenewable: { column_Name: "Lease_Renewable", display_Text: "Lease Renewable", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                cancellationPolicy: { column_Name: "Cancellation_Policy", display_Text: "Cancellation Policy", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                latePaymentFees: { column_Name: "Late_Fees", display_Text: "Late Payment Fees", type: "radio", mandatory: true, searchable: true, radioOptions: null }
            },
        },
        {

            // Table: Berth_Payment Fields: 5

            table_Name: "Berth_Payment",
            section_Heading: "Billing & Payment Details",
            columns: {
                paymentTerms: { column_Name: "Payment_Terms", display_Text: "Payment Terms", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                paymentCurrency: { column_Name: "Currency", display_Text: "Payment Currency", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                preferredPaymentMethods: { column_Name: "Preferred_Payment", display_Text: "Preferred Payment", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                invoiceReceiptProcedures: { column_Name: "Invoice_Receipt", display_Text: "Invoice Receipt", type: "radio", mandatory: true, searchable: true, radioOptions: null }
            },
        },
        {

            // Table: Berth_Sales Fields: 4

            table_Name: "Berth_Sales",
            section_Heading: "Sales Information",
            columns: {
                priceLabel: { column_Name: "Price_Label", display_Text: "Price Label", type: "radio", mandatory: false, searchable: true, radioOptions: null },
                priceDrop: { column_Name: "Price_Drop", display_Text: "Price Drop", type: "radio", mandatory: false, searchable: true, radioOptions: null },
                salesCurrency: { column_Name: "Currency", display_Text: "Sales Currency", type: "radio", mandatory: false, searchable: false, radioOptions: null },
                vat: { column_Name: "VAT", display_Text: "VAT", type: "radio", mandatory: false, searchable: false, radioOptions: null }
            },
        }

    ]
};

// TRAILER CONFIGURATION 

export const Trailer_Config = {
    schema_name: "marisail",
    main_table: "Trailer_Details",
    primary_key: "Trailer_ID",
    join_tables: [ "Accessories", "Axles", "Construction", "Corrosion_Resistance", "Documentation","Loading_Transport_Features", "Performance_Handling", "Regulatory","Security_Features", "Tongue", "Trailer_Features", "Trailer_Payment","Trailer_Sales", "Tyres_Brakes", "Winches_Lighting"],
    tables: [
        {

            // Table Trailer_Details Fields 13

            table_Name: "Trailer_Details",
            section_Heading: "Identification",
            columns: {
                TrailerId:{column_Name: "Trailer_ID", display_Text: "Trailer ID", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                manufacturer: { column_Name: "Manufacturer", display_Text: "Manufacturer", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                make: { column_Name: "Make", display_Text: "Make", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                model: { column_Name: "Model", display_Text: "Model", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                year: { column_Name: "Year", display_Text: "Year", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                askingPrice: { column_Name: "Asking_Price", display_Text: "Asking Price", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                type: { column_Name: "Type", display_Text: "Type", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                gvwr: { column_Name: "GVWR", display_Text: "Gross Vehicle Weight Rating (GVWR)", type: "dual", mandatory: true, searchable: true, radioOptions: dual_Range.lbs_kgs },
                loadCapacity: { column_Name: "Load_Capacity", display_Text: "Load Capacity", type: "dual", mandatory: true, searchable: true, radioOptions: dual_Range.lbs_kgs },
                length: { column_Name: "Length", display_Text: "Length", type: "dual", mandatory: true, searchable: true, radioOptions: dual_Range.feet_metres },
                width: { column_Name: "Width", display_Text: "Width", type: "dual", mandatory: true, searchable: true, radioOptions: dual_Range.feet_metres },
                totalHeight: { column_Name: "Total_Height", display_Text: "Total Height", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                axleHeight: { column_Name: "Axle_Height", display_Text: "Axle Height From Gound", type: "radio", mandatory: true, searchable: true, radioOptions: null }
            },        
        },
        {

            // Table Construction Fields 16

            table_Name: "Construction",
            section_Heading: "Construction Materials",
            columns: {
                frameMaterial: { column_Name: "Frame_Material", display_Text: "Frame Material", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                frameCoating: { column_Name: "Frame_Coating", display_Text: "Frame Coating", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                frameCrossmember: { column_Name: "Frame_Crossmember", display_Text: "Frame Crossmember Type", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                floorMaterial: { column_Name: "Floor_Material", display_Text: "Floor Material", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                sidesMaterial: { column_Name: "Sides_Material", display_Text: "Sides Material", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                roofMaterial: { column_Name: "Roof_Material", display_Text: "Roof Material", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                userFeatures: { column_Name: "User_Features", display_Text: "User Features", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                tieDownPoints: { column_Name: "Tie_Down_Points", display_Text: "Tie-Down Points", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                frameWeld: { column_Name: "Frame_Weld", display_Text: "Frame Weld Type", type: "radio", mandatory: false, searchable: true, radioOptions: null },
                maximumApproach: { column_Name: "Maximum_Approach", display_Text: "Maximum Angle of Approach", type: "radio", mandatory: false, searchable: false, radioOptions: null },
                greasePoints: { column_Name: "Grease_Points", display_Text: "Grease Points", type: "radio", mandatory: false, searchable: false, radioOptions: null },
                bearing: { column_Name: "Bearing", display_Text: "Bearing Type", type: "radio", mandatory: false, searchable: true, radioOptions: null },
                maintenanceSchedule: { column_Name: "Maintenance_Schedule", display_Text: "Maintenance Schedule", type: "radio", mandatory: false, searchable: false, radioOptions: null },
                storage: { column_Name: "Storage", display_Text: "Storage", type: "radio", mandatory: false, searchable: false, radioOptions: null },
                toolBox: { column_Name: "Tool_Box", display_Text: "Tool Box", type: "radio", mandatory: false, searchable: false, radioOptions: null },
                bumper: { column_Name: "Bumper", display_Text: "Bumper Type", type: "radio", mandatory: false, searchable: true, radioOptions: null }
            },
        },
        {
            
            // Table Trailer_Features Fields 14

            table_Name: "Trailer_Features",
            section_Heading: "Maintenance Features",
            columns: {
                hydraulicTilt: { column_Name: "Hydraulic_Tilt", display_Text: "Hydraulic Tilt", type: "radio", mandatory: true, searchable: false, radioOptions: null },
                extendableTongue: { column_Name: "Extendable_Tongue", display_Text: "Extendable Tongue", type: "radio", mandatory: true, searchable: false, radioOptions: null },
                ramp: { column_Name: "Ramp", display_Text: "Ramp Type", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                winchPost: { column_Name: "Winch_Post", display_Text: "Winch Post", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                splashGuards: { column_Name: "Splash_Guards", display_Text: "Splash Guards", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                fenders: { column_Name: "Fenders", display_Text: "Fenders", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                sideRails: { column_Name: "Side_Rails", display_Text: "Side Rails", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                color: { column_Name: "Color", display_Text: "Color", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                deckHeight: { column_Name: "Deck_Height", display_Text: "Adjustable Deck Height", type: "radio", mandatory: false, searchable: true, radioOptions: null },
                sidePanels: { column_Name: "Side_Panels", display_Text: "Detachable Side Panels", type: "radio", mandatory: false, searchable: false, radioOptions: null },
                decals: { column_Name: "Decals", display_Text: "Decals", type: "radio", mandatory: false, searchable: false, radioOptions: null },
                storageBox: { column_Name: "Storage_Box", display_Text: "Storage Box", type: "radio", mandatory: false, searchable: false, radioOptions: null },
                lightingPackage: { column_Name: "Lighting_Package", display_Text: "Lighting Package", type: "radio", mandatory: false, searchable: false, radioOptions: null },
                suspensionUpgrade: { column_Name: "Suspension_Upgrade", display_Text: "Suspension Upgrade", type: "radio", mandatory: false, searchable: false, radioOptions: null }
            },
        },
        {

            // Table Axles Fields 9

         table_Name: 'Axles', 
         section_Heading: 'Axles & Suspension',
            columns: {
                axle: { column_Name: 'Axle', display_Text: 'Axle Type', type: 'radio', mandatory: true, searchable: true, radioOptions: null },
                axleCapacity: { column_Name: 'Axle_Capacity', display_Text: 'Axle Capacity', type: 'dual', mandatory: true, searchable: true, radioOptions: dual_Range.ton_lbs_kg },
                axleHub: { column_Name: 'Axle_Hub', display_Text: 'Axle Hub Size', type: 'dual', mandatory: true, searchable: true, radioOptions: dual_Range.cm_mm },
                axlePosition: { column_Name: 'Axle_Position', display_Text: 'Axle Position', type: 'radio', mandatory: true, searchable: false, radioOptions: null },
                suspension: { column_Name: 'Suspension', display_Text: 'Suspension Type', type: 'radio', mandatory: true, searchable: true, radioOptions: null },
                suspensionCapacity: { column_Name: 'Suspension_Capacity', display_Text: 'Suspension Capacity', type: 'dual', mandatory: true, searchable: true, radioOptions: dual_Range.ton_lbs_kg },
                axleSeal: { column_Name: 'Axle_Seal', display_Text: 'Axle Seal Type', type: 'radio', mandatory: false, searchable: true, radioOptions: null },
                dropAxleOption: { column_Name: 'Drop_Axle_Option', display_Text: 'Drop Axle Option', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                suspensionAdjustment: { column_Name: 'Suspension_Adjustment', display_Text: 'Suspension Adjustment', type: 'radio', mandatory: false, searchable: false, radioOptions: null }
            },
        },
        { 

            // Table Tyres & Brakes Fields 20

        table_Name: 'Tyres_Brakes',
        section_Heading: 'Tyres, Wheels, Brakes & Safety',
        columns: {
                tyreSize: { column_Name: 'Tyre_Size', display_Text: 'Tyre Size', type: 'dual', mandatory: true, searchable: true, radioOptions: dual_Range.cm_mm },
                tyreLoadRange: { column_Name: 'Tyre_Load_Range', display_Text: 'Tyre Load Range', type: 'radio', mandatory: true, searchable: true, radioOptions: null },
                tyreType: { column_Name: 'Tyre_Type', display_Text: 'Tyre Type', type: 'radio', mandatory: true, searchable: true, radioOptions: null },
                wheelType: { column_Name: 'Wheel_Type', display_Text: 'Wheel Type', type: 'radio', mandatory: true, searchable: true, radioOptions: null },
                wheelBolt: { column_Name: 'Wheel_Bolt', display_Text: 'Wheel Bolt Pattern', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                hubLubrication: { column_Name: 'Hub_Lubrication', display_Text: 'Hub Lubrication System', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                brakeType: { column_Name: 'Brake_Type', display_Text: 'Brake Type', type: 'radio', mandatory: true, searchable: true, radioOptions: null },
                brakeActuator: { column_Name: 'Brake_Actuator', display_Text: 'Brake Actuator', type: 'radio', mandatory: true, searchable: false, radioOptions: null },
                brakeLine: { column_Name: 'Brake_Line', display_Text: 'Brake Line Material', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                brakeDrum: { column_Name: 'Brake_Drum', display_Text: 'Brake Drum Diameter', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                brakeFluid: { column_Name: 'Brake_Fluid', display_Text: 'Brake Fluid Type', type: 'radio', mandatory: false, searchable: true, radioOptions: null },
                brakes: { column_Name: 'Brakes', display_Text: 'Brakes', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                couplerSize: { column_Name: 'Coupler_Size', display_Text: 'Coupler Size', type: 'dual', mandatory: true, searchable: true, radioOptions: dual_Range.cm_mm },
                couplerType: { column_Name: 'Coupler_Type', display_Text: 'Coupler Type', type: 'radio', mandatory: false, searchable: true, radioOptions: null },
                couplerLock: { column_Name: 'Coupler_Lock', display_Text: 'Coupler Lock Type', type: 'radio', mandatory: false, searchable: true, radioOptions: null },
                hitchClass: { column_Name: 'Hitch_Class', display_Text: 'Hitch Class', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                hitchReceiver: { column_Name: 'Hitch_Receiver', display_Text: 'Hitch Receiver Size', type: 'dual', mandatory: true, searchable: true, radioOptions: dual_Range.cm_mm },
                safetyChains: { column_Name: 'Safety_Chains', display_Text: 'Safety Chains', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                breakaway: { column_Name: 'Breakaway', display_Text: 'Breakaway System', type: 'radio', mandatory: false, searchable: false, radioOptions: null }
            },
        },
        {

            // Table Winches Lighting Fields 11

            table_Name: 'Winches_Lighting', 
            section_Heading: 'Winch & Winch Accessories',
            columns: {
                winch: { column_Name: 'Winch_Type', display_Text: 'Winch Type', type: 'radio', mandatory: true, searchable: true, radioOptions: null },
                winchCapacity: { column_Name: 'Winch_Capacity', display_Text: 'Winch Capacity', type: 'dual', mandatory: true, searchable: true, radioOptions: dual_Range.lbs_kg },
                winchRopeLength: { column_Name: 'Winch_Rope_Length', display_Text: 'Winch Rope Length', type: 'dual', mandatory: true, searchable: false, radioOptions: dual_Range.ft_mtrs },
                winchDrumMaterial: { column_Name: 'Winch_Drum_Material', display_Text: 'Winch Drum Material', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                winchGearRatio: { column_Name: 'Winch_Gear_Ratio', display_Text: 'Winch Gear Ratio', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                winchRemoteControl: { column_Name: 'Winch_Remote_Control', display_Text: 'Winch Remote Control', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                winchBrake: { column_Name: 'Winch_Brake', display_Text: 'Winch Brake Type', type: 'radio', mandatory: false, searchable: true, radioOptions: null },
                winchCable: { column_Name: 'Winch_Cable', display_Text: 'Winch Cable Type', type: 'radio', mandatory: false, searchable: true, radioOptions: null },
                winchStrapLength: { column_Name: 'Winch_Strap_Length', display_Text: 'Winch Strap Length', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                winchHandleLength: { column_Name: 'Winch_Handle_Length', display_Text: 'Winch Handle Length', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                winchMounting: { column_Name: 'Winch_Mounting', display_Text: 'Winch Mounting', type: 'radio', mandatory: false, searchable: false, radioOptions: null }
            },
        },
        {

            // Table Winches Lighting Fields 7

            table_Name: 'Winches_Lighting', 
            section_Heading: 'Lighting & Electrical',
            columns: {
                lighting: { column_Name: 'Lighting', display_Text: 'Lighting', type: 'radio', mandatory: true, searchable: false, radioOptions: null },
                lightMountingPosition: { column_Name: 'Light_Mounting_Position', display_Text: 'Light Mounting Position', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                light: { column_Name: 'Light_Type', display_Text: 'Light Type', type: 'radio', mandatory: true, searchable: true, radioOptions: null },
                electricalConnector: { column_Name: 'Electrical_Connector', display_Text: 'Electrical Connector Type', type: 'radio', mandatory: true, searchable: true, radioOptions: null },
                electricalWiring: { column_Name: 'Electrical_Wiring', display_Text: 'Electrical Wiring Type', type: 'radio', mandatory: true, searchable: true, radioOptions: null },
                battery: { column_Name: 'Battery_Type', display_Text: 'Battery Type', type: 'radio', mandatory: true, searchable: true, radioOptions: null },
                batteryCharger: { column_Name: 'Battery_Charger', display_Text: 'Battery Charger Type', type: 'radio', mandatory: true, searchable: true, radioOptions: null }
            },
        },
        {

            // Table Accessories Fields 7

            table_Name: 'Accessories',
            section_Heading: 'Accessories',
            columns: {
                spareTyreCarrier: { column_Name: 'Spare_Tyre_Carrier', display_Text: 'Spare Tyre Carrier', type: 'radio', mandatory: true, searchable: false, radioOptions: null },
                spareTyre: { column_Name: 'Spare_Tyre_Size', display_Text: 'Spare Tyre Size', type: 'dual', mandatory: true, searchable: true, radioOptions: dual_Range.cm_mm },
                spareType: { column_Name: 'Spare_Tyre_Type', display_Text: 'Spare Tyre Type', type: 'dual', mandatory: true, searchable: true, radioOptions: null},
                spareTyreLocation: { column_Name: 'Spare_Tyre_Mounting_Location', display_Text: 'Spare Tyre Mounting Location', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                jack: { column_Name: 'Jack_Type', display_Text: 'Jack Type', type: 'radio', mandatory: false, searchable: true, radioOptions: null },
                jackWheel: { column_Name: 'Jack_Wheel', display_Text: 'Jack Wheel Type', type: 'radio', mandatory: false, searchable: true, radioOptions: null },
                jackCapacity: { column_Name: 'Jack_Capacity', display_Text: 'Jack Capacity', type: 'dual', mandatory: true, searchable: true, radioOptions: dual_Range.lbs_kg },
                jackLiftHeight: { column_Name: 'Jack_Lift_Height', display_Text: 'Jack Lift Height', type: 'radio', mandatory: false, searchable: true, radioOptions: null }
            },
        },
        {
            
            // Table Loading_Transport_Features Fields 9

            table_Name: 'Loading_Transport_Features', 
            section_Heading: 'Loading & Transport Features',
            columns: {
                loading: { column_Name: 'Loading_System', display_Text: 'Loading System', type: 'dual', mandatory: true, searchable: true, radioOptions: dual_Range.ft_mtrs },
                bunks: { column_Name: 'Bunks', display_Text: 'Bunks', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                bunkMaterial: { column_Name: 'Bunk_Material', display_Text: 'Bunk Material', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                bunkWidth: { column_Name: 'Bunk_Width', display_Text: 'Bunk Width', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                bunkHeightAdjustment: { column_Name: 'Bunk_Height_Adjustment', display_Text: 'Bunk Height Adjustment', type: 'radio', mandatory: false, searchable: true, radioOptions: null },
                bunkMountingBracket: { column_Name: 'Bunk_Mounting_Bracket_Material', display_Text: 'Bunk Mounting Bracket Material', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                rollers: { column_Name: 'Rollers', display_Text: 'Rollers', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                rollerMaterial: { column_Name: 'Roller_Material', display_Text: 'Roller Material', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                rollerAxleDiameter: { column_Name: 'Roller_Axle_Diameter', display_Text: 'Roller Axle Diameter', type: 'dual', mandatory: false, searchable: false, radioOptions: dual_Range.cm_mm }
            },
        },
        {

            // Table Security Features Fields 4

            table_Name: 'Security_Features', 
            section_Heading: 'Security Features',
            columns: {
                wheelLocks: { column_Name: 'Wheel_Locks', display_Text: 'Wheel Locks', type: 'radio', mandatory: true, searchable: false, radioOptions: null },
                lock: { column_Name: 'Security_Lock', display_Text: 'Security Lock', type: 'radio', mandatory: true, searchable: true, radioOptions: null },
                alarm: { column_Name: 'Alarm', display_Text: 'Alarm System', type: 'radio', mandatory: true, searchable: false, radioOptions: null },
                gpsTrackingDevice: { column_Name: 'GPS_Tracking_Device', display_Text: 'GPS Tracking Device', type: 'radio', mandatory: true, searchable: true, radioOptions: null }
            },
        },
        {

            // Table Corrosion_Resistance Fields 2

            table_Name: 'Corrosion_Resistance', 
            section_Heading: 'Environmental & Corrosion Resistance',
            columns: {
                corrosionProtection: { column_Name: 'Corrosion_Protection', display_Text: 'Corrosion Protection', type: 'radio', mandatory: true, searchable: true, radioOptions: null },
                rustInhibitors: { column_Name: 'Rust_Inhibitors', display_Text: 'Rust Inhibitors', type: 'radio', mandatory: false, searchable: false, radioOptions: null }
            },
        },

        // Table Performance Handling Fields 3

        {
            table_Name: 'Performance_Handling', 
            section_Heading: 'Performance & Handling',
            columns: {
                maximumSpeedRating: { column_Name: 'Maximum_Speed_Rating', display_Text: 'Maximum Speed Rating', type: 'radio', mandatory: true, searchable: false, radioOptions: null },
                turningRadius: { column_Name: 'Turning_Radius', display_Text: 'Turning Radius', type: 'dual', mandatory: true, searchable: true, radioOptions: dual_Range.ft_mtrs }
            },
        },

        // Table Documentation Fields 2

        {
            table_Name: 'Documentation', 
            section_Heading: 'Documentation',
            columns: {
                ownersManual: { column_Name: 'Owners_Manual', display_Text: "Owner's Manual", type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                warranty: { column_Name: 'Warranty', display_Text: 'Warranty', type: 'radio', mandatory: false, searchable: false, radioOptions: null }
            },
        },

        // Table Regulatory Fields 4

        {
            table_Name: 'Regulatory', 
            section_Heading: 'Regulatory Compliance',
            columns: {
                dotCompliance: { column_Name: 'Dot_Compliance', display_Text: 'Dot_Compliance', type: 'radio', mandatory: false, searchable: false, radioOptions: null },//[Error: Service: Trailer, Column: DOT_Compliance not present in the database But there is a column name as Dot_Compliance]
                natmCertification: { column_Name: 'Natm_Certification', display_Text: 'Natm Certification', type: 'radio', mandatory: false, searchable: false, radioOptions: null },//[Error: Service: Trailer, Column: NATM_Certification not present in the database But there is a column name as Natm_Certification]
                euApproval: { column_Name: 'EU_Approval', display_Text: 'EU Type Approval', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                adrCompliance: { column_Name: 'ADR_Compliance', display_Text: 'ADR Compliance', type: 'radio', mandatory: false, searchable: false, radioOptions: null }
            },
        },

        // Table Tongue Fields 6

        {
            table_Name: 'Tongue', 
            section_Heading: 'Tongue',
            columns: {
                tongueMaterial: { column_Name: 'Tongue_Material', display_Text: 'Tongue Material', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                tongueShape: { column_Name: 'Tongue_Shape', display_Text: 'Tongue Shape', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                jackWheel: { column_Name: 'Jack_Wheel', display_Text: 'Tongue Jack Wheel Size', type: 'dual', mandatory: true, searchable: true, radioOptions: dual_Range.cm_mm },
                jackType: { column_Name: 'Jack_Type', display_Text: 'Tongue Jack Type', type: 'radio', mandatory: false, searchable: true, radioOptions: null },
                tongueWeight: { column_Name: 'Tongue_Weight', display_Text: 'Tongue Weight', type: 'dual', mandatory: true, searchable: true, radioOptions: dual_Range.lbs_kgs },
                tongueWeightRatio: { column_Name: 'Tongue_Weight_Ratio', display_Text: 'Tongue Weight Ratio', type: 'radio', mandatory: false, searchable: false, radioOptions: null }
            },
        },

        // Table Trailer_Payment Fields 4

        {
            table_Name: 'Trailer_Payment', 
            section_Heading: 'Payment Terms',
            columns: {
                paymentTerms: { column_Name: 'Payment_Terms', display_Text: 'Payment Terms', type: 'radio', mandatory: true, searchable: false, radioOptions: null },
                currency: { column_Name: 'Currency', display_Text: 'Currency', type: 'radio', mandatory: true, searchable: false, radioOptions: null },
                preferredPayment: { column_Name: 'Preferred_Payment', display_Text: 'Preferred Payment Methods', type: 'radio', mandatory: true, searchable: false, radioOptions: null },
                invoiceReceipt: { column_Name: 'Invoice_Receipt', display_Text: 'Invoice & Receipt Procedures', type: 'radio', mandatory: true, searchable: false, radioOptions: null }
            },
        },

        // Table Trailer_Sales Fields 4

        {
            table_Name: 'Trailer_Sales',
            section_Heading: 'Trailer_Sales',
            columns: {
                priceLabel: { column_Name: 'Price_Label', display_Text: 'Price Label', type: 'radio', mandatory: false, searchable: true, radioOptions: null },
                priceDrop: { column_Name: 'Price_Drop', display_Text: 'Price Drop', type: 'radio', mandatory: false, searchable: true, radioOptions: null },
                currency: { column_Name: 'Currency', display_Text: 'Currency', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                vat: { column_Name: 'VAT', display_Text: 'VAT', type: 'radio', mandatory: false, searchable: false, radioOptions: null }
            },
        }
    ]   
};

// CHARTER CONFIGURATION 

export const Charter_Config = {
   
    schema_name: "marisail",
    main_table: "Accomodation",

    primary_key: "Charter_ID",
    join_tables: ["Charter_Costs", "Charter_Date", "Charter_Food", "Charter_Insurance","Charter_Location", "Charter_Payment", "Charter_Policy", "Charter_Requirements","Charter_Safety", "Costs", "Crew",  "Food", "Policy","Requirements", "Sales"],

    
    tables: [
        {

            // Table Accommodation Fields 9

            table_Name: "Accomodation",
            section_Heading: "General Information",
            columns: {
                vesselID: { column_Name: "Vessel_ID", display_Text: "Vessel ID", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                charterID: { column_Name: "Charter_ID", display_Text: "Charter ID", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                guestCapacity: { column_Name: "Guest_Capacity", display_Text: "Guest Capacity", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                bedroomConfiguration: { column_Name: "Bedroom_Configuration", display_Text: "Bedroom Configuration", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                bathroomConfiguration: { column_Name: "Bathroom_Configuration", display_Text: "Bathroom Configuration", type: "radio", mandatory: true, searchable: false, radioOptions: null },
                crewAccommodations: { column_Name: "Crew_Accommodation", display_Text: "Crew Accommodation", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                accessibilityInformation: { column_Name: "Accessibility_Information", display_Text: "Accessibility Information", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                cleaningAndMaintenanceProcedures: { column_Name: "Maintenance_Procedures", display_Text: "Maintenance Procedures", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                vesselDecorAndSetupRequests: { column_Name: "Yacht_Decor", display_Text: "Vessel Decor", type: "radio", mandatory: true, searchable: false, radioOptions: null }
            },        
        },
        {

            // Table Charter_Location Fields 9

            table_Name: "Charter_Location",
            section_Heading: "Charter Logistics",
            columns: {
                boardingPortArrivalTime: { column_Name: "Arrival_Time", display_Text: "Boarding Arrival Time", type: "timestamp", mandatory: true, searchable: false, radioOptions: null },
                boardingPortDepartureTime: { column_Name: "Departure_Time", display_Text: "Boarding Departure Time", type: "timestamp", mandatory: true, searchable: false, radioOptions: null },
                summerCruisingAreas: { column_Name: "Summer_Cruising_Area", display_Text: "Summer Cruising Areas", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                boardingPort: { column_Name: "Boarding_Port_Time", display_Text: "Boarding Port", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                boardingPort: { column_Name: "Boardingport_Time", display_Text: "Boarding Port", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                winterCruisingAreas: { column_Name: "Winter_Cruising_Area", display_Text: "Winter Cruising Areas", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                embarkationAndDisembarkationLogistics: { column_Name: "Logistics", display_Text: "Embarkation & Disembarkation", type: "radio", mandatory: true, searchable: false, radioOptions: null },
                disembarkationPort: { column_Name: "Disembarkationport_Time", display_Text: "Disembarkation Port", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                dockingAndMooringInstructions: { column_Name: "Mooring_Instructions", display_Text: "Mooring Instructions", type: "radio", mandatory: true, searchable: true, radioOptions: null }
            },
        },
        {

            // Table Requirements Fields 7

            table_Name: "Requirements",
            section_Heading: "Customer Requirements",
            columns: {
                carParkingAvailable: { column_Name: "Car_Parking", display_Text: "Car Parking Available?", type: "radio", mandatory: true, searchable: true, radioOptions: ["Yes", "No"] },
                specialRequirementsRequests: { column_Name: "Special_Requirements", display_Text: "Special Requirements", type: "radio", mandatory: true, searchable: false, radioOptions: null }
            },
        },
        {

            // Table Policy Fields 9

            table_Name: "Policy",
            section_Heading: "Policy Information",
            columns: {
                smokingPolicy: { column_Name: "Smoking_Policy", display_Text: "Smoking Policy", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                petFriendlyPolicy: { column_Name: "Pet_Policy", display_Text: "Pet Policy", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                localRegulationsAndRestrictions: { column_Name: "Local_Regulations", display_Text: "Local Regulations", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                charterAgreementTermsAndConditions: { column_Name: "Charter_TCs", display_Text: "Charter T&Cs", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                environmentalPolicies: { column_Name: "Environmental_Policies", display_Text: "Environmental Policies", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                waterConservationMeasures: { column_Name: "Water_Conservation", display_Text: "Water Conservation Measures", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                wasteManagementProtocols: { column_Name: "Waste_Management", display_Text: "Waste Management Protocols", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                alcoholPolicy: { column_Name: "Alcohol", display_Text: "Alcohol Policy", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                photographyPolicy: { column_Name: "Photography_Policies", display_Text: "Photography Policies", type: "radio", mandatory: true, searchable: true, radioOptions: null }
            },
        },
        {

            // Table Charter_Safety Fields 8

            table_Name: "Charter_Safety",
            section_Heading: "Safety & Security",
            columns: {
                weatherContingencyPlans: { column_Name: "Weather_Contingency", display_Text: "Weather Contingency Plans", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                emergencyProcedures: { column_Name: "Emergency_Procedures", display_Text: "Emergency Procedures", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                medicalFacilitiesOnboard: { column_Name: "Medical_Facilities", display_Text: "Medical Facilities Onboard", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                emergencyContacts: { column_Name: "Emergency_Contacts", display_Text: "Emergency Contacts", type: "radio", mandatory: true, searchable: false, radioOptions: null },
                weatherForecastServices: { column_Name: "Weather_Forecast", display_Text: "Weather Forecast Services", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                securityMeasures: { column_Name: "Security_Measures", display_Text: "Security Measures", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                guestOrientationAndSafetyBriefing: { column_Name: "Safety_Briefing", display_Text: "Guest Safety Briefing", type: "radio", mandatory: true, searchable: true, radioOptions: null }
            },
        },
        {

            // Table Charter_Costs Fields 15

            table_Name: "Charter_Costs",
            section_Heading: "Cost Details",
            columns: {
                summerRatePerWeek: { column_Name: "Summerrate_Per_Week", display_Text: "Summer Rate Per Week", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                summerRatePerNight: { column_Name: "Summerrate_Per_Night", display_Text: "Summer Rate Per Night", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                winterRatePerWeek: { column_Name: "Winterrate_Per_week", display_Text: "Winter Rate Per week", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                winterRatePerNight: { column_Name: "Winterrate_Per_Night", display_Text: "Winter Rate Per Night", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                securityDepositAmount: { column_Name: "Deposit_Amount", display_Text: "Deposit Amount", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                totalPrice: { column_Name: "Total_Price", display_Text: "Total Price", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                refundableDeposit: { column_Name: "Refundable_Deposit", display_Text: "Refundable Deposit?", type: "radio", mandatory: true, searchable: true, radioOptions: ["Yes", "No"] },
                additionalFuelCosts: { column_Name: "Additional_Fuel", display_Text: "Additional Fuel Costs?", type: "radio", mandatory: true, searchable: false, radioOptions: ["Yes", "No"] },
                additionalFees: { column_Name: "Additional_Fees", display_Text: "Additional Fees", type: "radio", mandatory: true, searchable: false, radioOptions: null },
                fuelIncluded: { column_Name: "Fuel_Included", display_Text: "Fuel Included?", type: "radio", mandatory: true, searchable: true, radioOptions: ["Yes", "No"] },
                lateCheckInCheckOutFees: { column_Name: "Late_Fees", display_Text: "Late Fees", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                insuranceForGuestsPersonalBelongings: { column_Name: "Guest_Insurance", display_Text: "Guest Insurance Available", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                insuranceCoverageDetails: { column_Name: "Charter_Insurance", display_Text: "Charter Insurance ", type: "radio", mandatory: true, searchable: true, radioOptions: null } ,
                vatdeta: { column_Name: "VAT", display_Text: "Insurance Coverage", type: "radio", mandatory: true, searchable: true, radioOptions: null }  
            },
        },
        {

            // Table Charter_Date Fields 7
          
            table_Name: "Charter_Date",
            section_Heading: "Charter Date",
            columns: {
                minimumNightsPolicy: { column_Name: "Minimum_Nights", display_Text: "Minimum Nights Policy", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                datesAvailable: { column_Name: "Dates_Available", display_Text: "Dates Available", type: "date", mandatory: true, searchable: true, radioOptions: null },
                cancellationPolicy: { column_Name: "Cancellation_Policy", display_Text: "Cancellation Policy", type: "radio", mandatory: true, searchable: false, radioOptions: null },
                startDate: { column_Name: "Start_Date", display_Text: "Start Date", type: "date", mandatory: true, searchable: true, radioOptions: null },
                endDate: { column_Name: "End_Date", display_Text: "End Date", type: "date", mandatory: true, searchable: true, radioOptions: null }, 
                numberNights: { column_Name: "Number_Nights", display_Text: "Number Nights", type: "radio", mandatory: true, searchable: true, radioOptions: null }
            },
        },
        {

           // Table: Charter_Payment Fields: 4

            table_Name: "Charter_Payment",
            section_Heading: "Payment Information",
            columns: {
                paymentTerms: { column_Name: "Payment_Terms", display_Text: "Payment Terms", type: "radio", mandatory: true, searchable: false, radioOptions: null },
                paymentCurrency: { column_Name: "Currency", display_Text: "Payment Currency", type: "radio", mandatory: true, searchable: false, radioOptions: null },
                preferredPaymentMethods: { column_Name: "Preferred_Payment", display_Text: "Preferred Payment Method", type: "radio", mandatory: true, searchable: false, radioOptions: null },
                invoiceReceiptProcedures: { column_Name: "Invoice_Receipt", display_Text: "Invoice Receipting Procedures", type: "radio", mandatory: true, searchable: false, radioOptions: null }
            },
        },
        {

            /// Table: Sales Fields: 4

            table_Name: "Sales",
            section_Heading: "Sales Information",
            columns: {
                priceLabel: { column_Name: "Price_Label", display_Text: "Price Label", type: "radio", mandatory: true, searchable: true, radioOptions: null },
                priceDrop: { column_Name: "Price_Drop", display_Text: "Price Drop", type: "radio", mandatory: true, searchable: true, radioOptions: null }, 
                salesCalculate: { column_Name: "Calculate", display_Text: "Calculate", type: "radio", mandatory: true, searchable: false, radioOptions: null }            
            },
        }
    ]
};

// TRANSPORT CONFIGURATION 

export const Transport_Config = {
    schema_name: 'marisail',
    main_table: 'Job',
    primary_key: 'Transport_ID',
    join_tables: ['Compliance','Haulier','Vessel_Details', 'Questions', 'Reviews', 'Transportation_Contacts', 'Transportation_Payment', 'Transportation_Quotes', 'Transportation_Sales'],
    tables: [
        {

            // Table: Job Fields: 23

            table_Name: 'Job',
            section_Heading: 'Job Description',
            columns: {
                TransportId: { column_Name: 'Transport_ID', display_Text: 'Transport  ID', type: 'radio', mandatory: false, searchable: true, radioOptions: null },
                category: { column_Name: 'Category', display_Text: 'Category', type: 'radio', mandatory: true, searchable: true, radioOptions: null },
                title: { column_Name: 'Title', display_Text: 'Title', type: 'radio', mandatory: true, searchable: true, radioOptions: null },
                description: { column_Name: 'Description', display_Text: 'Description', type: 'radio', mandatory: true, searchable: true, radioOptions: null },
                deadlineDate: { column_Name: 'Deadline_Date', display_Text: 'Deadline Date', type: 'date', mandatory: true, searchable: true, radioOptions: null },
                timescale: { column_Name: 'Timescale', display_Text: 'Timescale', type: 'date', mandatory: true, searchable: true, radioOptions: null },
                preferredDate: { column_Name: 'Preferred_Date', display_Text: 'Preferred Date', type: 'date', mandatory: true, searchable: true, radioOptions: null },
                international: { column_Name: 'International', display_Text: 'International', type: 'radio', mandatory: true, searchable: true, radioOptions: ['Yes', 'No'] },
                ferryRequired: { column_Name: 'Ferry_Required', display_Text: 'Ferry Required', type: 'radio', mandatory: true, searchable: true, radioOptions: ['Yes', 'No'] },
                specialHandlingRequirements: { column_Name: 'Special_Handling', display_Text: 'Special Handling', type: 'radio', mandatory: true, searchable: true, radioOptions: null },
                departureLoadingEquipmentNeeded: { column_Name: 'Loading_Equipment', display_Text: 'Loading Equipment Required?', type: 'radio', mandatory: true, searchable: true, radioOptions: ['Yes', 'No'] },
                destinationUnloadingEquipmentNeeded: { column_Name: 'Unloading_Equipment', display_Text: 'Unloading Equipment Required?', type: 'radio', mandatory: true, searchable: true, radioOptions: ['Yes', 'No'] },
                overweightPermitNeeded: { column_Name: 'Overweight_Permit', display_Text: 'Overweight Permit Required?', type: 'radio', mandatory: true, searchable: true, radioOptions: ['Yes', 'No'] },
                oversizePermitNeeded: { column_Name: 'Oversize_Permit', display_Text: 'Oversize Permit Required?', type: 'radio', mandatory: true, searchable: true, radioOptions: ['Yes', 'No'] },
                postedDate: { column_Name: 'Posted_Date', display_Text: 'Posted Date', type: 'date', mandatory: false, searchable: true, radioOptions: null },
                ToDepartureDistance: { column_Name: 'Collection_Delivery_Distance', display_Text: 'Collection Delivery Distance', type: 'radio', mandatory: false, searchable: true, radioOptions: null },
                departureToDestinationDistance: { column_Name: 'Departure_Destination', display_Text: 'Departure Destination', type: 'radio', mandatory: false, searchable: true, radioOptions: null },
                returnJourney: { column_Name: 'Return_Journey', display_Text: 'Return Journey', type: 'radio', mandatory: false, searchable: true, radioOptions: ['Yes', 'No'] },
                roundTripDistance: { column_Name: 'Round_Trip_Distance', display_Text: 'Round Trip Distance', type: 'radio', mandatory: false, searchable: true, radioOptions: null },
                freightClass: { column_Name: 'Freight_Class', display_Text: 'Freight Class', type: 'radio', mandatory: false, searchable: true, radioOptions: null },
                numberQuotes: { column_Name: 'Number_Quotes', display_Text: 'Number Quotes', type: 'number', mandatory: false, searchable: true, radioOptions: null },
                jobDoneHaulier: { column_Name: 'Job_Done_Haulier', display_Text: 'Job Done Date', type: 'radio', mandatory: false, searchable: true, radioOptions: null },
                jobDoneDate: { column_Name: 'Job_Done_Date_Haulier', display_Text: 'Job Done Date', type: 'date', mandatory: false, searchable: true, radioOptions: null },
            },        
        },
        {

            // Table: Vessel_Details Fields: 8

            table_Name: 'Vessel_Details',
            section_Heading: 'Vessel Details',
            columns: {
                itemNumber: { column_Name: 'Item_Number', display_Text: 'Item Number', type: 'number', mandatory: true, searchable: true, radioOptions: null },
                totalNumberItems: { column_Name: 'Total_Number_Items', display_Text: 'Total Number Items', type: 'number', mandatory: true, searchable: true, radioOptions: null },
                previousInsuranceClaims: { column_Name: 'Insurance_Claims', display_Text: 'Previous Insurance Claims', type: 'radio', mandatory: true, searchable: true, radioOptions: ['Yes', 'No'] },
                existingDamage: { column_Name: 'Existing_Damage', display_Text: 'Existing Damage', type: 'radio', mandatory: true, searchable: true, radioOptions: ['Yes', 'No'] },
                damageDescription: { column_Name: 'Damage_Description', display_Text: 'Damage Description', type: 'radio', mandatory: true, searchable: true, radioOptions: null },
                vesselInsuranceType: { column_Name: 'Vessel_Insurance_Type', display_Text: 'Vessel Insurance Type', type: 'radio', mandatory: true, searchable: true, radioOptions: null },
                vesselInsuranceNotes: { column_Name: 'Vessel_Insurance_Notes', display_Text: 'Vessel Insurance Notes', type: 'radio', mandatory: true, searchable: true, radioOptions: null },
            },
        },
        {

            // Table: Transportation_Contacts Fields: 13

            table_Name: 'Transportation_Contacts',
            section_Heading: 'Contact Details',
            columns: {
                customerType: { column_Name: 'Customer_Type', display_Text: 'Customer Type', type: 'radio', mandatory: true, searchable: true, radioOptions: null },
                customerID: { column_Name: 'Customer_ID', display_Text: 'Customer ID', type: 'radio', mandatory: false, searchable: true, radioOptions: null },
                customerName: { column_Name: 'Customer_Name', display_Text: 'Customer Name', type: 'radio', mandatory: false, searchable: true, radioOptions: null },
                customerCompanyName: { column_Name: 'Customer_Company_Name', display_Text: 'Customer Company Name', type: 'radio', mandatory: false, searchable: true, radioOptions: null },
                collectionDepartureNamedContact: { column_Name: 'Collection_Contact', display_Text: 'Collection Contact', type: 'radio', mandatory: false, searchable: true, radioOptions: null },
                collectionDepartureMobile: { column_Name: 'Collection_Mobile', display_Text: 'Collection Mobile', type: 'radio', mandatory: false, searchable: true, radioOptions: null },
                deliveryDestinationNamedContact: { column_Name: 'Delivery_Contact', display_Text: 'Delivery Contact', type: 'radio', mandatory: false, searchable: true, radioOptions: null },
                collectionDepartureAddress: { column_Name: 'Collection_Address', display_Text: 'Collection Address', type: 'radio', mandatory: false, searchable: true, radioOptions: null },
                deliveryDestinationMobile: { column_Name: 'Delivery_Mobile', display_Text: 'Delivery Mobile', type: 'radio', mandatory: false, searchable: true, radioOptions: null },
                deliveryDestinationAddress: { column_Name: 'Delivery_Address', display_Text: 'Delivery Address', type: 'radio', mandatory: false, searchable: true, radioOptions: null },
                emergencyContactInformation: { column_Name: 'Emergency_Contacts', display_Text: 'Emergency Contacts', type: 'radio', mandatory: false, searchable: true, radioOptions: null },
                preferredCommunicationMethod: { column_Name: 'Preferred_Communication', display_Text: 'Preferred Communication', type: 'radio', mandatory: false, searchable: true, radioOptions: null },
            },
        },
        {

            // Table: Quotes Fields: 7

            table_Name: 'Transportation_Quotes',
            section_Heading: 'Quote Details',
            columns: {
                quote: { column_Name: 'Quote_Value', display_Text: 'Quote Value', type: 'radio', mandatory: true, searchable: false, radioOptions: null },
                quoteDescription: { column_Name: 'Quote_Description', display_Text: 'Quote Description', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                quoteDate: { column_Name: 'Quote_Date', display_Text: 'Quote Date', type: 'date', mandatory: false, searchable: false, radioOptions: null },
                declineDate: { column_Name: 'Decline_Date', display_Text: 'Decline Date', type: 'date', mandatory: false, searchable: false, radioOptions: null },
                withdrawDate: { column_Name: 'Withdraw_Date', display_Text: 'Withdraw Date', type: 'date', mandatory: false, searchable: false, radioOptions: null },
                quoteStatus: { column_Name: 'Quote_Status', display_Text: 'Quote Status', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
            },
        },
        {
            
            // Table: Questions Fields: 5

            table_Name: 'Questions',
            section_Heading: 'Customer Questions',
            columns: {
                questionDate: { column_Name: 'Question_Date', display_Text: 'Question Date', type: 'date', mandatory: true, searchable: false, radioOptions: null },
                answerDate: { column_Name: 'Answer_Date', display_Text: 'Answer Date', type: 'date', mandatory: true, searchable: false, radioOptions: null },
                transportProviderQuestions: { column_Name: 'Transport_Provider_Questions', display_Text: 'Transport Provider Questions', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                customerAnswers: { column_Name: 'Customer_Answers', display_Text: 'Customer Answers', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
            },
        },
        {
            // Table: Reviews Fields: 11

            table_Name: 'Reviews',
            section_Heading: 'Customer Reviews',
            columns: {
                customerFeedbackNotes: { column_Name: 'Customer_Feedback_Notes', display_Text: 'Customer Feedback Notes', type: 'radio', mandatory: true, searchable: false, radioOptions: null },
                customerFeedbackScore: { column_Name: 'Customer_Feedback_Score', display_Text: 'Customer Feedback Score', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                positive: { column_Name: 'Positive', display_Text: 'Positive', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                neutral: { column_Name: 'Neutral', display_Text: 'Neutral', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                negative: { column_Name: 'Negative', display_Text: 'Negative', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                reviews: { column_Name: 'Reviews', display_Text: 'Reviews', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                rating: { column_Name: 'Rating', display_Text: 'Rating', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                itemTitle: { column_Name: 'Item_Title', display_Text: 'Item Title', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                leftBy: { column_Name: 'Left_By', display_Text: 'Left By', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                comments: { column_Name: 'Comments', display_Text: 'Comments', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                date: { column_Name: 'Date', display_Text: 'Date', type: 'date', mandatory: false, searchable: false, radioOptions: null },
                jobDoneCustomer: { column_Name: 'Job_Done_Customer', display_Text: 'Job Done Date', type: 'radio', mandatory: false, searchable: true, radioOptions: null },
                jobDoneDateCustomer: { column_Name: 'Job_Done_Date_Customer', display_Text: 'Job Done Date', type: 'date', mandatory: false, searchable: true, radioOptions: null }
            },
        },
        {

            
            // Table: Haulier Fields: 18
            
            table_Name: 'Haulier',
            section_Heading: ' (Transport Provider) Details',
            columns: {
                ID: { column_Name: 'Haulier_ID', display_Text: ' ID', type: 'radio', mandatory: true, searchable: false, radioOptions: null },
                Name: { column_Name: 'Haulier_Name', display_Text: ' Name', type: 'radio', mandatory: true, searchable: false, radioOptions: null },
                Address: { column_Name: 'Haulier_Address', display_Text: ' Address', type: 'radio', mandatory: true, searchable: false, radioOptions: null },
                NumberJobs: { column_Name: 'Haulier_Number_Jobs', display_Text: ' Number Jobs', type: 'number', mandatory: true, searchable: false, radioOptions: null },
                registeredSince: { column_Name: 'Registered_Since', display_Text: 'Registered Since', type: 'radio', mandatory: true, searchable: false, radioOptions: null },
                numberVehicles: { column_Name: 'Number_Vehicles', display_Text: 'Number Vehicles', type: 'number', mandatory: true, searchable: false, radioOptions: null },
                numberDrivers: { column_Name: 'Number_Drivers', display_Text: 'Number Drivers', type: 'number', mandatory: true, searchable: false, radioOptions: null },
                verified: { column_Name: 'Verified', display_Text: 'Verified', type: 'radio', mandatory: true, searchable: false, radioOptions: null },
                TotalCustomerScore: { column_Name: 'Haulier_Total_Customer_Score', display_Text: 'Total Customer Score', type: 'radio', mandatory: true, searchable: false, radioOptions: null },
                realTimeTracking: { column_Name: 'Real_Time_Tracking', display_Text: 'Real Time Tracking', type: 'radio', mandatory: true, searchable: false, radioOptions: null }, // please check this column too as i thinkh it is mismatching with the below one 
                electronicProofOfDelivery: { column_Name: 'Electronic_POD', display_Text: 'Electronic Proof of Delivery', type: 'radio', mandatory: true, searchable: false, radioOptions: null },// have to conform it also with the database
                automatedAlertsAndNotifications: { column_Name: 'Electronic_POD', display_Text: 'Electronic POD', type: 'radio', mandatory: true, searchable: false, radioOptions: null },
                vehicleType: { column_Name: 'Vehicle_Type', display_Text: 'Vehicle Type', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                vehicleCapacity: { column_Name: 'Vehicle_Capacity', display_Text: 'Vehicle Capacity', type: 'dual', mandatory: false, searchable: false, radioOptions: dual_Range.kg_ton},
                customerServiceContactInformation: { column_Name: 'Customer_Service_Contactinfo', display_Text: 'Customer Service', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                trackingSystem: { column_Name: 'Tracking_System', display_Text: 'Tracking System', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                deliveryWindow: { column_Name: 'Delivery_Window', display_Text: 'Delivery Window', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                deliveryConfirmation: { column_Name: 'Delivery_Confirmation', display_Text: 'Delivery Confirmation', type: 'radio', mandatory: false, searchable: false, radioOptions: null }
            },
        },
        {

            // Table: Compliance Fields: 13

            table_Name: 'Compliance',
            section_Heading: 'Safety & Regulatory Compliance',
            columns: {
                safetyCertifications: { column_Name: 'Safety_Certifications', display_Text: 'Safety Certifications', type: 'radio', mandatory: true, searchable: false, radioOptions: null },
                environmentalRegulationsCompliance: { column_Name: 'Environmental_Regulations', display_Text: 'Environmental Regulation Compliance', type: 'radio', mandatory: true, searchable: false, radioOptions: null },
                hazardousMaterialsHandling: { column_Name: 'Hazardous_Materials', display_Text: 'Hazardous Material Handling', type: 'radio', mandatory: true, searchable: false, radioOptions: null },
                safetyTrainingPrograms: { column_Name: 'Safety_Training', display_Text: 'Safety Training', type: 'radio', mandatory: true, searchable: false, radioOptions: null },
                accidentReportingProcedures: { column_Name: 'Accident_Reporting', display_Text: 'Accident Reporting Procedures', type: 'radio', mandatory: true, searchable: false, radioOptions: null },
                healthAndSafetyPolicies: { column_Name: 'Health_Safety', display_Text: 'Health & Safety Policies', type: 'radio', mandatory: true, searchable: false, radioOptions: null },
                safetyAudits: { column_Name: 'Safety_Audits', display_Text: 'Safety Audits', type: 'radio', mandatory: true, searchable: false, radioOptions: null },
                riskAssessments: { column_Name: 'Risk_Assessments', display_Text: 'Risk Assessments', type: 'radio', mandatory: true, searchable: false, radioOptions: null },
                incidentManagement: { column_Name: 'Incident_Management', display_Text: 'Incident Management', type: 'radio', mandatory: true, searchable: false, radioOptions: null },
                complianceRecords: { column_Name: 'Compliance_Records', display_Text: 'Compliance Records', type: 'radio', mandatory: true, searchable: false, radioOptions: null },
                permitsAndLicenses: { column_Name: 'Permits', display_Text: 'Permits', type: 'radio', mandatory: true, searchable: false, radioOptions: null },
                transportRegulationsCompliance: { column_Name: 'Transport_Regulations', display_Text: 'Transport Regulations Compliance', type: 'radio', mandatory: true, searchable: false, radioOptions: null }
            },
        },
        {

            // Table: Transport_Payment Fields: 16

            table_Name: 'Transportation_Payment',
            section_Heading: 'Payment Details',
            columns: {
                paymentTerms: { column_Name: 'Payment_Terms', display_Text: 'Payment Terms', type: 'radio', mandatory: true, searchable: true, radioOptions: null },
                acceptedPaymentMethods: { column_Name: 'Payment_Methods', display_Text: 'Accepted Payment Methods', type: 'radio', mandatory: true, searchable: true, radioOptions: null },
                cancellationPolicy: { column_Name: 'Cancellation_Policy', display_Text: 'Cancellation Policy', type: 'radio', mandatory: true, searchable: true, radioOptions: null },
                invoiceTime: { column_Name: 'Invoice_Time', display_Text: 'Invoice Time', type: 'date', mandatory: true, searchable: true, radioOptions: null },
                latePaymentFees: { column_Name: 'Late_Fees', display_Text: 'Late Payment Fees', type: 'radio', mandatory: true, searchable: true, radioOptions: null },
                disputeResolutionTerms: { column_Name: 'Dispute_Resolution_Terms', display_Text: 'Dispute Resolution Terms', type: 'radio', mandatory: true, searchable: true, radioOptions: null },
                liabilityCoverage: { column_Name: 'Liability_Coverage', display_Text: 'Liability Coverage', type: 'radio', mandatory: true, searchable: true, radioOptions: null },
                insurancePolicy: { column_Name: 'Insurance_Policy', display_Text: 'Insurance Policy', type: 'radio', mandatory: true, searchable: true, radioOptions: null },
                insuranceCoverage: { column_Name: 'Insurance_Coverage', display_Text: 'Insurance Coverage', type: 'radio', mandatory: true, searchable: true, radioOptions: null },
                insuranceProvider: { column_Name: 'Insurance_Provider', display_Text: 'Insurance Provider', type: 'radio', mandatory: true, searchable: true, radioOptions: null },
                insuranceClaimProcess: { column_Name: 'Claim_Process', display_Text: 'Insurance Claim Process', type: 'radio', mandatory: true, searchable: true, radioOptions: null },
                preferredPaymentMethods: { column_Name: 'Preferred_Payment', display_Text: 'Preferred Payment Method', type: 'radio', mandatory: true, searchable: false, radioOptions: null },
                invoiceAndReceiptProcedures: { column_Name: 'Invoice_Receipt', display_Text: 'Invoice & Receipting Procedures', type: 'radio', mandatory: true, searchable: false, radioOptions: null },
                serviceLevelAgreement: { column_Name: 'SLA', display_Text: 'Service Level Agreement (SLA)', type: 'radio', mandatory: false, searchable: true, radioOptions: null },
                billingContactInformation: { column_Name: 'Billing_Contact', display_Text: 'Billing Contact Information', type: 'radio', mandatory: false, searchable: true, radioOptions: null }
            },
        },
        { 

            // Table: Transportation_Sales Fields: 5

            table_Name: 'Transportation_Sales',
            section_Heading: 'Price Details',
            columns: {
                priceLabel: { column_Name: 'Price_Label', display_Text: 'Price Label', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                priceDrop: { column_Name: 'Price_Drop', display_Text: 'Price Drop', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                currency: { column_Name: 'Currency', display_Text: 'Currency', type: 'radio', mandatory: false, searchable: false, radioOptions: null },
                vat: { column_Name: 'VAT', display_Text: 'VAT', type: 'radio', mandatory: false, searchable: false, radioOptions: null }
            },
        }
    ]
};

// BERTH MAPPINGS

const berth_Var_To_Column = {};
Berth_Config.tables.forEach(table => {
  Object.entries(table.columns).forEach(([field_Name, col_Info]) => {
    berth_Var_To_Column[field_Name] = col_Info.column_Name;
  });
});
const berth_Var_To_Table = {};
Berth_Config.tables.forEach(table => {
  Object.keys(table.columns).forEach(field_Name => {
    berth_Var_To_Table[field_Name] = table.table_Name;
  });
});
const berth_Unique_Table = [
  ...new Set(Berth_Config.tables.map(table => table.table_Name).filter(Boolean))
];
export { berth_Var_To_Column, berth_Var_To_Table, berth_Unique_Table };

// CHARTER MAPPINGS

const charter_Var_To_Column = {};
Charter_Config.tables.forEach(table => {
  Object.entries(table.columns).forEach(([field_Name, col_Info]) => {
    charter_Var_To_Column[field_Name] = col_Info.column_Name;
  });
});
const charter_Var_To_Table = {};
Charter_Config.tables.forEach(table => {
  Object.keys(table.columns).forEach(field_Name => {
    charter_Var_To_Table[field_Name] = table.table_Name;
  });
});
const charter_Unique_Table = [
  ...new Set(Charter_Config.tables.map(table => table.table_Name).filter(Boolean))
];
export { charter_Var_To_Column, charter_Var_To_Table, charter_Unique_Table };

// TRAILER MAPPINGS

const trailer_Var_To_Column = {};
Trailer_Config.tables.forEach(table => {
  Object.entries(table.columns).forEach(([field_Name, col_Info]) => {
    trailer_Var_To_Column[field_Name] = col_Info.column_Name;
  });
});
const trailer_Var_To_Table = {};
Trailer_Config.tables.forEach(table => {
  Object.keys(table.columns).forEach(field_Name => {
    trailer_Var_To_Table[field_Name] = table.table_Name;
  });
});
const trailer_Unique_Table = [
  ...new Set(Trailer_Config.tables.map(table => table.table_Name).filter(Boolean))
];
export { trailer_Var_To_Column, trailer_Var_To_Table, trailer_Unique_Table };

// TRANSPORT MAPPINGS 

const transport_Var_To_Column = {};
Transport_Config.tables.forEach(table => {
  if (table.columns && table.table_Name) { 
    Object.entries(table.columns).forEach(([field_Name, col_Info]) => {
      transport_Var_To_Column[field_Name] = col_Info.column_Name;
    });
  }
});
const transport_Var_To_Table = {};
Transport_Config.tables.forEach(table => {
  if (table.columns && table.table_Name) {
    Object.keys(table.columns).forEach(field_Name => {
      transport_Var_To_Table[field_Name] = table.table_Name;
    });
  }
});
const transport_Unique_Table  = [
  ...new Set(Transport_Config.tables.map(table => table.table_Name).filter(Boolean))
];
export { transport_Var_To_Column, transport_Var_To_Table, transport_Unique_Table };

// MAIN SERVICES EXPORT 

export const SERVICES = {
  berth: Berth_Config,
  trailer: Trailer_Config,
  charter: Charter_Config,
  transport: Transport_Config,
};
