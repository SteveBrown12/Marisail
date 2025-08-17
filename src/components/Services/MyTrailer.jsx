import { Form, Container, Row, Col } from "react-bootstrap";
import { useEffect, useState, useRef } from "react";
import DropdownWithRadio from "../DropdownWithRadio";
import Loader from "../Loader";
import InputComponentDynamic from "../InputComponentDynamic";
import SubmitButton from "../SubmitButton";
import { keyToExpectedValueMap, typeDef } from "../Trailers/Trailer_Advert_Info";
import { makeString } from "../../services/common_functions";
const apiUrl = import.meta.env.VITE_BACKEND_URL;

export default function MyTrailer() {
  const storedUser = localStorage.getItem("user");
  const formData = localStorage.getItem("TrailerData");
  let trailerData;
  if (storedUser && formData) {
    trailerData = JSON.parse(formData);
  }
  
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
  });
  const [basics, setBasics] = useState({
    type: "",
    grossVehicleWeightRating: "",
    loadCapacity: "",
    length: "",
    width: "",
    totalHeight: "",
    axleHeightFromGround: "",
  });
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
    greasePoints: "", //
    bearingType: "",
    maintenanceSchedule: "", //
  });
  const [userFeatures, setUserFeatures] = useState({
    storage: "",
    tieDownPoints: "",
    toolBox: "",
    bumperType: "",
    userFeatures: "",
  });
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
  const [securityFeatures, setSecurityFeatures] = useState({
    wheelLocks: "",
    lockType: "",
    alarmSystem: "",
    gps_TrackingDevice: "",
  });
  const [
    environmentalAndCorrosionResistance,
    setEnvironmentalAndCorrosionResistance,
  ] = useState({
    corrosionProtection: "",
    rustInhibitors: "",
  });
  const [performanceAndHandling, setPerformanceAndHandling] = useState({
    maximumSpeedRating: "",
    turningRadius: "",
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
            // if(field.value){
            //   console.log("001 field value--",field);
            // }
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
    identification,
    specialFeatures,
    constructionMaterials,
    basics,
    userFeatures,
    securityFeatures,
    additionalAccessories,
    customizationOptions,
    axlesAndSuspension,
    loadingAndTransportFeatures,
    brakes,
    winchAndWrinchAccessories,
    lightingAndElectrical,
    acessories,
    performanceAndHandling,
    documentation,
    tyresAndWheels,
    tongue,
    regulatoryCompliance,
    maintenanceFeatures,
    paymentTerms,
    environmentalAndCorrosionResistance,
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
      if (checkRequired()) {
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

  const cacheKey = "trailersFilterData";
  const URL = apiUrl +"/trailers/";

  const fetchDistinctData = async () => {
    try {
      setLoading(true);
      const promises = Object.keys(sections).map(async (key) => {
        const response = await fetch(`${URL}trailers`, {
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
    }
  };
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
                              allSelectedOptions[title]?.[fieldKey] || trailerData[title]?.[fieldKey]  || ""
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
                  }
                  return null;
                })}
              </Col>
            ))}
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
