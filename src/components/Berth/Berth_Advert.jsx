import { Form, Container, Row, Col } from "react-bootstrap";
import { useEffect, useState, useRef } from "react";
import DropdownWithCheckBoxes from "../DropdownWithCheckBoxes2";
import Loader from "../Loader";
import SubmitButton from "../SubmitButton";
import InputComponentDynamic from "../InputComponentDynamic";
import InputComponentDual from "../InputComponentDual";
import FormFieldCard from "../../services/FormFieldCard";
import { convertUnitsInFormData } from "../../services/common_functions";
import { useNavigate } from "react-router-dom";
import { Berth_Config } from "../../../node-api/src/config/Berth_Config";
import { fetchBerthDropdownOptions } from "../../../node-api/src/utils/fetchBerthDropdownOptions";

const apiUrl = import.meta.env.VITE_BACKEND_URL;

export default function BerthAdvert() {
  const navigate = useNavigate();
  const [sections, setSections] = useState({});
  const [berths, setBerths] = useState({});
  const [allSelectedOptions, setAllSelectedOptions] = useState({});
  const [openKey, setOpenKey] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const initialized = useRef(false);

  // Initialize empty structure for dropdowns
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      const init = {};
      Berth_Config.config.forEach(({ table_Name, columns }) => {
        init[table_Name] = {};
        Object.keys(columns).forEach((key) => {
          init[table_Name][key] = [];
        });
      });
      setSections(init);
    }
  }, []);

  // Handle checkbox multi-selection
  const pushSelections = (table, field, newArray) => {
    setAllSelectedOptions((prev) => ({
      ...prev,
      [table]: { ...prev[table], [field]: newArray },
    }));
  };

  const handleNumber = (table, field, value) =>
    setBerths((prev) => ({
      ...prev,
      [table]: { ...prev[table], [field]: value },
    }));

  const handleDual = (table, field, value, unit) =>
    setAllSelectedOptions((prev) => ({
      ...prev,
      [table]: { ...prev[table], [field]: { value, unit } },
    }));

  // Dynamically fetch dropdown options
  const fetchDropdown = async (table, field, search = "", offset = 0) => {
    try {
      setFetching(true);
      const cleanData = await fetchBerthDropdownOptions({
        apiUrl,
        uiKey: field,
        filters: allSelectedOptions,
        search,
        offSet: offset,
      });

      setSections((prev) => ({
        ...prev,
        [table]: {
          ...prev[table],
          [field]: offset !== 0
            ? [...(prev[table]?.[field] || []), ...cleanData]
            : cleanData,
        },
      }));
    } catch (err) {
      console.error("❌ Dropdown fetch error:", err);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    convertUnitsInFormData(allSelectedOptions);
    localStorage.setItem("BertData", JSON.stringify(allSelectedOptions));
    navigate("/view-berth");
  };

  return (
    <Container className="mb-5">
      {loading ? (
        <Loader />
      ) : (
        <Form onSubmit={handleSubmit}>
          <Row>
            {Berth_Config.config.map(({ table_Name, section_Heading, columns }) => (
              <Col md={6} key={table_Name} className="mt-2">
                <legend className="fieldset-legend">
                  <h6 style={{ padding: "15px 10px 0px 10px" }}>{section_Heading}</h6>
                </legend>

                {Object.entries(columns).map(([fieldKey, field]) => {
                  const selectedGroup = allSelectedOptions[table_Name] || {};
                  const currentSel = selectedGroup[fieldKey] || [];

                  if (field.type === "radio") {
                    return (
                      <DropdownWithCheckBoxes
                        key={fieldKey}
                        heading={fieldKey}
                        title={field.displayText}
                        options={sections[table_Name]?.[fieldKey] || []}
                        selectedOptions={selectedGroup}
                        setSelectedOptions={(obj) =>
                          pushSelections(table_Name, fieldKey, obj[fieldKey] || [])
                        }
                        onOpen={(search, offset) => fetchDropdown(table_Name, fieldKey, search, offset)}
                        fetching={fetching}
                      />
                    );
                  }

                  if (field.type === "number") {
                    return (
                      <InputComponentDynamic
                        key={fieldKey}
                        label={field.displayText}
                        value={berths[table_Name]?.[fieldKey] || ""}
                        setValue={(e) =>
                          handleNumber(table_Name, fieldKey, e.target.value)
                        }
                        formType="number"
                        isMandatory={field.mandatory}
                        openKey={openKey}
                        setOpenKey={setOpenKey}
                      />
                    );
                  }

                  if (field.type === "dual") {
                    return (
                      <InputComponentDual
                        key={fieldKey}
                        label={field.displayText}
                        value={berths[table_Name]?.[fieldKey] || ""}
                        formType="number"
                        radioOptions={field.radioOptions}
                        selectedOption={currentSel.unit || ""}
                        setSelectedOption={(val, unit) =>
                          handleDual(table_Name, fieldKey, val, unit)
                        }
                        openKey={openKey}
                        setOpenKey={setOpenKey}
                      />
                    );
                  }

                  return null;
                })}
              </Col>
            ))}
            <FormFieldCard countryVisible />
          </Row>
          <SubmitButton text="Submit" name="advert_berth_submit" />
        </Form>
      )}
    </Container>
  );
}
