// Generic_Advert.jsx
import React, { useEffect, useState, useCallback } from "react";
import { Form, Container, Row, Col, Button, Card } from "react-bootstrap";
import FormUtilities from "./Form_Utilities";
import DropdownWithCheckBoxes from "../components/DropdownWithCheckBoxes2";
import InputComponentDual from "../components/InputComponentDual";
import InputComponentDynamic from "../components/InputComponentDynamic";
import Loader from "../components/Loader";
import axios from "axios";
import { useParams } from "react-router-dom";

const API_BASE = import.meta.env.VITE_BACKEND_URL;

export default function GenericAdvert() {
  const { serviceName } = useParams();
  const [loading, setLoading] = useState(true);
  const [serviceConfig, setServiceConfig] = useState(null);
  const [serviceMappings, setServiceMappings] = useState(null);
  const [formState, setFormState] = useState({});
  const [errors, setErrors] = useState({});
  const [autofillLoading, setAutofillLoading] = useState(false);

  const init = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/${serviceName}/search-options`);
      if (res.data.ok) {
        const { service_config, service_mappings } = res.data.data;
        setServiceConfig(service_config);
        setServiceMappings(service_mappings);
        setFormState({});
      }
    } catch (e) {
      console.error("Init error", e);
    } finally {
      setLoading(false);
    }
  }, [serviceName]);

  useEffect(() => {
    if (!serviceName) return;
    init();
  }, [serviceName, init]);

  const handleChange = (varName, value) => {
    setFormState((prev) => ({ ...prev, [varName]: value }));
    setErrors((prev) => ({ ...prev, [varName]: null }));
  };

  const handleDualChange = (varName, { value, unit }) => {
    setFormState((prev) => ({ ...prev, [varName]: { value, unit } }));
    setErrors((prev) => ({ ...prev, [varName]: null }));
  };

  const handleAutofill = async (keyTriplet) => {
    if (!serviceName) return;
    setAutofillLoading(true);
    try {
      const res = await fetch(`${API_BASE}/advert/${serviceName}/autofill`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(keyTriplet),
      });
      const js = await res.json();
      if (!js.ok) throw new Error(js.message || "Autofill failed");
      setFormState((prev) => {
        const merged = { ...prev };
        Object.entries(js.result || {}).forEach(([k, v]) => {
          if (
            merged[k] === undefined ||
            merged[k] === "" ||
            (Array.isArray(merged[k]) && merged[k].length === 0)
          ) {
            merged[k] = v;
          }
        });
        return merged;
      });
    } catch (e) {
      console.error("autofill error", e);
    } finally {
      setAutofillLoading(false);
    }
  };

  const validate = () => {
    if (!serviceConfig) return true;
    const errs = FormUtilities.validateMandatoryFields(
      serviceConfig.tables,
      formState
    );
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e && e.preventDefault();
    if (!validate()) return window.scrollTo({ top: 0, behavior: "smooth" });
    setLoading(true);
    try {
      const normalized = FormUtilities.normalizeFormForSubmit(
        formState,
        serviceMappings
      );
      const res = await fetch(`${API_BASE}/advert/${serviceName}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(normalized),
      });
      const js = await res.json();
      if (!js.ok) throw new Error(js.message || "submit failed");
      const newId = js.new_id || js.data?.new_id;
      window.location.href = `/details/${serviceName}/${newId}`;
    } catch (err) {
      console.error("submit error", err);
      alert("Submit failed. Check console for error.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <Container className="generic-advert">
      <h3 className="mb-4">Advertise {serviceName.toUpperCase()}</h3>
      <Form onSubmit={handleSubmit}>
        <Row>
          {(serviceConfig?.tables || []).map((table) => (
            <Col md={12} key={table.table_Name} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title>{table.section_Heading || table.table_Name}</Card.Title>
                  <Row>
                    {Object.entries(table.columns).map(([varName, colCfg]) => {
                      const label = colCfg.displayText || varName;

                      return (
                        <Col md={4} sm={6} xs={12} key={varName} className="mb-3">
                          {colCfg.type === "radio" ? (
                            <>
                              <label className="form-label">{label}</label>
                              <DropdownWithCheckBoxes
                                options={colCfg.options || []}
                                value={formState[varName] || []}
                                onChange={(v) => handleChange(varName, v)}
                                multi={true}
                                placeholder={`Select ${label}`}
                              />
                            </>
                          ) : colCfg.type === "dual" ? (
                            <>
                              <label className="form-label">{label}</label>
                              <InputComponentDual
                                value={formState[varName]?.value || ""}
                                unit={
                                  formState[varName]?.unit ||
                                  colCfg.radioOptions?.[0]?.value
                                }
                                radioOptions={colCfg.radioOptions || []}
                                onChange={(value, unit) =>
                                  handleDualChange(varName, { value, unit })
                                }
                              />
                            </>
                          ) : (
                            <>
                              <label className="form-label">{label}</label>
                              <InputComponentDynamic
                                value={formState[varName] || ""}
                                onChange={(v) => handleChange(varName, v)}
                                type={colCfg.type === "number" ? "number" : "text"}
                              />
                            </>
                          )}
                          {errors[varName] && (
                            <div className="text-danger small">
                              {errors[varName]}
                            </div>
                          )}
                        </Col>
                      );
                    })}
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <Row className="mt-3">
          <Col>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </Col>
        </Row>

        {autofillLoading && <div className="text-muted mt-2">Autofilling...</div>}
      </Form>
    </Container>
  );
}
