export const trailerVarToColumn = {
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

// name of the table in escelsheet is not matching with DBA
export const trailerVarToTable = {
  // identification: "Identification",
  identification: "Trailers_ID",
  // basics: "identification",
  basics: "Trailers_ID",
  constructionMaterials: "Construction", // why C is ot capital as given in excel
  maintenanceFeatures: "Construction",
  userFeatures: "Construction",
  specialFeatures: "Trailer_Features",
  additionalAccessories: "Trailer_Features",
  customizationOptions: "Trailer_Features",
  axlesAndSuspension: "Axles",
  tyresAndWheels: "Tyres_Brakes",
  brakesAndSafety: "Tyres_Brakes",
  winchAndWrinchAccessories: "Winches_Lighting",
  lightingAndElectrical: "Winches_Lighting",
  accessories: "Accessories",
  loadingAndTransportFeatures: "Loading_Transport_Features",
  securityFeatures: "Security_Features",
  environmentalAndCorrosionResistance: "Corrosion_Resistance",
  performanceAndHandling: "Performance_Handling",
  tongue: "Tongue",
  documentation: "Documentation",
  regulatoryCompliance: "Regulatory",
  paymentTerms: "Trailers_Payment", // not for trailers
  sales: "Trailers_Sales", // not for trailers
};

export const trailerUniqueTable = [
  "Trailers_ID",
  "Construction",
  "Trailer_Features",
  "Axles",
  "Tyres_Brakes",
  "Winches_Lighting",
  "Accessories",
  "Loading_Transport_Features",
  "Security_Features",
  "Corrosion_Resistance",
  "Performance_Handling",
  "Tongue",
  "Documentation", // issues in it still and field below it
  "Regulatory",
  // "Trailers_Payment",
  // "Trailers_Sales",
];
