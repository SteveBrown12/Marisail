import PropTypes from "prop-types";
import { useEffect, useState, useRef, useCallback, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Container, Row, Col } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";

// Components
import Loader from "../components/Loader";
import SubmitButton from "../components/SubmitButton";
import ResetBar from "../components/ResetBar";
import DropdownWithRadio from "../components/DropdownWithRadio";
import DropdownWithCheckBoxes from "../components/DropdownWithCheckBoxes2";
import InputComponentDynamic from "../components/InputComponentDynamic";
import InputComponentDual from "../components/InputComponentDual";
import RangeInput from "../components/RangeInput";
import TrailerCard from "../components/TrailerCard";

// Config
import { keyToExpectedValueMap, typeDef } from "../config/Trailer_Advert_Info";
import { varToDb, varToScreen } from "../config/Trailer_Search_Info";

// Services
import {
  makeString,
  convertUnitsInFormData,
} from "../services/common_functions";
import FormFieldCard from "../services/FormFieldCard";


const apiUrl = import.meta.env.VITE_BACKEND_URL;

function TrailersAdvert() {
  const navigate = useNavigate();
  const [error, setError] = useState({});
  const hasFetched = useRef(false);
  const [trailers, setTrailers] = useState("");
  const [openKey, setOpenKey] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allSelectedOptions, setAllSelectedOptions] = useState({});
  const [identification, setIdentification] = useState({
    trailerId: "",
    manufacturer: "",
    make: "",
    model: "",
    year: "",
    askingPrice: "",
    type: "",
    grossVehicleWeightRating: "",
    loadCapacity: "",
    length: "",
    width: "",
    totalHeight: "",
    axleHeightFromGround: "",
  });
  // const [basics, setBasics] = useState({
  
  // });
  const [constructionMaterials, setConstructionMaterials] = useState({
    frameMaterial: "",
    frameCoating: "",
    frameCrossmemberType: "",
    frameWeldType: "",
    maximumAngleOfApproach: "",
    floorMaterial: "",
    sidesMaterial: "",
    roofMaterial: "",
  });
  const [maintenanceFeatures, setMaintenanceFeatures] = useState({
    greasePoints: "", 
    bearingType: "",
    maintenanceSchedule: "",
    corrosionProtection: "",
    rustInhibitors: "", 
  });
  // const [userFeatures, setUserFeatures] = useState({
   
  // });
  const [specialFeatures, setSpecialFeatures] = useState({
    hydraulicTilt: "", //
    extendableTongue: "", //
    adjustableDeckHeight: "",
    detachableSidePanels: "", //
  });
  const [additionalAccessories, setAdditionalAccessories] = useState({
    rampType: "",
    winchPost: "",
    splashGuards: "",
    fenders: "",
    sideRails: "",
  });
  const [customizationOptions, setCustomizationOptions] = useState({
    color: "",
    decals: "", //
    storageBox: "", //
    lightingPackage: "", //
    suspensionUpgrade: "", //
  });
  const [axlesAndSuspension, setAxlesAndSuspension] = useState({
    axleType: "",
    axleCapacity: "",
    axleSealType: "",
    axleHubSize: "",
    axlePosition: "", //
    dropAxleOption: "", //
    suspensionType: "",
    suspensionCapacity: "",
    suspensionAdjustment: "",
  });
  const [tyresAndWheels, setTyresAndWheels] = useState({
    tyreSize: "",
    tyreLoadRange: "",
    tyreType: "",
    wheelType: "",
    wheelBoltPattern: "", //
    hubLubricationSystem: "", //
  });
  const [brakes, setBrakes] = useState({
    brakeType: "",
    brakeActuator: "",
    brakeLineMaterial: "",
    brakeDrumDiameter: "",
    brakeFluidType: "",
    brakes: "",
    couplerSize: "",
    couplerType: "",
    couplerLockType: "",
    hitchClass: "",
    hitchReceiverSize: "",
    safetyChains: "",
    breakawaySystem: "",
  });
  const [winchAndWrinchAccessories, setWinchAndWrinchAccessories] = useState({
    winchType: "",
    winchCapacity: "",
    winchRopeLength: "",
    winchDrumMaterial: "",
    winchGearRatio: "",
    winchRemoteControl: "",
    winchBrakeType: "",
    winchCableType: "",
    winchStrapLength: "",
    winchHandleLength: "",
    winchMounting: "",
  });
  const [lightingAndElectrical, setLightingAndElectrical] = useState({
    lighting: "",
    lightMountingPosition: "",
    lightType: "",
    electricalConnectorType: "",
    electricalWiringType: "",
    batteryType: "",
    batteryChargerType: "",
  });
  const [acessories, setAcessories] = useState({
    spareTyreCarrier: "",
    spareTyreSize: "",
    spareTyreMountingLocation: "",
    jackType: "",
    jackWheelType: "",
    jackCapacity: "",
    jackLiftHeight: "",
  });
  const [loadingAndTransportFeatures, setLoadingAndTransportFeatures] =
    useState({
      loadingSystem: "",
      bunks: "",
      bunkMaterial: "",
      bunkWidth: "",
      bunkHeightAdjustment: "",
      bunkMountingBracketMaterial: "",
      rollers: "",
      rollerMaterial: "",
      rollerAxleDiameter: "",
    });

  const [tongue, setTongue] = useState({
    tongueMaterial: "",
    tongueShape: "",
    tongueJackWheelSize: "",
    tongueJackType: "",
    tongueWeight: "",
    tongueWeightRatio: "",
  });
  const [documentation, setDocumentation] = useState({
    ownerManual: "",
    warranty: "",
    storage: "",
    tieDownPoints: "",
    toolBox: "",
    bumperType: "",
    userFeatures: "",
    wheelLocks: "",
    lockType: "",
    alarmSystem: "",
    gps_TrackingDevice: "",
    maximumSpeedRating: "",
    turningRadius: "",
  });
  const [regulatoryCompliance, setRegulatoryCompliance] = useState({
    dot_Compliance: "",
    natmCertification: "",
    euTypeApproval: "",
    adrCompliance: "",
  });
  const [paymentTerms, setPaymentTerms] = useState({
    paymentTerms: "",
    currency: "",
    preferredPaymentMethod: "",
    invoiceAndRecieptProcedures: "",
    calculatePriceAndPay: "",
    priceLabel: "",
    priceDrop: "",
    VAT: "",
    totalPrice: "",
    country: "",
    globalAddressLookup: "",
    distance: "",
    contactDetails: "",
    uploadPhotos: "",
    uploadVideos: "",
  });
  const handleDualInputChange = (title, fieldKey, inputValue, radioValue) => {
    setAllSelectedOptions((prevState) => ({
      ...prevState,
      [title]: {
        ...prevState[title],
        [fieldKey]: { value: inputValue, unit: radioValue },
      },
    }));
  };

 
  const sections = {
    identification,
    winchAndWrinchAccessories,
    specialFeatures,
    maintenanceFeatures,
   
    additionalAccessories,
    customizationOptions,
    axlesAndSuspension,
    loadingAndTransportFeatures,
   
    acessories,
    lightingAndElectrical,
    brakes,
    // performanceAndHandling,
    documentation,
    tyresAndWheels,
    tongue,
   
    constructionMaterials,
    paymentTerms,
    regulatoryCompliance,
    // environmentalAndCorrosionResistance,
  };

  const setStateFunctions = {
    identification: setIdentification,
    // basics: setBasics,
    constructionMaterials: setConstructionMaterials,
    maintenanceFeatures: setMaintenanceFeatures,
    // userFeatures: setUserFeatures,
    specialFeatures: setSpecialFeatures,
    additionalAccessories: setAdditionalAccessories,
    customizationOptions: setCustomizationOptions,
    axlesAndSuspension: setAxlesAndSuspension,
    tyresAndWheels: setTyresAndWheels,
    brakes: setBrakes,
    winchAndWrinchAccessories: setWinchAndWrinchAccessories,
    lightingAndElectrical: setLightingAndElectrical,
    acessories: setAcessories,
    loadingAndTransportFeatures: setLoadingAndTransportFeatures,
    tongue: setTongue,
    documentation: setDocumentation,
    regulatoryCompliance: setRegulatoryCompliance,
    paymentTerms: setPaymentTerms,
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

      if (category === "identification" && field === "model") {
        const { trailerId, manufacturer, make, model } =
          updatedOptions.identification;
        fetchRelevantOptions(trailerId, manufacturer, make, model);
      }

      return updatedOptions;
    });

    if (
      category === "identification" &&
      (field === "trailerId" || field === "manufacturer" || field === "make")
    ) {
      fetchIdentificationSectionOptions(category, selectedOption, field);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      convertUnitsInFormData(allSelectedOptions);
      // if (checkRequired()) {
      console.log("001 Form is valid, submitting...");
      localStorage.setItem("TrailerData", JSON.stringify(allSelectedOptions));
      navigate("/view-trailer");
      // localStorage.setItem("advertise_engine", JSON.stringify(form));
      // } else {
      //     console.warn(error);
      // }
    } catch (error) {
      console.error(error);
    }
  };
  const setPageData = useCallback(
    (key, newData) => {
      const setStateFunction = setStateFunctions[key];
      if (setStateFunction) {
        setStateFunction((prevState) => ({
          ...prevState,
          ...newData,
        }));
      } else {
        console.error(`No setState function found for key: ${key}`);
      }
    },
    [setStateFunctions]
  );

  const cacheKey = "trailersFilterData";
  const URL = apiUrl + "/trailers/";

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
        const response = await fetch(`${URL}trailers`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        const data = await response.json();
        console.log("data :>> ", data);

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

  const fetchRelevantOptions = async (trailerId, manufacturer, make, model) => {
    try {
      setLoading(true);

      const requestBody = {
        trailerId,
        manufacturer,
        make,
        model,
      };

      const response = await fetch(`${URL}relevant_data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      const result = data?.result;

      if (result) {
        // Create an array of promises to update each section asynchronously
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

                  resolve(); // Resolve the promise once the update is done
                } else {
                  resolve(); // Resolve the promise if there's no matching field
                }
              });
            })
          );
        });

        // Wait for all updates to complete
        await Promise.all(updatePromises);
      }
    } catch (error) {
      console.error("Error fetching relevant options:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchIdentificationSectionOptions = async (
    category,
    selectedOption,
    Key
  ) => {
    try {
      setLoading(true);
      const tableName = "Trailers_ID";
      const keyHierarchy = ["manufacturer", "make", "model"];
      const currentKeyIndex = keyHierarchy.indexOf(Key);
      const fetchColumn = keyHierarchy[currentKeyIndex + 1];
      let requestBody = {};
      for (let i = 0; i <= currentKeyIndex; i++) {
        const key = keyHierarchy[i];
        requestBody[key] =
          key === Key ? selectedOption : allSelectedOptions[category]?.[key];
      }

      if (!fetchColumn) {
        throw new Error(
          "No further data to fetch. All selections are complete."
        );
      }

      const response = await fetch(`${URL}${tableName}/${fetchColumn}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requestBody }),
      });

      const data = await response.json();

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


  const handleInputChange = (title, fieldKey, newValue) => {
    setTrailers((prevTrailers) => ({
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
                              allSelectedOptions[title]?.[fieldKey] || ""
                            }
                            setSelectedOption={(selectedOption) =>
                              handleOptionSelect(
                                title,
                                fieldKey,
                                selectedOption
                              )
                            }
                            isMandatory={field.mandatory}
                            setOpenKey={() =>
                              handleDropdownOpen(title, fieldKey)
                            }
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
                          value={trailers[title]?.[fieldKey] || ""}
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
                  } else if (field && field.type === "dual") {
                    return (
                      <Col
                        md={12}
                        className="mr-3"
                        key={fieldKey}
                        style={{ width: 480 }}
                      >
                        <InputComponentDual
                          label={makeString(fieldKey, keyToExpectedValueMap)}
                          value={trailers[title]?.[fieldKey] || ""}
                          setValue={(e) =>
                            handleInputChange(title, fieldKey, e.target.value)
                          }
                          formType="number"
                          setOpenKey={setOpenKey}
                          openKey={openKey || ""}
                          isMandatory={field.mandatory}
                          radioOptions={field?.radioOptions}
                          selectedOption={
                            allSelectedOptions[title]?.[fieldKey]?.unit || ""
                          }
                          setSelectedOption={(inputValue, radioValue) =>
                            handleDualInputChange(
                              title,
                              fieldKey,
                              inputValue,
                              radioValue
                            )
                          }
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
            <FormFieldCard countryVisible={true} />
          </Row>
          <SubmitButton
            text="Submit"
            name="advert_trailer_submit"
            onClick={handleSubmit}
          />
        </Form>
      )}
    </Container>
  );
}

