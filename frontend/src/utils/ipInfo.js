import axios from "axios";

const IPINFO_KEY = import.meta.env.VITE_IPINFO_API_KEY;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
export async function initIPInfo() {
  // If already in localStorage, don't fetch again
  // const cached = localStorage.getItem("ipInfo");
  // if (cached) return JSON.parse(cached);

  try {
    const geoRes = await axios.get(
      `https://api.ipinfo.io/lite/me?token=${IPINFO_KEY}`
    );

    const { country_code } = geoRes.data;

    const res = await axios.post(`${BACKEND_URL}/home/ipinfo`, { country_code });

    const data = {
      country: res.data.result.Country,
      countryCode: res.data.result.Country_Code,
      language: res.data.result.Language.split("/")[0].trim(),
      currency: res.data.result.Currency.split("/")[0].trim(),
      currencySymbol: res.data.result.Currency_Symbol.split(",")[0].trim(),
    };

    localStorage.setItem("ipInfo", JSON.stringify(data));
    return data;
  } catch (error) {
    console.error("Error fetching IPInfo", error);
    return null;
  }
}
