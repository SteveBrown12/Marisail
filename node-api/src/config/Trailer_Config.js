
export const Trailer_Config = {
  schema_name: "Trailer",
  main_table: "Trailer_ID",
  primary_key: "Trailer_ID",
  join_tables: [
    "Accessories",
    "Axles",
    "Construction",
    "Corrosion_Resistance",
    "Documentation",
    "Loading_Transport_Features",
    "Performance_Handling",
    "Regulatory",
    "Security_Features",
    "Tongue",
    "Trailer_Features",
    "Trailer_Payment",
    "Trailer_Sales",
    "Tyres_Brakes",
    "Winches_Lighting"
  ],
  tables: [
    {
      table_Name: "Trailer_ID",
      section_Heading: "Identification",
      columns: {
        manufacturer: {
          column_Name: "Manufacturer",
          displayText: "Manufacturer",
          type: "radio",
          mandatory: true,
          searchable: true,
          radioOptions: null
        },
        make: {
          column_Name: "Make",
          displayText: "Make",
          type: "radio",
          mandatory: true,
          searchable: true,
          radioOptions: null
        },
        model: {
          column_Name: "Model",
          displayText: "Model",
          type: "radio",
          mandatory: true,
          searchable: true,
          radioOptions: null
        },
        year: {
          column_Name: "Year",
          displayText: "Year",
          type: "radio",
          mandatory: true,
          searchable: true,
          radioOptions: null
        },
        askingPrice: {
          column_Name: "Asking_Price",
          displayText: "Asking Price",
          type: "radio",
          mandatory: true,
          searchable: true,
          radioOptions: null
        },
        type: {
          column_Name: "Type",
          displayText: "Type",
          type: "radio",
          mandatory: true,
          searchable: true,
          radioOptions: null
        },
        gvwr: {
          column_Name: "GVWR",
          displayText: "Gross Vehicle Weight Rating (GVWR)",
          type: "dual",
          mandatory: true,
          searchable: true,
          radioOptions: [
            { label: "lbs", value: "lbs", id: 1 },
            { label: "Kgs", value: "Kgs", id: 2 }
          ]
        },
        loadCapacity: {
          column_Name: "Load_Capacity",
          displayText: "Load Capacity",
          type: "dual",
          mandatory: true,
          searchable: true,
          radioOptions: [
            { label: "lbs", value: "lbs", id: 1 },
            { label: "Kgs", value: "Kgs", id: 2 }
          ]
        },
        length: {
          column_Name: "Length",
          displayText: "Length",
          type: "dual",
          mandatory: true,
          searchable: true,
          radioOptions: [
            { label: "ft", value: "ft", id: 1 },
            { label: "mtrs", value: "mtrs", id: 2 }
          ]
        },
        width: {
          column_Name: "Width",
          displayText: "Width",
          type: "dual",
          mandatory: true,
          searchable: true,
          radioOptions: [
            { label: "ft", value: "ft", id: 1 },
            { label: "mtrs", value: "mtrs", id: 2 }
          ]
        },
        totalHeight: {
          column_Name: "Total_Height",
          displayText: "Total Height",
          type: "radio",
          mandatory: true,
          searchable: true,
          radioOptions: null
        },
        axleHeight: {
          column_Name: "Axle_Height",
          displayText: "Axle Height From Ground",
          type: "radio",
          mandatory: true,
          searchable: true,
          radioOptions: null
        }
      }
    },
    {
  table_Name: "Construction",
  section_Heading: "Construction Materials",
  columns: {
    frameMaterial: {
      column_Name: "Frame_Material",
      displayText: "Frame Material",
      type: "radio",
      mandatory: true,
      searchable: true,
      radioOptions: null
    },
    frameCoating: {
      column_Name: "Frame_Coating",
      displayText: "Frame Coating",
      type: "radio",
      mandatory: true,
      searchable: true,
      radioOptions: null
    },
    frameCrossmember: {
      column_Name: "Frame_Crossmember",
      displayText: "Frame Crossmember Type",
      type: "radio",
      mandatory: true,
      searchable: true,
      radioOptions: null
    },
    floorMaterial: {
      column_Name: "Floor_Material",
      displayText: "Floor Material",
      type: "radio",
      mandatory: true,
      searchable: true,
      radioOptions: null
    },
    sidesMaterial: {
      column_Name: "Sides_Material",
      displayText: "Sides Material",
      type: "radio",
      mandatory: true,
      searchable: true,
      radioOptions: null
    },
    roofMaterial: {
      column_Name: "Roof_Material",
      displayText: "Roof Material",
      type: "radio",
      mandatory: true,
      searchable: true,
      radioOptions: null
    },
    userFeatures: {
      column_Name: "User_Features",
      displayText: "User Features",
      type: "radio",
      mandatory: true,
      searchable: true,
      radioOptions: null
    },
    tieDownPoints: {
      column_Name: "Tie_Down_Points",
      displayText: "Tie-Down Points",
      type: "radio",
      mandatory: true,
      searchable: true,
      radioOptions: null
    },
    frameWeld: {
      column_Name: "Frame_Weld",
      displayText: "Frame Weld Type",
      type: "radio",
      mandatory: false,
      searchable: true,
      radioOptions: null
    },
    maximumApproach: {
      column_Name: "Maximum_Approach",
      displayText: "Maximum Angle of Approach",
      type: "radio",
      mandatory: false,
      searchable: false,
      radioOptions: null
    },
    greasePoints: {
      column_Name: "Grease_Points",
      displayText: "Grease Points",
      type: "radio",
      mandatory: false,
      searchable: false,
      radioOptions: null
    },
    bearing: {
      column_Name: "Bearing",
      displayText: "Bearing Type",
      type: "radio",
      mandatory: false,
      searchable: true,
      radioOptions: null
    },
    maintenanceSchedule: {
      column_Name: "Maintenance_Schedule",
      displayText: "Maintenance Schedule",
      type: "radio",
      mandatory: false,
      searchable: false,
      radioOptions: null
    },
    storage: {
      column_Name: "Storage",
      displayText: "Storage",
      type: "radio",
      mandatory: false,
      searchable: false,
      radioOptions: null
    },
    toolBox: {
      column_Name: "Tool_Box",
      displayText: "Tool Box",
      type: "radio",
      mandatory: false,
      searchable: false,
      radioOptions: null
    },
    bumper: {
      column_Name: "Bumper",
      displayText: "Bumper Type",
      type: "radio",
      mandatory: false,
      searchable: true,
      radioOptions: null
    }
  }
},
{
  table_Name: "Trailer_Features",
  section_Heading: "Maintenance Features",
  columns: {
    hydraulicTilt: {
      column_Name: "Hydraulic_Tilt",
      displayText: "Hydraulic Tilt",
      type: "radio",
      mandatory: true,
      searchable: false,
      radioOptions: null
    },
    extendableTongue: {
      column_Name: "Extendable_Tongue",
      displayText: "Extendable Tongue",
      type: "radio",
      mandatory: true,
      searchable: false,
      radioOptions: null
    },
    ramp: {
      column_Name: "Ramp",
      displayText: "Ramp Type",
      type: "radio",
      mandatory: true,
      searchable: true,
      radioOptions: null
    },
    winchPost: {
      column_Name: "Winch_Post",
      displayText: "Winch Post",
      type: "radio",
      mandatory: true,
      searchable: true,
      radioOptions: null
    },
    splashGuards: {
      column_Name: "Splash_Guards",
      displayText: "Splash Guards",
      type: "radio",
      mandatory: true,
      searchable: true,
      radioOptions: null
    },
    fenders: {
      column_Name: "Fenders",
      displayText: "Fenders",
      type: "radio",
      mandatory: true,
      searchable: true,
      radioOptions: null
    },
    sideRails: {
      column_Name: "Side_Rails",
      displayText: "Side Rails",
      type: "radio",
      mandatory: true,
      searchable: true,
      radioOptions: null
    },
    color: {
      column_Name: "Color",
      displayText: "Color",
      type: "radio",
      mandatory: true,
      searchable: true,
      radioOptions: null
    },
    deckHeight: {
      column_Name: "Deck_Height",
      displayText: "Adjustable Deck Height",
      type: "radio",
      mandatory: false,
      searchable: true,
      radioOptions: null
    },
    sidePanels: {
      column_Name: "Side_Panels",
      displayText: "Detachable Side Panels",
      type: "radio",
      mandatory: false,
      searchable: false,
      radioOptions: null
    },
    decals: {
      column_Name: "Decals",
      displayText: "Decals",
      type: "radio",
      mandatory: false,
      searchable: false,
      radioOptions: null
    },
    storageBox: {
      column_Name: "Storage_Box",
      displayText: "Storage Box",
      type: "radio",
      mandatory: false,
      searchable: false,
      radioOptions: null
    },
    lightingPackage: {
      column_Name: "Lighting_Package",
      displayText: "Lighting Package",
      type: "radio",
      mandatory: false,
      searchable: false,
      radioOptions: null
    },
    suspensionUpgrade: {
      column_Name: "Suspension_Upgrade",
      displayText: "Suspension Upgrade",
      type: "radio",
      mandatory: false,
      searchable: false,
      radioOptions: null
    }
  }
},{
  table_Name: "Axles",
  section_Heading: "Axles & Suspension",
  columns: {
    axle: {
      column_Name: "Axle",
      displayText: "Axle Type",
      type: "radio",
      mandatory: true,
      searchable: true,
      radioOptions: null
    },
    axleCapacity: {
      column_Name: "Axle_Capacity",
      displayText: "Axle Capacity",
      type: "dual",
      mandatory: true,
      searchable: true,
      radioOptions: [
        { label: "lbs", value: "lbs", id: 1 },
        { label: "Kgs", value: "Kgs", id: 2 }
      ]
    },
    axleHub: {
      column_Name: "Axle_Hub",
      displayText: "Axle Hub Size",
      type: "dual",
      mandatory: true,
      searchable: true,
      radioOptions: [
        { label: "cm", value: "cm", id: 1 },
        { label: "mm", value: "mm", id: 2 }
      ]
    },
    axlePosition: {
      column_Name: "Axle_Position",
      displayText: "Axle Position",
      type: "radio",
      mandatory: true,
      searchable: false,
      radioOptions: null
    },
    suspension: {
      column_Name: "Suspension",
      displayText: "Suspension Type",
      type: "radio",
      mandatory: true,
      searchable: true,
      radioOptions: null
    },
    suspensionCapacity: {
      column_Name: "Suspension_Capacity",
      displayText: "Suspension Capacity",
      type: "dual",
      mandatory: true,
      searchable: true,
      radioOptions: [
        { label: "lbs", value: "lbs", id: 1 },
        { label: "Kgs", value: "Kgs", id: 2 }
      ]
    },
    axleSeal: {
      column_Name: "Axle_Seal",
      displayText: "Axle Seal Type",
      type: "radio",
      mandatory: false,
      searchable: true,
      radioOptions: null
    },
    dropAxleOption: {
      column_Name: "Drop_Axle_Option",
      displayText: "Drop Axle Option",
      type: "radio",
      mandatory: false,
      searchable: false,
      radioOptions: null
    },
    suspensionAdjustment: {
      column_Name: "Suspension_Adjustment",
      displayText: "Suspension Adjustment",
      type: "radio",
      mandatory: false,
      searchable: false,
      radioOptions: null
    }
  }
},{
  table_Name: "Tyres_Brakes",
  section_Heading: "Tyres & Wheels",
  columns: {
    tyreSize: {
      column_Name: "Tyre_Size",
      displayText: "Tyre Size",
      type: "dual",
      mandatory: true,
      searchable: true,
      radioOptions: [
        { label: "cm", value: "cm", id: 1 },
        { label: "mm", value: "mm", id: 2 }
      ]
    },
    tyreLoadRange: {
      column_Name: "Tyre_Load_Range",
      displayText: "Tyre Load Range",
      type: "radio",
      mandatory: true,
      searchable: true,
      radioOptions: null
    },
    tyreType: {
      column_Name: "Tyre_Type",
      displayText: "Tyre Type",
      type: "radio",
      mandatory: true,
      searchable: true,
      radioOptions: null
    },
    wheelType: {
      column_Name: "Wheel_Type",
      displayText: "Wheel Type",
      type: "radio",
      mandatory: true,
      searchable: true,
      radioOptions: null
    },
    wheelBolt: {
      column_Name: "Wheel_Bolt",
      displayText: "Wheel Bolt Pattern",
      type: "radio",
      mandatory: false,
      searchable: false,
      radioOptions: null
    },
    hubLubrication: {
      column_Name: "Hub_Lubrication",
      displayText: "Hub Lubrication System",
      type: "radio",
      mandatory: false,
      searchable: false,
      radioOptions: null
    }
  }
},{
  table_Name: "Tyres_Brakes",
  section_Heading: "Tyres & Wheels",
  columns: {
    tyreSize: {
      column_Name: "Tyre_Size",
      displayText: " Tyre Size ",
      type: "dual",
      mandatory: true,
      searchable: true,
      radioOptions: [
        { label: "cm", value: "cm", id: 1 },
        { label: "mm", value: "mm", id: 2 }
      ]
    },
    tyreType: {
      column_Name: "Tyre_Type",
      displayText: " Tyre Type ",
      type: "radio",
      mandatory: true,
      searchable: true,
      radioOptions: null
    },
    tyreLoadRange: {
      column_Name: "Tyre_Load_Range",
      displayText: " Tyre Load Range ",
      type: "radio",
      mandatory: true,
      searchable: true,
      radioOptions: null
    },
    wheel: {
      column_Name: "Wheel_Type",
      displayText: " Wheel Type ",
      type: "radio",
      mandatory: true,
      searchable: true,
      radioOptions: null
    },
    wheelBolt: {
      column_Name: "Wheel_Bolt",
      displayText: " Wheel Bolt Pattern ",
      type: "radio",
      mandatory: false,
      searchable: false,
      radioOptions: null
    },
    hubLubrication: {
      column_Name: "Hub_Lubrication",
      displayText: " Hub Lubrication System ",
      type: "radio",
      mandatory: false,
      searchable: false,
      radioOptions: null
    }
  }
},{
  table_Name: "Winches_Lighting",
  section_Heading: "Winch & Winch Accessories",
  columns: {
    winch: {
      column_Name: "Winch_Type",
      displayText: "Winch Type",
      type: "radio",
      mandatory: true,
      searchable: true,
      radioOptions: null
    },
    winchCapacity: {
      column_Name: "Winch_Capacity",
      displayText: "Winch Capacity",
      type: "dual",
      mandatory: true,
      searchable: true,
      radioOptions: [
        { label: "lbs", value: "lbs", id: 1 },
        { label: "Kgs", value: "Kgs", id: 2 }
      ]
    },
    winchRopeLength: {
      column_Name: "Winch_Rope_Length",
      displayText: "Winch Rope Length",
      type: "dual",
      mandatory: true,
      searchable: false,
      radioOptions: [
        { label: "ft", value: "ft", id: 1 },
        { label: "mtrs", value: "mtrs", id: 2 }
      ]
    },
    winchDrumMaterial: {
      column_Name: "Winch_Drum_Material",
      displayText: "Winch Drum Material",
      type: "radio",
      mandatory: false,
      searchable: false,
      radioOptions: null
    },
    winchGearRatio: {
      column_Name: "Winch_Gear_Ratio",
      displayText: "Winch Gear Ratio",
      type: "radio",
      mandatory: false,
      searchable: false,
      radioOptions: null
    },
    winchRemoteControl: {
      column_Name: "Winch_Remote_Control",
      displayText: "Winch Remote Control",
      type: "radio",
      mandatory: false,
      searchable: false,
      radioOptions: null
    },
    winchBrake: {
      column_Name: "Winch_Brake",
      displayText: "Winch Brake Type",
      type: "radio",
      mandatory: false,
      searchable: true,
      radioOptions: null
    },
    winchCable: {
      column_Name: "Winch_Cable",
      displayText: "Winch Cable Type",
      type: "radio",
      mandatory: false,
      searchable: true,
      radioOptions: null
    },
    winchStrapLength: {
      column_Name: "Winch_Strap_Length",
      displayText: "Winch Strap Length",
      type: "radio",
      mandatory: false,
      searchable: false,
      radioOptions: null
    },
    winchHandleLength: {
      column_Name: "Winch_Handle_Length",
      displayText: "Winch Handle Length",
      type: "radio",
      mandatory: false,
      searchable: false,
      radioOptions: null
    },
    winchMounting: {
      column_Name: "Winch_Mounting",
      displayText: "Winch Mounting",
      type: "radio",
      mandatory: false,
      searchable: false,
      radioOptions: null
    }
  }
},{
  table_Name: "Winches_Lighting",
  section_Heading: "Lighting & Electrical",
  columns: {
    lighting: {
      column_Name: "Lighting",
      displayText: "Lighting",
      type: "radio",
      mandatory: true,
      searchable: false,
      radioOptions: null
    },
    lightMountingPosition: {
      column_Name: "Light_Mounting_Position",
      displayText: "Light Mounting Position",
      type: "radio",
      mandatory: false,
      searchable: false,
      radioOptions: null
    },
    light: {
      column_Name: "Light_Type",
      displayText: "Light Type",
      type: "radio",
      mandatory: true,
      searchable: true,
      radioOptions: null
    },
    electricalConnector: {
      column_Name: "Electrical_Connector",
      displayText: "Electrical Connector Type",
      type: "radio",
      mandatory: true,
      searchable: true,
      radioOptions: null
    },
    electricalWiring: {
      column_Name: "Electrical_Wiring",
      displayText: "Electrical Wiring Type",
      type: "radio",
      mandatory: true,
      searchable: true,
      radioOptions: null
    },
    battery: {
      column_Name: "Battery_Type",
      displayText: "Battery Type",
      type: "radio",
      mandatory: true,
      searchable: true,
      radioOptions: null
    },
    batteryCharger: {
      column_Name: "Battery_Charger",
      displayText: "Battery Charger Type",
      type: "radio",
      mandatory: true,
      searchable: true,
      radioOptions: null
    }
  }
},{
  table_Name: "Accessories",
  section_Heading: "Accessories",
  columns: {
    spareTyreCarrier: {
      column_Name: "Spare_Tyre_Carrier",
      displayText: "Spare Tyre Carrier",
      type: "radio",
      mandatory: true,
      searchable: false,
      radioOptions: null
    },
    spareTyre: {
      column_Name: "Spare_Tyre_Size",
      displayText: "Spare Tyre Size",
      type: "dual",
      mandatory: true,
      searchable: true,
      radioOptions: [
        { label: "cm", value: "cm", id: 1 },
        { label: "mm", value: "mm", id: 2 }
      ]
    },
    spareTyreLocation: {
      column_Name: "Spare_Tyre_Mounting_Location",
      displayText: "Spare Tyre Mounting Location",
      type: "radio",
      mandatory: false,
      searchable: false,
      radioOptions: null
    },
    jack: {
      column_Name: "Jack_Type",
      displayText: "Jack Type",
      type: "radio",
      mandatory: false,
      searchable: true,
      radioOptions: null
    },
    jackWheel: {
      column_Name: "Jack_Wheel",
      displayText: "Jack Wheel Type",
      type: "radio",
      mandatory: false,
      searchable: true,
      radioOptions: null
    },
    jackCapacity: {
      column_Name: "Jack_Capacity",
      displayText: "Jack Capacity",
      type: "dual",
      mandatory: true,
      searchable: true,
      radioOptions: [
        { label: "lbs", value: "lbs", id: 1 },
        { label: "Kgs", value: "Kgs", id: 2 }
      ]
    },
    jackLiftHeight: {
      column_Name: "Jack_Lift_Height",
      displayText: "Jack Lift Height",
      type: "radio",
      mandatory: false,
      searchable: true,
      radioOptions: null
    }
  }
},{
  table_Name: "Loading_Transport_Features",
  section_Heading: "Loading & Transport Features",
  columns: {
    loading: {
      column_Name: "Loading_System",
      displayText: "Loading System",
      type: "dual",
      mandatory: true,
      searchable: true,
      radioOptions: [
        { label: "ft", value: "ft", id: 1 },
        { label: "mtrs", value: "mtrs", id: 2 }
      ]
    },
    bunks: {
      column_Name: "Bunks",
      displayText: "Bunks",
      type: "radio",
      mandatory: false,
      searchable: false,
      radioOptions: null
    },
    bunkMaterial: {
      column_Name: "Bunk_Material",
      displayText: "Bunk Material",
      type: "radio",
      mandatory: false,
      searchable: false,
      radioOptions: null
    },
    bunkWidth: {
      column_Name: "Bunk_Width",
      displayText: "Bunk Width",
      type: "radio",
      mandatory: false,
      searchable: false,
      radioOptions: null
    },
    bunkHeightAdjustment: {
      column_Name: "Bunk_Height_Adjustment",
      displayText: "Bunk Height Adjustment",
      type: "radio",
      mandatory: false,
      searchable: true,
      radioOptions: null
    },
    bunkMountingBracket: {
      column_Name: "Bunk_Mounting_Bracket_Material",
      displayText: "Bunk Mounting Bracket Material",
      type: "radio",
      mandatory: false,
      searchable: false,
      radioOptions: null
    },
    rollers: {
      column_Name: "Rollers",
      displayText: "Rollers",
      type: "radio",
      mandatory: false,
      searchable: false,
      radioOptions: null
    },
    rollerMaterial: {
      column_Name: "Roller_Material",
      displayText: "Roller Material",
      type: "radio",
      mandatory: false,
      searchable: false,
      radioOptions: null
    },
    rollerAxleDiameter: {
      column_Name: "Roller_Axle_Diameter",
      displayText: "Roller Axle Diameter",
      type: "dual",
      mandatory: false,
      searchable: false,
      radioOptions: [
        { label: "cm", value: "cm", id: 1 },
        { label: "mm", value: "mm", id: 2 }
      ]
    }
  }
}
,{
  table_Name: "Security_Features",
  section_Heading: "Security Features",
  columns: {
    wheelLocks: {
      column_Name: "Wheel_Locks",
      displayText: "Wheel Locks",
      type: "radio",
      mandatory: true,
      searchable: false,
      radioOptions: null
    },
    lock: {
      column_Name: "Security_Lock",
      displayText: "Security Lock",
      type: "radio",
      mandatory: true,
      searchable: true,
      radioOptions: null
    },
    alarm: {
      column_Name: "Alarm",
      displayText: "Alarm System",
      type: "radio",
      mandatory: true,
      searchable: false,
      radioOptions: null
    },
    gpsTrackingDevice: {
      column_Name: "GPS_Tracking_Device",
      displayText: "GPS Tracking Device",
      type: "radio",
      mandatory: true,
      searchable: true,
      radioOptions: null
    }
  }
}
,{
  table_Name: "Corrosion_Resistance",
  section_Heading: "Environmental & Corrosion Resistance",
  columns: {
    corrosionProtection: {
      column_Name: "Corrosion_Protection",
      displayText: "Corrosion Protection",
      type: "radio",
      mandatory: true,
      searchable: true,
      radioOptions: null
    },
    rustInhibitors: {
      column_Name: "Rust_Inhibitors",
      displayText: "Rust Inhibitors",
      type: "radio",
      mandatory: false,
      searchable: false,
      radioOptions: null
    }
  }
},{
  table_Name: "Performance_Handling",
  section_Heading: "Performance & Handling",
  columns: {
    maximumSpeedRating: {
      column_Name: "Maximum_Speed_Rating",
      displayText: "Maximum Speed Rating",
      type: "radio",
      mandatory: true,
      searchable: false,
      radioOptions: null
    },
    turningRadius: {
      column_Name: "Turning_Radius",
      displayText: "Turning Radius",
      type: "dual",
      mandatory: true,
      searchable: true,
      radioOptions: [
        { label: "ft", value: "ft", id: 1 },
        { label: "mtrs", value: "mtrs", id: 2 }
      ]
    }
  }
},{
  table_Name: "Tongue",
  section_Heading: "Tongue",
  columns: {
    tongueMaterial: {
      column_Name: "Tongue_Material",
      displayText: "Tongue Material",
      type: "radio",
      mandatory: false,
      searchable: false,
      radioOptions: null
    },
    tongueShape: {
      column_Name: "Tongue_Shape",
      displayText: "Tongue Shape",
      type: "radio",
      mandatory: false,
      searchable: false,
      radioOptions: null
    },
    jackWheel: {
      column_Name: "Jack_Wheel",
      displayText: "Tongue Jack Wheel Size",
      type: "dual",
      mandatory: true,
      searchable: true,
      radioOptions: [
        { label: "cm", value: "cm", id: 1 },
        { label: "mm", value: "mm", id: 2 }
      ]
    },
    jackType: {
      column_Name: "Jack_Type",
      displayText: "Tongue Jack Type",
      type: "radio",
      mandatory: false,
      searchable: true,
      radioOptions: null
    },
    tongueWeight: {
      column_Name: "Tongue_Weight",
      displayText: "Tongue Weight",
      type: "dual",
      mandatory: true,
      searchable: true,
      radioOptions: [
        { label: "Kg", value: "Kg", id: 1 },
        { label: "Ton", value: "Ton", id: 2 }
      ]
    },
    tongueWeightRatio: {
      column_Name: "Tongue_Weight_Ratio",
      displayText: "Tongue Weight Ratio",
      type: "radio",
      mandatory: false,
      searchable: false,
      radioOptions: null
    }
  }
}
,{
  table_Name: "Regulatory",
  section_Heading: "Regulatory Compliance",
  columns: {
    dotCompliance: {
      column_Name: "DOT_Compliance",
      displayText: "DOT Compliance",
      type: "radio",
      mandatory: false,
      searchable: false,
      radioOptions: null
    },
    natmCertification: {
      column_Name: "NATM_Certification",
      displayText: "NATM Certification",
      type: "radio",
      mandatory: false,
      searchable: false,
      radioOptions: null
    },
    euApproval: {
      column_Name: "EU_Approval",
      displayText: "EU Type Approval",
      type: "radio",
      mandatory: false,
      searchable: false,
      radioOptions: null
    },
    adrCompliance: {
      column_Name: "ADR_Compliance",
      displayText: "ADR Compliance",
      type: "radio",
      mandatory: false,
      searchable: false,
      radioOptions: null
    }
  }
},{
  table_Name: "Trailer_Payment",
  section_Heading: "Payment Terms",
  columns: {
    paymentTerms: {
      column_Name: "Payment_Terms",
      displayText: "Payment Terms",
      type: "radio",
      mandatory: true,
      searchable: false,
      radioOptions: null
    },
    currency: {
      column_Name: "Currency",
      displayText: "Currency",
      type: "radio",
      mandatory: true,
      searchable: false,
      radioOptions: null
    },
    preferredPayment: {
      column_Name: "Preferred_Payment",
      displayText: "Preferred Payment Methods",
      type: "radio",
      mandatory: true,
      searchable: false,
      radioOptions: null
    },
    invoiceReceipt: {
      column_Name: "Invoice_Receipt",
      displayText: "Invoice & Receipt Procedures",
      type: "radio",
      mandatory: true,
      searchable: false,
      radioOptions: null
    }
  }
}
,{
  table_Name: "Trailer_Sales",
  section_Heading: "Trailer Sales",
  columns: {
    priceLabel: {
      column_Name: "Price_Label",
      displayText: "Price Label",
      type: "radio",
      mandatory: false,
      searchable: true,
      radioOptions: null
    },
    priceDrop: {
      column_Name: "Price_Drop",
      displayText: "Price Drop",
      type: "radio",
      mandatory: false,
      searchable: true,
      radioOptions: null
    },
    currency: {
      column_Name: "Currency",
      displayText: "Currency",
      type: "radio",
      mandatory: false,
      searchable: false,
      radioOptions: null
    },
    vat: {
      column_Name: "VAT",
      displayText: "VAT",
      type: "radio",
      mandatory: false,
      searchable: false,
      radioOptions: null
    }
  }
}











  ]
  
};

// Example structure
