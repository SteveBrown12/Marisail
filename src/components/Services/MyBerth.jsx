import { Form, Container, Row, Col } from "react-bootstrap";
import { useEffect, useState, useRef } from "react";
import DropdownWithRadio from "../DropdownWithRadio";
import Loader from "../Loader";
import SubmitButton from "../SubmitButton";
import { makeString } from "../../services/common_functions";
import { Berth_Config } from "../../../node-api/src/config/Berth_Config";

const apiUrl = import.meta.env.VITE_BACKEND_URL;
const URL = apiUrl + "/advert_berth/";

export default function MyBerth() {
  const storedData = JSON.parse(localStorage.getItem("BerthData") || "{}");
  const [sections, setSections] = useState({});
  const [allSelected, setAllSelected] = useState({});
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [openKey, setOpenKey] = useState(null);
  const hasFetched = useRef(false);

  // Initialize based on config
  useEffect(() => {
    console.log("Berth_Config:", Berth_Config);
    const initial = {};
    Berth_Config.config.forEach(({ section_Heading, columns }) => {
      const key = makeString(section_Heading);
      initial[key] = {};
      Object.keys(columns).forEach((f) => {
        initial[key][f] = storedData[f] || [];
      });
    });
    setSections(initial);
    console.log("Initial sections state:", initial);
  }, []);

  const setSectionData = (key, data) => {
    setSections(prev => ({
      ...prev,
      [key]: { ...prev[key], ...data }
    }));
  };

  // Fetch unique lists to populate dropdown options
  const fetchDistinctData = async () => {
    setLoading(true);
    try {
      for (const key of Object.keys(sections)) {
        console.log(`Fetching dropdown data for ${key} ->`, sections[key]);
        const res = await fetch(`${URL}berths`, {
          method: "POST",
          headers: {"Content-Type":"application/json"},
          body: JSON.stringify(sections[key])
        });
        const json = await res.json();
        console.log(`Response for ${key}:`, json.res);
        setSectionData(key, json.res);
      }
    } catch (e) {
      console.error("fetchDistinctData error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasFetched.current && Object.keys(sections).length > 0) {
      fetchDistinctData();
      hasFetched.current = true;
    }
  }, [sections]);

  const handleOptionSelect = (section, field, value) => {
    setAllSelected(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const renderSection = ({ section_Heading, columns }) => {
    const key = makeString(section_Heading);
    const optionState = sections[key] || {};
    return (
      <Col md={6} key={key} className="mt-3">
        <legend><h6>{section_Heading}</h6></legend>
        {Object.entries(columns).map(([fieldKey, cfg]) => {
          if (cfg.type !== "radio") return null;
          const opts = optionState[fieldKey] || [];
          return (
            <DropdownWithRadio
              key={fieldKey}
              heading={fieldKey}
              title={cfg.displayText}
              options={opts}
              selectedOption={allSelected[key]?.[fieldKey] || storedData[fieldKey] || ""}
              setSelectedOption={(v) => handleOptionSelect(key, fieldKey, v)}
              isMandatory={cfg.mandatory}
              setOpenKey={setOpenKey}
              openKey={openKey}
            />
          );
        })}
      </Col>
    );
  };

  return (
    <Container className="mb-5">
      {loading ? <Loader /> : (
        <Form onSubmit={e => e.preventDefault()}>
          <Row>
            {Berth_Config.config.map(renderSection)}
          </Row>
          <SubmitButton text="Submit" name="advert_berth_submit" onClick={() => console.log(allSelected)} />
        </Form>
      )}
    </Container>
  );
}
