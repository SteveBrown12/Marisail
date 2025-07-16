import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import TrailerDetailsPanel from "../Trailers/Trailer_Details_Panel";
import Loader from "../Loader";
import { Transport_Config } from "../../../node-api/src/config/Transport_Config";

const apiUrl = import.meta.env.VITE_BACKEND_URL;
const URL = `${apiUrl}/search_transport/`;

const getEmptyDetailsState = () => {
  const state = {};
  Transport_Config.tables.forEach(({ key, columns }) => {
    state[key] = {};
    Object.keys(columns).forEach((fieldKey) => {
      state[key][fieldKey] = "";
    });
  });
  return state;
};

const TransportDetail = () => {
  const { id } = useParams();
  const [transportDetails, setTransportDetails] = useState(getEmptyDetailsState());
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransportDetails = async () => {
      try {
        const response = await fetch(`${URL}transport-detail/${id}`);
        if (!response.ok) throw new Error("Failed to fetch details");

        const data = await response.json();
        const fetched = data.res?.[0]?.[0];

        if (!fetched) throw new Error("No data found");

        const updated = {};
        Transport_Config.tables.forEach(({ key, columns }) => {
          updated[key] = {};
          Object.keys(columns).forEach((fieldKey) => {
            const dbFieldName = columns[fieldKey].columnName || fieldKey;
            updated[key][fieldKey] = fetched[dbFieldName] ?? "";
          });
        });

        setTransportDetails(updated);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTransportDetails();
    else setLoading(false);
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <p>Error: {error}</p>;
  if (!transportDetails) return <p>No transport details available.</p>;

  return (
    <div className="engine-detail-page">
      <div className="engine-main-section">
        <Row>
          {Object.keys(transportDetails).map((section) => (
            <Col key={section} md={6}>
              <TrailerDetailsPanel title={section} details={transportDetails[section]} />
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default TransportDetail;
