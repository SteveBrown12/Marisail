import PropTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";
import { conversions, convertUnit } from "../utils/Common_Functions";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { format as formatDate, parseISO, isValid } from "date-fns";
import { Loader } from "./Common_Utils";

export const RangeInput = ({
  title,
  min,
  max,
  valueFrom,
  valueTo,
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

  const effectiveFrom = valueFrom !== undefined ? valueFrom : "";
  const effectiveTo = valueTo !== undefined ? valueTo : "";

  const handleFromChange = (e) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    if (!isNaN(value) || value === "") {
      onChange(value, effectiveTo);
    }
  };

  const handleToChange = (e) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    if (!isNaN(value) || value === "") {
      onChange(effectiveFrom, value);
    }
  };

  const handleUnitChange = (unitValue) => {

    const convertedFrom =
      effectiveFrom !== ""
        ? Math.max(0, convertUnit(Number(effectiveFrom), selectedUnit, unitValue))
        : "";

    const convertedTo =
      effectiveTo !== ""
        ? Math.max(0, convertUnit(Number(effectiveTo), selectedUnit, unitValue))
        : "";

    setSelectedUnit(unitValue);

    if (typeof onChange === "function")
      onChange(convertedFrom, convertedTo);
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
        className="w-full flex justify-between items-center py-2 text-[17px] text-gray-900 font-medium transition"
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
            {/* From Input */}
            <input
              type="text"
              inputMode="numeric"
              value={effectiveFrom}
              onChange={handleFromChange}
              placeholder="From"
              className="w-[60px] px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:border-blue-400"
            />
            <span className="text-gray-300">–</span>
            {/* To Input */}
            <input
              type="text"
              inputMode="numeric"
              value={effectiveTo}
              onChange={handleToChange}
              placeholder="To"
              className="w-[60px] px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:border-blue-400"
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

RangeInput.propTypes = {
  title: PropTypes.string,
  min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  valueFrom: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  valueTo: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  radioOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
};


export const InputComponent = ({
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

  // Local state mirrors the controlled value
  const [localValue, setLocalValue] = useState(value || "");

  // Update local value whenever parent updates value
  useEffect(() => {
    onChange(value);
  }, [value]);

  const handleValueChange = (e) => {
    const newValue = e.target.value.replace(/[^0-9.]/g, "");
    if (!isNaN(newValue) || newValue === "") {
      setLocalValue(newValue);  
      if (typeof onChange === "function") onChange(newValue);
    }
  };

  const handleUnitChange = (unitValue) => {
    const convertedValue =
    localValue !== ""
        ? Math.max(0, convertUnit(Number(localValue), selectedUnit, unitValue))
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
        className="w-full flex justify-between items-center py-2 text-[17px] text-gray-900 font-medium transition"
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
              value={localValue}
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


export const TextComponent = ({
  title,
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  // Update local value whenever parent updates value
  useEffect(() => {
    onChange(value);
  }, [value]);  

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
        className="w-full flex justify-between items-center py-2 text-[17px] text-gray-900 font-medium transition"
      >
        <span className="truncate">
          {title}
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
      {isOpen && value && (
        <div className="w-full my-2 bg-white px-3">
            {value}
        </div>
      )}
    </div>
  );
};

TextComponent.propTypes = {
  title: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
};

export const DropdownWithCheckBoxes = ({
  defaultUnit,
  varToDb = {},
  heading,
  title,
  mandatory,
  options = [],
  // Backwards-compat props (simple API)
  selected,
  onChange,
  // Original API (grouped selections by heading)
  selectedOptions,
  setSelectedOptions,
  onOpen,
  fetching = false,
  open,
  advert,
  onAddOption
}) => {
  const [isOpen, setIsOpen] = useState(open);
  const [inputText, setInputText] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const dropdownRef = useRef(null);
  const [offSet, setOffSet] = useState(0);
  const safeOnOpen = typeof onOpen === "function" ? onOpen : () => {};

  // Determine selected values
  const selectedValues = Array.isArray(selected)
    ? selected
    : (heading &&
        selectedOptions &&
        Array.isArray(selectedOptions[heading])
        ? selectedOptions[heading]
        : []);

  // Scroll handler
  const handleScroll = () => {
    if (!dropdownRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = dropdownRef.current;
    if (scrollTop + clientHeight >= scrollHeight) {
      if (offSet <= filteredOptions.length) {
        setOffSet((prev) => prev + 20);
      }
    }
  };

  // Search input handler with filtering
  const handleInputChange = (e) => {
    const searchText = e.target.value;
    setOffSet(0);
    setInputText(searchText);

    if (searchText.trim() === "") {
      setFilteredOptions(options);
    } else {
      const lower = searchText.toLowerCase();
      setFilteredOptions(
        options.filter((opt) => {
          const valueKey =
            heading &&
            typeof opt === "object" &&
            opt &&
            varToDb[heading] &&
            opt[varToDb[heading]] != null
              ? opt[varToDb[heading]]
              : typeof opt === "string"
              ? opt
              : (opt && (opt.value ?? opt.label)) || "";
          return String(valueKey).toLowerCase().includes(lower);
        })
      );
    }
  };

  const handleOptionChange = (value, e) => {
    e.stopPropagation();

    if (advert) {
      // Single-select mode
      if (Array.isArray(selected) && typeof onChange === "function") {
        // Always replace the entire selection with only the clicked value
        onChange([value]);
        return;
      }
      if (typeof setSelectedOptions === "function" && heading) {
        setSelectedOptions((prev) => ({
          ...(prev || {}),
          [heading]: [value],
        }));
      }
      return;
    }

    // Multi-select mode (default)
    if (Array.isArray(selected) && typeof onChange === "function") {
      const exists = selected.includes(value);
      const updated = exists
        ? selected.filter((v) => v !== value)
        : [...selected, value];
      onChange(updated);
      return;
    }
    if (typeof setSelectedOptions === "function" && heading) {
      setSelectedOptions((prev) => {
        const currentSelections = (prev && prev[heading]) || [];
        const updatedSelections = currentSelections.includes(value)
          ? currentSelections.filter((item) => item !== value)
          : [...currentSelections, value];
        return {
          ...(prev || {}),
          [heading]: updatedSelections,
        };
      });
    }
  };

  const handleAddOption = () => {
    if (!inputText.trim()) return;

    const newValue = inputText.trim();
    const newOption = { value: newValue, count: 0 };

    // Prevent duplicates
    const exists = options.some(
      (opt) => (typeof opt === "object" ? opt.value : opt) === newValue
    );
    if (exists) return;

    // Call parent to update its options state
    if (typeof onAddOption === "function") {
      onAddOption(newOption);
    }

    // Also reflect locally so dropdown updates immediately
    const updatedOptions = [...options, newOption];
    setFilteredOptions(updatedOptions);

    // Select only the new option (single-select behavior for advert)
    if (Array.isArray(selected) && typeof onChange === "function") {
      onChange([newValue]);
    } else if (typeof setSelectedOptions === "function" && heading) {
      setSelectedOptions((prev) => ({
        ...(prev || {}),
        [heading]: [newValue],
      }));
    }

    // Clear input
    setInputText("");
  };


  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (isOpen) {
        safeOnOpen(inputText, offSet);
      }
    }, 500);
    return () => clearTimeout(debounceTimeout);
  }, [inputText, offSet, selectedOptions, isOpen]);

  useEffect(() => {
    if (inputText.trim() === "") {
      setFilteredOptions(options);
    }
  }, [options, inputText]);

  useEffect(() => {
    setIsOpen(!!open);
  }, [open]);

  return (
    <div
      className="dropdown w-full"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Toggle Button */}
      <button
        type="button"
        aria-expanded={isOpen}
        className="w-full flex justify-between items-center py-2 text-[17px] text-gray-900 font-medium transition"
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
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="w-full mt-2 bg-white p-3"
          style={{
            maxHeight: "280px",
            overflowY: "auto",
            scrollbarWidth: "thin",
            scrollbarColor: "#ccc transparent",
          }}
          ref={dropdownRef}
          onScroll={handleScroll}
        >
          {/* Search Box */}
          <input
            type="text"
            className="w-full mb-3 rounded-md px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:border-blue-400"
            placeholder={defaultUnit ? `Search in ${defaultUnit}...` : "Search..."}
            value={inputText}
            onChange={handleInputChange}
          />

          {/* Options */}
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, idx) => {
              const valueKey =
                heading &&
                typeof option === "object" &&
                option &&
                varToDb[heading] &&
                option[varToDb[heading]] != null
                  ? option[varToDb[heading]]
                  : typeof option === "string"
                  ? option
                  : (option && (option.value ?? option.label)) || String(idx);

              const isChecked = Array.isArray(selectedValues)
                ? selectedValues.includes(valueKey)
                : false;

              return (
                <label
                  key={`${valueKey}-${idx}`}
                  className="flex justify-between items-center px-2 py-1 rounded-md cursor-pointer hover:bg-gray-100 transition"
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={isChecked}
                      onChange={(e) => handleOptionChange(valueKey, e)}
                    />
                    <span>{valueKey}</span>
                  </div>
                  {/* // Requirement #1 - Dynamic Search Counts */}
                  {/* // Key Functionality #2 - Search - DYNAMIC SEARCH COUNTS Code */}
                  {option.count !== undefined && (
                    <span className="text-xs bg-gray-100 text-gray-800 rounded-full px-2">
                      {option.count}
                    </span>
                  )}
                </label>
              );
            })
          ) : fetching ? (
            <Loader />
          ) : advert && inputText.trim() && !options.includes(inputText.trim()) ? ( 
            <div
              className="text-gray-500 text-center p-2 cursor-pointer hover:bg-gray-100"
              onClick={handleAddOption}
            >
              Add {inputText}
            </div>  
          ) : (
            <div className="text-gray-500 text-center p-2">No options available</div>
          )}
        </div>
      )}
    </div>
  );
};

