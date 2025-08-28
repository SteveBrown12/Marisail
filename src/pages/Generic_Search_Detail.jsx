import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import { format as formatDate, parseISO, isValid } from "date-fns";
import axios from "axios";
import image from "/images/engine.jpg";
import { Section_Positions } from "../utils/Section_Position";

const api_Url = import.meta.env.VITE_BACKEND_URL;

// Utility: format date/time values
const format_Display_Value = (value) => {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "string") {
    const parsed_Iso = parseISO(value);
    if (isValid(parsed_Iso)) {
      const shows_Time = value.includes("T") || value.includes(":");
      return formatDate(parsed_Iso, shows_Time ? "dd MMM yyyy HH:mm" : "dd MMM yyyy");
    }
    const date_Object = new Date(value);
    if (isValid(date_Object)) {
      const shows_Time = value.includes("T") || value.includes(":");
      return formatDate(date_Object, shows_Time ? "dd MMM yyyy HH:mm" : "dd MMM yyyy");
    }
  }
  return value;
};

// Requirement #3 - Detailed Search Results Page – Optimize Styling.
// Key Functionality #3 - Search - DETAILED RESULTS Code (Details Panels)
const GenericDetail = () => {
  const { serviceName: service_Name, id } = useParams();
  const [details, set_Details] = useState(null);
  const [loading, set_Loading] = useState(true);
  const [error, set_Error] = useState(null);

  useEffect(() => {
    const fetch_Details = async () => {
      try {
        const response = await axios.get(`${api_Url}/search/${service_Name}/details/${id}`);
        set_Details(response.data.data); // expecting an object
      } catch (error) {
        set_Error(error.message);
      } finally {
        set_Loading(false);
      }
    };

    if (service_Name && id) {
      fetch_Details();
    } else {
      set_Loading(false);
    }
  }, [service_Name, id]);

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
          .sort((entry_A, entry_B) => {
            const position_A =
              Section_Positions[service_Name]?.find(
                (table_Config) => table_Config.table_Name === entry_A[0]
              )?.position || 0;
            const position_B =
              Section_Positions[service_Name]?.find(
                (table_Config) => table_Config.table_Name === entry_B[0]
              )?.position || 0;
            return position_A - position_B;
          })
          .map(([table_Name, values_Object]) => (
            <div key={table_Name} className="p-4 w-full min-w-[380px] sm:max-w-[480px]">
              <h6 className="text-md font-semibold text-blue-500 uppercase tracking-wide mb-5">
                {table_Name.replace(/_/g, " ")}
              </h6>

              <div className="grid grid-cols-2 gap-y-2">
                {Object.entries(values_Object).map(([key, value]) => (
                  <React.Fragment key={key}>
                    <span className="font-semibold text-sm text-gray-900">
                      {key.replace(/_/g, " ")}:
                    </span>
                    <span className="text-sm text-gray-900">
                      {format_Display_Value(value)}
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