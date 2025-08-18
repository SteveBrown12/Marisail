import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import { format as formatDate, parseISO, isValid } from "date-fns";
import axios from "axios";
import image from "/images/engine.jpg"

const apiUrl = import.meta.env.VITE_BACKEND_URL;

// Utility: format date/time values
const formatDisplayValue = (value) => {
  if (value === null || value === undefined || value === "") return "—";
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

// Requirement #3 - Detailed Search Results Page – Optimize Styling.
// Key Functionality #3 - Search - DETAILED RESULTS Code (Details Panels)
const GenericDetail = () => {
  const { serviceName, id } = useParams();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get(`${apiUrl}/search/${serviceName}/details/${id}`);
        setDetails(res.data.data); // expecting an object
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
  if (!details || Object.keys(details).length === 0) return <p>No details available.</p>;
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Image Section */}
      <div className="mb-6 rounded-2xl overflow-hidden shadow-md">
        <img
          src={image}
          alt="Detail Preview"
          className="w-full h-64 md:h-80 object-cover"
        />
      </div>
        
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(details).map(([key, value]) => (
          <div
            key={key}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 p-4 border border-gray-100"
          >
            <h6 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              {key.replace(/_/g, " ")}
            </h6>
            <p className="text-gray-900 text-sm font-medium break-words">
              {formatDisplayValue(value)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GenericDetail;
