import { Form, Container, Row, Col } from "react-bootstrap";
import { useEffect, useState, useRef } from "react";
import DropdownWithRadio from "../DropdownWithRadio";
import Loader from "../Loader";
import InputComponentDynamic from "../InputComponentDynamic";
import SubmitButton from "../SubmitButton";
import { keyToExpectedValueMap, typeDef } from "../Engine/Engine_Advert_Info";
import { makeString } from "../../services/common_functions";
const apiUrl = import.meta.env.VITE_BACKEND_URL;

export default function MyEngine() {
  const storedUser = localStorage.getItem("user");
  const formData = localStorage.getItem("EngineData");
  let engineData;
  if (storedUser && formData) {
    engineData = JSON.parse(formData);
  }
  const [error, setError] = useState({});
  const hasFetched = useRef(false);
  const [engines, setEngines] = useState("");
  const [openKey, setOpenKey] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allSelectedOptions, setAllSelectedOptions] = useState({});
  const [engineDetails, setEngineDetails] = useState({
    engineMake: engineData?.engineMake || "",
    engineModel: engineData?.engineModel || "",
    engineModelYear: engineData?.engineModelYear || "",
    engineType: engineData?.engineType || "",
    typeDesignation: engineData?.typeDesignation || "",
    askingPrice: engineData?.askingPrice || "",
  });
  
  const [condition, setCondition] = useState({
    condition: engineData?.condition || "",
    usedCondition: engineData?.usedCondition || "",
    seller: engineData?.seller || "",
    offeredBy: engineData?.offeredBy || "",
    lastSurveyDate: engineData?.lastSurveyDate || new Date(),
    brokerValuation: engineData?.brokerValuation || "",
  });
  
  const [general, setGeneral] = useState({
    engineClassification: engineData?.engineClassification || "",
    certification: engineData?.certification || "",
    manufacturerWarranty: engineData?.manufacturerWarranty || "",
    engineSerialNumber: engineData?.engineSerialNumber || "",
    ce_DesignCategory: engineData?.ce_DesignCategory || "",
    numberDrives: engineData?.numberDrives || "",
    numberEngines: engineData?.numberEngines || "",
    rangeMiles: engineData?.rangeMiles || "",
    cruisingSpeed: engineData?.cruisingSpeed || "",
    driveType: engineData?.driveType || "",
    engineHours: engineData?.engineHours || "",
    ignitionSystem: engineData?.ignitionSystem || "",
    noiseLevel: engineData?.noiseLevel || "",
    engineSoundproofingKits: engineData?.engineSoundproofingKits || "",
  });
  
  const [transmission, setTransmission] = useState({
    transmissionType: engineData?.transmissionType || "",
    gearShift: engineData?.gearShift || "",
    gearRatio: engineData?.gearRatio || "",
    gearShiftType: engineData?.gearShiftType || "",
    flywheelSAE14: engineData?.flywheelSAE14 || "",
    siluminFlywheelHousing: engineData?.siluminFlywheelHousing || "",
    camShaft: engineData?.camShaft || "",
    camShaftAlloy: engineData?.camShaftAlloy || "",
    crankcaseDesign: engineData?.crankcaseDesign || "",
  });
  
  const [installationAndMounting, setInstallationAndMounting] = useState({
    engineMountingOrientation: engineData?.engineMountingOrientation || "",
    engineSuspension: engineData?.engineSuspension || "",
    engineMountingType: engineData?.engineMountingType || "",
    mountingBracketMaterial: engineData?.mountingBracketMaterial || "",
    alignmentRequirements: engineData?.alignmentRequirements || "",
    engineBlock: engineData?.engineBlock || "",
  });
  
  const [serviceAndMaintenance, setServiceAndMaintenance] = useState({
    scheduledMaintenancePlan: engineData?.scheduledMaintenancePlan || "",
    serviceInterval: engineData?.serviceInterval || "",
    maintenanceLogRequirements: engineData?.maintenanceLogRequirements || "",
    availabilityOfSpareParts: engineData?.availabilityOfSpareParts || "",
    operationMode: engineData?.operationMode || "",
    lastServiceDate: engineData?.lastServiceDate || "",
  });
  
  const [equipment, setEquipment] = useState({
    engineManagementSystem: engineData?.engineManagementSystem || "",
    engineControlSystem: engineData?.engineControlSystem || "",
    unitInjectors: engineData?.unitInjectors || "",
    turboCharger: engineData?.turboCharger || "",
    turboCharging: engineData?.turboCharging || "",
    starterMotor: engineData?.starterMotor || "",
    protectionCovers: engineData?.protectionCovers || "",
    closedCrankcaseVentilation: engineData?.closedCrankcaseVentilation || "",
    heatExchanger: engineData?.heatExchanger || "",
    heatExchangerWithExpansionTank: engineData?.heatExchangerWithExpansionTank || "",
    seaWaterPump: engineData?.seaWaterPump || "",
    seaWaterCooledChargeAirCooler: engineData?.seaWaterCooledChargeAirCooler || "",
    workingPrinciple: engineData?.workingPrinciple || "",
    compressionRatio: engineData?.compressionRatio || "",
    pistonSpeedAt1500Rpm: engineData?.pistonSpeedAt1500Rpm || "",
    pistonSpeedAt1800Rpm: engineData?.pistonSpeedAt1800Rpm || "",
    firingOrder: engineData?.firingOrder || "",
    pistons: engineData?.pistons || "",
    connectionRods: engineData?.connectionRods || "",
    auxiliaryPowerTakeOff: engineData?.auxiliaryPowerTakeOff || "",
    remoteControlSystems: engineData?.remoteControlSystems || "",
  });
  
  const [dimensions, setDimensions] = useState({
    displacement: engineData?.displacement || "",
    length: engineData?.length || "",
    width: engineData?.width || "",
    height: engineData?.height || "",
    lengthFromFrontEndOfFlywheelHousing: engineData?.lengthFromFrontEndOfFlywheelHousing || "",
    engineWeight: engineData?.engineWeight || "",
    dryWeight: engineData?.dryWeight || "",
    exclOilWeight: engineData?.exclOilWeight || "",
    weightWithHeatExchanger: engineData?.weightWithHeatExchanger || "",
    weightWithKeelCooling: engineData?.weightWithKeelCooling || "",
  });
  
  const [performance, setPerformance] = useState({
    nominalRating: engineData?.nominalRating || "",
    enginePerformance: engineData?.enginePerformance || "",
    maxPowerOutput: engineData?.maxPowerOutput || "",
    maxPowerBHP: engineData?.maxPowerBHP || "",
    maxSpeedKnots: engineData?.maxSpeedKnots || "",
    supercharged: engineData?.supercharged || "",
    valveTrain: engineData?.valveTrain || "",
    grossPowerFullLoadKW: engineData?.grossPowerFullLoadKW || "",
    grossPowerFullLoadHpMetric: engineData?.grossPowerFullLoadHpMetric || "",
    GrossPowerPropellerCurveKw: engineData?.GrossPowerPropellerCurveKw || "",
    GrossPowerPropellerCurveHpMetric: engineData?.GrossPowerPropellerCurveHpMetric || "",
    grossTorque: engineData?.grossTorque || "",
    powerToWeightRatio: engineData?.powerToWeightRatio || "",
    engineEfficiency: engineData?.engineEfficiency || "",
    engineSpeedRange: engineData?.engineSpeedRange || "",
    maximumContinuousRating: engineData?.maximumContinuousRating || "",
    continuousPower: engineData?.continuousPower || "",
  });
  
  const [cylinders, setCylinders] = useState({
    cylinderConfiguration: engineData?.cylinderConfiguration || "",
    numberCylinders: engineData?.numberCylinders || "",
    cylindersAndArrangement: engineData?.cylindersAndArrangement || "",
    numberValves: engineData?.numberValves || "",
    valvePerCylinder: engineData?.valvePerCylinder || "",
    boreXStroke: engineData?.boreXStroke || "",
    bore: engineData?.bore || "",
    stroke: engineData?.stroke || "",
  });
  
  const [rpm, setRpm] = useState({
    idleRPM: engineData?.idleRPM || "",
    ratedSpeedRPM: engineData?.ratedSpeedRPM || "",
    rpmAtMaxPower: engineData?.rpmAtMaxPower || "",
  });
  
  const [torque, setTorque] = useState({
    maximumTorque: engineData?.maximumTorque || "",
    maximumTorqueAtSpeed: engineData?.maximumTorqueAtSpeed || "",
    torqueAtRatedSpeed: engineData?.torqueAtRatedSpeed || "",
  });
  
  const [coolingSystem, setCoolingSystem] = useState({
    afterCooled: engineData?.afterCooled || "",
    coolingSystem: engineData?.coolingSystem || "",
    openCoolingSystem: engineData?.openCoolingSystem || "",
    closedCoolingSystem: engineData?.closedCoolingSystem || "",
    intercooled: engineData?.intercooled || "",
    recommendedCoolant: engineData?.recommendedCoolant || "",
    typeOfCooling: engineData?.typeOfCooling || "",
    heatDissipationRate: engineData?.heatDissipationRate || "",
    heatExchangerMaterial: engineData?.heatExchangerMaterial || "",
    engineLubrication: engineData?.engineLubrication || "",
    lubricationSystem: engineData?.lubricationSystem || "",
    coolingCapacity: engineData?.coolingCapacity || "",
    coolingFluidType: engineData?.coolingFluidType || "",
    coolingSystemPressure: engineData?.coolingSystemPressure || "",
    airFilterType: engineData?.airFilterType || "",
    circulationPumpType: engineData?.circulationPumpType || "",
    rawWaterpumpType: engineData?.rawWaterpumpType || "",
  });
  
  const [propulsion, setPropulsion] = useState({
    propulsion: engineData?.propulsion || "",
    bowthruster: engineData?.bowthruster || "",
    propulsionSystem: engineData?.propulsionSystem || "",
    propulsionSystemType: engineData?.propulsionSystemType || "",
    propellerDiameter: engineData?.propellerDiameter || "",
    propellerMaterial: engineData?.propellerMaterial || "",
    propellerPitch: engineData?.propellerPitch || "",
    propellerType: engineData?.propellerType || "",
    propellerShaftDiameter: engineData?.propellerShaftDiameter || "",
    gearboxType: engineData?.gearboxType || "",
    transmissionCooling: engineData?.transmissionCooling || "",
    propellerBladeMaterial: engineData?.propellerBladeMaterial || "",
    propellerShaftMaterial: engineData?.propellerShaftMaterial || "",
    steeringSystem: engineData?.steeringSystem || "",
    steeringControlType: engineData?.steeringControlType || "",
    trimSystem: engineData?.trimSystem || "",
    trimTabMaterial: engineData?.trimTabMaterial || "",
    trimTabType: engineData?.trimTabType || "",
  });
  
  const [fuelSystem, setFuelSystem] = useState({
    electronicFuelinjection: engineData?.electronicFuelinjection || "",
    fuelPreFilter: engineData?.fuelPreFilter || "",
    fuelFilter: engineData?.fuelFilter || "",
    fuelFilterType: engineData?.fuelFilterType || "",
    fuelReserve: engineData?.fuelReserve || "",
    fuelSystem: engineData?.fuelSystem || "",
    fuelTankCapacity: engineData?.fuelTankCapacity || "",
    fuelType: engineData?.fuelType || "",
    lowestSpecificFuelConsumption: engineData?.lowestSpecificFuelConsumption || "",
    recommendedFuel: engineData?.recommendedFuel || "",
    fuelConsumptionAtCruisingSpeed: engineData?.fuelConsumptionAtCruisingSpeed || "",
    fuelConsumptionRate: engineData?.fuelConsumptionRate || "",
    fuelConsumtpionAtFullLoad: engineData?.fuelConsumtpionAtFullLoad || "",
    fuelInjectionSystemType: engineData?.fuelInjectionSystemType || "",
    fuelDeliveryPressure: engineData?.fuelDeliveryPressure || "",
    fuelTankMaterial: engineData?.fuelTankMaterial || "",
    fuelLineDiameter: engineData?.fuelLineDiameter || "",
  });
  
  const [fuelConsumption, setFuelConsumption] = useState({
    fuelConsumption: engineData?.fuelConsumption || "",
    fuelConsumptionHalfLoad: engineData?.fuelConsumptionHalfLoad || "",
    fuelConsumptionPropellerCurve: engineData?.fuelConsumptionPropellerCurve || "",
    heatRejectionToCoolant: engineData?.heatRejectionToCoolant || "",
  });
  
  const [oil, setOil] = useState({
    oilFilter: engineData?.oilFilter || "",
    oilFilterType: engineData?.oilFilterType || "",
    centrifugalOilCleaner: engineData?.centrifugalOilCleaner || "",
    oilCooler: engineData?.oilCooler || "",
    oilFiller: engineData?.oilFiller || "",
    oilDipstick: engineData?.oilDipstick || "",
    recommendedOil: engineData?.recommendedOil || "",
    oilCapacity: engineData?.oilCapacity || "",
    oilChangeInterval: engineData?.oilChangeInterval || "",
    oilCoolingMethod: engineData?.oilCoolingMethod || "",
    lubricationOilPressure: engineData?.lubricationOilPressure || "",
    oilFilterBypassValve: engineData?.oilFilterBypassValve || "",
  });
  
  const [electricalSystem, setElectricalSystem] = useState({
    alternator: engineData?.alternator || "",
    alternatorOutput: engineData?.alternatorOutput || "",
    batteryType: engineData?.batteryType || "",
    batteryVoltage: engineData?.batteryVoltage || "",
    generatorOutputKw: engineData?.generatorOutputKw || "",
    alternatorOutputAmps: engineData?.alternatorOutputAmps || "",
    starterMotorVoltage: engineData?.starterMotorVoltage || "",
    engineControlUnitModel: engineData?.engineControlUnitModel || "",
    batteryChargingSystem: engineData?.batteryChargingSystem || "",
    integratedGenerator: engineData?.integratedGenerator || "",
  });
  
  const [emissionsAndEnvironment, setEmissionsAndEnvironment] = useState({
    emissionCompliance: engineData?.emissionCompliance || "",
    exhaustSystem: engineData?.exhaustSystem || "",
    exhaustSystemType: engineData?.exhaustSystemType || "",
    exhaustGasAfterTreatment: engineData?.exhaustGasAfterTreatment || "",
    exhaustGasStatus: engineData?.exhaustGasStatus || "",
    exhaustValveTiming: engineData?.exhaustValveTiming || "",
    intakeValveTiming: engineData?.intakeValveTiming || "",
    emissionControlTechnology: engineData?.emissionControlTechnology || "",
    noxEmissions: engineData?.noxEmissions || "",
    coxEmissions: engineData?.coxEmissions || "",
    soxEmissions: engineData?.soxEmissions || "",
    complianceWithIMOStandards: engineData?.complianceWithIMOStandards || "",
  });
  
  const [safetyAndMonitoring, setSafetyAndMonitoring] = useState({
    emergencyStopSystem: engineData?.emergencyStopSystem || "",
    engineMonitoringSystems: engineData?.engineMonitoringSystems || "",
    overheatProtection: engineData?.overheatProtection || "",
    lowOilPressureAlarm: engineData?.lowOilPressureAlarm || "",
  });
  
  const [engineParts, setEngineParts] = useState({
    engineBearings: engineData?.engineBearings || "",
    engineBed: engineData?.engineBed || "",
    engineBlock: engineData?.engineBlock || "",
    engineBracket: engineData?.engineBracket || "",
    engineBreather: engineData?.engineBreather || "",
    engineCompartment: engineData?.engineCompartment || "",
    engineCompartmentVentilation: engineData?.engineCompartmentVentilation || "",
    engineCoolingSystem: engineData?.engineCoolingSystem || "",
    engineCover: engineData?.engineCover || "",
    engineDrivenPump: engineData?.engineDrivenPump || "",
    engineExhaustSystem: engineData?.engineExhaustSystem || "",
    engineGasketSet: engineData?.engineGasketSet || "",
    engineGearshift: engineData?.engineGearshift || "",
    engineHatch: engineData?.engineHatch || "",
    engineHourMeter: engineData?.engineHourMeter || "",
    engineInstrumentPanel: engineData?.engineInstrumentPanel || "",
    engineMaintenance: engineData?.engineMaintenance || "",
    engineMounts: engineData?.engineMounts || "",
    enginePanel: engineData?.enginePanel || "",
    engineRemoteControl: engineData?.engineRemoteControl || "",
    engineStartButton: engineData?.engineStartButton || "",
    engineStopButton: engineData?.engineStopButton || "",
    engineTachometer: engineData?.engineTachometer || "",
    engineTelegraph: engineData?.engineTelegraph || "",
    engineTemperatureGauge: engineData?.engineTemperatureGauge || "",
    engineThrottle: engineData?.engineThrottle || "",
    engineTransmission: engineData?.engineTransmission || "",
    engineTrunk: engineData?.engineTrunk || "",
    engineVoltageMeter: engineData?.engineVoltageMeter || "",
    engineWarningLight: engineData?.engineWarningLight || "",
    engineControlLever: engineData?.engineControlLever || "",
    engineControlPartsAccessories: engineData?.engineControlPartsAccessories || "",
    engineControlRoom: engineData?.engineControlRoom || "",
  });
  
  const [engineMeasurements, setEngineMeasurements] = useState({
    engineCoolingWaterFlow: engineData?.engineCoolingWaterFlow || "",
    engineExhaustTemperature: engineData?.engineExhaustTemperature || "",
    engineOperatingHours: engineData?.engineOperatingHours || "",
    enginePowerHpKw: engineData?.enginePowerHpKw || "",
    engineRoomVolume: engineData?.engineRoomVolume || "",
    engineRpm: engineData?.engineRpm || "",
    engineTorque: engineData?.engineTorque || "",
  });
  
  const [engineRoom, setEngineRoom] = useState({
    engineRoom: engineData?.engineRoom || "",
    engineRoomFan: engineData?.engineRoomFan || "",
    engineRoomFanExtractor: engineData?.engineRoomFanExtractor || "",
    engineRoomInsulation: engineData?.engineRoomInsulation || "",
    engineRoomLight: engineData?.engineRoomLight || "",
    engineRoomSoundproofing: engineData?.engineRoomSoundproofing || "",
    engineRoomVentilation: engineData?.engineRoomVentilation || "",
  });
  
  const [engineShaft, setEngineShaft] = useState({
    engineShaftBearing: engineData?.engineShaftBearing || "",
    engineShaftCollar: engineData?.engineShaftCollar || "",
    engineShaftCoupling: engineData?.engineShaftCoupling || "",
    engineShaftKey: engineData?.engineShaftKey || "",
    engineShaftLog: engineData?.engineShaftLog || "",
    engineShaftNut: engineData?.engineShaftNut || "",
    engineShaftSeal: engineData?.engineShaftSeal || "",
    engineShaftSealant: engineData?.engineShaftSealant || "",
    engineShaftSize: engineData?.engineShaftSize || "",
    engineShaftSpacer: engineData?.engineShaftSpacer || "",
    engineShaftStrut: engineData?.engineShaftStrut || "",
    engineShaftTube: engineData?.engineShaftTube || "",
    engineShaftWasher: engineData?.engineShaftWasher || "",
  });
  
  const [engineType, setEngineType] = useState({
    ecuEngineControlUnit: engineData?.ecuEngineControlUnit || "",
    engineFuelType: engineData?.engineFuelType || "",
    engineStroke: engineData?.engineStroke || "",
    engineTier: engineData?.engineTier || "",
    inboardOutboard: engineData?.inboardOutboard || "",
    mainOrAuxiliary: engineData?.mainOrAuxiliary || "",
    podEngine: engineData?.podEngine || "",
    saildriveEngine: engineData?.saildriveEngine || "",
    steeringAndEngineControls: engineData?.steeringAndEngineControls || "",
    sternDriveEngine: engineData?.sternDriveEngine || "",
    engineType: engineData?.engineType || "",
  });

  const checkRequired = () => {
    const errors = {};
    Object.keys(typeDef).forEach((sectionKey) => {
      const section = typeDef[sectionKey];
      const sectionData = sections[sectionKey];
      Object.keys(section).forEach((fieldKey) => {
        const field = section[fieldKey];
        if (field.mandatory) {
          const fieldValue = sectionData[fieldKey];
          if (field.type === "radio") {
            if (!field.value || String(field.value).trim() === "") {
              errors[`${fieldKey}`] = true;
            }
          } else if (field.type === "number") {
            if (
              fieldValue === undefined ||
              fieldValue === "" ||
              isNaN(fieldValue)
            ) {
              errors[`${fieldKey}`] = true;
            }
          }
        }
      });
    });

    setError(errors);
    return Object.keys(errors).length === 0;
  };

  const sections = {
    engineDetails,
    condition,
    performance,
    general,
    transmission,
    cylinders,
    propulsion,
    fuelSystem,
    serviceAndMaintenance,
    installationAndMounting,
    safetyAndMonitoring,
    fuelConsumption,
    torque,
    rpm,
    oil,
    emissionsAndEnvironment,
    dimensions,
    electricalSystem,
    engineShaft,
    engineType,
    engineRoom,
    engineMeasurements,
    engineParts,
    equipment,
    coolingSystem,
  };

  const setStateFunctions = {
    engineDetails: setEngineDetails,
    condition: setCondition,
    general: setGeneral,
    transmission: setTransmission,
    installationAndMounting: setInstallationAndMounting,
    serviceAndMaintenance: setServiceAndMaintenance,
    equipment: setEquipment,
    dimensions: setDimensions,
    performance: setPerformance,
    cylinders: setCylinders,
    rpm: setRpm,
    torque: setTorque,
    coolingSystem: setCoolingSystem,
    propulsion: setPropulsion,
    fuelSystem: setFuelSystem,
    fuelConsumption: setFuelConsumption,
    oil: setOil,
    electricalSystem: setElectricalSystem,
    emissionsAndEnvironment: setEmissionsAndEnvironment,
    safetyAndMonitoring: setSafetyAndMonitoring,
    engineParts: setEngineParts,
    engineMeasurements: setEngineMeasurements,
    engineRoom: setEngineRoom,
    engineShaft: setEngineShaft,
    engineType: setEngineType,
  };

  const handleOptionSelect = (category, field, selectedOption) => {
    setAllSelectedOptions((prevState) => {
      const updatedOptions = {
        ...prevState,
        [category]: {
          ...prevState[category],
          [field]: selectedOption,
        },
      };

      if (category === "engineDetails" && field === "typeDesignation") {
        const {
          engineMake,
          engineModel,
          engineModelYear,
          engineType,
          typeDesignation,
        } = updatedOptions.engineDetails;
        fetchRelevantOptions(
          engineMake,
          engineModel,
          engineModelYear,
          engineType,
          typeDesignation
        );
      }

      return updatedOptions;
    });

    if (
      category === "engineDetails" &&
      (field === "engineModel" ||
        field === "engineModelYear" ||
        field === "engineMake" ||
        field === "engineType")
    ) {
      // Fetch manufacturers based on selected trailerId
      fetchEngineDetailsSectionOptions(category, selectedOption, field);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (checkRequired()) {
        // If no errors, proceed with form submission logic
        console.log("001 Form is valid, submitting...");
        // localStorage.setItem("advertise_engine", JSON.stringify(form));
      } else {
        console.warn(error);
      }
    } catch (error) {
      console.error(error);
    }
  };
  function setPageData(key, newData) {
    const setStateFunction = setStateFunctions[key];
    if (setStateFunction) {
      setStateFunction((prevState) => ({
        ...prevState,
        ...newData,
      }));
    } else {
      console.error(`No setState function found for key: ${key}`);
    }
  }

  const cacheKey = "enginesFilterData";
  const URL = apiUrl +"/advert_engine/";

  const fetchDistinctData = async () => {
    try {
      setLoading(true);
      const promises = Object.keys(sections).map(async (key) => {
        const response = await fetch(`${URL}engines`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sections[key]),
        });
        const data = await response.json();
        return { key, data: data.res };
      });
      const results = await Promise.all(promises);
      results.forEach(({ key, data }) => {
        setPageData(key, data);
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      console.log("done");
    }
  };
  const fetchRelevantOptions = async (
    engineMake,
    engineModel,
    engineModelYear,
    engineType,
    typeDesignation
  ) => {
    try {
      setLoading(true);
      const requestBody = {
        engineMake,
        engineModel,
        engineModelYear,
        engineType,
        typeDesignation,
      };
      const response = await fetch(`${URL}relevant_data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requestBody }),
      });
      const data = await response.json();
      const result = data?.result;

      if (result) {
        const updatePromises = Object.keys(result).map((fieldKey) => {
          if (Object.keys(requestBody).includes(fieldKey)) {
            return Promise.resolve();
          }
          return Promise.all(
            Object.keys(sections).map((sectionKey) => {
              return new Promise((resolve) => {
                if (sections[sectionKey][fieldKey] !== undefined) {
                  const fieldValue =
                    Array.isArray(result[fieldKey]) &&
                      result[fieldKey].length > 0
                      ? result[fieldKey]?.[0]
                      : sections[sectionKey][fieldKey];

                  setAllSelectedOptions((prevState) => ({
                    ...prevState,
                    [sectionKey]: {
                      ...prevState[sectionKey],
                      [fieldKey]: [fieldValue],
                    },
                  }));

                  resolve();
                } else {
                  resolve();
                }
              });
            })
          );
        });

        // Wait for all updates to complete
        await Promise.all(updatePromises);
      }
    } catch (error) {
      console.error("Error fetching other section:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchEngineDetailsSectionOptions = async (
    category,
    selectedOption,
    Key
  ) => {
    try {
      setLoading(true);
      const tableName = "General";

      // Define the order of keys for request body construction
      const keyHierarchy = [
        "engineMake",
        "engineModel",
        "engineModelYear",
        "engineType",
        "typeDesignation",
      ];

      // Find the index of the current key
      const currentKeyIndex = keyHierarchy.indexOf(Key);

      // The next column to be fetched will be the one after the current key
      const fetchColumn = keyHierarchy[currentKeyIndex + 1];

      // Dynamically construct the requestBody by including all prior selections
      let requestBody = {};
      for (let i = 0; i <= currentKeyIndex; i++) {
        const key = keyHierarchy[i];
        // If it's the current key, assign the selected option, otherwise use the already selected options
        requestBody[key] =
          key === Key ? selectedOption : allSelectedOptions[category]?.[key];
      }

      // Make sure fetchColumn is defined before proceeding
      if (!fetchColumn) {
        throw new Error(
          "No further data to fetch. All selections are complete."
        );
      }

      // Send the request
      const response = await fetch(`${URL}${tableName}/${fetchColumn}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requestBody }),
      });

      const data = await response.json();

      // Update the page data with the fetched results
      setPageData(category, {
        ...sections[category],
        [fetchColumn]: data.result,
      });
    } catch (error) {
      console.error("Error fetching manufacturers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      setPageData(JSON.parse(cachedData));
    } else {
      if (!hasFetched.current) {
        fetchDistinctData();
        hasFetched.current = true;
      }
    }
  }, [setPageData]);

  const handleInputChange = (title, fieldKey, newValue) => {
    setEngines((prevTrailers) => ({
      ...prevTrailers,
      [title]: {
        ...prevTrailers[title],
        [fieldKey]: newValue,
      },
    }));
  };

  const errorDisplay = (fieldName) => {
    return (
      <div style={{ color: "red", paddingLeft: 10 }}>
        {fieldName} field is required
      </div>
    );
  };

  return (
    <Container className="mb-5">
      {loading ? (
        <Loader />
      ) : (
        <Form onSubmit={handleSubmit}>
          <Row>
            {Object.keys(sections).map((title) => (
              <Col md={6} key={title} className="mt-2">
                <legend className="fieldset-legend">
                  <h6 style={{ padding: "15px 10px 0px 10px" }}>
                    {makeString(title, keyToExpectedValueMap)}
                  </h6>
                </legend>
                {Object.keys(sections[title]).map((fieldKey) => {
                  const field = typeDef[title][fieldKey];
                  if (field && field.type === "radio") {
                    return (
                      <Col
                        md={12}
                        className="mr-3"
                        key={fieldKey}
                        style={{ width: 480 }}
                      >
                        <Col xs={3} md={12}>
                          <DropdownWithRadio
                            heading={fieldKey}
                            title={makeString(fieldKey, keyToExpectedValueMap)}
                            options={sections[title][fieldKey]}
                            selectedOption={
                              allSelectedOptions[title]?.[fieldKey] || engineData[title]?.[fieldKey] || ""
                            }
                            setSelectedOption={(selectedOption) =>
                              handleOptionSelect(
                                title,
                                fieldKey,
                                selectedOption
                              )
                            }
                            isMandatory={field.mandatory}
                            setOpenKey={setOpenKey}
                            openKey={openKey}
                          />
                          {error[`${fieldKey}`] && (
                            <div>
                              {errorDisplay(
                                makeString(fieldKey, keyToExpectedValueMap)
                              )}
                            </div>
                          )}
                        </Col>
                      </Col>
                    );
                  } else if (field && field.type === "number") {
                    return (
                      <Col
                        md={12}
                        className="mr-3"
                        key={fieldKey}
                        style={{ width: 480 }}
                      >
                        <InputComponentDynamic
                          label={makeString(fieldKey, keyToExpectedValueMap)}
                          value={engines[title]?.[fieldKey] || ""}
                          setValue={(e) =>
                            handleInputChange(title, fieldKey, e.target.value)
                          }
                          formType="number"
                          setOpenKey={setOpenKey}
                          openKey={openKey}
                          isMandatory={field.mandatory}
                        />
                        {error[`${fieldKey}`] && (
                          <div>
                            {errorDisplay(
                              makeString(fieldKey, keyToExpectedValueMap)
                            )}
                          </div>
                        )}
                      </Col>
                    );
                  }
                  return null;
                })}
              </Col>
            ))}
          </Row>
          <SubmitButton
            text="Submit"
            name="advert_engine_submit"
            onClick={handleSubmit}
          />
        </Form>
      )}
    </Container>
  );
}
