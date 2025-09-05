import axios from "../utils/Axios_Config";
import { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    title: "",
    landline: "",
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    privateTrade: "",
    personalRole: "",
    companyName: "",
    companyType: "",
    country: "",
    state: "",
    city: "",
    address1: "",
    address2: "",
    address3: "",
    postcode: "",
  });

  const [errors, setErrors] = useState({
    title: "",
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    privateTrade: "",
    country: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    let valid = true;
    const newErrors = {
      title: "",
      firstName: "",
      lastName: "",
      mobile: "",
      email: "",
      privateTrade: "",
      country: "",
    };

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
      valid = false;
    }
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First Name is required";
      valid = false;
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last Name is required";
      valid = false;
    }
    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile is required";
      valid = false;
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    }
    if (!formData.privateTrade.trim()) {
      newErrors.privateTrade = "Private Trade is required";
      valid = false;
    }
    if (!formData.country.trim()) {
      newErrors.country = "Country is required";
      valid = false;
    }


    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return; // stop if validation fails

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/contact`,
        formData,
      );
      setErrors({
        title: "",
        firstName: "",
        lastName: "",
        mobile: "",
        email: "",
        privateTrade: "",
        country: "",
      });
    } catch (error) {
      console.error("Error submitting contact information:", error);
      alert("Error submitting contact information");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 w-full container max-w-5xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          My Contact
        </h2>

        {/* Title + Email */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder=""
              className="w-full border rounded-lg p-4 focus:ring focus:ring-blue-300"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@mail.com"
              className="w-full border rounded-lg p-4 focus:ring focus:ring-blue-300"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>
        </div>

        {/* First Name + Last Name */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="John"
              className="w-full border rounded-lg p-4 focus:ring focus:ring-blue-300"
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm">{errors.firstName}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Done"
              className="w-full border rounded-lg p-4 focus:ring focus:ring-blue-300"
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Landline + Mobile */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Landline
            </label>
            <input
              type="number"
              name="landline"
              value={formData.landline}
              onChange={handleChange}
              className="w-full border rounded-lg p-4 focus:ring focus:ring-blue-300 
             [&::-webkit-outer-spin-button]:appearance-none 
             [&::-webkit-inner-spin-button]:appearance-none 
             [appearance:textfield]"
            />
            {errors.landline && (
              <p className="text-red-500 text-sm">{errors.landline}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Mobile
            </label>
            <input
              type="number"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full border rounded-lg p-4 focus:ring focus:ring-blue-300 
             [&::-webkit-outer-spin-button]:appearance-none 
             [&::-webkit-inner-spin-button]:appearance-none 
             [appearance:textfield]"
            />
            {errors.mobile && (
              <p className="text-red-500 text-sm">{errors.mobile}</p>
            )}
          </div>
        </div>

        {/* Private Trade + Personal Role */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Private Trade
            </label>
            <input
              type="text"
              name="privateTrade"
              value={formData.privateTrade}
              onChange={handleChange}
              className="w-full border rounded-lg p-4 focus:ring focus:ring-blue-300"
            />
            {errors.privateTrade && (
              <p className="text-red-500 text-sm">{errors.privateTrade}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Personal Role
            </label>
            <input
              type="text"
              name="personalRole"
              value={formData.personalRole}
              onChange={handleChange}
              className="w-full border rounded-lg p-4 focus:ring focus:ring-blue-300"
            />
            {errors.personalRole && (
              <p className="text-red-500 text-sm">{errors.personalRole}</p>
            )}
          </div>
        </div>

        {/* Company Name + Company Type */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Company Name
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full border rounded-lg p-4 focus:ring focus:ring-blue-300"
            />
            {errors.companyName && (
              <p className="text-red-500 text-sm">{errors.companyName}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Company Type
            </label>
            <select
              name="companyType"
              value={formData.companyType}
              onChange={handleChange}
              className="w-full border rounded-lg p-4 focus:ring focus:ring-blue-300"
            >
              <option value="">Select</option>
              {[
                "Broker",
                "Marina",
                "Boatyard",
                "Shipyard",
                "Sailing Club",
                "Recruiter",
                "Job Applicant",
                "Marine Retail(B2C)",
                "Marine Wholesale(B2B)",
                "Docks",
                "Marine Survey",
                "Boat Builder",
                "Marine Engineering",
                "Haulage, Transport, Logistics",
                "Berths",
                "Marine Chandlery",
              ].map((companyType) => (
                <option key={companyType} value={companyType}>
                  {companyType}
                </option>
              ))}
            </select>
            {errors.companyType && (
              <p className="text-red-500 text-sm">{errors.companyType}</p>
            )}
          </div>
        </div>

        {/*country inpur, state input, city input, postcode input, address1, address2, address3 input */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Country
            </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full border rounded-lg p-4 focus:ring focus:ring-blue-300"
            />
            {errors.country && (
              <p className="text-red-500 text-sm">{errors.country}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              State
            </label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full border rounded-lg p-4 focus:ring focus:ring-blue-300"
            />
            {errors.state && (
              <p className="text-red-500 text-sm">{errors.state}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              City
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full border rounded-lg p-4 focus:ring focus:ring-blue-300"
            />
            {errors.city && (
              <p className="text-red-500 text-sm">{errors.city}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Postcode
              </label>
              <input
                type="text"
                name="postcode"
                value={formData.postcode}
                onChange={handleChange}
                className="w-full border rounded-lg p-4 focus:ring focus:ring-blue-300"
              />
              {errors.postcode && (
                <p className="text-red-500 text-sm">{errors.postcode}</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Address 1
            </label>
            <input
              type="text"
              name="address1"
              value={formData.address1}
              onChange={handleChange}
              className="w-full border rounded-lg p-4 focus:ring focus:ring-blue-300"
            />
            {errors.address1 && (
              <p className="text-red-500 text-sm">{errors.address1}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Address 2
            </label>
            <input
              type="text"
              name="address2"
              value={formData.address2}
              onChange={handleChange}
              className="w-full border rounded-lg p-4 focus:ring focus:ring-blue-300"
            />
            {errors.address2 && (
              <p className="text-red-500 text-sm">{errors.address2}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Address 3
            </label>
            <input
              type="text"
              name="address3"
              value={formData.address3}
              onChange={handleChange}
              className="w-full border rounded-lg p-4 focus:ring focus:ring-blue-300"
            />
            {errors.address3 && (
              <p className="text-red-500 text-sm">{errors.address3}</p>
            )}
          </div>
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

export default Contact;