DropdownWithCheckBoxes.propTypes = {
  heading: PropTypes.string,
  title: PropTypes.string,
  options: PropTypes.array,
  selected: PropTypes.array,
  onChange: PropTypes.func,
  selectedOptions: PropTypes.object,
  setSelectedOptions: PropTypes.func,
  defaultUnit: PropTypes.string,
  onOpen: PropTypes.func,
  fetching: PropTypes.bool,
};



function toDate(val) {
  if (!val) return undefined;
  if (val instanceof Date) return isValid(val) ? val : undefined;
  if (typeof val === "string") {
    const d = parseISO(val);
    if (isValid(d)) return d;
    const d2 = new Date(val);
    return isValid(d2) ? d2 : undefined;
  }
  return undefined;
}

// ✅ Convert to MySQL DATETIME format
function toMySQL(val) {
  if (!val) return "";
  const d = toDate(val);
  if (!d) return "";
  return formatDate(d, "yyyy-MM-dd HH:mm:ss");
}

export function DateTimePickerField({
  value,
  onChange,
  placeholder = "dd MMM yyyy HH:mm",
  displayFormat = "dd MMM yyyy HH:mm",
  title = "Select Date & Time",
  mandatory = false,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // state for time
  const [time, setTime] = useState({ hours: "00", minutes: "00" });

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const selected = useMemo(() => toDate(value), [value]);

  const displayText = useMemo(() => {
    try {
      const d = toDate(value);
      return d ? formatDate(d, displayFormat) : "";
    } catch {
      return "";
    }
  }, [value, displayFormat]);

  const handleSelect = (sel) => {
    let d = toDate(sel);
    if (d) {
      d.setHours(parseInt(time.hours, 10));
      d.setMinutes(parseInt(time.minutes, 10));
    }
    onChange && onChange(d ? toMySQL(d) : "");
    setOpen(false);
  };

  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    setTime((prev) => ({ ...prev, [name]: value }));

    if (selected) {
      let d = new Date(selected);
      d.setHours(name === "hours" ? parseInt(value, 10) : parseInt(time.hours, 10));
      d.setMinutes(name === "minutes" ? parseInt(value, 10) : parseInt(time.minutes, 10));
      onChange && onChange(toMySQL(d));
    }
  };

  return (
    <div
      className="dropdown w-full"
      ref={ref}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Toggle Button */}
      <button
        type="button"
        aria-expanded={open}
        className="w-full flex justify-between items-center py-2 text-[17px] text-gray-900 font-medium transition"
      >
        <span className="truncate text-left">
          {title}
          {mandatory && <span className="text-red-500 ml-1">*</span>}
        </span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="w-full mt-2 bg-white p-3 space-y-4">
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={handleSelect}
            numberOfMonths={1}
            styles={{
              caption: { fontWeight: 600 },
              day_selected: { backgroundColor: "#0d6efd", color: "#fff" },
            }}
          />

          {/* Time Picker */}
          <div className="flex gap-2">
            <select
              name="hours"
              value={time.hours}
              onChange={handleTimeChange}
              className="border rounded px-2 py-1"
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={String(i).padStart(2, "0")}>
                  {String(i).padStart(2, "0")}
                </option>
              ))}
            </select>
            <span>:</span>
            <select
              name="minutes"
              value={time.minutes}
              onChange={handleTimeChange}
              className="border rounded px-2 py-1"
            >
              {Array.from({ length: 60 }, (_, i) => (
                <option key={i} value={String(i).padStart(2, "0")}>
                  {String(i).padStart(2, "0")}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

DateTimePickerField.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  displayFormat: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  title: PropTypes.string,
  mandatory: PropTypes.bool,
};

// ✅ Convert to ISO (yyyy-MM-dd)
function toISO(val) {
  if (!val) return "";
  const d = toDate(val);
  if (!d) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function DatePickerField({
  value,
  onChange,
  placeholder = "dd MMM yyyy",
  displayFormat = "dd MMM yyyy",
  title = "Select Date",
  mandatory = false,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const selected = useMemo(() => toDate(value), [value]);

  const displayText = useMemo(() => {
    try {
      const d = toDate(value);
      return d ? formatDate(d, displayFormat) : "";
    } catch {
      return "";
    }
  }, [value, displayFormat]);

  const handleSelect = (sel) => {
    const iso = toISO(sel);
    onChange && onChange(iso);
    setOpen(false);
  };

  return (
    <div
      className="dropdown w-full"
      ref={ref}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Toggle Button */}
      <button
        type="button"
        aria-expanded={open}
        className="w-full flex justify-between items-center py-2 text-[17px] text-gray-900 font-medium transition"
      >
        <span className="truncate text-left">
          {title}
          {mandatory && <span className="text-red-500 ml-1">*</span>}
        </span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="w-full mt-2 bg-white p-3">
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={handleSelect}
            numberOfMonths={1}
            styles={{
              caption: { fontWeight: 600 },
              day_selected: { backgroundColor: "#0d6efd", color: "#fff" },
            }}
          />
        </div>
      )}
    </div>
  );
}

DatePickerField.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  displayFormat: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  title: PropTypes.string,
  mandatory: PropTypes.bool,
};

