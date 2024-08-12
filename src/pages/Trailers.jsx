import { useState } from "react";
import { Button, Card, Container } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import SelectComponent from "../components/SelectComponent";
import InputComponent from "../components/InputComponent";
import CheckComponent from "../components/CheckComponent";
import "./trailers.css";

const Trailers = () => {
  const [form, setForm] = useState({
    MarisailID: "",
    Make: "",
    Model: "",
    Year: "",
    Type: "",
    GVWR: "",
    LoadCapacity: "",
    Length: "",
    Width: "",
    FrameMaterial: "",
    FrameCoating: "",
    FrameCrossmemberType: "",
    FrameWeldType: "",
    MaximumAngleofApproach: "",
    FloorMaterial: "",
    SidesMaterial: "",
    RoofMaterial: "",
    GreasePoints: "",
    BearingType: "",
    MaintenanceSchedule: "",
    Storage: "",
    TieDownPoints: "",
    ToolBox: "",
    BumperType: "",
    TotalHeight: "",
    AxleHeightFromGound: "",
    HydraulicTilt: "",
    ExtendableTongue: "",
    AdjustableDeckHeight: "",
    DetachableSidePanels: "",
    RampType: "",
    WinchPost: "",
    SplashGuards: "",
    Fenders: "",
    SideRails: "",
    Color: "",
    Decals: "",
    StorageBox: "",
    LightingPackage: "",
    SuspensionUpgrade: "",
    AxleType: "",
    AxleCapacity: "",
    AxleSealType: "",
    AxleHubSize: "",
    AxlePosition: "",
    DropAxleOption: "",
    SuspensionType: "",
    SuspensionCapacity: "",
    SuspensionAdjustment: "",
    TyreSize: "",
    TyreLoadRange: "",
    TyreType: "",
    WheelType: "",
    WheelBoltPattern: "",
    HubLubricationSystem: "",
    BrakeType: "",
    BrakeActuator: "",
    BrakeLineMaterial: "",
    BrakeDrumDiameter: "",
    BrakeFluidType: "",
    Brakes: "",
    CouplerSize: "",
    CouplerType: "",
    CouplerLockType: "",
    HitchClass: "",
    HitchReceiverSize: "",
    SafetyChains: "",
    BreakawaySystem: "",
    WinchType: "",
    WinchCapacity: "",
    WinchRopeLength: "",
    WinchDrumMaterial: "",
    WinchGearRatio: "",
    WinchRemoteControl: "",
    WinchBrakeType: "",
    WinchCableType: "",
    WinchStrapLength: "",
    WinchHandleLength: "",
    WinchMounting: "",
    Lighting: "",
    LightMountingPosition: "",
    LightType: "",
    ElectricalConnectorType: "",
    ElectricalWiringType: "",
    BatteryType: "",
    BatteryChargerType: "",
    SpareTyreCarrier: "",
    SpareTyreSize: "",
    SpareTyreMountingLocation: "",
    JackType: "",
    JackWheelType: "",
    JackCapacity: "",
    JackLiftHeight: "",
    LoadingSystem: "",
    Bunks: "",
    BunkMaterial: "",
    BunkWidth: "",
    BunkHeightAdjustment: "",
    BunkMountingBracketMaterial: "",
    Rollers: "",
    RollerMaterial: "",
    RollerAxleDiameter: "",
    WheelLocks: "",
    LockType: "",
    AlarmSystem: "",
    GPSTrackingDevice: "",
    CorrosionProtection: "",
    RustInhibitors: "",
    MaximumSpeedRating: "",
    TurningRadius: "",
    TongueMaterial: "",
    TongueShape: "",
    TongueJackWheelSize: "",
    TongueJackType: "",
    TongueWeight: "",
    TongueWeightRatio: "",
    OwnerManual: "",
    Warranty: "",
    DOTCompliance: "",
    NATMCertification: "",
    EUTypeApproval: "",
    ADRCompliance: "",
  });
  const [openKey, setOpenKey] = useState(null);

  return (
    <>
      <Container className="mb-5">
        <Row>
          <Col md={6} className="mt-4">
            <h6 style={{ marginLeft: 20 }}>Identification</h6>
            <Col md={12}>
              <Form>
                <Col xs={3} md={12} className="mb-2 myAcc">
                  <SelectComponent
                    label="MarisailID"
                    value={form.MarisailID}
                    setValue={(val) => setForm({ ...form, MarisailID: val })}
                    header="Identification"
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    value={form.Make}
                    setValue={(val) => setForm({ ...form, Make: val })}
                    label="Make"
                    header="Identification"
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.Model}
                    setValue={(val) => setForm({ ...form, Model: val })}
                    label="Model"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.Year}
                    setValue={(val) => setForm({ ...form, Year: val })}
                    label="Year"
                  />
                </Col>
              </Form>
            </Col>
          </Col>
          <Col md={6} className="mt-4">
            <h6 style={{ marginLeft: 20 }}>General</h6>
            <Col md={12}>
              <Form>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.Type}
                    setValue={(val) => setForm({ ...form, Type: val })}
                    label="Type"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.GVWR}
                    setValue={(val) => setForm({ ...form, GVWR: val })}
                    label="GVWR"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.LoadCapacity}
                    setValue={(val) => setForm({ ...form, LoadCapacity: val })}
                    label="LoadCapacity"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.Length}
                    setValue={(val) => setForm({ ...form, Length: val })}
                    label="Length"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.Width}
                    setValue={(val) => setForm({ ...form, Width: val })}
                    label="Width"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <InputComponent
                    label="Total Height"
                    value={form.TotalHeight}
                    setValue={(e) =>
                      setForm({ ...form, TotalHeight: e.target.value })
                    }
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <InputComponent
                    label="Axle Height From Gound"
                    value={form.AxleHeightFromGound}
                    setValue={(e) =>
                      setForm({ ...form, AxleHeightFromGound: e.target.value })
                    }
                  />
                </Col>
              </Form>
            </Col>
          </Col>
          <Col md={6} className="mt-4">
            <h6 style={{ marginLeft: 20 }}>Construction Materials</h6>
            <Col md={12}>
              <Form>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.FrameMaterial}
                    setValue={(val) => setForm({ ...form, FrameMaterial: val })}
                    label="FrameMaterial"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.FrameCoating}
                    setValue={(val) => setForm({ ...form, FrameCoating: val })}
                    label="FrameCoating"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.FrameCrossmemberType}
                    setValue={(val) =>
                      setForm({ ...form, FrameCrossmemberType: val })
                    }
                    label="FrameCrossmemberType"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.FrameWeldType}
                    setValue={(val) => setForm({ ...form, FrameWeldType: val })}
                    label="FrameWeldType"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.MaximumAngleofApproach}
                    setValue={(val) =>
                      setForm({
                        ...form,
                        MaximumAngleofApproach: val,
                      })
                    }
                    label="MaximumAngleofApproach"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.FloorMaterial}
                    setValue={(val) => setForm({ ...form, FloorMaterial: val })}
                    label="FloorMaterial"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.SidesMaterial}
                    setValue={(val) => setForm({ ...form, SidesMaterial: val })}
                    label="SidesMaterial"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.RoofMaterial}
                    setValue={(val) => setForm({ ...form, RoofMaterial: val })}
                    label="RoofMaterial"
                  />
                </Col>
              </Form>
            </Col>
          </Col>
          <Col md={6} className="mt-4">
            <h6 style={{ marginLeft: 20 }}>Maintenance Features</h6>
            <Col md={12}>
              <Form>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.GreasePoints}
                    setValue={(val) => setForm({ ...form, GreasePoints: val })}
                    label="GreasePoints"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.BearingType}
                    setValue={(val) => setForm({ ...form, BearingType: val })}
                    label="BearingType"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.MaintenanceSchedule}
                    setValue={(val) =>
                      setForm({ ...form, MaintenanceSchedule: val })
                    }
                    label="MaintenanceSchedule"
                  />
                </Col>
              </Form>
            </Col>
          </Col>
          <Col md={6} className="mt-4">
            <h6 style={{ marginLeft: 20 }}>User Features</h6>
            <Col md={12}>
              <Form>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.Storage}
                    setValue={(val) => setForm({ ...form, Storage: val })}
                    label="Storage"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.TieDownPoints}
                    setValue={(val) => setForm({ ...form, TieDownPoints: val })}
                    label="TieDownPoints"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.ToolBox}
                    setValue={(val) => setForm({ ...form, ToolBox: val })}
                    label="ToolBox"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.BumperType}
                    setValue={(val) => setForm({ ...form, BumperType: val })}
                    label="BumperType"
                  />
                </Col>
              </Form>
            </Col>
          </Col>
          <Col md={6} className="mt-4">
            <h6 style={{ marginLeft: 20 }}>Special Features</h6>
            <Col md={12}>
              <Form>
                <Col xs={3} md={12} className="mb-2">
                  <CheckComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    label="Hydraulic Tilt"
                    setValue={(val) => setForm({ ...form, HydraulicTilt: val })}
                    name="Hydraulic Tilt"
                    id="HydraulicTilt"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <CheckComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    label="Extendable Tongue"
                    setValue={(val) =>
                      setForm({ ...form, ExtendableTongue: val })
                    }
                    name="Extendable Tongue"
                    id="ExtendableTongue"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <CheckComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    label="Adjustable Deck Height"
                    setValue={(val) =>
                      setForm({ ...form, AdjustableDeckHeight: val })
                    }
                    name="Adjustable Deck Height"
                    id="AdjustableDeckHeight"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <CheckComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    label="Adjustable Deck Height"
                    setValue={(val) =>
                      setForm({ ...form, DetachableSidePanels: val })
                    }
                    name="Adjustable Deck Height"
                    id="AdjustableDeckHeight"
                  />
                </Col>
              </Form>
            </Col>
          </Col>
          <Col md={6} className="mt-4">
            <h6 style={{ marginLeft: 20 }}>Additional Accessories</h6>
            <Col md={12}>
              <Form>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.RampType}
                    setValue={(val) => setForm({ ...form, RampType: val })}
                    label="RampType"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.WinchPost}
                    setValue={(val) => setForm({ ...form, WinchPost: val })}
                    label="WinchPost"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <CheckComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    label="Splash Guards"
                    setValue={(val) => setForm({ ...form, SplashGuards: val })}
                    name="Splash Guards"
                    id="SplashGuards"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.Fenders}
                    setValue={(val) => setForm({ ...form, Fenders: val })}
                    label="Fenders"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <CheckComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    label="Side Rails"
                    setValue={(val) => setForm({ ...form, SideRails: val })}
                    name="Side Rails"
                    id="SideRails"
                  />
                </Col>
              </Form>
            </Col>
          </Col>
          <Col md={6} className="mt-4">
            <h6 style={{ marginLeft: 20 }}>Customization Options</h6>
            <Col md={12}>
              <Form>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.Color}
                    setValue={(val) => setForm({ ...form, Color: val })}
                    label="Color"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.Decals}
                    setValue={(val) => setForm({ ...form, Decals: val })}
                    label="Decals"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.StorageBox}
                    setValue={(val) => setForm({ ...form, StorageBox: val })}
                    label="StorageBox"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.LightingPackage}
                    setValue={(val) =>
                      setForm({ ...form, LightingPackage: val })
                    }
                    label="LightingPackage"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.SuspensionUpgrade}
                    setValue={(val) =>
                      setForm({ ...form, SuspensionUpgrade: val })
                    }
                    label="SuspensionUpgrade"
                  />
                </Col>
              </Form>
            </Col>
          </Col>
          <Col md={6} className="mt-4">
            <h6 style={{ marginLeft: 20 }}>Axles & Suspension</h6>
            <Col md={12}>
              <Form>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.AxleType}
                    setValue={(val) => setForm({ ...form, AxleType: val })}
                    label="AxleType"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.AxleCapacity}
                    setValue={(val) => setForm({ ...form, AxleCapacity: val })}
                    label="AxleCapacity"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.AxleSealType}
                    setValue={(val) => setForm({ ...form, AxleSealType: val })}
                    label="AxleSealType"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.AxleHubSize}
                    setValue={(val) => setForm({ ...form, AxleHubSize: val })}
                    label="AxleHubSize"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.AxlePosition}
                    setValue={(val) => setForm({ ...form, AxlePosition: val })}
                    label="AxlePosition"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <CheckComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    label="Drop Axle Option"
                    setValue={(val) =>
                      setForm({ ...form, DropAxleOption: val })
                    }
                    name="Drop Axle Option"
                    id="DropAxleOption"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.SuspensionType}
                    setValue={(val) =>
                      setForm({ ...form, SuspensionType: val })
                    }
                    label="SuspensionType"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.SuspensionCapacity}
                    setValue={(val) =>
                      setForm({ ...form, SuspensionCapacity: val })
                    }
                    label="SuspensionCapacity"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.SuspensionAdjustment}
                    setValue={(val) =>
                      setForm({ ...form, SuspensionAdjustment: val })
                    }
                    label="SuspensionAdjustment"
                  />
                </Col>
              </Form>
            </Col>
          </Col>
          <Col md={6} className="mt-4">
            <h6 style={{ marginLeft: 20 }}>Tyres & Wheels</h6>
            <Col md={12}>
              <Form>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.TyreSize}
                    setValue={(val) => setForm({ ...form, TyreSize: val })}
                    label="TyreSize"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.TyreLoadRange}
                    setValue={(val) => setForm({ ...form, TyreLoadRange: val })}
                    label="TyreLoadRange"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.TyreType}
                    setValue={(val) => setForm({ ...form, TyreType: val })}
                    label="TyreType"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.WheelType}
                    setValue={(val) => setForm({ ...form, WheelType: val })}
                    label="WheelType"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.WheelBoltPattern}
                    setValue={(val) =>
                      setForm({ ...form, WheelBoltPattern: val })
                    }
                    label="WheelBoltPattern"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.HubLubricationSystem}
                    setValue={(val) =>
                      setForm({ ...form, HubLubricationSystem: val })
                    }
                    label="HubLubricationSystem"
                  />
                </Col>
              </Form>
            </Col>
          </Col>
          <Col md={6} className="mt-4">
            <h6 style={{ marginLeft: 20 }}>Brakes & Safety</h6>
            <Col md={12}>
              <Form>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.BrakeType}
                    setValue={(val) => setForm({ ...form, BrakeType: val })}
                    label="BrakeType"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.BrakeActuator}
                    setValue={(val) => setForm({ ...form, BrakeActuator: val })}
                    label="BrakeActuator"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.BrakeLineMaterial}
                    setValue={(val) =>
                      setForm({ ...form, BrakeLineMaterial: val })
                    }
                    label="BrakeLineMaterial"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.BrakeDrumDiameter}
                    setValue={(val) =>
                      setForm({ ...form, BrakeDrumDiameter: val })
                    }
                    label="BrakeDrumDiameter"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.BrakeFluidType}
                    setValue={(val) =>
                      setForm({ ...form, BrakeFluidType: val })
                    }
                    label="BrakeFluidType"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <CheckComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    label="Drop Axle Option"
                    setValue={(val) => setForm({ ...form, Brakes: val })}
                    name="Brakes"
                    id="Brakes"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.CouplerSize}
                    setValue={(val) => setForm({ ...form, CouplerSize: val })}
                    label="CouplerSize"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.CouplerType}
                    setValue={(val) => setForm({ ...form, CouplerType: val })}
                    label="CouplerType"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.CouplerLockType}
                    setValue={(val) =>
                      setForm({ ...form, CouplerLockType: val })
                    }
                    label="CouplerLockType"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.HitchClass}
                    setValue={(val) => setForm({ ...form, HitchClass: val })}
                    label="HitchClass"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.HitchReceiverSize}
                    setValue={(val) =>
                      setForm({ ...form, HitchReceiverSize: val })
                    }
                    label="HitchReceiverSize"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.SafetyChains}
                    setValue={(val) => setForm({ ...form, SafetyChains: val })}
                    label="SafetyChains"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <CheckComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    label="Breakaway System"
                    setValue={(val) =>
                      setForm({ ...form, BreakawaySystem: val })
                    }
                    name="Breakaway System"
                    id="BreakawaySystem"
                  />
                </Col>
              </Form>
            </Col>
          </Col>
          <Col md={6} className="mt-4">
            <h6 style={{ marginLeft: 20 }}>Winch & Winch Accessories</h6>
            <Col md={12}>
              <Form>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.WinchType}
                    setValue={(val) => setForm({ ...form, WinchType: val })}
                    label="WinchType"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.WinchCapacity}
                    setValue={(val) => setForm({ ...form, WinchCapacity: val })}
                    label="WinchCapacity"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.WinchRopeLength}
                    setValue={(val) =>
                      setForm({ ...form, WinchRopeLength: val })
                    }
                    label="WinchRopeLength"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.WinchDrumMaterial}
                    setValue={(val) =>
                      setForm({ ...form, WinchDrumMaterial: val })
                    }
                    label="WinchDrumMaterial"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.WinchGearRatio}
                    setValue={(val) =>
                      setForm({ ...form, WinchGearRatio: val })
                    }
                    label="WinchGearRatio"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.WinchRemoteControl}
                    setValue={(val) =>
                      setForm({ ...form, WinchRemoteControl: val })
                    }
                    label="WinchRemoteControl"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.WinchBrakeType}
                    setValue={(val) =>
                      setForm({ ...form, WinchBrakeType: val })
                    }
                    label="WinchBrakeType"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.WinchCableType}
                    setValue={(val) =>
                      setForm({ ...form, WinchCableType: val })
                    }
                    label="WinchCableType"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.WinchStrapLength}
                    setValue={(val) =>
                      setForm({ ...form, WinchStrapLength: val })
                    }
                    label="WinchStrapLength"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.WinchHandleLength}
                    setValue={(val) =>
                      setForm({ ...form, WinchHandleLength: val })
                    }
                    label="WinchHandleLength"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.WinchMounting}
                    setValue={(val) => setForm({ ...form, WinchMounting: val })}
                    label="WinchMounting"
                  />
                </Col>
              </Form>
            </Col>
          </Col>
          <Col md={6} className="mt-4">
            <h6 style={{ marginLeft: 20 }}>Lighting & Electrical</h6>
            <Col md={12}>
              <Form>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.Lighting}
                    setValue={(val) => setForm({ ...form, Lighting: val })}
                    label="Lighting"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.LightMountingPosition}
                    setValue={(val) =>
                      setForm({ ...form, LightMountingPosition: val })
                    }
                    label="LightMountingPosition"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.LightType}
                    setValue={(val) => setForm({ ...form, LightType: val })}
                    label="LightType"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.ElectricalConnectorType}
                    setValue={(val) =>
                      setForm({ ...form, ElectricalConnectorType: val })
                    }
                    label="ElectricalConnectorType"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.ElectricalWiringType}
                    setValue={(val) =>
                      setForm({ ...form, ElectricalWiringType: val })
                    }
                    label="ElectricalWiringType"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.BatteryType}
                    setValue={(val) => setForm({ ...form, BatteryType: val })}
                    label="BatteryType"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.BatteryChargerType}
                    setValue={(val) =>
                      setForm({ ...form, BatteryChargerType: val })
                    }
                    label="BatteryChargerType"
                  />
                </Col>
              </Form>
            </Col>
          </Col>
          <Col md={6} className="mt-4">
            <h6 style={{ marginLeft: 20 }}>Accessories</h6>
            <Col md={12}>
              <Form>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.SpareTyreCarrier}
                    setValue={(val) =>
                      setForm({ ...form, SpareTyreCarrier: val })
                    }
                    label="SpareTyreCarrier"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.SpareTyreSize}
                    setValue={(val) => setForm({ ...form, SpareTyreSize: val })}
                    label="SpareTyreSize"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.SpareTyreMountingLocation}
                    setValue={(val) =>
                      setForm({ ...form, SpareTyreMountingLocation: val })
                    }
                    label="SpareTyreMountingLocation"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.JackType}
                    setValue={(val) => setForm({ ...form, JackType: val })}
                    label="JackType"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.JackWheelType}
                    setValue={(val) => setForm({ ...form, JackWheelType: val })}
                    label="JackWheelType"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.JackCapacity}
                    setValue={(val) => setForm({ ...form, JackCapacity: val })}
                    label="JackCapacity"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.JackLiftHeight}
                    setValue={(val) =>
                      setForm({ ...form, JackLiftHeight: val })
                    }
                    label="JackLiftHeight"
                  />
                </Col>
              </Form>
            </Col>
          </Col>
          <Col md={6} className="mt-4">
            <h6 style={{ marginLeft: 20 }}>Loading & Transport Features</h6>
            <Col md={12}>
              <Form>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.LoadingSystem}
                    setValue={(val) => setForm({ ...form, LoadingSystem: val })}
                    label="LoadingSystem"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.Bunks}
                    setValue={(val) => setForm({ ...form, Bunks: val })}
                    label="Bunks"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.BunkMaterial}
                    setValue={(val) => setForm({ ...form, BunkMaterial: val })}
                    label="BunkMaterial"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.BunkWidth}
                    setValue={(val) => setForm({ ...form, BunkWidth: val })}
                    label="BunkWidth"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.BunkHeightAdjustment}
                    setValue={(val) =>
                      setForm({ ...form, BunkHeightAdjustment: val })
                    }
                    label="BunkHeightAdjustment"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.BunkMountingBracketMaterial}
                    setValue={(val) =>
                      setForm({ ...form, BunkMountingBracketMaterial: val })
                    }
                    label="BunkMountingBracketMaterial"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.Rollers}
                    setValue={(val) => setForm({ ...form, Rollers: val })}
                    label="Rollers"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.RollerMaterial}
                    setValue={(val) =>
                      setForm({ ...form, RollerMaterial: val })
                    }
                    label="RollerMaterial"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.RollerAxleDiameter}
                    setValue={(val) =>
                      setForm({ ...form, RollerAxleDiameter: val })
                    }
                    label="RollerAxleDiameter"
                  />
                </Col>
              </Form>
            </Col>
          </Col>
          <Col md={6} className="mt-4">
            <h6 style={{ marginLeft: 20 }}>Security Features</h6>
            <Col md={12}>
              <Form>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.WheelLocks}
                    setValue={(val) => setForm({ ...form, WheelLocks: val })}
                    label="WheelLocks"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.LockType}
                    setValue={(val) => setForm({ ...form, LockType: val })}
                    label="LockType"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.AlarmSystem}
                    setValue={(val) => setForm({ ...form, AlarmSystem: val })}
                    label="AlarmSystem"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.GPSTrackingDevice}
                    setValue={(val) =>
                      setForm({ ...form, GPSTrackingDevice: val })
                    }
                    label="GPSTrackingDevice"
                  />
                </Col>
              </Form>
            </Col>
          </Col>
          <Col md={6} className="mt-4">
            <h6 style={{ marginLeft: 20 }}>
              Environmental & Corrosion Resistance
            </h6>
            <Col md={12}>
              <Form>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.CorrosionProtection}
                    setValue={(val) =>
                      setForm({ ...form, CorrosionProtection: val })
                    }
                    label="CorrosionProtection"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.RustInhibitors}
                    setValue={(val) =>
                      setForm({ ...form, RustInhibitors: val })
                    }
                    label="RustInhibitors"
                  />
                </Col>
              </Form>
            </Col>
          </Col>
          <Col md={6} className="mt-4">
            <h6 style={{ marginLeft: 20 }}>Performance & Handling</h6>
            <Col md={12}>
              <Form>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.MaximumSpeedRating}
                    setValue={(val) =>
                      setForm({ ...form, MaximumSpeedRating: val })
                    }
                    label="MaximumSpeedRating"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.TurningRadius}
                    setValue={(val) => setForm({ ...form, TurningRadius: val })}
                    label="TurningRadius"
                  />
                </Col>
              </Form>
            </Col>
          </Col>
          <Col md={6} className="mt-4">
            <h6 style={{ marginLeft: 20 }}>Tongue</h6>
            <Col md={12}>
              <Form>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.TongueMaterial}
                    setValue={(val) =>
                      setForm({ ...form, TongueMaterial: val })
                    }
                    label="TongueMaterial"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.TongueShape}
                    setValue={(val) => setForm({ ...form, TongueShape: val })}
                    label="TongueShape"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.TongueJackWheelSize}
                    setValue={(val) =>
                      setForm({ ...form, TongueJackWheelSize: val })
                    }
                    label="TongueJackWheelSize"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.TongueJackType}
                    setValue={(val) =>
                      setForm({ ...form, TongueJackType: val })
                    }
                    label="TongueJackType"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.TongueWeight}
                    setValue={(val) => setForm({ ...form, TongueWeight: val })}
                    label="TongueWeight"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.TongueWeightRatio}
                    setValue={(val) =>
                      setForm({ ...form, TongueWeightRatio: val })
                    }
                    label="TongueWeightRatio"
                  />
                </Col>
              </Form>
            </Col>
          </Col>
          <Col md={6} className="mt-4">
            <h6 style={{ marginLeft: 20 }}>Documentation</h6>
            <Col md={12}>
              <Form>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.OwnerManual}
                    setValue={(val) => setForm({ ...form, OwnerManual: val })}
                    label="OwnerManual"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.Warranty}
                    setValue={(val) => setForm({ ...form, Warranty: val })}
                    label="Warranty"
                  />
                </Col>
              </Form>
            </Col>
          </Col>
          <Col md={6} className="mt-4">
            <h6 style={{ marginLeft: 20 }}>Regulatory Compliance</h6>
            <Col md={12}>
              <Form>
                <Col xs={3} md={12} className="mb-2">
                  <CheckComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    label="DOT Compliance"
                    setValue={(val) => setForm({ ...form, DOTCompliance: val })}
                    name="DOT Compliance"
                    id="DOTCompliance"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <CheckComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    label="NATM Certification"
                    setValue={(val) =>
                      setForm({ ...form, NATMCertification: val })
                    }
                    name="NATM Certification"
                    id="NATMCertification"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <CheckComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    label="EU Type Approval"
                    setValue={(val) =>
                      setForm({ ...form, EUTypeApproval: val })
                    }
                    name="EU Type Approval"
                    id="EUTypeApproval"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <CheckComponent
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    label="ADR Compliance"
                    setValue={(val) => setForm({ ...form, ADRCompliance: val })}
                    name="ADR Compliance"
                    id="ADRCompliance"
                  />
                </Col>
              </Form>
            </Col>
          </Col>
        </Row>
      </Container>
      ;
    </>
  );
};

export default Trailers;
