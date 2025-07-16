import { useState, useEffect } from "react";
import { Form, Accordion, Row, Col } from "react-bootstrap";
import PropTypes from "prop-types";

function InputComponentDual({
  label,
  value,
  setValue,
  formType,
  isMandatory,
  openKey,
  setOpenKey,
  radioOptions,
  setSelectedOption
}) {
  const [inputText, setInputText] = useState(value);
  const [selectedRadio, setSelectedRadio] = useState(radioOptions.length > 0 ? radioOptions[0].value : "" );

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setInputText(inputValue);
    setSelectedOption(inputValue, selectedRadio);
};

const handleRadioChange = (e) => {
    const radioValue = e.target.value;
    setSelectedRadio(radioValue);
    setSelectedOption(inputText, radioValue);
};


  useEffect(() => {
    setInputText(value);
  }, [value]);

  useEffect(() => {
    if (radioOptions.length > 0) {
      setSelectedRadio(radioOptions[0]?.value);
    }
  }, [radioOptions]);
  

  return (
    <Accordion
      activeKey={openKey}
      style={{ marginLeft: "-10px" }}
      onSelect={(eventKey) => setOpenKey(eventKey)}
    >
      <Accordion.Item eventKey={label}>
        <Accordion.Header>
          {label}
          {isMandatory && <span className="text-danger">&nbsp;*</span>}
        </Accordion.Header>
        <Accordion.Body>
          <Form.Group controlId="formGridState">
            <Row>
              <Col md={8} style={{ display: "flex", alignItems: "center" }}>
                <Form.Control
                  value={inputText}
                  onChange={handleInputChange}
                  type={formType}
                  placeholder=""
                  name={label}
                  style={{ flexGrow: 1 }}
                />
              </Col>

              {radioOptions.length > 0 && (
                <Col md={4} style={{ display: "flex", alignItems: "center" }}>
                  <div
                    className="btn-group"
                    role="group"
                    aria-label="Basic radio toggle button group"
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "17px",
                      width: "65%",
                      display: "flex",
                      justifyContent: "space-around",
                      gap: "0px"
                    }}
                  >
                    {radioOptions.map((option) => (
                      <div key={option.id}>
                        <input
                          type="radio"
                          className="btn-check"
                          name={`btnradio-${label}-${option.value}`}
                          id={`btnradio-${label}-${option.value}`}
                          value={option.value}
                          onChange={handleRadioChange}
                          checked={selectedRadio === option.value}
                        />
                        <label
                          className="btn btn-outline-primary"
                          htmlFor={`btnradio-${label}-${option.value}`}
                          style={{
                            width: "100%",
                            padding: "5px 10px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </Col>
              )}
            </Row>
          </Form.Group>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}

InputComponentDual.propTypes = {
  label: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  formType: PropTypes.string.isRequired,
  isMandatory: PropTypes.bool,
  openKey: PropTypes.string,
  setOpenKey: PropTypes.func,
  radioOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  setSelectedOption: PropTypes.func.isRequired,
};

export default InputComponentDual;
