import { useEffect, useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import DropdownWithCheckBoxes from "../DropdownWithCheckBoxes2";
import Loader from "../Loader";
import ResetBar from "../ResetBar";
import TransportCard from "../TransportCard";
import { Transport_Config } from "../../../node-api/src/config/Transport_Config";
import { transportVarToColumn } from "../../../node-api/src/config/Transport_Config";

const apiUrl = import.meta.env.VITE_BACKEND_URL;
const URL = apiUrl + "/transportRoutes/";

export default function TransportSearch() {
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [allSelectedOptions, setAllSelectedOptions] = useState({});
  const [filters, setFilters] = useState({});
  const [trailers, setTrailers] = useState([]);

  // Generate empty filters from config
useEffect(() => {
  const initialFilters = {};
  Transport_Config.tables.forEach(({ table_Name, columns }) => {
    initialFilters[table_Name] = {}; // use table_Name instead of `key`
    Object.keys(columns).forEach((colKey) => {
      initialFilters[table_Name][colKey] = [];
    });
  });
  setFilters(initialFilters);
}, []);


  const removeTag = (tag) => {
    setAllSelectedOptions((prev) => {
      const updated = { ...prev };
      delete updated[tag];
      return updated;
    });
  };

  const resetTags = () => {
    setAllSelectedOptions({});
  };

  const handlePageChange = (newPage) => setPage(newPage);

  const fetchDropdownData = async (tableKey, columnKey, search = "", offSet = 0) => {
  // we already know tableKey is a real table_Name – no need to look it up
const fieldConfig = Transport_Config.tables
  .find(t => t.table_Name === tableKey)?.columns[columnKey];

if (!fieldConfig || fieldConfig.type === "range") return;   // keep this


    setFetching(true);
    try {
    const res = await fetch(`${URL}search/transport/dropdown`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    uiKey: columnKey,
    filters: allSelectedOptions,
  }),
});console.log("🔍 Sending to dropdown:", {
  uiKey: columnKey,
  filters: allSelectedOptions,
});
console.log("🔽 Triggering dropdown fetch:", { tableKey, columnKey });


      const data = await res.json();
     const cleanData = (data.data || []).filter(Boolean);

      setFilters((prev) => ({
        ...prev,
        [tableKey]: {
          ...prev[tableKey],
          [columnKey]: offSet !== 0
            ? [...(prev[tableKey][columnKey] || []), ...cleanData]
            : cleanData,
        },
      }));
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setFetching(false);
    }
  };

  const removeFilter = (key, filter) => {
    const updated = (allSelectedOptions[key] || []).filter((v) => v !== filter);
    setAllSelectedOptions((prev) => ({ ...prev, [key]: updated }));
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${URL}search/transport/list`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            selectedOptions: allSelectedOptions,
            page,
          }),
        });

        const data = await res.json();
setTrailers(Array.isArray(data.data) ? data.data : []);


      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [allSelectedOptions, page]);

  return (
    <Container>
      <Row>
        <Col md={3}>
          <h4 className="py-3">Search For Transport</h4>
          <ResetBar
            selectedTags={allSelectedOptions}
            removeTag={removeTag}
            resetTags={resetTags}
            removeFilter={removeFilter}
          />
        {Transport_Config.tables.map(({ table_Name, label, columns }) => (
  <fieldset key={table_Name} className="mb-4">
    <legend className="fieldset-legend">
      <h6 className="d-flex justify-content-between align-items-center px-0 pt-3">
        {label || table_Name}
      </h6>
    </legend>
    {Object.entries(columns).map(([colKey, config]) => {
      if (config.type === "range") return null;

      return (
        <Row key={`${table_Name}-${colKey}`} className="row-margin">
          <Col md={12}>
            <Form.Group>
              <DropdownWithCheckBoxes
  heading={colKey}
  title={config.displayText}
  options={filters[table_Name]?.[colKey] || []}
  selectedOptions={allSelectedOptions}
  setSelectedOptions={setAllSelectedOptions}
  fetching={fetching}
  varToDb={transportVarToColumn}
  onOpen={(search, offSet) =>
    fetchDropdownData(table_Name, colKey, search, offSet)
  }
/>

            </Form.Group>
          </Col>
        </Row>
      );
    })}
  </fieldset>
))}

        </Col>

        <Col md={9}>
          <h1 style={{ fontSize: "28.8px", fontWeight: "200", padding: "20px" }}>
            Transport For Sale
          </h1>

          {loading ? (
            <Loader />
          ) : (
            <Row>
              {trailers.length === 0 ? (
                <Col md={12}>
                  <p>No Results Found</p>
                </Col>
              ) : (
                trailers.map((item, index) => (
                  <Col key={index} md={4}>
                    <TransportCard {...item} />
                  </Col>
                ))
              )}
            </Row>
          )}

          <Row className="my-4">
            <div className="d-flex justify-content-center align-items-center gap-2 w-100">
              <button onClick={() => handlePageChange(page - 1)} disabled={page === 0}>
                Previous
              </button>
              <span>Page {page + 1}</span>
              <button onClick={() => handlePageChange(page + 1)}>Next</button>
            </div>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
