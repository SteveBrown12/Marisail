export const varToScreen = {
  identification: {
    type: "select",
    displayText: "Identification",
    radioOptions: null,
  },
  trailerID: { type: "select", displayText: "Trailer_ID", radioOptions: null },
  manufacturer: {
    type: "select",
    displayText: "Manufacturer",
    radioOptions: null,
  },
  make: { type: "select", displayText: "Make", radioOptions: null },
  model: { type: "select", displayText: "Model", radioOptions: null },
  year: { type: "select", displayText: "Year", radioOptions: null },
  askingPrice: {
    type: "select",
    displayText: "Asking Price",
    radioOptions: null,
  },

  basics: { type: "select", displayText: "Basics", radioOptions: null },
  type: { type: "select", displayText: "Type", radioOptions: null },
  gvwr: {
    type: "range",
    displayText: "Gross Vehicle Weight Rating (GVWR)",
    radioOptions: [
      { label: "lbs", value: "lbs", id: 1 },
      { label: "Kgs", value: "Kgs", id: 2 },
    ],
  },
  loadCapacity: {
    type: "range",
    displayText: "Load Capacity",
    radioOptions: [
      { label: "lbs", value: "lbs", id: 1 },
      { label: "Kgs", value: "Kgs", id: 2 },
    ],
  },
  length: {
    type: "range",
    displayText: "Length",
    radioOptions: [
      { label: "ft", value: "ft", id: 1 },
      { label: "mtrs", value: "mtrs", id: 2 },
    ],
  },
  width: {
    type: "range",
    displayText: "Width",
    radioOptions: [
      { label: "ft", value: "ft", id: 1 },
      { label: "mtrs", value: "mtrs", id: 2 },
    ],
  },
  totalHeight: {
    type: "select",
    displayText: "Total Height",
    radioOptions: null,
  },
  axleHeightFromGround: {
    type: "select",
    displayText: "Axle Height From Ground",
    radioOptions: null,
  },

  constructionMaterials: {
    type: "select",
    displayText: "Construction Materials",
    radioOptions: null,
  },
  frameMaterial: {
    type: "select",
    displayText: "Frame Material",
    radioOptions: null,
  },
  frameCoating: {
    type: "select",
    displayText: "Frame Coating",
    radioOptions: null,
  },
  frameCrossmemberType: {
    type: "select",
    displayText: "Frame Crossmember Type",
    radioOptions: null,
  },
  maximumAngleOfApproach: {
    type: "select",
    displayText: "Maximum Angle Of Approach",
    radioOptions: null,
  },
  frameWeldType: {
    type: "select",
    displayText: "Frame Weld Type",
    radioOptions: null,
  },
  floorMaterial: {
    type: "select",
    displayText: "Floor Material",
    radioOptions: null,
  },
  sidesMaterial: {
    type: "select",
    displayText: "Sides Material",
    radioOptions: null,
  },
  roofMaterial: {
    type: "select",
    displayText: "Roof Material",
    radioOptions: null,
  },

  maintenanceFeatures: {
    type: "select",
    displayText: "Maintenance Features",
    radioOptions: null,
  },
  greasePoints: {
    type: "select",
    displayText: "Grease Points",
    radioOptions: null,
  },
  bearingType: {
    type: "select",
    displayText: "Bearing Type",
    radioOptions: null,
  },
  maintenanceSchedule: {
    type: "select",
    displayText: "Maintenance Schedule",
    radioOptions: null,
  },

  userFeatures: {
    type: "select",
    displayText: "User Features",
    radioOptions: null,
  },
  storage: { type: "select", displayText: "Storage", radioOptions: null },
  tieDownPoints: {
    type: "select",
    displayText: "Tie Down Points",
    radioOptions: null,
  },
  toolBox: { type: "select", displayText: "Tool Box", radioOptions: null },
  bumperType: {
    type: "select",
    displayText: "Bumper Type",
    radioOptions: null,
  },

  specialFeatures: {
    type: "select",
    displayText: "Special Features",
    radioOptions: null,
  },
  hydraulicTilt: {
    type: "select",
    displayText: "Hydraulic Tilt",
    radioOptions: null,
  },
  extendableTongue: {
    type: "select",
    displayText: "Extendable Tongue",
    radioOptions: null,
  },
  adjustableDeckHeight: {
    type: "select",
    displayText: "Adjustable Deck Height",
    radioOptions: null,
  },
  detachableSidePanels: {
    type: "select",
    displayText: "Detachable Side Panels",
    radioOptions: null,
  },

  additionalAccessories: {
    type: "select",
    displayText: "Additional Accessories",
    radioOptions: null,
  },
  rampType: { type: "select", displayText: "Ramp Type", radioOptions: null },
  winchPost: { type: "select", displayText: "Winch Post", radioOptions: null },
  splashGuards: {
    type: "select",
    displayText: "Splash Guards",
    radioOptions: null,
  },
  fenders: { type: "select", displayText: "Fenders", radioOptions: null },
  sideRails: { type: "select", displayText: "Side Rails", radioOptions: null },

  customizationOptions: {
    type: "select",
    displayText: "Customization Options",
    radioOptions: null,
  },
  color: { type: "select", displayText: "Color", radioOptions: null },
  decals: { type: "select", displayText: "Decals", radioOptions: null },
  storageBox: {
    type: "select",
    displayText: "Storage Box",
    radioOptions: null,
  },
  lightingPackage: {
    type: "select",
    displayText: "Lighting Package",
    radioOptions: null,
  },
  suspensionUpgrade: {
    type: "select",
    displayText: "Suspension Upgrade",
    radioOptions: null,
  },

  axlesAndSuspension: {
    type: "select",
    displayText: "Axles And Suspension",
    radioOptions: null,
  },
  axleType: { type: "select", displayText: "Axle Type", radioOptions: null },
  axleCapacity: {
    type: "range",
    displayText: "Axle Capacity",
    radioOptions: [
      { label: "lbs", value: "lbs", id: 1 },
      { label: "Kgs", value: "Kgs", id: 2 },
    ],
  },
  axleSealType: {
    type: "select",
    displayText: "Axle Seal Type",
    radioOptions: null,
  },
  axleHubSize: {
    type: "range",
    displayText: "Axle Hub Size",
    radioOptions: [
      { label: "cm", value: "cm", id: 1 },
      { label: "mm", value: "mm", id: 2 },
    ],
  },
  axlePosition: {
    type: "select",
    displayText: "Axle Position",
    radioOptions: null,
  },
  dropAxleOption: {
    type: "select",
    displayText: "Drop Axle Option",
    radioOptions: null,
  },
  suspensionType: {
    type: "select",
    displayText: "Suspension Type",
    radioOptions: null,
  },
  suspensionCapacity: {
    type: "range",
    displayText: "Suspension Capacity",
    radioOptions: [
      { label: "lbs", value: "lbs", id: 1 },
      { label: "Kgs", value: "Kgs", id: 2 },
    ],
  },
  suspensionAdjustment: {
    type: "select",
    displayText: "Suspension Adjustment",
    radioOptions: null,
  },

  tyresAndWheels: {
    type: "select",
    displayText: "Tyres And Wheels",
    radioOptions: null,
  },
  tyreSize: {
    type: "range",
    displayText: "Tyre Size",
    radioOptions: [
      { label: "cm", value: "cm", id: 1 },
      { label: "mm", value: "mm", id: 2 },
    ],
  },
  tyreLoadRange: {
    type: "select",
    displayText: "Tyre Load Range",
    radioOptions: null,
  },
  tyreType: { type: "select", displayText: "Tyre Type", radioOptions: null },
  wheelType: { type: "select", displayText: "Wheel Type", radioOptions: null },
  wheelBoltPattern: {
    type: "select",
    displayText: "Wheel Bolt Pattern",
    radioOptions: null,
  },
  hubLubricationSystem: {
    type: "select",
    displayText: "Hub Lubrication System",
    radioOptions: null,
  },

  brakesAndSafety: {
    type: "select",
    displayText: "Brakes And Safety",
    radioOptions: null,
  },
  brakeType: { type: "select", displayText: "Brake Type", radioOptions: null },
  brakeActuator: {
    type: "select",
    displayText: "Brake Actuator",
    radioOptions: null,
  },
  brakeLineMaterial: {
    type: "select",
    displayText: "Brake Line Material",
    radioOptions: null,
  },
  brakeDrumDiameter: {
    type: "select",
    displayText: "Brake Drum Diameter",
    radioOptions: null,
  },
  brakeFluidType: {
    type: "select",
    displayText: "Brake Fluid Type",
    radioOptions: null,
  },
  brakes: { type: "select", displayText: "Brakes", radioOptions: null },
  couplerSize: {
    type: "range",
    displayText: "Coupler Size",
    radioOptions: [
      { label: "cm", value: "cm", id: 1 },
      { label: "mm", value: "mm", id: 2 },
    ],
  },
  couplerType: {
    type: "select",
    displayText: "Coupler Type",
    radioOptions: null,
  },
  couplerLockType: {
    type: "select",
    displayText: "Coupler Lock Type",
    radioOptions: null,
  },
  hitchClass: {
    type: "select",
    displayText: "Hitch Class",
    radioOptions: null,
  },
  hitchReceiverSize: {
    type: "range",
    displayText: "Hitch Receiver Size",
    radioOptions: [
      { label: "cm", value: "cm", id: 1 },
      { label: "mm", value: "mm", id: 2 },
    ],
  },
  safetyChains: {
    type: "select",
    displayText: "Safety Chains",
    radioOptions: null,
  },
  breakawaySystem: {
    type: "select",
    displayText: "Breakaway System",
    radioOptions: null,
  },

  winchType: { type: "select", displayText: "Winch Type", radioOptions: null },
  winchCapacity: {
    type: "range",
    displayText: "Winch Capacity",
    radioOptions: [
      { label: "lbs", value: "lbs", id: 1 },
      { label: "Kgs", value: "Kgs", id: 2 },
    ],
  },
  winchRopeLength: {
    type: "select",
    displayText: "Winch Rope Length",
    radioOptions: null,
  },
  winchDrumMaterial: {
    type: "select",
    displayText: "Winch Drum Material",
    radioOptions: null,
  },
  winchGearRatio: {
    type: "select",
    displayText: "Winch Gear Ratio",
    radioOptions: null,
  },
  winchRemoteControl: {
    type: "select",
    displayText: "Winch Remote Control",
    radioOptions: null,
  },
  winchBrakeType: {
    type: "select",
    displayText: "Winch Brake Type",
    radioOptions: null,
  },
  winchCableType: {
    type: "select",
    displayText: "Winch Cable Type",
    radioOptions: null,
  },
  winchStrapLength: {
    type: "select",
    displayText: "Winch Strap Length",
    radioOptions: null,
  },
  winchHandleLength: {
    type: "select",
    displayText: "Winch Handle Length",
    radioOptions: null,
  },
  winchMounting: {
    type: "select",
    displayText: "Winch Mounting",
    radioOptions: null,
  },

  lighting: { type: "select", displayText: "Lighting", radioOptions: null },
  lightMountingPosition: {
    type: "select",
    displayText: "Light Mounting Position",
    radioOptions: null,
  },
  lightType: { type: "select", displayText: "Light Type", radioOptions: null },
  electricalConnectorType: {
    type: "select",
    displayText: "Electrical Connector Type",
    radioOptions: null,
  },
  electricalWiringType: {
    type: "select",
    displayText: "Electrical Wiring Type",
    radioOptions: null,
  },
  batteryType: {
    type: "select",
    displayText: "Battery Type",
    radioOptions: null,
  },
  batteryChargerType: {
    type: "select",
    displayText: "Battery Charger Type",
    radioOptions: null,
  },

  accessories: {
    type: "select",
    displayText: "Accessories",
    radioOptions: null,
  },
  spareTyreCarrier: {
    type: "select",
    displayText: "Spare Tyre Carrier",
    radioOptions: null,
  },
  spareTyreSize: {
    type: "range",
    displayText: "Spare Tyre Size",
    radioOptions: [
      { label: "cm", value: "cm", id: 1 },
      { label: "mm", value: "mm", id: 2 },
    ],
  },
  spareTyreMountingLocation: {
    type: "select",
    displayText: "Spare Tyre Mounting Location",
    radioOptions: null,
  },
  jackType: { type: "select", displayText: "Jack Type", radioOptions: null },
  jackWheelType: {
    type: "select",
    displayText: "Jack Wheel Type",
    radioOptions: null,
  },
  jackCapacity: {
    type: "range",
    displayText: "Jack Capacity",
    radioOptions: [
      { label: "lbs", value: "lbs", id: 1 },
      { label: "Kgs", value: "Kgs", id: 2 },
    ],
  },
  jackLiftHeight: {
    type: "select",
    displayText: "Jack Lift Height",
    radioOptions: null,
  },

  loadingAndTransportFeatures: {
    type: "select",
    displayText: "Loading And Transport Features",
    radioOptions: null,
  },
  loadingSystem: {
    type: "range",
    displayText: "Loading System",
    radioOptions: [
      { label: "ft", value: "ft", id: 1 },
      { label: "mtrs", value: "mtrs", id: 2 },
    ],
  },

  bunks: { type: "select", displayText: "Bunks", radioOptions: null },
  bunkMaterial: {
    type: "select",
    displayText: "Bunk Material",
    radioOptions: null,
  },
  bunkWidth: { type: "select", displayText: "Bunk Width", radioOptions: null },
  bunkHeightAdjustment: {
    type: "select",
    displayText: "Bunk Height Adjustment",
    radioOptions: null,
  },
  bunkMountingBracketMaterial: {
    type: "select",
    displayText: "Bunk Mounting Bracket Material",
    radioOptions: null,
  },
  rollers: { type: "select", displayText: "Rollers", radioOptions: null },
  rollerMaterial: {
    type: "select",
    displayText: "Roller Material",
    radioOptions: null,
  },
  rollerAxleDiameter: {
    type: "select",
    displayText: "Roller Axle Diameter",
    radioOptions: null,
  },

  securityFeatures: {
    type: "select",
    displayText: "Security Features",
    radioOptions: null,
  },
  wheelLocks: {
    type: "select",
    displayText: "Wheel Locks",
    radioOptions: null,
  },
  lockType: { type: "select", displayText: "Lock Type", radioOptions: null },
  alarmSystem: {
    type: "select",
    displayText: "Alarm System",
    radioOptions: null,
  },
  gpsTrackingDevice: {
    type: "select",
    displayText: "GPS Tracking Device",
    radioOptions: null,
  },

  environmentalAndCorrosionResistance: {
    type: "select",
    displayText: "Environmental And Corrosion Resistance",
    radioOptions: null,
  },
  corrosionProtection: {
    type: "select",
    displayText: "Corrosion Protection",
    radioOptions: null,
  },
  rustInhibitors: {
    type: "select",
    displayText: "Rust Inhibitors",
    radioOptions: null,
  },

  performanceAndHandling: {
    type: "select",
    displayText: "Performance And Handling",
    radioOptions: null,
  },
  maximumSpeedRating: {
    type: "select",
    displayText: "Maximum Speed Rating",
    radioOptions: null,
  },
  turningRadius: {
    type: "range",
    displayText: "Turning Radius",
    radioOptions: [
      { label: "ft", value: "ft", id: 1 },
      { label: "mtrs", value: "mtrs", id: 2 },
    ],
  },

  tongue: { type: "select", displayText: "Tongue", radioOptions: null },
  tongueMaterial: {
    type: "select",
    displayText: "Tongue Material",
    radioOptions: null,
  },
  tongueShape: {
    type: "select",
    displayText: "Tongue Shape",
    radioOptions: null,
  },
  tongueJackWheelSize: {
    type: "range",
    displayText: "Tongue Jack Wheel Size",
    radioOptions: [
      { label: "cm", value: "cm", id: 1 },
      { label: "mm", value: "mm", id: 2 },
    ],
  },
  tongueJackType: {
    type: "select",
    displayText: "Tongue Jack Type",
    radioOptions: null,
  },
  tongueWeight: {
    type: "range",
    displayText: "Tongue Weight",
    radioOptions: [
      { label: "Kg", value: "Kg", id: 1 },
      { label: "Ton", value: "Ton", id: 2 },
    ],
  },
  tongueWeightRatio: {
    type: "select",
    displayText: "Tongue Weight Ratio",
    radioOptions: null,
  },

  documentation: {
    type: "select",
    displayText: "Documentation",
    radioOptions: null,
  },
  ownerManual: {
    type: "select",
    displayText: "Owner's Manual",
    radioOptions: null,
  },
  warranty: { type: "select", displayText: "Warranty", radioOptions: null },

  regulatoryCompliance: {
    type: "select",
    displayText: "Regulatory Compliance",
    radioOptions: null,
  },
  dotCompliance: {
    type: "select",
    displayText: "DOT Compliance",
    radioOptions: null,
  },
  natmCertification: {
    type: "select",
    displayText: "NATM Certification",
    radioOptions: null,
  },
  euTypeApproval: {
    type: "select",
    displayText: "EU Type Approval",
    radioOptions: null,
  },
  adrCompliance: {
    type: "select",
    displayText: "ADR Compliance",
    radioOptions: null,
  },

  paymentTerms: {
    type: "select",
    displayText: "Payment Terms",
    radioOptions: null,
  },
  currency: { type: "select", displayText: "Currency", radioOptions: null },
  preferredPaymentMethod: {
    type: "select",
    displayText: "Preferred Payment Method",
    radioOptions: null,
  },
  invoiceAndRecieptProcedures: {
    type: "select",
    displayText: "Invoice And Receipt Procedures",
    radioOptions: null,
  },
  priceLabel: {
    type: "select",
    displayText: "Price Label",
    radioOptions: null,
  },
  priceDrop: { type: "select", displayText: "Price Drop", radioOptions: null },

  country: { type: "select", displayText: "Country", radioOptions: null },
  globalAddressLookup: {
    type: "select",
    displayText: "Global Address Lookup",
    radioOptions: null,
  },
  distance: { type: "select", displayText: "Distance", radioOptions: null },
};

