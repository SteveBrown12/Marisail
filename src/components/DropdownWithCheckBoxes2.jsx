import { useState, useEffect, useRef } from "react";
import { Form } from "react-bootstrap";
import PropTypes from "prop-types";
import { Loader } from "rsuite";

const DropdownWithCheckBoxes = ({
  defaultUnit,
  varToDb = {},
  heading,
  title,
  options = [],
  // Backwards-compat props (simple API)
  selected,
  onChange,
  // Original API (grouped selections by heading)
  selectedOptions,
  setSelectedOptions,
  onOpen,
  fetching = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const dropdownRef = useRef(null); // Ref for the scrollable container
  const [offSet, setOffSet] = useState(0);
  const safeOnOpen = typeof onOpen === "function" ? onOpen : () => {};

  // Determine selected values and setter behavior
  const selectedValues = Array.isArray(selected)
    ? selected
    : (heading && selectedOptions && Array.isArray(selectedOptions[heading])
        ? selectedOptions[heading]
        : []);

  // Toggle dropdown visibility
  const handleDropdownToggle = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      console.log("call from dropdowntoggle");
      safeOnOpen(inputText, offSet); // Call onOpen when the dropdown is opened
    }
  };

  const handleScroll = () => {
    if (!dropdownRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = dropdownRef.current;

    // Detect if the user has scrolled to the bottom
    if (scrollTop + clientHeight >= scrollHeight) {
      if (offSet <= filteredOptions.length) {
        setOffSet((prev) => prev + 20);
      }
      // console.log("Scrolled to the end");
    }
  };

  // Handle search input
  const handleInputChange = (e) => {
    const searchText = e.target.value;
    setOffSet(0);
    setInputText(searchText);
  };

  // Handle checkbox selection
  const handleOptionChange = (value, e) => {
    e.stopPropagation(); // Stop event propagation to prevent dropdown from closing
    // If simple API is provided
    if (Array.isArray(selected) && typeof onChange === "function") {
      const exists = selected.includes(value);
      const updated = exists
        ? selected.filter((v) => v !== value)
        : [...selected, value];
      onChange(updated);
      return;
    }

    // Fallback to grouped API (requires heading)
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
  // console.log(heading);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (isOpen) {
        console.log("call from ");
        safeOnOpen(inputText, offSet);
      }
    }, 500);

    return () => clearTimeout(debounceTimeout); // Cleanup on re-renders
  }, [inputText, offSet, selectedOptions, isOpen]); // Depend on `inputText` and `isOpen`

  // Update filtered options when the options prop changes
  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);
  return (
    <div className="custom-dropdown-container">
      {/* Dropdown Header */}
      <div
        className="custom-dropdown-header"
        onClick={handleDropdownToggle}
        aria-expanded={isOpen}
        aria-controls="dropdown-content"
        style={{ marginBottom: "10px", cursor: "pointer" }}
      >
        {title}

        <span
          className={`dropdown-icon ${isOpen ? "open" : ""}`}
          style={{
            display: "inline-block",
            transition: "transform 0.3s ease-in-out",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 3 L5 7 L9 3"
              fill="none"
              stroke="black"
              strokeWidth="1.5"
            />
          </svg>
        </span>
      </div>

      {/* Dropdown Content */}
      {isOpen && (
        <div>
          {/* Search Input */}
          {/* {options.length > 5 && ( */}
          <input
            type="text"
            placeholder={
              defaultUnit ? `Search in ${defaultUnit}...` : "Search..."
            }
            value={inputText}
            onChange={handleInputChange}
            style={{
              width: "100%",
              padding: "8px 14px",
              margin: "0 0 12px 0",
              border: "1px solid #ccc",
              borderRadius: "4px",
              outline: "none",
              backgroundColor: "#f5f5f5",
            }}
          />
          {/* // )} */}

          {/* Options List */}
          <div id="dropdown-content" className="custom-dropdown-content">
            <div
              className="custom-dropdown-options"
              ref={dropdownRef}
              onScroll={handleScroll}
            >
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, idx) => {
                  const valueKey =
                    heading && typeof option === "object" && option && varToDb[heading] && option[varToDb[heading]] != null
                      ? option[varToDb[heading]]
                      : (typeof option === "string"
                          ? option
                          : (option && (option.value ?? option.label)) || String(idx));

                  const isChecked = Array.isArray(selectedValues)
                    ? selectedValues.includes(valueKey)
                    : false;

                  return (
                  <div
                    key={`${valueKey}-${idx}`}
                    className="custom-dropdown-option"
                    onClick={(e) => e.stopPropagation()} // Prevent clicks on the option from closing the dropdown
                    style={{
                      display: "flex", // Use flexbox
                      justifyContent: "space-between", // Align content to be spaced out
                      alignItems: "center", // Vertically center the items
                      padding: "8px 10px", // Add some padding around the option
                      borderBottom: "1px solid #ccc", // Optional: to separate options with a thin line
                    }}
                  >
                    <Form.Check
                      type="checkbox"
                      id={`checkbox-${heading || 'opt'}-${idx}`}
                      label={valueKey}
                      checked={isChecked}
                      onChange={(e) => handleOptionChange(valueKey, e)}
                      style={{ flexGrow: 1 }} // Allow label to take available space
                    />

                    {/* Count badge */}
                    <span
                      className="count-badge"
                      style={{
                        // background: "#007BFF",
                        color: "rgb(87, 84, 84)",
                        padding: "5px 12px",
                        borderRadius: "15px",
                        fontSize: "14px",
                        fontWeight: "600",
                        marginLeft: "10px", // Space between checkbox and badge
                        whiteSpace: "nowrap", // Prevent badge text from wrapping
                      }}
                    >
                      {option && option["occurrence_cnt"]}
                    </span>
                  </div>
                  );
                })
              ) : fetching ? (
                <Loader />
              ) : (
                <div className="custom-dropdown-no-results">
                  No options available
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Prop Types Validation
DropdownWithCheckBoxes.propTypes = {
  heading: PropTypes.string,
  title: PropTypes.string,
  options: PropTypes.array,
  // Simple API
  selected: PropTypes.array,
  onChange: PropTypes.func,
  // Grouped API
  selectedOptions: PropTypes.object,
  setSelectedOptions: PropTypes.func,
  defaultUnit: PropTypes.string,
  onOpen: PropTypes.func,
  fetching: PropTypes.bool,
};

export default DropdownWithCheckBoxes;
