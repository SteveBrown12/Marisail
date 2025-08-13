import PropTypes from "prop-types";
import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// Components
import Loader from "../components/Loader";
import SubmitButton from "../components/SubmitButton";
import ResetBar from "../components/ResetBar";
import DropdownWithRadio from "../components/DropdownWithRadio";
import DropdownWithCheckBoxes from "../components/DropdownWithCheckBoxes2";
import InputComponentDynamic from "../components/InputComponentDynamic";
import EngineCard from "../components/EngineCard";
import Pagination from "../components/CustomPagination";

// Config
import { keyToExpectedValueMap, typeDef } from "./services/Engine_Advert_Info";
import { varToDb, varToScreen } from "./services/Engine_Search_Info";

// Services
import { makeString } from "../utils/common_functions";
import FormFieldCard from "../components/FormFieldCard";
import { fetchColumns } from "../utils/searchEngineApi";


const apiUrl = import.meta.env.VITE_BACKEND_URL;

function EngineAdvert() {
  const navigate = useNavigate();
  const [error, setError] = useState({});
  const hasFetched = useRef(false);
  const [engines, setEngines] = useState("");
  const [openKey, setOpenKey] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allSelectedOptions, setAllSelectedOptions] = useState({});
  const [engineDetails, setEngineDetails] = useState({
    engineMake: "",
    engineModel: "",
    engineModelYear: "",
    engineType: "",
    typeDesignation: "",
    askingPrice: "",
    condition: "",
    usedCondition: "",
    seller: "",
    offeredBy: "",
    lastSurveyDate: new Date(),
    brokerValuation: "",
  });
   const [condition, setCondition] = useState({
     condition: "",
     usedCondition: "",
     seller: "",
     offeredBy: "",
     lastSurveyDate: new Date(),
     brokerValuation: "",
   });
   const [general, setGeneral] = useState({
     engineClassification: "",
     certification: "",
     manufacturerWarranty: "",
     engineSerialNumber: "",
     ce_DesignCategory: "",
     numberDrives: "",
     numberEngines: "",
     rangeMiles: "",
     cruisingSpeed: "",
     driveType: "",
     engineHours: "",
     ignitionSystem: "",
     noiseLevel: "",
     engineSoundproofingKits: "",
   });
  const [transmission, setTransmission] = useState({
    transmissionType: "",
    gearShift: "",
    gearRatio: "",
    gearShiftType: "",
    flywheelSAE14: "",
    siluminFlywheelHousing: "",
    camShaft: "",
    camShaftAlloy: "",
    crankcaseDesign: "",
  });
  const [installationAndMounting, setInstallationAndMounting] = useState({
    engineMountingOrientation: "",
    engineSuspension: "",
    engineMountingType: "",
    mountingBracketMaterial: "",
    alignmentRequirements: "",
    engineBlock: "",
  });
  const [serviceAndMaintenance, setServiceAndMaintenance] = useState({
    scheduledMaintenancePlan: "",
    serviceInterval: "",
    maintenanceLogRequirements: "",
    availabilityOfSpareParts: "",
    operationMode: "",
    lastServiceDate: "",
  });
  const [equipment, setEquipment] = useState({
    engineManagementSystem: "",
    engineControlSystem: "",
    unitInjectors: "",
    turboCharger: "",
    turboCharging: "",
    starterMotor: "",
    protectionCovers: "",
    closedCrankcaseVentilation: "",
    heatExchanger: "",
    heatExchangerWithExpansionTank: "",
    seaWaterPump: "",
    seaWaterCooledChargeAirCooler: "",
    workingPrinciple: "",
    compressionRatio: "",
    pistonSpeedAt1500Rpm: "",
    pistonSpeedAt1800Rpm: "",
    firingOrder: "",
    pistons: "",
    connectionRods: "",
    auxiliaryPowerTakeOff: "",
    remoteControlSystems: "",
  });
  const [dimensions, setDimensions] = useState({
    displacement: "",
    length: "",
    width: "",
    height: "",
    lengthFromFrontEndOfFlywheelHousing: "",
    engineWeight: "",
    dryWeight: "",
    exclOilWeight: "",
    weightWithHeatExchanger: "",
    weightWithKeelCooling: "",
  });
  const [performance, setPerformance] = useState({
    nominalRating: "",
    enginePerformance: "",
    maxPowerOutput: "",
    maxPowerBHP: "",
    maxSpeedKnots: "",
    supercharged: "",
    valveTrain: "",
    grossPowerFullLoadKW: "",
    grossPowerFullLoadHpMetric: "",
    GrossPowerPropellerCurveKw: "",
    GrossPowerPropellerCurveHpMetric: "",
    grossTorque: "",
    powerToWeightRatio: "",
    engineEfficiency: "",
    engineSpeedRange: "",
    maximumContinuousRating: "",
    continuousPower: "",
    engineClassification: "",
    certification: "",
    manufacturerWarranty: "",
    engineSerialNumber: "",
    ce_DesignCategory: "",
    numberDrives: "",
    numberEngines: "",
    rangeMiles: "",
    cruisingSpeed: "",
    driveType: "",
    engineHours: "",
    ignitionSystem: "",
    noiseLevel: "",
    engineSoundproofingKits: "",
  });
  const [cylinders, setCylinders] = useState({
    cylinderConfiguration: "",
    numberCylinders: "",
    cylindersAndArrangement: "",
    numberValves: "",
    valvePerCylinder: "",
    boreXStroke: "",
    bore: "",
    stroke: "",
  });
   const [rpm, setRpm] = useState({
     idleRPM: "",
     ratedSpeedRPM: "",
     rpmAtMaxPower: "",
   });
  const [torque, setTorque] = useState({
    maximumTorque: "",
    maximumTorqueAtSpeed: "",
    torqueAtRatedSpeed: "",
    ecuEngineControlUnit: "",
    engineFuelType: "",
    engineStroke: "",
    engineTier: "",
    inboardOutboard: "",
    mainOrAuxiliary: "",
    podEngine: "",
    saildriveEngine: "",
    steeringAndEngineControls: "",
    sternDriveEngine: "",
    engineType: "",
    idleRPM: "",
    ratedSpeedRPM: "",
    rpmAtMaxPower: "",
  });
  const [coolingSystem, setCoolingSystem] = useState({
    afterCooled: "",
    coolingSystem: "",
    openCoolingSystem: "",
    closedCoolingSystem: "",
    intercooled: "",
    recommendedCoolant: "",
    typeOfCooling: "",
    heatDissipationRate: "",
    heatExchangerMaterial: "",
    engineLubrication: "",
    lubricationSystem: "",
    coolingCapacity: "",
    coolingFluidType: "",
    coolingSystemPressure: "",
    airFilterType: "",
    circulationPumpType: "",
    rawWaterpumpType: "",
  });
  const [propulsion, setPropulsion] = useState({
    propulsion: "",
    bowthruster: "",
    propulsionSystem: "",
    propulsionSystemType: "",
    propellerDiameter: "",
    propellerMaterial: "",
    propellerPitch: "",
    propellerType: "",
    propellerShaftDiameter: "",
    gearboxType: "",
    transmissionCooling: "",
    propellerBladeMaterial: "",
    propellerShaftMaterial: "",
    steeringSystem: "",
    steeringControlType: "",
    trimSystem: "",
    trimTabMaterial: "",
    trimTabType: "",
  });
  const [fuelSystem, setFuelSystem] = useState({
    electronicFuelinjection: "",
    fuelPreFilter: "",
    fuelFilter: "",
    fuelFilterType: "",
    fuelReserve: "",
    fuelSystem: "",
    fuelTankCapacity: "",
    fuelType: "",
  
    recommendedFuel: "",
  
    fuelConsumtpionAtFullLoad: "",
    fuelInjectionSystemType: "",
    fuelDeliveryPressure: "",
    fuelTankMaterial: "",
    fuelLineDiameter: "",
  });
  const [fuelConsumption, setFuelConsumption] = useState({
    fuelConsumption: "",
    fuelConsumptionHalfLoad: "",
    fuelConsumptionPropellerCurve: "",
    heatRejectionToCoolant: "",
    fuelConsumptionAtCruisingSpeed: "",
    fuelConsumptionRate: "",
    lowestSpecificFuelConsumption: "",
  });
  const [oil, setOil] = useState({
    oilFilter: "",
    oilFilterType: "",
    centrifugalOilCleaner: "",
    oilCooler: "",
    oilFiller: "",
    oilDipstick: "",
    recommendedOil: "",
    oilCapacity: "",
    oilChangeInterval: "",
    oilCoolingMethod: "",
    lubricationOilPressure: "",
    oilFilterBypassValve: "",
  });
  const [electricalSystem, setElectricalSystem] = useState({
    alternator: "",
    alternatorOutput: "",
    batteryType: "",
    batteryVoltage: "",
    generatorOutputKw: "",
    alternatorOutputAmps: "",
    starterMotorVoltage: "",
    engineControlUnitModel: "",
    batteryChargingSystem: "",
    integratedGenerator: "",
  });
  const [emissionsAndEnvironment, setEmissionsAndEnvironment] = useState({
    emissionCompliance: "",
    exhaustSystem: "",
    exhaustSystemType: "",
    exhaustGasAfterTreatment: "",
    exhaustGasStatus: "",
    exhaustValveTiming: "",
    intakeValveTiming: "",
    emissionControlTechnology: "",
    noxEmissions: "",
    coxEmissions: "",
    soxEmissions: "",
    complianceWithIMOStandards: "",
  });
  const [safetyAndMonitoring, setSafetyAndMonitoring] = useState({
    emergencyStopSystem: "",
    engineMonitoringSystems: "",
    overheatProtection: "",
    lowOilPressureAlarm: "",
  });
  const [engineParts, setEngineParts] = useState({
    engineBearings: "",
    engineBed: "",
    engineBlock: "",
    engineBracket: "",
    engineBreather: "",
    engineCompartment: "",
    engineCompartmentVentilation: "",
    engineCoolingSystem: "",
    engineCover: "",
    engineDrivenPump: "",
    engineExhaustSystem: "",
    engineGasketSet: "",
    engineGearshift: "",
    engineHatch: "",
    engineHourMeter: "",
    engineInstrumentPanel: "",
    engineMaintenance: "",
    engineMounts: "",
    enginePanel: "",
    engineRemoteControl: "",
    engineStartButton: "",
    engineStopButton: "",
    engineTachometer: "",
    engineTelegraph: "",
    engineTemperatureGauge: "",
    engineThrottle: "",
    engineTransmission: "",
    engineTrunk: "",
    engineVoltageMeter: "",
    engineWarningLight: "",
    engineControlLever: "",
    engineControlPartsAccessories: "",
    engineControlRoom: "",
  });
  const [engineMeasurements, setEngineMeasurements] = useState({
    engineCoolingWaterFlow: "",
    engineExhaustTemperature: "",
    engineOperatingHours: "",
    enginePowerHpKw: "",
    engineRoomVolume: "",
    engineRpm: "",
    engineTorque: "",
  });
  const [engineRoom, setEngineRoom] = useState({
    engineRoom: "",
    engineRoomFan: "",
    engineRoomFanExtractor: "",
    engineRoomInsulation: "",
    engineRoomLight: "",
    engineRoomSoundproofing: "",
    engineRoomVentilation: "",
  });
  const [engineShaft, setEngineShaft] = useState({
    engineShaftBearing: "",
    engineShaftCollar: "",
    engineShaftCoupling: "",
    engineShaftKey: "",
    engineShaftLog: "",
    engineShaftNut: "",
    engineShaftSeal: "",
    engineShaftSealant: "",
    engineShaftSize: "",
    engineShaftSpacer: "",
    engineShaftStrut: "",
    engineShaftTube: "",
    engineShaftWasher: "",
  });

  const [engineType, setEngineType] = useState({
     ecuEngineControlUnit: "",
     engineFuelType: "",
     engineStroke: "",
     engineTier: "",
     inboardOutboard: "",
    mainOrAuxiliary: "",
     podEngine: "",
    saildriveEngine: "",
     steeringAndEngineControls: "",
     sternDriveEngine: "",
     engineType: "",
    });



  const sections = {
    engineDetails,
    condition,
    general,
    performance,
    transmission,
    cylinders,
    propulsion,
    fuelSystem,
    fuelConsumption,
    serviceAndMaintenance,
    installationAndMounting,
    safetyAndMonitoring,
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
      localStorage.setItem("EngineData", JSON.stringify(allSelectedOptions));
      navigate("/view-engine");
     
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
  const URL = apiUrl + "/advert_engine/";


  const fetchDistinctData = useCallback(
    async (sectionKey, fieldKey) => {
      try {
        setLoading(true);

        // Prepare request payload based on the opened section & field
        const requestBody = {
          sectionKey: sectionKey, // The section (e.g., "amenitiesAndServices")
          fieldKey: fieldKey, // The specific field/column (e.g., "wifiAvailability")
        };

        // Call API for only the relevant section & field
        const response = await fetch(`${URL}engines`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          const text = await response.text().catch(() => "");
          throw new Error(
            `engines endpoint error: ${response.status} ${response.statusText}\n${text.slice(0, 200)}`
          );
        }

        const contentType = response.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          const text = await response.text().catch(() => "");
          throw new Error(
            `engines endpoint returned non-JSON (${contentType}). Body: ${text.slice(0, 200)}`
          );
        }

        const data = await response.json();

        // Update state only for the specific field
        setPageData(sectionKey, data.res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [URL, sections, setPageData]
  );

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
      if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(
          `relevant_data endpoint error: ${response.status} ${response.statusText}\n${text.slice(0, 200)}`
        );
      }

      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        const text = await response.text().catch(() => "");
        throw new Error(
          `relevant_data endpoint returned non-JSON (${contentType}). Body: ${text.slice(0, 200)}`
        );
      }

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

      if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(
          `${tableName}/${fetchColumn} endpoint error: ${response.status} ${response.statusText}\n${text.slice(0, 200)}`
        );
      }

      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        const text = await response.text().catch(() => "");
        throw new Error(
          `${tableName}/${fetchColumn} returned non-JSON (${contentType}). Body: ${text.slice(0, 200)}`
        );
      }

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
  };;

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

  const handleDropdownOpen = (sectionKey, fieldKey) => {
    setOpenKey(fieldKey);

    // Fetch data only if not already loaded
    if (
      !sections[sectionKey][fieldKey] ||
      sections[sectionKey][fieldKey].length === 0
    ) {
      fetchDistinctData(sectionKey, fieldKey);
    }
  };

  return (
    <div className="mb-5">
      {loading ? (
        <Loader />
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap -mx-2">
            {Object.keys(sections).map((title) => (
              <div key={title} className="w-full md:w-1/2 px-2 mt-2">
                <legend className="fieldset-legend">
                  <h6 className="pt-4 px-2">
                    {makeString(title, keyToExpectedValueMap)}
                  </h6>
                </legend>
                {Object.keys(sections[title]).map((fieldKey) => {
                  const field = typeDef[title][fieldKey];

                  if (field && field.type === "radio") {
                    return (
                      <div
                        key={fieldKey}
                        className="w-[480px] mr-3 mb-4"
                      >
                        <div className="w-full">
                          <DropdownWithRadio
                            heading={fieldKey}
                            title={makeString(fieldKey, keyToExpectedValueMap)}
                            options={sections[title][fieldKey] || []}
                            selectedOption={
                              allSelectedOptions[title]?.[fieldKey] || ""
                            }
                            setSelectedOption={(selectedOption) =>
                              handleOptionSelect(title, fieldKey, selectedOption)
                            }
                            isMandatory={field.mandatory}
                            setOpenKey={() => handleDropdownOpen(title, fieldKey)}
                            openKey={openKey}
                          />
                          {error[`${fieldKey}`] && (
                            <div>
                              {errorDisplay(
                                makeString(fieldKey, keyToExpectedValueMap)
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  } else if (field && field.type === "number") {
                    return (
                      <div
                        key={fieldKey}
                        className="w-[480px] mr-3 mb-4"
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
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            ))}
            <FormFieldCard countryVisible={true} />
          </div>

          <SubmitButton
            text="Submit"
            name="advert_engine_submit"
            onClick={handleSubmit}
          />
        </form>
      )}
    </div>
  );
}


function EngineSearch() {
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [engines, setEngines] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState([]);
  const [allSelectedOptions, setAllSelectedOptions] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 21,
  });

  const [engineDetails, setEngineDetails] = useState({
    marisailVesselID: "",
    dataSouce: "",
    engineId: "",
    engineMake: "",
    engineModel: "",
    engineModelYear: "",
    engineType: "",
    typeDesignation: "",
    askingPrice: "",
    condition: "",
    usedCondition: "",
    seller: "",
    offeredBy: "",
    lastSurveyDate: "",
    brokerValuation: "",
  });

  const [condition, setCondition] = useState({
    condition: "",
    usedCondition: "",
    seller: "",
    offeredBy: "",
    lastSurveyDate: "",
    brokerValuation: "",
  });

  const [general, setGeneral] = useState({
    engineClassification: "",
    certification: "",
    manufacturerWarranty: "",
    engineSerialNumber: "",
    ceDesignCategory: "",
    numberDrives: "",
    numberEngines: "",
    range: "",
    cruisingSpeed: "",
    driveType: "",
    engineHours: "",
    ignitionSystem: "",
    noiseLevel: "",
    engineSoundproofingKits: "",
  });

  const [guestRequirements, setGuestRequirements] = useState({
    skipperIncluded: "",
    crewIncluded: "",
    crewUniformPreferences: "",
    localCuisinePreferences: "",
    cateringRequired: "",
    carParkingAvailable: "",
    specialRequirementsRequests: "",
  });

  const [transmission, setTransmission] = useState({
    transmissionType: "",
    gearShift: "",
    gearRatio: "",
    gearShiftType: "",
    flywheelSAE14: "",
    siluminFlywheelHousing: "",
    camshaft: "",
    crankshaftAlloy: "",
    crankcaseDesign: "",
  });

  const [installationMounting, setInstallationMounting] = useState({
    engineMountingOrientation: "",
    engineSuspension: "",
    engineMountingType: "",
    mountingBracketMaterial: "",
    alignmentRequirements: "",
    engineBlock: "",
  });

  const [serviceMaintenance, setServiceMaintenance] = useState({
    scheduledMaintenancePlan: "",
    serviceInterval: "",
    maintenanceLogRequirements: "",
    availabilityofSpareParts: "",
    operationMode: "",
    lastServiceDate: "",
  });

  const [equipment, setEquipment] = useState({
    engineManagementSystem: "",
    engineControlSystem: "",
    unitInjectors: "",
    turbocharger: "",
    turbocharging: "",
    starterMotor: "",
    protectionCovers: "",
    closedCrankcaseVentilation: "",
    heatExchanger: "",
    heatExchangerWithExpansionTank: "",
    seaWaterPump: "",
    seaWaterCooledChargeAirCooler: "",
    workingPrinciple: "",
    compressionRatio: "",
    pistonSpeedAt1500Rpm: "",
    pistonSpeedAt1800Rpm: "",
    firingOrder: "",
    pistons: "",
    connectionRods: "",
    auxiliaryPowerTakeOff: "",
    remoteControlSystems: "",
  });

  const [dimensions, setDimensions] = useState({
    displacement: "",
    length: "",
    width: "",
    height: "",
    lengthFromFrontEndToEdgeOfFlywheelHousing: "",
    engineWeight: "",
    dryWeight: "",
    weight: "",
    weightWithHeatExchanger: "",
    weightWithKeelCooling: "",
  });

  const [performance, setPerformance] = useState({
    nominalRating: "",
    enginePerformance: "",
    maxPowerOutput: "",
    maxPower: "",
    maxSpeed: "",
    supercharged: "",
    valveTrain: "",
    grossPowerFullLoadKw: "",
    grossPowerFullLoadHp: "",
    grossPowerPropellerCurveKw: "",
    grossPowerPropellerCurveHp: "",
    grossTorque: "",
    continuousPower: "",
    maximumContinuousRating: "",
    engineSpeedRange: "",
    engineEfficiency: "",
    powertoWeightRatio: "",
  });

  const [cylinders, setCylinders] = useState({
    cylinderConfiguration: "",
    numberCylinders: "",
    cylindersArrangement: "",
    numberValves: "",
    valveperCylinder: "",
    boreXStroke: "",
    bore: "",
    stroke: "",
  });

  const [rpm, setRpm] = useState({
    idleRPM: "",
    ratedSpeed: "",
    rpmMaxPower: "",
  });

  const [torque, setTorque] = useState({
    maximumTorque: "",
    maximumTorqueAtSpeed: "",
    torqueAtRatedSpeed: "",
  });

  const [coolingSystem, setCoolingSystem] = useState({
    aftercooled: "",
    coolingSystem: "",
    closedCoolingSystem: "",
    openCoolingSystem: "",
    intercooled: "",
    recommendedCoolant: "",
    typeOfCooling: "",
    heatExchangerMaterial: "",
    heatDissipationRate: "",
    engineLubrication: "",
    lubricationSystem: "",
    coolingCapacity: "",
    coolingFluidType: "",
    coolingSystemPressure: "",
    airFilterType: "",
    circulationPumpType: "",
    rawWaterPumpType: "",
  });

  const [engineParts, setEngineParts] = useState({
    engineBearings: "",
    engineBed: "",
    engineBlock: "",
    engineBracket: "",
    engineBreather: "",
    engineCompartment: "",
    engineCompartmentVentilation: "",
    engineCoolingSystem: "",
    engineCover: "",
    engineDrivenPump: "",
    engineExhaustSystem: "",
    engineGasketSet: "",
    engineGearshift: "",
    engineHatch: "",
    engineHourMeter: "",
    engineInstrumentPanel: "",
    engineMaintenance: "",
    engineMounts: "",
    enginePanel: "",
    engineRemoteControl: "",
    engineStartButton: "",
    engineStopButton: "",
    engineTachometer: "",
    engineTelegraph: "",
    engineTemperatureGauge: "",
    engineThrottle: "",
    engineTransmission: "",
    engineTrunk: "",
    engineVoltageMeter: "",
    engineWarningLight: "",
    engineControlLever: "",
    engineControlPartsAccessories: "",
    engineControlRoom: "",
  });

  const [electricalSystem, setElectricalSystem] = useState({
    alternator: "",
    alternatorOutput: "",
    batteryType: "",
    batteryVoltage: "",
    generatorOutput: "",
    starterMotorVoltage: "",
    engineControlUnitModel: "",
    batteryChargingSystem: "",
    integratedGenerator: "",
  });

  const [fuelSystem, setFuelSystem] = useState({
    electronicFuelInjection: "",
    fuelPreFilter: "",
    fuelFilter: "",
    fuelFilterType: "",
    fuelReserve: "",
    fuelSystem: "",
    fuelTankCapacity: "",
    fuelType: "",
    lowestSpecificFuelConsumption: "",
    recommendedFuel: "",
    fuelConsumptionAtCruisingSpeed: "",
    fuelConsumptionRate: "",
    fuelConsumptionAtFullLoad: "",
    fuelInjectionSystemType: "",
    fuelDeliveryPressure: "",
    fuelTankMaterial: "",
    fuelLineDiameter: "",
  });

  const [paymentTerms, setPaymentTerms] = useState({
    paymentTerms: "",
  });

  const [safetyMonitoring, setSafetyMonitoring] = useState({
    currency: "",
    engineMonitoringSystems: "",
    preferredPaymentMethods: "",
    overheatProtection: "",
    invoiceReceiptProcedures: "",
    lowOilPressureAlarm: "",
    emergencyStopSystem: "",
    calculatePricePay: "",
    priceLabel: "",
  });

  const filters = {
    // identification,
    engineDetails,
    // condition,
    general,
    guestRequirements,
    transmission,
    installationMounting,
    serviceMaintenance,
    equipment,
    dimensions,
    performance,
    cylinders,
    rpm,
    torque,
    coolingSystem,
    engineParts,
    electricalSystem,
    fuelSystem,
    paymentTerms,
    safetyMonitoring,
  };
  const setStateFunctions = {
    engineDetails: setEngineDetails,
    // condition: setCondition,
    general: setGeneral,
    guestRequirements: setGuestRequirements,
    transmission: setTransmission,
    installationMounting: setInstallationMounting,
    serviceMaintenance: setServiceMaintenance,
    equipment: setEquipment,
    dimensions: setDimensions,
    performance: setPerformance,
    cylinders: setCylinders,
    rpm: setRpm,
    torque: setTorque,
    coolingSystem: setCoolingSystem,
    engineParts: setEngineParts,
    electricalSystem: setElectricalSystem,
    fuelSystem: setFuelSystem,
    paymentTerms: setPaymentTerms,
    safetyMonitoring: setSafetyMonitoring,
  };

  const URL = apiUrl + "/search_engine/";

  // Function to fetch results from the API
  const fetchDropdownData = async (tableKey, columnKey, search, offSet) => {
    if (varToScreen[columnKey]?.type === "range" || tableKey === "notDefined")
      return;
    try {
      if (!varToScreen[columnKey]) {
        console.error(`Missing varToScreen mapping for ${columnKey}`);
        return;
      }
      setFetching(true);
      const response = await fetch(`${apiUrl + "/search_berth/"}engines`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteDetailsTable: tableKey,
          siteDetailsColumn: columnKey,
          searchString: search,
          offSet: offSet,
          appliedFilters: allSelectedOptions,
        }),
      });
      setFetching(false);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data?.ok || !data?.siteDetails?.data) {
        console.error("Invalid response format:", data);
        return;
      }

      var cleanData = data.siteDetails.data
        .filter(Boolean)
        .map((value) => value);
      const setStateFunction = setStateFunctions[tableKey];
      if (setStateFunction) {
        setStateFunction((prev) => ({
          ...prev,
          [columnKey]:
            offSet !== 0 ? [...prev[columnKey], ...cleanData] : cleanData,
        }));
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  // today
  useEffect(() => {
    const loadColumns = async () => {
      try {
        const columnList = await fetchColumns(tableName);
        setColumns(columnList);
        if (columnList.length > 0) {
          setSelectedColumn(columnList[0]); // Set default column
        }
      } catch (err) {
        setError(err.message);
      }
    };

    loadColumns();
  }, []);

  useEffect(() => {
    setLoading(true);
    let currInfo = {
      selectedOptions: allSelectedOptions,
      page: page,
    };
    const fetchEnginesData = async () => {
      try {
        const response = await fetch(`${URL}enginesData`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(currInfo),
        });
        const data = await response.json();
        setEngines(data?.res[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnginesData();
  }, [allSelectedOptions, page, URL]);

  const removeTag = (tag) => {
    setAllSelectedOptions((prev) => {
      const newOptions = { ...prev };
      delete newOptions[tag];
      return newOptions;
    });
  };

  const resetTags = () => {
    setAllSelectedOptions({});
  };

  return (
    <div className="container mx-auto">
      <div className="flex flex-wrap">
        <div className="w-full">
          <ResetBar
            selectedTags={allSelectedOptions}
            removeTag={removeTag}
            resetTags={resetTags}
          />
        </div>
      </div>

      <div className="flex flex-wrap">
        {/* Left Sidebar */}
        <div className="w-full md:w-1/4 px-2">
          <div className="flex flex-wrap">
            <h4 className="py-3">Search For Engines</h4>
          </div>

          <div className="flex flex-wrap">
            {Object.keys(filters).map((key) => {
              return (
                <fieldset key={key} className="mb-4">
                  <legend className="fieldset-legend">
                    <h6 className="py-[15px] w-full flex flex-row justify-between items-center">
                      <span>{varToScreen[key]?.displayText}</span>
                    </h6>
                  </legend>

                  {Object.keys(filters[key]).map((key2) => {
                    const uniqueKey = `${key}-${key2}`;
                    return (
                      <>
                        {varToScreen[key2]?.displayText && (
                          <div
                            key={uniqueKey}
                            className="flex flex-wrap mb-2"
                          >
                            <div className="w-full">
                              <div className="mb-2">
                                {varToScreen[key2]?.type !== "range" ? (
                                  <DropdownWithCheckBoxes
                                    onOpen={(search, offSet) =>
                                      fetchDropdownData(
                                        key,
                                        key2,
                                        search,
                                        offSet,
                                        allSelectedOptions
                                      )
                                    }
                                    varToDb={varToDb}
                                    heading={key2}
                                    title={varToScreen[key2]?.displayText}
                                    options={filters[key][key2] || []}
                                    selectedOptions={allSelectedOptions}
                                    setSelectedOptions={setAllSelectedOptions}
                                    fetching={fetching}
                                  />
                                ) : (
                                  <RangeInput
                                    key2={key2.replace(/\s+/g, " ").trim()}
                                    title={varToScreen[key2]?.displayText}
                                    fromValue={fromValue}
                                    toValue={toValue}
                                    setFromValue={setFromValue}
                                    radioOptions={
                                      varToScreen[key2]?.radioOptions
                                    }
                                    setToValue={setToValue}
                                    selectedRadio={
                                      selectedRadios[key2] ||
                                      varToScreen[key2]?.radioOptions[0]?.value
                                    }
                                    onRadioChange={(value) =>
                                      handleRadioChange(key2, value)
                                    }
                                    isOpen={!!openStates[key2]}
                                    toggleAccordion={() =>
                                      toggleAccordion(key2)
                                    }
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    );
                  })}
                </fieldset>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-3/4 px-2">
          <div className="flex flex-wrap">
            <div className="w-full">
              <h1 className="text-[1.5rem] font-extralight p-5">
                Engines For Sale
              </h1>
            </div>
          </div>

          {loading ? (
            <Loader />
          ) : (
            <div className="flex flex-wrap">
              {engines.length === 0 ? (
                <div className="w-full">
                  <p>No Results Found</p>
                </div>
              ) : (
                engines.map((engine) => (
                  <div key={engine.engine_id} className="w-full md:w-1/3 px-2">
                    <EngineCard {...engine} />
                  </div>
                ))
              )}
            </div>
          )}

          {!loading && (
            <Pagination totalPages={pagination.totalPages} />
          )}
        </div>
      </div>
    </div>
  );
};

const Engines = ({ type }) => {
  return (
    <main className="min-h-screen overflow-hidden">
      {type === "search" ? <EngineAdvert /> : <EngineSearch />}
    </main>
  );
};


Engines.propTypes = {
  type: PropTypes.string.isRequired,
};

export default Engines;