export const radioOptions = [
  { label: "lbs", value: "lbs", id: 1 },
  { label: "Kgs", value: "Kgs", id: 2 },
];

export const varToDb = {
  // identification
  trailerID: "Trailer_ID",
  manufacturer: "Manufacturer",
  make: "Make",
  model: "Model",
  year: "Year",
  askingPrice: "Asking_Price",

  // basics
  type: "Type",
  gvwr: "GVWR",
  loadCapacity: "Load_Capacity",
  length: "Length",
  width: "Width",
  totalHeight: "Total_Height",
  axleHeightFromGround: "Axle_Height",

  // constructionMaterials
  frameMaterial: "Frame_Material",
  frameCoating: "Frame_Coating",
  frameCrossmemberType: "Frame_Crossmember",
  frameWeldType: "Frame_Weld",
  maximumAngleOfApproach: "Maximum_Approach",
  floorMaterial: "Floor_Material",
  sidesMaterial: "Sides_Material",
  roofMaterial: "Roof_Material",

  // maintenanceFeatures
  greasePoints: "Grease_Points",
  bearingType: "Bearing",
  maintenanceSchedule: "Maintenance_Schedule",

  // userFeatures
  userFeatures: "User_Features",
  storage: "Storage",
  tieDownPoints: "Tie_Down_Points",
  toolBox: "Tool_Box",
  bumperType: "Bumper",

  // specialFeatures
  hydraulicTilt: "Hydraulic_Tilt",
  extendableTongue: "Extendable_Tongue",
  adjustableDeckHeight: "Deck_Height",
  detachableSidePanels: "Side_Panels",

  // additionalAccessories
  rampType: "Ramp",
  winchPost: "Winch_Post",
  splashGuards: "Splash_Guards",
  fenders: "Fenders",
  sideRails: "Side_Rails",

  // customizationOptions
  // customizationOptions: "Customization Options",
  color: "Color",
  decals: "Decals",
  storageBox: "Storage_Box",
  lightingPackage: "Lighting_Package",
  suspensionUpgrade: "Suspension_Upgrade",

  // axlesAndSuspension
  axleType: "Axle",
  axleCapacity: "Axle_Capacity",
  axleSealType: "Axle_Seal",
  axleHubSize: "Axle_Hub",
  axlePosition: "Axle_Position",
  dropAxleOption: "Drop_Axle_Option",
  suspensionType: "Suspension",
  suspensionCapacity: "Suspension_Capacity",
  suspensionAdjustment: "Suspension_Adjustment",

  // tyresAndWheels
  tyreSize: "Tyre_Size", //
  tyreLoadRange: "Tyre_Load_Range",
  tyreType: "Tyre_Type", //
  wheelType: "Wheel",
  wheelBoltPattern: "Wheel_Bolt",
  hubLubricationSystem: "Hub_Lubrication",

  // brakesAndSafety
  brakeType: "Brake",
  brakeActuator: "Brake_Actuator",
  brakeLineMaterial: "Brake_Line",
  brakeDrumDiameter: "Brake_Drum",
  brakeFluidType: "Brake_Fluid",
  brakes: "Brakes",
  couplerSize: "Coupler_Size",
  couplerType: "Coupler_Type",
  couplerLockType: "Coupler_Lock",
  hitchClass: "Hitch_Class",
  hitchReceiverSize: "Hitch_Receiver",
  safetyChains: "Safety_Chains",
  breakawaySystem: "Breakaway",

  // winchAndWrinchAccessories
  winchType: "Winch",
  winchCapacity: "Winch_Capacity",
  winchRopeLength: "Winch_Rope_Length",
  winchDrumMaterial: "Winch_Drum_Material",
  winchGearRatio: "Winch_Gear_Ratio",
  winchRemoteControl: "Winch_Remote_Control",
  winchBrakeType: "Winch_Brake",
  winchCableType: "Winch_Cable",
  winchStrapLength: "Winch_Strap_Length",
  winchHandleLength: "Winch_Handle_Length",
  winchMounting: "Winch_Mounting",

  // lightingAndElectrical
  lighting: "Lighting",
  lightMountingPosition: "Light_Mounting_Position",
  lightType: "Light",
  electricalConnectorType: "Electrical_Connector",
  electricalWiringType: "Electrical_Wiring",
  batteryType: "Battery",
  batteryChargerType: "Battery_Charger",

  // acessories
  spareTyreCarrier: "Spare_Tyre_Carrier",
  spareTyreSize: "Spare_Tyre",
  spareTyreMountingLocation: "Spare_Tyre_Location",
  jackType: "Jack",
  jackWheelType: "Jack_Wheel",
  jackCapacity: "Jack_Capacity",
  jackLiftHeight: "Jack_Lift_Height",

  // loadingAndTransportFeatures
  loadingSystem: "Loading",
  bunks: "Bunks",
  bunkMaterial: "Bunk_Material",
  bunkWidth: "Bunk_Width",
  bunkHeightAdjustment: "Bunk_Height_Adjustment",
  bunkMountingBracketMaterial: "Bunk_Mounting_Bracket",
  rollers: "Rollers",
  rollerMaterial: "Roller_Material",
  rollerAxleDiameter: "Roller_Axle_Diameter",

  // securityFeatures
  wheelLocks: "Wheel_Locks",
  lockType: "Lock",
  alarmSystem: "Alarm",
  gpsTrackingDevice: "GPS_Tracking_Device",

  // environmentalAndCorrosionResistance
  corrosionProtection: "Corrosion_Protection",
  rustInhibitors: "Rust_Inhibitors",

  // performanceAndHandling
  maximumSpeedRating: "Maximum_Speed_Rating",
  turningRadius: "Turning_Radius",

  // tongue
  tongueMaterial: "Tongue_Material",
  tongueShape: "Tongue_Shape",
  tongueJackWheelSize: "Jack_Wheel",
  tongueJackType: "Jack_Type",
  tongueWeight: "Tongue_Weight",
  tongueWeightRatio: "Tongue_Weight_Ratio",

  // documentation
  ownerManual: "Owners_Manual",
  warranty: "Warranty",

  // regulatoryCompliance
  dotCompliance: "DOT_Compliance",
  natmCertification: "NATM_Certification",
  euTypeApproval: "EU_Approval",
  adrCompliance: "ADR_Compliance",

  // paymentTerms
  paymentTerms: "Payment_Terms",
  currency: "Currency",
  preferredPaymentMethod: "Preferred_Payment",
  invoiceAndRecieptProcedures: "Invoice_Reciept",

  calculatePriceAndPay: "Calculate",
  priceLabel: "Price_Label",
  priceDrop: "Price_Drop",
  // currency: "Currency", // duplicate so no need
  vat: "VAT",

  // functions
  // country: "Country",
  // globalAddressLookup: "Global_Address",
  // distance: "Distance",
  // contactDetails: "Contact",
  // uploadPhotos: "Photos",
  // uploadVideos: "Videos",
};

