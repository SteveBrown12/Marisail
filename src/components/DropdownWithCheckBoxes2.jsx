import { useState, useEffect, useRef } from "react";
import { Form } from "react-bootstrap";
import PropTypes from "prop-types";
import { Loader } from "rsuite";

const DropdownWithCheckBoxes = ({
  defaultUnit,
  varToDb,
  heading,
  title,
  options,
  selectedOptions,
  setSelectedOptions,
  onOpen,
  fetching,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const dropdownRef = useRef(null); // Ref for the scrollable container
  const [offSet, setOffSet] = useState(0);

  // Toggle dropdown visibility
  const handleDropdownToggle = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      console.log("call from dropdowntoggle");
      onOpen(inputText, offSet); // Call onOpen when the dropdown is opened
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
  const handleOptionChange = (option, e) => {
    e.stopPropagation(); // Stop event propagation to prevent dropdown from closing
    setSelectedOptions((prev) => {
      const currentSelections = prev[heading] || [];
      const updatedSelections = currentSelections.includes(option)
        ? currentSelections.filter((item) => item !== option) // Remove if already selected
        : [...currentSelections, option]; // Add if not selected

      return {
        ...prev,
        [heading]: updatedSelections,
      };
    });
  };
  // console.log(heading);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (isOpen) {
        console.log("call from ");
        onOpen(inputText, offSet);
      }
    }, 500);

    return () => clearTimeout(debounceTimeout); // Cleanup on re-renders
  }, [inputText, offSet, selectedOptions]); // Depend on `inputText` and `onOpen`

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
                filteredOptions.map((option) => (
                  <div
                    key={option[varToDb[heading]]}
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
                      id={`checkbox-${option[varToDb[heading]]}`}
                      label={option[varToDb[heading]]}
                      checked={
                        selectedOptions[heading]?.includes(
                          option[varToDb[heading]]
                        ) || false
                      }
                      onChange={(e) =>
                        handleOptionChange(option[varToDb[heading]], e)
                      }
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
                      {option["occurrence_cnt"]}
                    </span>
                  </div>
                ))
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
  heading: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedOptions: PropTypes.object.isRequired,
  setSelectedOptions: PropTypes.func.isRequired,
  defaultUnit: PropTypes.string,
  onOpen: PropTypes.func.isRequired,
  fetching: PropTypes.bool.isRequired,
};

export default DropdownWithCheckBoxes;
