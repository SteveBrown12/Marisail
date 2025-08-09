import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import Loader from "../../components/Loader";
import PropTypes from "prop-types";
import { varToScreen } from "../../info/Charter_Search_Info";
import { detailStateType, varToDb } from "../../info/Charter_Search_Info";
const apiUrl = import.meta.env.VITE_BACKEND_URL;

const URL = apiUrl + "/search_charter/";


const CharterDetailPanel = ({ title, details }) => {
  
  return (
    <div className="details-panel-container">
      <div className="details-panel-header">
        <span className="panel-title ">
          <h6>{varToScreen[title]?.displayText}</h6>
        </span>
      </div>
      <div className="details-panel-content">
        <table className="details-panel-table">
          <tbody>
            {Object.entries(details).map(([key, value]) => {
              return (
                <tr key={key}>
                  <td className="details-panel-key">
                    <strong>{varToScreen?.[key]?.displayText}:</strong>
                  </td>
                  <td className="details-panel-value">{value}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

CharterDetailPanel.propTypes = {
  title: PropTypes.string.isRequired,
  details: PropTypes.object.isRequired,
};

const CharterDetail = () => {
  const { id } = useParams();
  const [trailer, setTrailer] = useState(detailStateType);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  
  

  useEffect(() => {
    const fetchEngineDetails = async (id) => {
      try {
        const response = await fetch(`${URL}charter-detail/${id}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        Object.keys(trailer).map((key) => {
          Object.keys(trailer[key]).map((key2) => {
            var name = varToDb[key2];

            if (data.res[0][0] && data.res[0][0][name] !== undefined)
              setTrailer((prevState) => ({
                ...prevState,
                [key]: {
                  ...prevState[key],
                  [key2]: data.res[0][0][name],
                },
              }));
          });
        });

        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEngineDetails(id);
    } else {
      setLoading(false);
    }
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <p>Error: {error}</p>;
  if (!trailer) return <p>No trailer details available.</p>;
  
  return (
    <div className="engine-detail-page">
      <div className="engine-main-section">
   
        <div>
          <Row>
            {trailer &&
              Object.keys(trailer).map((key) => (
                <Col key={key} md={6}>
                  <CharterDetailPanel title={key} details={trailer[key]} />
                </Col>
              ))}
          </Row>
        </div>
      </div>
    </div>
  );
};

export default CharterDetail;
