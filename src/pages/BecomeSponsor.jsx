import axios from "../utils/axiosConfig";
import { useState } from "react";

const BecomeSponsor = () => {
  const [formData, setFormData] = useState({
    contactName: "",
    companyName: "",
    paymentValue: "",
    currency: "",
    paymentDate: "",
    logo: null,
  });

  const [errors, setErrors] = useState({
    contactName: "",
    companyName: "",
    paymentValue: "",
    currency: "",
    paymentDate: "",
    logo: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validate = () => {
    let valid = true;
    const newErrors = {
      contactName: "",
      companyName: "",
      paymentValue: "",
      currency: "",
      paymentDate: "",
      logo: "",
    };

    if (!formData.contactName.trim()) {
      newErrors.contactName = "Contact Name is required";
      valid = false;
    }
    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company Name is required";
      valid = false;
    }
    if (!formData.paymentValue.trim()) {
      newErrors.paymentValue = "Payment Value is required";
      valid = false;
    }
    if (!formData.currency.trim()) {
      newErrors.currency = "Currency is required";
      valid = false;
    }
    if (!formData.paymentDate.trim()) {
      newErrors.paymentDate = "Payment Date is required";
      valid = false;
    }
    if (!formData.logo) {
      newErrors.logo = "Company Logo is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return; // stop if validation fails

    const data = new FormData();
    data.append("Contact_Name", formData.contactName);
    data.append("Company_Name", formData.companyName);
    data.append("Payment_Value", formData.paymentValue);
    data.append("Currency", formData.currency);
    data.append("Payment_Date", formData.paymentDate);
    if (formData.logo) data.append("Logo", formData.logo);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/sponsor`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      alert("Sponsor submitted successfully!");
      setFormData({
        contactName: "",
        companyName: "",
        paymentValue: "",
        currency: "",
        paymentDate: "",
        logo: null,
      });
      setErrors({
        contactName: "",
        companyName: "",
        paymentValue: "",
        currency: "",
        paymentDate: "",
        logo: "",
      });
    } catch (error) {
      console.error("Error submitting sponsor:", error);
      alert("Error submitting sponsor");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 w-full container max-w-5xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Become a Sponsor
        </h2>
        {/* Contact Name + Company Name */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Contact Name
            </label>
            <input
              type="text"
              name="contactName"
              value={formData.contactName}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full border rounded-lg p-4 focus:ring focus:ring-blue-300"
            />
            {errors.contactName && (
              <p className="text-red-500 text-sm">{errors.contactName}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Company Name
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="ABC Ltd."
              className="w-full border rounded-lg p-4 focus:ring focus:ring-blue-300"
            />
            {errors.companyName && (
              <p className="text-red-500 text-sm">{errors.companyName}</p>
            )}
          </div>
        </div>

        {/* Payment Value + Currency */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Payment Value
            </label>
            <input
              type="number"
              name="paymentValue"
              value={formData.paymentValue}
              onChange={handleChange}
              placeholder="1000"
              className="w-full border rounded-lg p-4 focus:ring focus:ring-blue-300"
            />
            {errors.paymentValue && (
              <p className="text-red-500 text-sm">{errors.paymentValue}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Currency
            </label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="w-full border rounded-lg p-4 focus:ring focus:ring-blue-300"
            >
              <option value="">Select</option>
              {[
                "USD",
                "EUR",
                "PKR",
                "GBP",
                "JPY",
                "AUD",
                "CAD",
                "CHF",
                "CNY",
                "INR",
                "SGD",
                "NZD",
              ].map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
            {errors.currency && (
              <p className="text-red-500 text-sm">{errors.currency}</p>
            )}
          </div>
        </div>

        {/* Payment Date */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Payment Date
          </label>
          <input
            type="date"
            name="paymentDate"
            value={formData.paymentDate}
            onChange={handleChange}
            className="w-full border rounded-lg p-4 focus:ring focus:ring-blue-300"
          />
          {errors.paymentDate && (
            <p className="text-red-500 text-sm">{errors.paymentDate}</p>
          )}
        </div>

        {/* Company Logo */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Company Logo
          </label>
          <input
            type="file"
            name="logo"
            accept="image/*"
            onChange={handleChange}
            className="w-full border rounded-lg p-4 bg-gray-50"
          />
          {errors.logo && <p className="text-red-500 text-sm">{errors.logo}</p>}
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default BecomeSponsor;
