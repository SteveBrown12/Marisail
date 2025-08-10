import React, { useEffect, useState, useCallback } from "react";
import { Form, Container, Row, Col, Button } from "react-bootstrap";
import DropdownWithCheckBoxes from "../components/DropdownWithCheckBoxes2";
import RangeInput from "../components/RangeInput";
import Loader from "../components/Loader";
import DatePickerField from "../components/DatePickerField";
import axios from "axios";
import { useParams } from "react-router-dom";
import FormUtilities from "./Form_Utilities";

const API_BASE = import.meta.env.VITE_BACKEND_URL;

export default function GenericAdvert() {
  const { serviceName } = useParams();
  const [loading, setLoading] = useState(true);
  const [fetchingOptions, setFetchingOptions] = useState({});
  const [serviceConfig, setServiceConfig] = useState(null);
  const [serviceMappings, setServiceMappings] = useState(null);
  const [formState, setFormState] = useState({});
  const [errors, setErrors] = useState({});
  const [filtersData, setFiltersData] = useState({});
  const [autofillLoading, setAutofillLoading] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  // Fetch config
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

  // helper to build uiKey
  const UI_KEY_SEP = "||";
  const buildUiKey = (tableName, fieldKey) => `${tableName}${UI_KEY_SEP}${fieldKey}`;

  // updated fetchDropdownData
  const fetchDropdownData = async (uiKey, fieldKey) => {
    if (!serviceName || !fieldKey || !uiKey) return;
    setFetchingOptions((prev) => ({ ...prev, [uiKey]: true }));
    try {
      const res = await axios.get(`${API_BASE}/${serviceName}/facets/${fieldKey}`);
      if (res.data.ok) {
        setFiltersData((prev) => ({
          ...prev,
          [uiKey]: [...(res.data.facets || [])],
        }));
      } else {
        setFiltersData((prev) => ({ ...prev, [uiKey]: [] }));
      }
    } catch (err) {
      console.error(`Error fetching facets for ${fieldKey}:`, err);
      setFiltersData((prev) => ({ ...prev, [uiKey]: [] }));
    } finally {
      setFetchingOptions((prev) => ({ ...prev, [uiKey]: false }));
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
    <Container className="generic-advert py-5">
      <Row className="justify-content-center">
        <Col lg={10}>
          <div className="card shadow-sm border-0 rounded-4 p-4">
            <h3 className="mb-4 fw-bold text-primary">
              Advertise {serviceName.toUpperCase()}
            </h3>

            <Form onSubmit={handleSubmit}>
              <Row>
                {serviceConfig?.tables?.map((table) => {
                  const tableColumns = Array.isArray(table.columns)
                    ? table.columns
                    : table.columns
                    ? Object.values(table.columns)
                    : [];

                  return (
                    <Col md={12} key={table.table_Name} className="mb-4">
                      <h5 className="mt-4 mb-3 border-bottom pb-2 text-secondary">
                        {table.section_Heading}
                      </h5>
                      <Row>
                        {tableColumns
                          .map((col) => {
                            const fieldKey = col.column_Name;
                            const uiKey = buildUiKey(table.table_Name, fieldKey);
                            const label = col.display_Text || fieldKey;

                            switch (col.type) {
                              case "radio":
                                return (
                                  <Col md={4} sm={6} xs={12} key={uiKey}>
                                    <Form.Group className="mb-3" controlId={uiKey}>
                                      <DropdownWithCheckBoxes
                                        title={label}
                                        options={filtersData[uiKey] ? [...filtersData[uiKey]] : []}
                                        selected={formState[uiKey] || []}
                                        onChange={(vals) =>
                                          setFormState((prev) => ({
                                            ...prev,
                                            [uiKey]: vals
                                          }))
                                        }
                                        onOpen={() => {
                                          setOpenDropdown(uiKey);
                                          fetchDropdownData(uiKey, fieldKey);
                                        }}
                                        onClose={() => setOpenDropdown(null)}
                                        open={openDropdown === uiKey}
                                        fetching={!!fetchingOptions[uiKey]}
                                        placeholder={`Select ${label}`}
                                      />

                                      {errors[uiKey] && (
                                        <div className="text-danger small mt-1">
                                          {errors[uiKey]}
                                        </div>
                                      )}
                                    </Form.Group>
                                  </Col>
                                );
                              case "number":
                                return (
                                  <Col md={4} sm={6} xs={12} key={fieldKey}>
                                    <Form.Group className="mb-3" controlId={fieldKey}>
                                      <RangeInput
                                        title={label}
                                        min={col.min || ""}
                                        max={col.max || ""}
                                        valueFrom={formState[fieldKey]?.from || ""}
                                        valueTo={formState[fieldKey]?.to || ""}
                                        onChange={(min, max) =>
                                          setFormState((prev) => ({
                                            ...prev,
                                            [fieldKey]: { from: min, to: max }
                                          }))
                                        }
                                      />
                                      {errors[fieldKey] && (
                                        <div className="text-danger small mt-1">
                                          {errors[fieldKey]}
                                        </div>
                                      )}
                                    </Form.Group>
                                  </Col>
                                );

                        case "date":
                          return (
                            <Col md={4} sm={6} xs={12} key={fieldKey} className="mb-3">
                              <label>{label}</label>
                              <DatePickerField
                                mode="single"
                                value={formState[fieldKey] || ""}
                                onChange={(iso) =>
                                  setFormState((prev) => ({
                                    ...prev,
                                    [fieldKey]: iso,
                                  }))
                                }
                                placeholder="dd-mm-yyyy"
                                style={{ width: 220 }}
                              />
                              {errors[fieldKey] && (
                                <div className="text-danger small">{errors[fieldKey]}</div>
                              )}
                            </Col>
                          );

                              default:
                                return (
                                  <Col md={4} sm={6} xs={12} key={fieldKey}>
                                    <Form.Group className="mb-3" controlId={fieldKey}>
                                      <Form.Label className="fw-semibold">{label}</Form.Label>
                                      <Form.Control
                                        type="text"
                                        placeholder={label}
                                        value={formState[fieldKey] || ""}
                                        onChange={(e) =>
                                          setFormState((prev) => ({
                                            ...prev,
                                            [fieldKey]: e.target.value
                                          }))
                                        }
                                      />
                                      {errors[fieldKey] && (
                                        <div className="text-danger small mt-1">
                                          {errors[fieldKey]}
                                        </div>
                                      )}
                                    </Form.Group>
                                  </Col>
                                );
                            }
                          })}
                      </Row>
                    </Col>
                  );
                })}
              </Row>

              <Row className="mt-3">
                <Col>
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 rounded-pill"
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Submitting...
                      </>
                    ) : (
                      "Submit"
                    )}
                  </Button>
                </Col>
              </Row>

              {autofillLoading && (
                <div className="text-muted mt-2 fst-italic">Autofilling...</div>
              )}
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