export const detailStateType = {
  identification: {
    trailerID: "",
    manufacturer: "",
    make: "",
    model: "",
    year: "",
    askingPrice: "",
  },
  basics: {
    type: "",
    gvwr: "",
    loadCapacity: "",
    length: "",
    width: "",
    totalHeight: "",
    axleHeightFromGround: "",
  },
  constructionMaterials: {
    frameMaterial: "",
    frameCoating: "",
    frameCrossmemberType: "",
    frameWeldType: "",
    maximumAngleOfApproach: "",
    floorMaterial: "",
    sidesMaterial: "",
    roofMaterial: "",
  },
  maintenanceFeatures: {
    greasePoints: "",
    bearingType: "",
    maintenanceSchedule: "",
  },
  userFeatures: {
    userFeatures: "",
    storage: "",
    tieDownPoints: "",
    toolBox: "",
    bumperType: "",
  },

  specialFeatures: {
    hydraulicTilt: "",
    extendableTongue: "",
    adjustableDeckHeight: "",
    detachableSidePanels: "",
  },

  additionalAccessories: {
    rampType: "Ramp",
    winchPost: "Winch_Post",
    splashGuards: "Splash_Guards",
    fenders: "Fenders",
    sideRails: "Side_Rails",
  },

  customizationOptions: {
    color: "Color",
    decals: "Decals",
    storageBox: "Storage_Box",
    lightingPackage: "Lighting_Package",
    suspensionUpgrade: "Suspension_Upgrade",
  },

  axlesAndSuspension: {
    axleType: "Axle",
    axleCapacity: "Axle_Capacity",
    axleSealType: "Axle_Seal",
    axleHubSize: "Axle_Hub",
    axlePosition: "Axle_Position",
    dropAxleOption: "Drop_Axle_Option",
    suspensionType: "Suspension",
    suspensionCapacity: "Suspension_Capacity",
    suspensionAdjustment: "Suspension_Adjustment",
  },

  tyresAndWheels: {
    tyreSize: "Tyre_Size", //
    tyreLoadRange: "Tyre_Load_Range",
    tyreType: "Tyre", //
    wheelType: "Wheel",
    wheelBoltPattern: "Wheel_Bolt",
    hubLubricationSystem: "Hub_Lubrication",
  },
  brakesAndSafety: {
    brakeType: "Brake",
    brakeActuator: "Brake_Actuator",
    brakeLineMaterial: "Brake_Line",
    brakeDrumDiameter: "Brake_Drum",
    brakeFluidType: "Brake_Fluid",
    brakes: "Brakes",
    couplerSize: "Coupler_Size",
    couplerType: "Coupler",
    couplerLockType: "Coupler_Lock",
    hitchClass: "Hitch_Class",
    hitchReceiverSize: "Hitch_Receiver",
    safetyChains: "Safety_Chains",
    breakawaySystem: "Breakaway",
  },

  winchAndWrinchAccessories: {
    winchType: "Winch",
    winchCapacity: "Winch_Capacity",
    winchRopeLength: "Winch_Rope_Length",
    winchDrumMaterial: "Winch_Drum_Material",
    winchGearRatio: "Winch_Gear_Ratio",
    winchRemoteControl: "Winch_Remote_Control",
    winchBrakeType: "Winch_Brake",
    winchCableType: "Winch_Cable",
    winchStrapLength: "Winch_Strap_Length",
    winchHandleLength: "Winch_Handle_Length",
    winchMounting: "Winch_Mounting",
  },
  lightingAndElectrical: {
    lighting: "Lighting",
    lightMountingPosition: "Light_Mounting_Position",
    lightType: "Light",
    electricalConnectorType: "Electrical_Connector",
    electricalWiringType: "Electrical_Wiring",
    batteryType: "Battery",
    batteryChargerType: "Battery_Charger",
  },
  acessories: {
    spareTyreCarrier: "",
    spareTyreSize: "",
    spareTyreMountingLocation: "Spare_Tyre_Mounting_Location",
    jackType: "Jack",
    jackWheelType: "Jack_Wheel",
    jackCapacity: "Jack_Capacity",
    jackLiftHeight: "Jack_Lift_Height",
  },
  loadingAndTransportFeatures: {
    loadingSystem: "Loading",
    bunks: "Bunks",
    bunkMaterial: "Bunk_Material",
    bunkWidth: "Bunk_Width",
    bunkHeightAdjustment: "Bunk_Height_Adjustment",
    bunkMountingBracketMaterial: "Bunk_Mounting_Bracket_Material",
    rollers: "Rollers",
    rollerMaterial: "Roller_Material",
    rollerAxleDiameter: "Roller_Axle_Diameter",
  },
  securityFeatures: {
    wheelLocks: "Wheel_Locks",
    lockType: "Lock",
    alarmSystem: "Alarm",
    gpsTrackingDevice: "GPS_Tracking_Device",
  },
  environmentalAndCorrosionResistance: {
    corrosionProtection: "Corrosion_Protection",
    rustInhibitors: "Rust_Inhibitors",
  },
  performanceAndHandling: {
    maximumSpeedRating: "Maximum_Speed_Rating",
    turningRadius: "Turning Radius",
  },
  tongue: {
    tongueMaterial: "Tongue_Material",
    tongueShape: "Tongue_Shape",
    tongueJackWheelSize: "Jack_Wheel",
    tongueJackType: "Jack_Type",
    tongueWeight: "Tongue_Weight",
    tongueWeightRatio: "Tongue_Weight_Ratio",
  },
  documentation: {
    ownerManual: "Owner_Manual",
    warranty: "Warranty",
  },
  regulatoryCompliance: {
    dotCompliance: "DOT_Compliance",
    natmCertification: "NATM_Certification",
    euTypeApproval: "EU_Approval",
    adrCompliance: "ADR_Compliance",
  },
  paymentTerms: {
    paymentTerms: "Payment_Terms",
    currency: "Currency",
    preferredPaymentMethod: "Preferred_Payment",
    invoiceAndRecieptProcedures: "Invoice_Reciept",

    calculatePriceAndPay: "Calculate",
    priceLabel: "Price_Label",
    priceDrop: "Price_Drop",
    // currency: "Currency", // duplicate so no need
    vat: "VAT",
  },

  // functions
  // country: "Country",
  // globalAddressLookup: "Global_Address",
  // distance: "Distance",
  // contactDetails: "Contact",
  // uploadPhotos: "Photos",
  // uploadVideos: "Videos",
};

