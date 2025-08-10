import React, { useEffect, useState, useCallback } from "react";
import { Form, Container, Row, Col, Button } from "react-bootstrap";
import DropdownWithCheckBoxes from "../components/DropdownWithCheckBoxes2";
import RangeInput from "../components/RangeInput";
import Loader from "../components/Loader";
import axios from "axios";
import { useParams } from "react-router-dom";
import FormUtilities from "./Form_Utilities";

const API_BASE = import.meta.env.VITE_BACKEND_URL;

export default function GenericAdvert() {
  const { serviceName } = useParams();
  const [loading, setLoading] = useState(true);
  const [fetchingOptions, setFetchingOptions] = useState(false);
  const [serviceConfig, setServiceConfig] = useState(null);
  const [serviceMappings, setServiceMappings] = useState(null);
  const [formState, setFormState] = useState({});
  const [errors, setErrors] = useState({});
  const [filtersData, setFiltersData] = useState({});
  const [autofillLoading, setAutofillLoading] = useState(false);

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

  // Fetch dropdown options on demand
  const fetchDropdownData = async (fieldKey) => {
    if (!serviceName || !fieldKey) return;
    setFetchingOptions(true);
    try {
      const res = await axios.get(`${API_BASE}/${serviceName}/facets/${fieldKey}`);
      if (res.data.ok) {
        setFiltersData((prev) => ({
          ...prev,
          [fieldKey]: res.data.facets || [],
        }));
      }
    } catch (err) {
      console.error(`Error fetching facets for ${fieldKey}:`, err);
    } finally {
      setFetchingOptions(false);
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
          {serviceConfig?.tables?.map((table) => {
            const tableColumns = Array.isArray(table.columns)
              ? table.columns
              : table.columns
              ? Object.values(table.columns)
              : [];

            return (
              <Col md={12} key={table.table_Name} className="mb-4">
                <h6>{table.section_Heading}</h6>
                <Row>
                  {tableColumns
                    .filter((col) => col.searchable)
                    .map((col) => {
                      const fieldKey = col.column_Name;
                      const label = col.display_Text || fieldKey;

                      switch (col.type) {
                        case "radio":
                          return (
                            <Col md={4} sm={6} xs={12} key={fieldKey} className="mb-3">
                              <DropdownWithCheckBoxes
                                title={label}
                                options={filtersData[fieldKey] || []}
                                selected={formState[fieldKey] || []}
                                onChange={(vals) =>
                                  setFormState((prev) => ({
                                    ...prev,
                                    [fieldKey]: vals
                                  }))
                                }
                                onOpen={() => fetchDropdownData(fieldKey)}
                                fetching={fetchingOptions}
                                placeholder={`Select ${label}`}
                              />
                              {errors[fieldKey] && (
                                <div className="text-danger small">{errors[fieldKey]}</div>
                              )}
                            </Col>
                          );

                        case "number":
                          return (
                            <Col md={4} sm={6} xs={12} key={fieldKey} className="mb-3">
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
                                <div className="text-danger small">{errors[fieldKey]}</div>
                              )}
                            </Col>
                          );

                        case "date":
                          return (
                            <Col md={4} sm={6} xs={12} key={fieldKey} className="mb-3">
                              <label>{label}</label>
                              <input
                                type="date"
                                className="form-control mb-2"
                                value={formState[fieldKey] || ""}
                                onChange={(e) =>
                                  setFormState((prev) => ({
                                    ...prev,
                                    [fieldKey]: e.target.value
                                  }))
                                }
                              />
                              {errors[fieldKey] && (
                                <div className="text-danger small">{errors[fieldKey]}</div>
                              )}
                            </Col>
                          );

                        default:
                          return (
                            <Col md={4} sm={6} xs={12} key={fieldKey} className="mb-3">
                              <label>{label}</label>
                              <input
                                type="text"
                                className="form-control mb-2"
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
                                <div className="text-danger small">{errors[fieldKey]}</div>
                              )}
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
