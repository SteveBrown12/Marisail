import PropTypes from "prop-types";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { conversions, convertUnit } from "../utils/common_functions";

const InputComponent = ({
  title,
  min,
  max,
  value,
  onChange,
  radioOptions,
  mandatory,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(() => {
    const firstValue = radioOptions?.[0]?.value;
    if (!firstValue) return "";
    const lower = firstValue.toLowerCase();
    return conversions[lower]?.defaultUnit || firstValue;
  });

  const effectiveValue = value !== undefined ? value : "";

  const handleValueChange = (e) => {
    const newValue = e.target.value.replace(/[^0-9.]/g, "");
    if (!isNaN(newValue) || newValue === "") {
      if (typeof onChange === "function") onChange(newValue);
    }
  };

  const handleUnitChange = (unitValue) => {
    const convertedValue =
      effectiveValue !== ""
        ? Math.max(0, convertUnit(Number(effectiveValue), selectedUnit, unitValue))
        : "";

    setSelectedUnit(unitValue);

    if (typeof onChange === "function") onChange(convertedValue);
  };

  return (
    <div
      className="dropdown w-full"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Toggle */}
      <button
        type="button"
        aria-expanded={isOpen}
        className="w-full flex justify-between items-center py-2 text-[15px] text-gray-900 font-medium transition"
      >
        <span className="truncate">
          {title}
          {mandatory && <span className="text-red-500 ml-1">*</span>}
        </span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Content */}
      {isOpen && (
        <div className="w-full mt-2 bg-white p-3">
          <div className="flex items-center gap-2">
            {/* Single Input */}
            <input
              type="text"
              inputMode="numeric"
              value={effectiveValue}
              onChange={handleValueChange}
              placeholder="Value"
              className="w-[200px] px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:border-blue-400"
            />

            {/* Radio Options Inline */}
            {Array.isArray(radioOptions) && radioOptions.length > 0 && (
              <div className="flex border border-gray-300 rounded-full overflow-hidden ml-2">
                {radioOptions.map((option) => (
                  <label
                    key={uuidv4()}
                    className={`px-3 py-1 text-sm cursor-pointer transition ${
                      selectedUnit === option.value.toLowerCase()
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <input
                      type="radio"
                      value={option.value.toLowerCase()}
                      checked={selectedUnit === option.value.toLowerCase()}
                      onChange={() => handleUnitChange(option.value.toLowerCase())}
                      className="hidden"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

InputComponent.propTypes = {
  title: PropTypes.string,
  min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  radioOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  mandatory: PropTypes.bool,
};

export default InputComponent;
