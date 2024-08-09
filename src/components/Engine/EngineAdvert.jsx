import { useState } from "react";
import { Container } from "react-bootstrap";
import { Col, InputGroup, Form, Row, Accordion } from "react-bootstrap";
import SelectComponent from "../SelectComponent";
import InputComponent from "../InputComponent";
import "./engineAdvert.module.scss";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const EngineAdvert = () => {
  const [form, setForm] = useState({
    condition: "",
    usedCondition: "",
    seller: "",
    offeredBy: "",
    lastSurveyDate: null,
    brokerValuation: "",
    marisailVesselId: "",
    engineMake: "",
    engineClassification: "",
    certification: "",
    engineModel: "",
    manufacturerWarranty: "",
  });
  const [openKey, setOpenKey] = useState(null);

  return (
    <>
      <Container className="mb-5">
        <Row>
          <Col md={6} className="mt-4">
            <h6 style={{ marginLeft: 20 }}>Condition</h6>
            <Col md={12}>
              <Form>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    type="advertEngine"
                    label="Condition"
                    value={form.condition}
                    setValue={(val) => setForm({ ...form, condition: val })}
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    type="advertEngine"
                    value={form.usedCondition}
                    setValue={(val) => setForm({ ...form, usedCondition: val })}
                    label="UsedCondition"
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    type="advertEngine"
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.seller}
                    setValue={(val) => setForm({ ...form, seller: val })}
                    label="Seller"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    type="advertEngine"
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.offeredBy}
                    setValue={(val) => setForm({ ...form, offeredBy: val })}
                    label="offeredBy"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <Accordion defaultActiveKey="0">
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>Last Survey Date</Accordion.Header>
                      <Accordion.Body>
                        <div>
                          <InputGroup>
                            <div className="customDatePickerWidth">
                              <DatePicker
                                className="form-control datepicker-input"
                                selected={form.lastSurveyDate}
                                onChange={(date) =>
                                  setForm({ ...form, lastSurveyDate: date })
                                }
                                dateFormat="dd/MM/yyyy"
                                placeholderText="DD/MM/YYYY"
                              />
                            </div>
                            {/* <div className="customDatePickerWidthText">
                          <InputGroup.Text>
                              <i className="bi bi-calendar" />
                            </InputGroup.Text>
                          </div> */}
                          </InputGroup>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <InputComponent
                    label={"Broker Valuation"}
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    formType={"number"}
                    type="advertEngine"
                    style={{ width: "100%" }}
                    value={form.brokerValuation}
                    setValue={(e) =>
                      setForm({
                        ...form,
                        brokerValuation: e.target.value,
                      })
                    }
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
                    type="advertEngine"
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.marisailVesselId}
                    setValue={(val) =>
                      setForm({ ...form, marisailVesselId: val })
                    }
                    label="marisailVesselId"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    type="advertEngine"
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.engineMake}
                    setValue={(val) => setForm({ ...form, engineMake: val })}
                    label="engineMake"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    type="advertEngine"
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.engineClassification}
                    setValue={(val) =>
                      setForm({ ...form, engineClassification: val })
                    }
                    label="engineClassification"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    type="advertEngine"
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.certification}
                    setValue={(val) => setForm({ ...form, certification: val })}
                    label="certification"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    type="advertEngine"
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.engineModel}
                    setValue={(val) => setForm({ ...form, engineModel: val })}
                    label="engineModel"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    type="advertEngine"
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.manufacturerWarranty}
                    setValue={(val) =>
                      setForm({ ...form, manufacturerWarranty: val })
                    }
                    label="manufacturerWarranty"
                  />
                </Col>
                <Col xs={3} md={12} className="mb-2">
                  <SelectComponent
                    type="advertEngine"
                    openKey={openKey}
                    setOpenKey={setOpenKey}
                    value={form.engineModelYear}
                    setValue={(val) =>
                      setForm({ ...form, engineModelYear: val })
                    }
                    label="engineModelYear"
                  />
                </Col>
              </Form>
            </Col>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default EngineAdvert;
