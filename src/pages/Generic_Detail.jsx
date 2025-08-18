import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import { format as formatDate, parseISO, isValid } from "date-fns";
import axios from "axios";
import image from "/images/engine.jpg"
import {Section_Positions} from "../utils/Section_Position";

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
    <div className="p-6 mx-auto flex justify-center items-center">
      {/* Image Section */}
      {/* <div className="mb-6 rounded-2xl overflow-hidden shadow-md">
        <img
          src={image}
          alt="Detail Preview"
          className="w-full h-64 md:h-80 object-cover"
        />
      </div> */}
        
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex justify-items-center">
        {Object.entries(details)
          .sort((a, b) => {
            const posA =
              Section_Positions[serviceName]?.find(
                (t) => t.table_Name === a[0]
              )?.position || 0;
            const posB =
              Section_Positions[serviceName]?.find(
                (t) => t.table_Name === b[0]
              )?.position || 0;
            return posA - posB;
          })
          .map(([tableName, valuesObject]) => (
            <div key={tableName} className="p-4 w-full min-w-[380px] sm:max-w-[480px]">
              <h6 className="text-md font-semibold text-blue-500 uppercase tracking-wide mb-5">
                {tableName.replace(/_/g, " ")}
              </h6>

              <div className="grid grid-cols-2 gap-y-2">
                {Object.entries(valuesObject).map(([key, value]) => (
                  <React.Fragment key={key}>
                    <span className="font-semibold text-sm text-gray-900">
                      {key.replace(/_/g, " ")}:
                    </span>
                    <span className="text-sm text-gray-900">
                      {formatDisplayValue(value)}
                    </span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default GenericDetail;
