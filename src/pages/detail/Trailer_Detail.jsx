import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../../components/Loader";
import PropTypes from "prop-types";
import { varToScreen } from "../services/Trailer_Search_Info";
import { varToDb, detailStateType } from "../services/Trailer_Search_Info";

const apiUrl = import.meta.env.VITE_BACKEND_URL;
const URL = `${apiUrl}/search_trailer/`;

const TrailerDetailsPanel = ({ title, details }) => (
  <div className="border border-gray-300 rounded-md shadow-sm mb-4">
    <div className="bg-gray-100 px-3 py-2 border-b border-gray-300">
      <span className="block font-semibold text-sm text-gray-800">
        <h6 className="text-base font-semibold">
          {varToScreen[title]?.displayText}
        </h6>
      </span>
    </div>
    <div className="p-3">
      <table className="w-full text-sm border-collapse">
        <tbody>
          {Object.entries(details).map(([key, value]) => (
            <tr key={key} className="border-b border-gray-200 last:border-none">
              <td className="pr-4 py-1 font-semibold text-gray-700 align-top w-1/3">
                {varToScreen?.[key]?.displayText}:
              </td>
              <td className="py-1 text-gray-800">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

TrailerDetailsPanel.propTypes = {
  title: PropTypes.string.isRequired,
  details: PropTypes.object.isRequired,
};

const TrailerDetail = () => {
  const { id } = useParams();
  const [trailer, setTrailer] = useState(detailStateType);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEngineDetails = async (id) => {
      try {
        const response = await fetch(`${URL}trailer-detail/${id}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        Object.keys(trailer).map((key) => {
          Object.keys(trailer[key]).map((key2) => {
            var name = varToDb[key2];
            if (data.res[0][0][name] !== undefined)
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
  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (!trailer) return <p>No trailer details available.</p>;

  return (
    <div className="p-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.keys(trailer).map((key) => (
            <TrailerDetailsPanel key={key} title={key} details={trailer[key]} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrailerDetail;
