// src/pages/GenericDetail.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import { format as formatDate, parseISO, isValid } from "date-fns";
import axios from "axios";

const apiUrl = import.meta.env.VITE_BACKEND_URL;

// Utility: format date/time values
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

const GenericDetail = () => {
  const { serviceName, id } = useParams();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get(`${apiUrl}/search/${serviceName}/details/${id}`);
        setSections(res.data); // axios automatically parses JSON
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (serviceName && id) {
      fetchDetails();
    } else {
      setLoading(false);
    }
  }, [serviceName, id]);

  if (loading) return <Loader />;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (!sections || sections.length === 0) return <p>No details available.</p>;

  return (
    <div className="p-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
        {sections.map((section, i) => (
          <div
            key={i}
            className="border border-gray-300 rounded-md shadow-sm mb-4 bg-white"
          >
            <div className="bg-gray-100 px-3 py-2 border-b border-gray-300">
              <h6 className="text-base font-semibold text-gray-800">
                {section.title}
              </h6>
            </div>
            <div className="p-3 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <tbody>
                  {Object.entries(section.details).map(([key, value]) => (
                    <tr
                      key={key}
                      className="border-b border-gray-200 last:border-none"
                    >
                      <td className="pr-4 py-1 font-semibold text-gray-700 align-top w-1/3">
                        {key}:
                      </td>
                      <td className="py-1 text-gray-800">
                        {formatDisplayValue(value)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GenericDetail;
