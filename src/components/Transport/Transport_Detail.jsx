import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import TrailerDetailsPanel from "../Trailers/Trailer_Details_Panel";
import { detailStateType } from "../Trailers/Trailer_Search_Info";
import Loader from "../Loader";
import { varToDb } from "./Transport_Search_Info";
const apiUrl = import.meta.env.VITE_BACKEND_URL;

const URL = apiUrl + "/search_transport/";

const TransportDetail = () => {
  // console.log("detailStateType", detailStateType);
  // console.log("varToDb", varToDb);
  const { id } = useParams();
  const [trailer, setTrailer] = useState(detailStateType);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  console.log(id);

  // console.log("trailer", trailer);

  useEffect(() => {
    const fetchEngineDetails = async (id) => {
      try {
        const response = await fetch(`${URL}transport-detail/${id}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

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

  console.log("trailer :>> ", trailer);

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

export default TransportDetail;