function TrailersSearch() {
  const [selectedRadios, setSelectedRadios] = useState({});
  const [trailers, setTrailers] = useState([]);
  const [page, setPage] = useState(0);
  const [fromValue, setFromValue] = useState("");
  const [fetching, setFetching] = useState(true);
  const [toValue, setToValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [allSelectedOptions, setAllSelectedOptions] = useState({});
  const toggleReducer = (state, action) => {
    switch (action.type) {
      case "TOGGLE":
        return {
          ...state,
          [action.key]: !state[action.key],
        };
      default:
        return state;
    }
  };
  const [openStates, dispatch] = useReducer(toggleReducer, {});
  const toggleAccordion = (key) => {
    dispatch({ type: "TOGGLE", key });
  };
  const [identification, setIdentification] = useState({
    manufacturer: [],
    make: [],
    model: [],
    year: [],
    askingPrice: [],
    type: [],
    gvwr: [],
    loadCapacity: [],
    length: [],
    width: [],
    totalHeight: [],
    axleHeightFromGround: [],
  });
  const [basics, setBasics] = useState({
    type: [],
    gvwr: [],
    loadCapacity: [],
    length: [],
    width: [],
    totalHeight: [],
    axleHeightFromGround: [],
  });
  const [constructionMaterials, setConstructionMaterials] = useState({
    frameMaterial: [],
    frameCoating: [],
    frameCrossmemberType: [],
    frameWeldType: [],
    floorMaterial: [],
    sidesMaterial: [],
    roofMaterial: [],
  });
  const [maintenanceFeatures, setMaintenanceFeatures] = useState({
    bearingType: [],
  });
  const [userFeatures, setUserFeatures] = useState({
    tieDownPoints: [],
    bumperType: [],
  });
  const [specialFeatures, setSpecialFeatures] = useState({
    adjustableDeckHeight: [],
  });
  const [additionalAccessories, setAdditionalAccessories] = useState({
    rampType: [],
    winchPost: [],
    splashGuards: [],
    fenders: [],
    sideRails: [],
  });
  const [customizationOptions, setCustomizationOptions] = useState({
    color: [],
  });

  const [axlesAndSuspension, setAxlesAndSuspension] = useState({
    axleType: [],
    axleCapacity: [],
    axleSealType: [],
    axleHubSize: [],
    suspensionType: [],
    suspensionCapacity: [],
    suspensionAdjustment: [],
  });
  const [tyresAndWheels, setTyresAndWheels] = useState({
    tyreSize: [],
    tyreLoadRange: [],
    tyreType: [],
    wheelType: [],
  });
  const [brakes, setBrakes] = useState({
    brakeType: [],
    brakeFluidType: [],
    couplerSize: [],
    couplerType: [],
    couplerLockType: [],
    hitchReceiverSize: [],
  });
  const [winchAndWrinchAccessories, setWinchAndWrinchAccessories] = useState({
    winchType: [],
    winchCapacity: [],
    winchBrakeType: [],
    winchCableType: [],
  });

  const [lightingAndElectrical, setLightingAndElectrical] = useState({
    lightType: [],
    electricalConnectorType: [],
    electricalWiringType: [],
    batteryType: [],
    batteryChargerType: [],
  });

  const [acessories, setAcessories] = useState({
    spareTyreSize: [],
    jackType: [],
    jackWheelType: [],
    jackCapacity: [],
    jackLiftHeight: [],
  });

  const [loadingAndTransportFeatures, setLoadingAndTransportFeatures] =
    useState({
      loadingSystem: [],
      bunkHeightAdjustment: [],
    });

  const [securityFeatures, setSecurityFeatures] = useState({
    lockType: [],
    gpsTrackingDevice: [],
  });

  const [
    environmentalAndCorrosionResistance,
    setEnvironmentalAndCorrosionResistance,
  ] = useState({
    corrosionProtection: [],
  });
  const [performanceAndHandling, setPerformanceAndHandling] = useState({
    turningRadius: [],
  });
  const [tongue, setTongue] = useState({
    tongueJackWheelSize: [],
    tongueJackType: [],
    tongueWeight: [],
  });

  const filters = {
    identification,
    basics,
    constructionMaterials,
    maintenanceFeatures,
    userFeatures,
    specialFeatures,
    additionalAccessories,
    customizationOptions,
    axlesAndSuspension,
    tyresAndWheels,
    brakes,
    winchAndWrinchAccessories,
    lightingAndElectrical,
    acessories,
    loadingAndTransportFeatures,
    securityFeatures,
    environmentalAndCorrosionResistance,
    performanceAndHandling,
    tongue,
  };

  const setStateFunctions = {
    identification: setIdentification,
    basics: setBasics,
    constructionMaterials: setConstructionMaterials,
    maintenanceFeatures: setMaintenanceFeatures,
    userFeatures: setUserFeatures,
    specialFeatures: setSpecialFeatures,
    additionalAccessories: setAdditionalAccessories,
    customizationOptions: setCustomizationOptions,
    axlesAndSuspension: setAxlesAndSuspension,
    tyresAndWheels: setTyresAndWheels,
    brakes: setBrakes,
    winchAndWrinchAccessories: setWinchAndWrinchAccessories,
    lightingAndElectrical: setLightingAndElectrical,
    acessories: setAcessories,
    loadingAndTransportFeatures: setLoadingAndTransportFeatures,
    securityFeatures: setSecurityFeatures,
    environmentalAndCorrosionResistance: setEnvironmentalAndCorrosionResistance,
    performanceAndHandling: setPerformanceAndHandling,
    tongue: setTongue,
  };

  const handleRadioChange = (key2, value) => {
    setSelectedRadios((prev) => ({ ...prev, [key2]: value }));
  };

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

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const URL = apiUrl + "/search_trailer/";

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
      const response = await fetch(`${apiUrl + "/search_berth/"}trailers`, {
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

  useEffect(() => {
    setLoading(true);
    let currInfo = {
      selectedOptions: allSelectedOptions,
      page: page,
    };
    const fetchTrailerData = async () => {
      try {
        const response = await fetch(`${URL}trailersData`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(currInfo),
        });
        const data = await response.json();
        setTrailers(data?.res[0]);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
        console.log("done");
      }
    };

    fetchTrailerData();
  }, [allSelectedOptions, page, URL]);

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
            <h4
              className="py-3"
              // style={{ borderBottom: "2px solid #f5f5f5", width: "80%" }}
            >
              Search For Trailer
            </h4>
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
                                radioOptions={varToScreen[key2]?.radioOptions}
                                setToValue={setToValue}
                                selectedRadio={
                                  selectedRadios[key2] ||
                                  varToScreen[key2]?.radioOptions[0]?.value
                                }
                                onRadioChange={(value) =>
                                  handleRadioChange(key2, value)
                                }
                                isOpen={!!openStates[key2]}
                                toggleAccordion={() => toggleAccordion(key2)}
                              />
                            )}
                          </Form.Group>
                        </Col>
                      </Row>
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
                  fontSize: "28.8px",
                  fontWeight: "200",
                  padding: "20px",
                }}
              >
                Trailers For Sale
              </h1>
            </Col>
          </Row>
          {loading ? (
            // <p>Loading...</p>
            <Loader />
          ) : (
            <Row>
              {trailers.length === 0 ? (
                <Col md={12}>
                  <p>No Results Found</p>
                </Col>
              ) : (
                trailers.map((trailer) => {
                  return (
                    <Col key={uuidv4()} md={4}>
                      {/* <h1>{trailer}</h1> */}
                      <TrailerCard {...trailer} />
                    </Col>
                  );
                })
              )}
            </Row>
          )}
          {/* {!loading ? <Pagination totalPages={pagination.totalPages} /> : <></>} */}

          <Row style={{ marginBottom: "20px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                width: "100%",
                marginTop: "20px",
              }}
            >
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
              >
                Previous
              </button>
              {/* Page {page} of {pagination.totalPages} */}
              <span>Page {page + 1}</span>
              {/* <button
                key={page}
                className="active"
                // onClick={() => updatePage(page)}
              >
                {page}
              </button> */}
              <button
                onClick={() => handlePageChange(page + 1)}
                // disabled={page === pagination.totalPages}
              >
                Next
              </button>
            </div>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}



const Trailers = ({ type }) => {
  return (
    <main
      style={{
        minHeight: `100vh`,
        overflow: "hidden",
      }}
    >
      {type === "search" ? <TrailersSearch /> : <TrailersAdvert />}
    </main>
  );
};

Trailers.propTypes = {
  type: PropTypes.string.isRequired,
};

export default Trailers;
