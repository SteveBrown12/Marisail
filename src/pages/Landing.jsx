"use client";
import { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";

const Landing = () => {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const res = await axios.get("/sponsor");
        setSponsors(res.data);
      } catch (error) {
        console.error("Error fetching sponsors", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSponsors();
  }, []);

  const url = import.meta.env.VITE_WEB_URL || "http://localhost:3001";

  return (
    <div className="p-6 mx-auto text-center">
      {loading ? (
        <p className="text-gray-500">Loading sponsors...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
          {sponsors.map((sponsor) => (
            <div
              key={sponsor.ID}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
            >
              {/* Top image */}
              <div className="h-64 flex items-center justify-center bg-gray-100 overflow-hidden">
                <img
                  src={`${url}/uploads/${sponsor.Logo}`}
                  alt={sponsor.Company_Name}
                  className="h-full w-auto max-w-full object-contain"
                />
              </div>

              {/* Description */}
              <div className="p-4 text-left">
                <h2 className="text-xl font-semibold">
                  {sponsor.Company_Name}
                </h2>
                <p className="text-gray-600 mt-2">
                  Payment: {sponsor.Payment} {sponsor.Currency}
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  {new Date(sponsor.Payment_Date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Landing;
