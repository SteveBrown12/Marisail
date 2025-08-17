import { useState, useEffect } from "react";
import { Form, Container, Row, Col } from "react-bootstrap";
import DropdownWithCheckBoxes from "../DropdownWithCheckBoxes2";
import EngineCard from "../EngineCard";
import Pagination from "../CustomPagination";
import { fetchColumns } from "../../api/searchEngineApi";
const apiUrl = import.meta.env.VITE_BACKEND_URL;

import "./Engine_Search.scss";
import Loader from "../Loader";
import ResetBar from "../ResetBar";
import { varToDb, varToScreen } from "./Engine_Search_Info";
const Engines = () => {
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
      console.log("/berths Put");
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
        console.log(err);
      } finally {
        setLoading(false);
        console.log("done");
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

  console.log("engines :>> ", engines);

  return (
    <Container>
      <Row>
        <ResetBar
          selectedTags={allSelectedOptions}
          removeTag={removeTag}
          resetTags={resetTags}
        />
      </Row>
      <Row>
        <Col md={3}>
          <Row>
            <h4 className="py-3">Search For Engines</h4>
          </Row>
          <Row>
            {Object.keys(filters).map((key) => {
              return (
                <fieldset key={key} className="mb-4">
                  <legend className="fieldset-legend">
                    <h6
                      style={{
                        padding: "15px 0px",

                        width: "100%",
                        display: "flex", // Use flex display
                        flexDirection: "row", // Arrange elements in a row
                        justifyContent: "space-between", // Space elements evenly
                        alignItems: "center", // Align vertically
                      }}
                    >
                      <span>{varToScreen[key]?.displayText}</span>
                    </h6>
                  </legend>
                  {Object.keys(filters[key]).map((key2) => {
                    const uniqueKey = `${key}-${key2}`; // Unique key for each filter
                    return (
                      <>
                        {varToScreen[key2]?.displayText && (
                          <Row key={uniqueKey} className="row-margin">
                            <Col md={12}>
                              <Form.Group>
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
                              </Form.Group>
                            </Col>
                          </Row>
                        )}
                      </>
                    );
                  })}
                </fieldset>
              );
            })}
          </Row>
        </Col>
        <Col md={9}>
          <Row>
            <Col md={12}>
              <h1
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "200",
                  padding: "20px",
                }}
              >
                Engines For Sale
              </h1>
            </Col>
          </Row>
          {loading ? (
            // <p>Loading...</p>
            <Loader />
          ) : (
            <Row>
              {engines.length === 0 ? (
                <Col md={12}>
                  <p>No Results Found</p>
                </Col>
              ) : (
                engines.map((engine) => (
                  <Col key={engine.engine_id} md={4}>
                    <EngineCard {...engine} />
                  </Col>
                ))
              )}
            </Row>
          )}
          {!loading ? <Pagination totalPages={pagination.totalPages} /> : <></>}
        </Col>
      </Row>
    </Container>
  );
};

export default Engines;
