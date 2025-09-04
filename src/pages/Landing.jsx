"use client";
import { useEffect, useState } from "react";
import axios from "../utils/Axios_Config.js";

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
    <div className="absolute top-16 bottom-16 left-0 right-0 flex flex-col px-36 mx-auto text-center">
      {loading ? (
        <p className="text-gray-500">Loading sponsors...</p>
      ) : (
       <div className="grid grid-cols-6 gap-2 grow content-between">
          {sponsors.map((sponsor) => (
            <div key={sponsor.ID} className="flex flex-col items-center justify-center p-2">
              <div className="h-24 w-full flex items-center justify-center">
                <img
                  src={`${url}/uploads/${sponsor.Logo}`}
                  alt={sponsor.Company_Name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <p className="mt-2 text-sm text-gray-700 text-center truncate">
                {sponsor.Company_Name}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Landing;