export const AddressFinderComponent = ({
  title,
  mandatory,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const debounceRef = useRef(null);
  const suppressFetch = useRef(false);
  const dummyElement = document.createElement("div");
  // Fetch candidates and add postal code
  const fetchCandidates = (query) => {
    if (!window.google || !query) return;

    const service = new window.google.maps.places.PlacesService(dummyElement);
    const request = {
      query,
      type: "address",
      fields: ["name", "formatted_address", "geometry", "place_id"],
    };

    service.textSearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        const geocoder = new window.google.maps.Geocoder();

        const enhancedResults = results.map((place) => {
          return new Promise((resolve) => {
            geocoder.geocode({ placeId: place.place_id }, (geoResults, geoStatus) => {
              let postalCode = "";
              let streetNumber = "";
              let route = "";
              let locality = "";
              let administrativeArea = "";
              let country = "";
              let isStreetLevel = false;

              if (geoStatus === "OK" && geoResults[0]) {
                const components = geoResults[0].address_components;

                // Extract all address components
                streetNumber = components.find((c) => c.types.includes("street_number"))?.long_name || "";
                route = components.find((c) => c.types.includes("route"))?.long_name || "";
                locality = components.find((c) => c.types.includes("locality"))?.long_name || "";
                administrativeArea = components.find((c) => c.types.includes("administrative_area_level_1"))?.short_name || "";
                country = components.find((c) => c.types.includes("country"))?.short_name || "";
                postalCode = components.find((c) => c.types.includes("postal_code"))?.long_name || "";

                // Check if this is truly street-level (has both street number and route)
                isStreetLevel = !!(streetNumber && route);
              }

              resolve({
                ...place,
                postalCode,
                streetNumber,
                route,
                locality,
                administrativeArea,
                country,
                isStreetLevel
              });
            });
          });
        });

        Promise.all(enhancedResults).then((finalResults) => {
          setCandidates(finalResults);
        });
      } else {
        setCandidates([]);
      }
    });
  };

  // Debounced typing
  useEffect(() => {
    if (suppressFetch.current) {
      suppressFetch.current = false;
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      if (inputValue.length > 2) {
        fetchCandidates(inputValue);
      } else {
        setCandidates([]);
      }
    }, 400);
  }, [inputValue]);

  // When selecting a candidate
  const handleSelect = (place) => {
    if (place.geometry) {
      setInputValue(place.formatted_address || place.name);
      setCandidates([]); // hide dropdown
      suppressFetch.current = true;
      onSelect(place);
    }
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
        className="w-full flex justify-between items-center py-2 text-[17px] text-gray-900 font-medium transition"
      >
        <span className="truncate">
          {title}
          {mandatory && <span className="text-red-500 ml-1">*</span>}
        </span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
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
        <div className="p-4 flex flex-col gap-4 relative h-[300px]">
          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              placeholder="Enter address or postal/zip code"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => {
                if (inputValue.length > 2) fetchCandidates(inputValue);
              }}
              className="w-full p-2 border border-blue-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            {/* Candidate Dropdown */}
            {candidates.length > 0 && (
              <ul className="absolute z-50 bg-white border rounded shadow mt-1 w-full max-h-60 overflow-y-auto">
                {candidates.map((place, index) => (
                  <li
                    key={index}
                    onClick={() => handleSelect(place)}
                    className="p-2 cursor-pointer hover:bg-gray-100 border-b last:border-b-0"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {place.formatted_address}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {place.isStreetLevel && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded bg-green-100 text-green-800 mr-2">
                              Street Level
                            </span>
                          )}
                          {place.streetNumber && (
                            <span className="mr-2">
                              <strong>Number:</strong> {place.streetNumber}
                            </span>
                          )}
                          {place.route && (
                            <span className="mr-2">
                              <strong>Street:</strong> {place.route}
                            </span>
                          )}
                          {place.postalCode && (
                            <span className="mr-2">
                              <strong>Postal:</strong> {place.postalCode}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )
      }
    </div >
  );
};

AddressFinderComponent.propTypes = {
  title: PropTypes.string,
  mandatory: PropTypes.bool,
  onSelect: PropTypes.func,
};
