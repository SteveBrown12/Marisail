import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import FormUtilities from './Form_Utilities';

const API_BASE = import.meta.env.VITE_BACKEND_URL;

export const usePriceLabel = (service_Name, service_Config, form_State, make_Model_Year_Keys) => {
  const [price_label, set_Price_Label] = useState("");
  const [price_label_loading, set_Price_Label_Loading] = useState(false);
  const prev_inputs_ref = useRef(null);

  useEffect(() => {
    let payload = null;
    let is_ready_to_calculate = false;
    const service_name_lower = String(service_Name || "").toLowerCase();

    // --- Logic to build payload for each service ---
    if (['trailer', 'boat', 'engine'].includes(service_name_lower)) {
        const asking_price_key = FormUtilities.findKeyForColumn(service_Config, "Asking_Price");
        if (make_Model_Year_Keys.make && make_Model_Year_Keys.model && make_Model_Year_Keys.year && asking_price_key) {
            const make = form_State[make_Model_Year_Keys.make]?.[0];
            const model = form_State[make_Model_Year_Keys.model]?.[0];
            const year = form_State[make_Model_Year_Keys.year]?.[0];
            const raw_price = form_State[asking_price_key];
            const askingPrice = Array.isArray(raw_price) ? raw_price[0] : raw_price?.value;
            
            if (make && model && year && askingPrice) {
                is_ready_to_calculate = true;
                payload = { make, model, year, askingPrice };
            }
        }
    } else if (service_name_lower === 'berth') {
        const length_key = FormUtilities.findKeyForColumn(service_Config, "Length");
        const beam_key = FormUtilities.findKeyForColumn(service_Config, "Beam");
        const price_pa_key = FormUtilities.findKeyForColumn(service_Config, "Price_PA");
        const price_pcm_key = FormUtilities.findKeyForColumn(service_Config, "Price_PCM");
        const price_pw_key = FormUtilities.findKeyForColumn(service_Config, "Price_PW");

        if (length_key && beam_key && price_pa_key && price_pcm_key && price_pw_key) {
            const length = form_State[length_key]?.value;
            const beam = form_State[beam_key]?.value;
            const pricePA = form_State[price_pa_key]?.[0];
            const pricePCM = form_State[price_pcm_key]?.[0];
            const pricePW = form_State[price_pw_key]?.[0];
            if (length && beam && (pricePA || pricePCM || pricePW)) {
                is_ready_to_calculate = true;
                payload = { length, beam, pricePA, pricePCM, pricePW };
            }
        }
    } else if (service_name_lower === 'charter') {
        const guest_capacity_key = FormUtilities.findKeyForColumn(service_Config, "Guest_Capacity");
        const summer_week_key = FormUtilities.findKeyForColumn(service_Config, "Summerrate_Per_Week");
        const winter_week_key = FormUtilities.findKeyForColumn(service_Config, "Winterrate_Per_week");
        const summer_night_key = FormUtilities.findKeyForColumn(service_Config, "Summerrate_Per_Night");
        const winter_night_key = FormUtilities.findKeyForColumn(service_Config, "Winterrate_Per_Night");
        const total_price_key = FormUtilities.findKeyForColumn(service_Config, "Total_Price");

        if (guest_capacity_key) {
            const guestCapacity = form_State[guest_capacity_key]?.[0];
            const summerRatePerWeek = form_State[summer_week_key]?.[0];
            const winterRatePerWeek = form_State[winter_week_key]?.[0];
            const summerRatePerNight = form_State[summer_night_key]?.[0];
            const winterRatePerNight = form_State[winter_night_key]?.[0];
            const totalPrice = form_State[total_price_key]?.[0];

            if (guestCapacity && (summerRatePerWeek || winterRatePerWeek || summerRatePerNight || winterRatePerNight || totalPrice)) {
                is_ready_to_calculate = true;
                payload = { guestCapacity, summerRatePerWeek, winterRatePerWeek, summerRatePerNight, winterRatePerNight, totalPrice };
            }
        }
    } else if (service_name_lower === 'transport') {
        const distance_key = FormUtilities.findKeyForColumn(service_Config, "Round_Trip_Distance");
        const quote_key = FormUtilities.findKeyForColumn(service_Config, "Quote_Value");
        if (distance_key && quote_key) {
            const roundTripDistance = form_State[distance_key]?.[0];
            const quoteValue = form_State[quote_key]?.[0];
            if (roundTripDistance && quoteValue) {
                is_ready_to_calculate = true;
                payload = { roundTripDistance, quoteValue };
            }
        }
    }

    if (JSON.stringify(payload) === JSON.stringify(prev_inputs_ref.current)) {
      return;
    }

    if (!is_ready_to_calculate) {
      set_Price_Label("");
      return;
    }

    const handler = setTimeout(() => {
      const fetch_price_label = async () => {
        set_Price_Label_Loading(true);
        try {
          const response = await axios.post(`${API_BASE}/advert/${service_Name}/calculate-price-label`, payload);
          if (response.data.ok) {
            set_Price_Label(response.data.price_label);
            prev_inputs_ref.current = payload;
          }
        } catch (error) {
          console.error("Price label fetch error:", error);
          set_Price_Label("");
        } finally {
          set_Price_Label_Loading(false);
        }
      };
      fetch_price_label();
    }, 500);

    return () => clearTimeout(handler);

  }, [form_State, service_Name, service_Config, make_Model_Year_Keys]);

  return { price_label, price_label_loading };
};

