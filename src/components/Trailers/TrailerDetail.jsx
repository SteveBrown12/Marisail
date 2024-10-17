import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TrailerDetailsPanel from "./TrailerDetailsPanel";
import Loader from "../Loader";
import { Row, Col } from "react-bootstrap";
import { varToDb, detailStateType } from "./trailerInfo";

const URL = "http://localhost:3001/api/search_trailer/";

const TrailerDetail = () => {
  const { id } = useParams();
  const [trailer, setTrailer] = useState(detailStateType);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  console.log(id);


  useEffect(() => {
    // fetch trailer details
    console.log("fetching trailer details", id);

    const fetchEngineDetails = async (id) => {
      try {
        const response = await fetch(`${URL}trailer-detail/${id}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("data", data.res[0][0]);

        Object.keys(trailer).map((key) => {
          Object.keys(trailer[key]).map((key2) => {
            // console.log("key2", key2);
            var name = varToDb[key2];
            // console.log("size", data.res[0].length);
            // console.log("name", name);
            // console.log("data[name] ooutside", data.res[0][0][name]);
            if (data.res[0][0][name] !== undefined)
              // console.log("data[name] inside", data.res[0][0][name]);
              setTrailer((prevState) => ({
                ...prevState,
                [key]: {
                  ...prevState[key],
                  [key2]: data.res[0][0][name],
                },
              }));
            // trailer[key][key2] = data[name];
          });
        });

        // console.log("trailer", trailer);
        // console.log("data[name] trailer", data.res[0]["Trailer_ID"]);
        setLoading(false);
        // console.log("trailer", trailer);
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
};

export default TrailerDetail;
