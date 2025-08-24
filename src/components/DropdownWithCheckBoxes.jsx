import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Loader } from "rsuite";

const DropdownWithCheckBoxes = ({
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

export default DropdownWithCheckBoxes;
