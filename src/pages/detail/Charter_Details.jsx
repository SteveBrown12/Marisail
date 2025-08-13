import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../../components/Loader";
import PropTypes from "prop-types";
import { varToScreen } from "../services/Charter_Search_Info";
import { detailStateType, varToDb } from "../services/Charter_Search_Info";
import { format as formatDate, parseISO, isValid } from "date-fns";

const apiUrl = import.meta.env.VITE_BACKEND_URL;
const URL = apiUrl + "/search_charter/";

const CharterDetailPanel = ({ title, details }) => {
  const formatDisplayValue = (value) => {
    if (value === null || value === undefined) return "";
    if (typeof value === "string") {
      const iso = parseISO(value);
      if (isValid(iso)) {
        const showsTime = value.includes("T") || value.includes(":");
        return formatDate(iso, showsTime ? "dd MMM yyyy HH:mm" : "dd MMM yyyy");
      }
      const d = new Date(value);
      if (isValid(d)) {
        const showsTime = value.includes("T") || value.includes(":");
        return formatDate(d, showsTime ? "dd MMM yyyy HH:mm" : "dd MMM yyyy");
      }
    }
    return value;
  };

  return (
    <div className="border rounded-lg shadow-sm bg-white mb-4">
      <div className="bg-gray-100 border-b px-4 py-2">
        <h6 className="font-semibold text-gray-800">
          {varToScreen[title]?.displayText}
        </h6>
      </div>
      <div className="p-4 overflow-x-auto">
        <table className="min-w-full border-collapse">
          <tbody>
            {Object.entries(details).map(([key, value]) => (
              <tr key={key} className="border-b last:border-none">
                <td className="pr-4 py-2 font-medium text-gray-700 whitespace-nowrap">
                  {varToScreen?.[key]?.displayText}:
                </td>
                <td className="py-2 text-gray-900">{formatDisplayValue(value)}</td>
              </tr>
            ))}
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
        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();

        Object.keys(trailer).forEach((key) => {
          Object.keys(trailer[key]).forEach((key2) => {
            const name = varToDb[key2];
            if (data.res[0][0] && data.res[0][0][name] !== undefined) {
              setTrailer((prevState) => ({
                ...prevState,
                [key]: {
                  ...prevState[key],
                  [key2]: data.res[0][0][name],
                },
              }));
            }
          });
        });

        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    if (id) fetchEngineDetails(id);
    else setLoading(false);
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (!trailer) return <p>No trailer details available.</p>;

  return (
    <div className="p-4">
      <div className="flex flex-wrap -mx-2">
        {Object.keys(trailer).map((key) => (
          <div key={key} className="w-full md:w-1/3 px-2">
            <CharterDetailPanel title={key} details={trailer[key]} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharterDetail;
