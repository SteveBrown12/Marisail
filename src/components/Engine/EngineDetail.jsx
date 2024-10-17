import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EngineDetailsPanel from "./EngineDetailPanel";
import Loader from "../Loader";
import { Col, Row } from "react-bootstrap";
import { varToDb, detailStateType } from "./engineInfo";

const URL = "http://localhost:3001/api/search_engine";

const EngineDetail = () => {
  const { id } = useParams();
  const [engine, setEngine] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  console.log("fetching engine data", id)

  const fetchEngineDetails = async (id) => {
    try {
      const response = await fetch(`${URL}engine-detail/${id}`);
      if(!response.ok){
        throw new Error("Network Error was not Ok")
      }
      const data = await response.json();
      console.log("data", data.res[0][0]);

      Object.keys(engine).map((key) => {
        Object.keys(engine[key]).map((key2) => {
          var name = varToDb[key2];
          if(data.res[0][0][name] !== undefined)
            setEngine((prevState) => ({
              ...prevState,
              [key]: {
                ...prevState[key], 
                [key2]: data.res[0][0][name]
              }
            }));
          
        })
      })
      
      setLoading(false)

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
  if (!trailer) return <p>No engine details available.</p>;

  return (
    <div className="engine-detail-page">
      <div className="engine-main-section">
        <div>
          <Row>
            {Object.keys(trailer).map((key) => (
              <Col key={key} md={6}>
                <TrailerDetailsPanel title={key} details={trailer[key]} />
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </div>
  );
}
export default EngineDetail;