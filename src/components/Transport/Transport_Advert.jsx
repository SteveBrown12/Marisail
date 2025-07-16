import { Form, Container, Row, Col } from "react-bootstrap";
import { useCallback, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DropdownWithRadio from "../DropdownWithRadio";
import Loader from "../Loader";
import SubmitButton from "../SubmitButton";
import DatePickerComponent from "../DatePickerComponent";
import InputComponentDual from "../InputComponentDual";
import FormFieldCard from "../../services/FormFieldCard";
import { convertUnitsInFormData } from "../../services/common_functions";
import { Transport_Config } from "../../../node-api/src/config/Transport_Config";

const apiUrl = import.meta.env.VITE_BACKEND_URL;

/* ---------- helpers ---------- */
const getFieldDef = (section, fieldKey) => {
  const table = Transport_Config.tables.find(
    (t) => t.table_Name === section
  );
  return table?.columns?.[fieldKey] || {};
};

const getLabel = (section, fieldKey) => {
  const field = getFieldDef(section, fieldKey);
  return field.displayText || fieldKey;
};

/* ---------- component ---------- */
export default function TransportAdvert() {
  const navigate = useNavigate();
  const hasFetched = useRef(false);
  const [error, setError] = useState({});
  const [openKey, setOpenKey] = useState(null);
  const [loading, setLoading] = useState(false);
  const [transport, setTransport] = useState({});
  const [allSelectedOptions, setAllSelectedOptions] = useState({});

  const handleDualInputChange = (section, fieldKey, inputValue, radioValue) => {
    setAllSelectedOptions((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [fieldKey]: { value: inputValue, unit: radioValue },
      },
    }));
  };

  const handleOptionSelect = (section, fieldKey, selectedOption) => {
    setAllSelectedOptions((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [fieldKey]: { value: selectedOption, unit: null },
      },
    }));
  };

  const handleInputChange = (section, fieldKey, newValue) => {
    setTransport((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [fieldKey]: newValue,
      },
    }));
  };

  const errorDisplay = (fieldName) => (
    <div style={{ color: "red", paddingLeft: 10 }}>
      {fieldName} field is required
    </div>
  );

  /* ---------- fetch dropdown data using shared util ---------- */
  const fetchDistinctData = useCallback(async () => {
    try {
      setLoading(true);

      const results = await Promise.all(
        Transport_Config.tables.map(async ({ table_Name }) => {
          const options = await fetchBerthDropdownOptions({
            apiUrl,
            uiKey: table_Name,
            filters: {},
            search: "",
            offSet: 0,
          });
          return { section: table_Name, data: options };
        })
      );

      results.forEach(({ section, data }) => {
        setTransport((prev) => ({ ...prev, [section]: data }));
      });
    } catch (err) {
      console.error("❌ Dropdown Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchDistinctData();
    }
  }, [fetchDistinctData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      convertUnitsInFormData(allSelectedOptions);
      localStorage.setItem("TransportData", JSON.stringify(allSelectedOptions));
      navigate("/view-transport");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container className="mb-5">
      {loading ? (
        <Loader />
      ) : (
        <Form onSubmit={handleSubmit}>
          <Row>
            {Transport_Config.tables.map(({ table_Name: section, columns }) => (
              <Col md={6} key={section} className="mt-2">
                <legend className="fieldset-legend">
                  <h6 style={{ padding: "15px 10px 0px 10px" }}>{section}</h6>
                </legend>

                {Object.entries(columns).map(([fieldKey, field]) => {
                  const label = getLabel(section, fieldKey);

                  if (field.type === "radio") {
                    return (
                      <Col
                        md={12}
                        className="mr-3"
                        key={fieldKey}
                        style={{ width: 480 }}
                      >
                        <DropdownWithRadio
                          heading={fieldKey}
                          title={label}
                          options={transport?.[section]?.[fieldKey] || []}
                          selectedOption={
                            allSelectedOptions?.[section]?.[fieldKey]?.value || ""
                          }
                          setSelectedOption={(selectedOption) =>
                            handleOptionSelect(section, fieldKey, selectedOption)
                          }
                          isMandatory={field.mandatory}
                          setOpenKey={() => setOpenKey(fieldKey)}
                          openKey={openKey}
                        />
                        {error?.[fieldKey] && errorDisplay(label)}
                      </Col>
                    );
                  }

                  if (field.type === "date") {
                    return (
                      <Col
                        md={12}
                        className="mr-3"
                        key={fieldKey}
                        style={{ width: 480 }}
                      >
                        <DatePickerComponent
                          label={label}
                          value={transport?.[section]?.[fieldKey] || new Date()}
                          setValue={(e) =>
                            handleInputChange(section, fieldKey, e.target.value)
                          }
                          formType="number"
                          setOpenKey={setOpenKey}
                          openKey={openKey}
                          isMandatory={field.mandatory}
                        />
                        {error?.[fieldKey] && errorDisplay(label)}
                      </Col>
                    );
                  }

                  if (field.type === "dual") {
                    return (
                      <Col
                        md={12}
                        className="mr-3"
                        key={fieldKey}
                        style={{ width: 480 }}
                      >
                        <InputComponentDual
                          label={label}
                          value={transport?.[section]?.[fieldKey] || ""}
                          setValue={(e) =>
                            handleInputChange(section, fieldKey, e.target.value)
                          }
                          formType="number"
                          setOpenKey={setOpenKey}
                          openKey={openKey || ""}
                          isMandatory={field.mandatory}
                          radioOptions={field.radioOptions}
                          selectedOption={
                            allSelectedOptions?.[section]?.[fieldKey]?.unit || ""
                          }
                          setSelectedOption={(inputValue, radioValue) =>
                            handleDualInputChange(
                              section,
                              fieldKey,
                              inputValue,
                              radioValue
                            )
                          }
                        />
                        {error?.[fieldKey] && errorDisplay(label)}
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
            name="advert_transport_submit"
            onClick={handleSubmit}
          />
        </Form>
      )}
    </Container>
  );
}