export const typeDef = {
  identification: {
    marisailTrailerId: [],
    manufacturer: [],
    make: [],
    model: [],
    year: [],
  },
  basics: {
    type: [],
    gvwr: [],
    loadCapacity: [],
    length: [],
    width: [],
    totalHeight: [],
    axleHeightFromGround: [],
  },
  constructionMaterials: {
    frameMaterial: [],
    frameCoating: [],
    frameCrossmemberType: [],
    frameWeldType: [],
    maximumAngleOfApproach: [],
    floorMaterial: [],
    sidesMaterial: [],
    roofMaterial: [],
  },
  maintenanceFeatures: {
    greasePoints: [],
    bearingType: [],
    maintenanceSchedule: [],
  },
  userFeatures: {
    storage: [],
    tieDownPoints: [],
    toolBox: [],
    bumperType: [],
  },
  specialFeatures: {
    hydraulicTilt: [],
    extendableTongue: [],
    adjustableDeckHeight: [],
    detachableSidePanels: [],
  },
  additionalAccessories: {
    rampType: [],
    winchPost: [],
    splashGuards: [],
    fenders: [],
    sideRails: [],
  },
  customizationOptions: {
    color: [],
    decals: [],
    storageBox: [],
    lightingPackage: [],
    suspensionUpgrade: [],
  },
  axlesAndSuspension: {
    axleType: [],
    axleCapacity: [],
    axleSealType: [],
    axleHubSize: [],
    axlePosition: [],
    dropAxleOption: [],
    suspensionType: [],
    suspensionCapacity: [],
    suspensionAdjustment: [],
  },
  tyresAndWheels: {
    tyreSize: [],
    tyreLoadRange: [],
    tyreType: [],
    wheelType: [],
    wheelBoltPattern: [],
    hubLubricationSystem: [],
  },
  brakes: {
    brakeType: [],
    brakeActuator: [],
    brakeLineMaterial: [],
    brakeDrumDiameter: [],
    brakeFluidType: [],
    brakes: [],
    couplerSize: [],
    couplerType: [],
    couplerLockType: [],
    hitchClass: [],
    hitchReceiverSize: [],
    safetyChains: [],
    breakawaySystem: [],
  },
  winchAndWrinchAccessories: {
    winchType: [],
    winchCapacity: [],
    winchRopeLength: [],
    winchDrumMaterial: [],
    winchGearRatio: [],
    winchRemoteControl: [],
    winchBrakeType: [],
    winchCableType: [],
    winchStrapLength: [],
    winchHandleLength: [],
    winchMounting: [],
  },
  lightingAndElectrical: {
    lighting: [],
    lightMountingPosition: [],
    lightType: [],
    electricalConnectorType: [],
    electricalWiringType: [],
    batteryType: [],
    batteryChargerType: [],
  },
  acessories: {
    spareTyreCarrier: [],
    spareTyreSize: [],
    spareTyreMountingLocation: [],
    jackType: [],
    jackWheelType: [],
    jackCapacity: [],
    jackLiftHeight: [],
  },
  loadingAndTransportFeatures: {
    loadingSystem: [],
    bunks: [],
    bunkMaterial: [],
    bunkWidth: [],
    bunkHeightAdjustment: [],
    bunkMountingBracketMaterial: [],
    rollers: [],
    rollerMaterial: [],
    rollerAxleDiameter: [],
  },
  securityFeatures: {
    wheelLocks: [],
    lockType: [],
    alarmSystem: [],
    gpsTrackingDevice: [],
  },
  environmentalAndCorrosionResistance: {
    corrosionProtection: [],
    rustInhibitors: [],
  },
  performanceAndHandling: {
    maximumSpeedRating: [],
    turningRadius: [],
  },
  tongue: {
    tongueMaterial: [],
    tongueShape: [],
    tongueJackWheelSize: [],
    tongueJackType: [],
    tongueWeight: [],
    tongueWeightRatio: [],
  },
  documentation: {
    ownerManual: [],
    warranty: [],
  },
  // ise kaise handle krna h uppercase m
  regulatoryCompliance: {
    dotCompliance: [],
    natmCertification: [],
    euTypeApproval: [],
    adrCompliance: [],
  },
  paymentTerms: {
    paymentTerms: [],
    currency: [],
    preferredPaymentMethod: [],
    invoiceAndRecieptProcedures: [],
    calculatePriceAndPay: [],
    priceLabel: [],
    priceDrop: [],
    // currency: "",
    VAT: [],
    totalPrice: [],
    country: [],
    globalAddressLookup: [],
    distance: [],
    contactDetails: [],
    uploadPhotos: [],
    uploadVideos: [],
  },
};

export const makeString = (str) => {
  var newStr = "";
  newStr += str[0].toUpperCase();
  for (let i = 1; i < str.length; i++) {
    if (str[i] === str[i].toUpperCase() || i === 0) {
      newStr += " " + str[i];
    } else {
      newStr += str[i];
    }
  }

  // ID, VAT, EU wagera ka hisab dekhna h

  // console.log(newStr);
  return newStr;
};
