import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EngineDetailsPanel from "./Engine_Detail_Panel";
import Loader from "../Loader";
import { Col, Row } from "react-bootstrap";
const apiUrl = import.meta.env.VITE_BACKEND_URL;

const EngineDetail = () => {
  const { id } = useParams();
  const [engine, setEngine] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEngineDetails = async (id) => {
      try {
        const response = await fetch(
          apiUrl + `/search_engine/engine-detail/${id}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        console.log("data :>> ", data[0]);
        setEngine(data[0]);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    if (id) {
      fetchEngineDetails(id);
    } else {
      setLoading(false);
    }
  }, [id]);

  const mapEngineToPanelData = (engine) => {
    return [
      {
        title: "Engine Details",
        details: {
          "Marisail Vessel ID": engine.Marisail_Vessel_ID,
          "Engine Make": engine.Engine_Make,
          "Engine Model": engine.Engine_Model,
          "Engine Model Year": engine.Engine_Model_Year,
          "Engine Type": engine.Engine_Type,
          "Type Designation": engine.Type_Designation,
          "Asking Price": engine.Asking_Price,
        },
      },
      {
        title: "Condition",
        details: {
          Condition: engine.Condition_1,
          "Used Condition": engine.used_condition,
          Seller: engine.seller,
          "Offered By (Dealer)": engine.offered_by,
          "Last Survey Date": engine.lastsurvey_date,
          "Broker Valuation": engine.broker_valuation,
        },
      },
   
      {
        title: "Transmission",
        details: {
          "Transmission Type": engine.transmission_type,
          "Gear Shift": engine.gear_shift,
          "Gear Ratio": engine.gear_ratio,
          "Gear Shift Type": engine.gearshift_type,
          "Flywheel SAE": engine.flywheel_SAE,
          "Flywheel Housing": engine.flywheel_housing,
          Camshaft: engine.camshaft,
          "Crankshaft Alloy": engine.crankshaft_alloy,
          "Crankcase Design": engine.crankcase_design,
        },
      },
      {
        title: "Dimensions",
        details: {
          Displacement: engine.displacement,
          "Length (mm)": engine.length,
          "Width (mm)": engine.width,
          "Height (mm)": engine.height,
          "Length From Front End To Edge Of Flywheel Housing (mm)":
            engine.Engine_length,
          "Engine Weight": engine.engine_weight,
          "Dry Weight (Kg)": engine.dry_weight,
          "Weight (Excl Oil And Coolant)": engine.weight_excloil,
          "Weight With Heat Exchanger": engine.weight_heatexchanger,
          "Weight With Keel Cooling": engine.weight_keelcooling,
        },
      },
      {
        title: "Installation and Mounting",
        details: {
          "Engine Mounting Orientation": engine.enginemounting_orientation,
          "Engine Suspension": engine.engine_suspension,
          "Engine Mounting Type": engine.engine_mountingtype,
          "Mounting Bracket Material": engine.mountingbracket_material,
          "Alignment Requirements": engine.alignment_requirements,
          "Engine Block": engine.engine_block,
        },
      },
      {
        title: "Service & Maintenance",
        details: {
          "Scheduled Maintenance Plan": engine.scheduled_maintenanceplan,
          "Service Interval": engine.service_interval,
          "Maintenance Log Requirements": engine.maintenancelog_requirements,
          "Availability of Spare Parts": engine.availability_spareparts,
          "Operation Mode": engine.operation_mode,
          "Last Service Date": engine.last_servicedate,
        },
      },
  
      {
        title: "Torque",
        details: {
          "Maximum Torque (Nm)": engine.max_torque,
          "Maximum Torque At Speed (RPM)": engine.max_torquerpm,
          "Torque At Rated Speed (Nm)": engine.torque_ratedspeed,


          "Idle RPM": engine.idle_rpm,
          "Rated Speed (RPM)": engine.rated_speed,
          "RPM at Max Power": engine.rpm_maxpower,
        },
      },
      {
        title: "Cooling System",
        details: {
          Aftercooled: engine.after_cooled,
          "Cooling System": engine.cooling_system,
          "Closed Cooling System": engine.closed_coolingsystem,
          "Open Cooling System": engine.open_coolingsystem,
          Intercooled: engine.intercooled,
          "Recommended Coolant": engine.recommended_coolant,
          "Type Of Cooling": engine.cooling_type,
          "Heat Exchanger Material": engine.heat_exchangermaterial,
          "Heat Dissipation Rate": engine.heat_dissipationrate,
          "Engine Lubrication": engine.engine_lubrication,
          "Lubrication System": engine.lubrication_system,
          "Cooling Fluid Type": engine.cooling_fluidtype,
          "Cooling System Pressure": engine.cooling_systempressure,
          "Air Filter Type": engine.air_filtertype,
          "Circulation Pump Type": engine.circulation_pumptype,
          "Raw Water Pump Type": engine.rawwater_pumptype,
        },
      },

      {
        title: "Equipment",
        details: {
          "Engine Management System (EMS)": engine.EMS,
          "Engine Control System": engine.engine_controlsystem,
          "Unit Injectors": engine.unit_injectors,
          Turbocharger: engine.turbocharger,
          Turbocharging: engine.turbo_charging,
          "Starter Motor": engine.starter_motor,
          "Protection Covers": engine.protection_covers,
          "Closed Crankcase Ventilation": engine.crankcase_ventilation,
          "Heat Exchanger": engine.heat_exchanger,
          "Heat Exchanger With Expansion Tank": engine.heat_exchanger_WET,
          "Sea Water Pump": engine.sea_water_pump,
          "Sea Water-Cooled Charge Air Cooler": engine.charge_aircooler,
          "Working Principle": engine.working_principle,
          "Compression Ratio": engine.compression_ratio,
          "Piston Speed At 1500 RPM": engine.pistonspeed_1500,
          "Piston Speed At 1800 RPM": engine.pistonspeed_1800,
          "Firing Order": engine.firing_order,
          Pistons: engine.pistons,
          "Connection Rods": engine.connection_rods,
          "Auxiliary Power Take-Off (PTO)": engine.auxiliarypower_takeoff,
          "Remote Control Systems": engine.remote_controlsystems,
        },
      },

      {
        title: "Performance",
        details: {
          "Nominal Rating (Kw) (HP)": engine.nominal_rating,
          "Engine Performance": engine.engine_performance,
          "Max Power Output": engine.max_poweroutput,
          "Max. Power (BHP)": engine.max_power,
          "Max. Speed (Knots)": engine.max_speed,
          Supercharged: engine.supercharged,
          "Valve Train": engine.valve_train,
          "Gross Power, Full Load (Kw)": engine.GP_fullloadKW,
          "Gross Power, Full Load (Hp, Metric)": engine.GP_fullloadmetric,
          "Gross Power, Propeller Curve (Kw)": engine.GP_propellercurveKW,
          "Gross Power, Propeller Curve (Hp, Metric)":
            engine.GP_propellercurvemetric,
          "Gross Torque (Nm)": engine.gross_torque,
          "Continuous Power (kW/HP)": engine.continuouspower_KWHP,
          "Maximum Continuous Rating (MCR)": engine.Max_Continuousrating,
          "Engine Speed Range (RPM)": engine.Engine_speedrange,
          "Engine Efficiency": engine.engine_efficiency,
          "Power-to-Weight Ratio": engine.powertoweight_ratio,
          "Engine Classification": engine.engine_classifiable,
          "Certification": engine.engine_certification,
          "Manufacturer Warranty": engine.manufacture_warranty,
          "Engine Serial Number": engine.engine_serial,
          "CE Design Category": engine.ce_category,
          "Number Drives": engine.number_drives,
          "Number Engines": engine.number_engines,
          "Range (Miles)": engine.engine_range,
          "Cruising Speed (Knots)": engine.cruise_speed,
          "Drive Type": engine.drive_type,
          "Ignition System (Starting)": engine.ignition_system,
          "Noise Level (dB)": engine.noiselevel_db,
          "Engine Soundproofing Kits": engine.enginesound_proofingkits,
        },
      },
      {
        title: "Fuel System",
        details: {
          "Electronic Fuel Injection (EFI)": engine.electronic_fuel_injection,
          "Fuel Pre-Filter": engine.fuel_pre_filter,
          "Fuel Filter": engine.fuel_filter,
          "Fuel Filter Type": engine.fuel_filter_type,
          "Fuel Reserve (Holding Tank) (Litres)":
            engine.fuel_reserve_holding_tank,
          "Fuel System": engine.fuel_system,
          "Fuel Tank Capacity (Litres)": engine.fuel_tank_capacity,
          "Fuel Type": engine.fuel_type,
         
          "Recommended Fuel": engine.recommended_fuel,
         
          "Fuel Injection System Type": engine.fuel_injection_system_type,
          "Fuel Delivery Pressure": engine.fuel_delivery_pressure,
          "Fuel Tank Material": engine.fuel_tank_material,
          "Fuel Line Diameter": engine.fuel_line_diameter,
        },
      },

      {
        title: "Propulsion System",
        details: {
          Propulsion: engine.propulsion,
          Bowthruster: engine.bowthruster,
          "Propulsion System": engine.propulsion_system,
          "Propulsion System Type": engine.propulsion_systemtype,
          "Propeller Diameter": engine.propeller_diameter,
          "Propeller Material": engine.propeller_material,
          "Propeller Pitch": engine.propeller_pitch,
          "Propeller Type": engine.propeller_type,
          "Propeller Shaft Diameter": engine.propeller_shaftdiameter,
          "Gearbox Type": engine.gearbox_type,
          "Transmission Cooling": engine.transmission_cooling,
          "Propeller Blade Material": engine.propeller_bladematerial,
          "Propeller Shaft Material": engine.propeller_shaftmaterial,
          "Steering System": engine.steering_system,
        },
      },
      {
        title: "Fuel Consumption",
        details: {
          "Fuel Consumption": engine.fuel_consumption,
          "Fuel Consumption At 3/4 Load (G/Kwh)":
            engine.fuel_consumption_3_4_load,
          "Fuel Consumption At 1/2 Load (G/Kwh)":
            engine.fuel_consumption_1_2_load,
          "Fuel Consumption, Propeller Curve (L/H)":
            engine.fuel_consumption_propeller_curve,
          "Heat Rejection To Coolant (Kw)": engine.heat_rejection_to_coolant,
          "Fuel Consumption At Cruising Speed (Litres)":
          engine.fuel_consumption_cruising_speed,
        "Fuel Consumption Rate": engine.fuel_consumption_rate,
        "Fuel Consumption At Full Load (G/Kwh)":
          engine.fuel_consumption_full_load,
          "Lowest Specific Fuel Consumption (G/Kwh)":
          engine.lowest_specific_fuel_consumption,
        },
      },
      {
        title: "Safety and Monitoring",
        details: {
          "Engine Monitoring Systems": engine.engine_monitoringsystem,
          "Overheat Protection": engine.overheat_protection,
          "Low Oil Pressure Alarm": engine.lowoil_pressurealarm,
          "Emergency Stop System": engine.emergency_stopsystem,
        },
      },

      {
        title: "Cylinders",
        details: {
          "Cylinder Configuration": engine.cylinder_configuration,
          "Number Cylinders": engine.number_cylinders,
          "Cylinders And Arrangement": engine.cylinders_arrangement,
          "Number Valves": engine.number_valves,
          "Valve per Cylinder": engine.valve_percylinder,
          "Bore X Stroke": engine.bore_stroke,
          Bore: engine.bore,
          Stroke: engine.stroke,
        },
      },
      {
        title: "Electrical System",
        details: {
          Alternator: engine.alternator,
          "Alternator Output": engine.alternator_output,
          "Battery Type": engine.battery_type,
          "Battery Voltage": engine.battery_voltage,
          "Generator Output (kW)": engine.generator_output_kw,
          "Alternator Output (Amps)": engine.alternator_output_amps,
          "Starter Motor Voltage": engine.starter_motor_voltage,
          "Engine Control Unit (ECU) Model": engine.ecu_model,
          "Battery Charging System": engine.battery_charging_system,
          "Integrated Generator": engine.integrated_generator,
        },
      },
      {
        title: "Oil System",
        details: {
          Oil: engine.oil,
          "Oil Filter": engine.oil_filter,
          "Oil Filter Type": engine.oil_filter_type,
          "Centrifugal Oil Cleaner": engine.centrifugal_oil_cleaner,
          "Oil Cooler": engine.oil_cooler,
          "Oil Filler": engine.oil_filler,
          "Oil Dipstick": engine.oil_dipstick,
          "Recommended Oil": engine.recommended_oil,
          "Oil Capacity": engine.oil_capacity,
          "Oil Change Interval": engine.oil_change_interval,
          "Oil Cooling Method": engine.oil_cooling_method,
          "Lubrication Oil Pressure": engine.lubrication_oil_pressure,
          "Oil Filter Bypass Valve": engine.oil_filter_bypass_valve,
        },
      },
      {
        title: "Emissions & Environment",
        details: {
          "Emission Compliance": engine.emission_compliance,
          "Exhaust System": engine.exhaust_system,
          "Exhaust System Type": engine.exhaust_system_type,
          "Exhaust Gas After Treatment": engine.exhaust_gas_after_treatment,
          "Exhaust Gas Status": engine.exhaust_gas_status,
          "Exhaust Valve Timing": engine.exhaust_valve_timing,
          "Intake Valve Timing": engine.intake_valve_timing,
          "Emission Control Technology": engine.emission_control_technology,
          "NOx Emissions (g/kWh)": engine.nox_emissions,
          "SOx Emissions (g/kWh)": engine.sox_emissions,
          "CO2 Emissions (g/kWh)": engine.co2_emissions,
          "Compliance With IMO Standards": engine.compliance_with_imo_standards,
        },
      },
      {
        title: "Location",
        details: {
          Location: engine.location,
          Distance: engine.distance,
          "Address Details": engine.address_details,
        },
      },
      {
        title: "Payment Terms",
        details: {
          "Payment Terms": engine.payment_terms,
          Currency: engine.currency,
          "Preferred Payment Methods": engine.preferred_payment_methods,
          "Invoice and Receipt Procedures": engine.invoice_receipt_procedures,
        },
      },
      {
        title: "Calculate Price & Pay",
        details: {
          "Price Label": engine.price_label,
          "Price Drop": engine.price_drop,
          Currency: engine.currency,
          VAT: engine.vat,
          "Total Price": engine.total_price,
        },
      },
      {
        title: "Country (Lying)",
        details: {
          "Address Details": engine.address_details,
          Distance: engine.distance,
          "Contact Details": engine.contact_details,
          "Upload Photos": engine.upload_photos,
          "Upload Videos": engine.upload_videos,
        },
      },
    ];
  };
  const images = [
    "https://cdn.pixabay.com/photo/2020/05/29/21/46/seascape-5236865_960_720.jpg",
    "https://cdn.pixabay.com/photo/2020/05/29/21/46/seascape-5236865_960_720.jpg",
    "https://cdn.pixabay.com/photo/2020/05/29/21/46/seascape-5236865_960_720.jpg",
  ];
  if (loading) return <Loader />;
  if (error) return <p>Error: {error}</p>;
  if (!engine) return <p>No engine details available.</p>;

  const panelData = mapEngineToPanelData(engine);

  return (
    <div className="engine-detail-page">
      <div className="engine-main-section">
        <div className="engine-image-gallery">
          <img
            src="../images/engine.jpg"
            alt="Engine"
            className="engine-main-image"
          />
          <div className="engine-thumbnails">
            <img
              src="../images/engine.jpg"
              alt="Thumbnail 1"
              className="thumbnail"
            />
            <img
              src="../images/engine.jpg"
              alt="Thumbnail 2"
              className="thumbnail"
            />
          </div>
        </div>
        <div>
          <Row>
            {panelData.map((section, index) => (
              <Col key={index} md={6}>
                <EngineDetailsPanel
                  title={section.title}
                  details={section.details}
                />
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </div>
  );
};

export default EngineDetail;
