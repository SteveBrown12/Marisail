import { useState, useEffect, useRef } from "react";
import { Form } from "react-bootstrap";
import PropTypes from "prop-types";
import { Loader } from "rsuite";

const DropdownWithCheckBoxes = ({
  defaultUnit,
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
  const dropdownRef = useRef(null);
  const [offSet, setOffSet] = useState(0);

  const handleDropdownToggle = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      console.log("📥 Open dropdown for:", heading);
      onOpen(inputText, offSet);
    }
  };

  const handleScroll = () => {
    if (!dropdownRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = dropdownRef.current;
    if (scrollTop + clientHeight >= scrollHeight) {
      if (offSet <= filteredOptions.length) {
        setOffSet((prev) => prev + 20);
      }
    }
  };

  const handleInputChange = (e) => {
    const searchText = e.target.value;
    setOffSet(0);
    setInputText(searchText);
  };

  const handleOptionChange = (option, e) => {
    e.stopPropagation();
    setSelectedOptions((prev) => {
      const currentSelections = prev[heading] || [];
      const updatedSelections = currentSelections.includes(option)
        ? currentSelections.filter((item) => item !== option)
        : [...currentSelections, option];

      return {
        ...prev,
        [heading]: updatedSelections,
      };
    });
  };

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (isOpen) {
        onOpen(inputText, offSet);
      }
    }, 500);
    return () => clearTimeout(debounceTimeout);
  }, [inputText, offSet, selectedOptions]);

  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);

  return (
    <div className="custom-dropdown-container">
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
          <svg width="10" height="10" viewBox="0 0 10 10">
            <path d="M1 3 L5 7 L9 3" fill="none" stroke="black" strokeWidth="1.5" />
          </svg>
        </span>
      </div>

      {isOpen && (
        <div>
          <input
            type="text"
            placeholder={defaultUnit ? `Search in ${defaultUnit}...` : "Search..."}
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

          <div id="dropdown-content" className="custom-dropdown-content">
            <div
              className="custom-dropdown-options"
              ref={dropdownRef}
              onScroll={handleScroll}
            >
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    className="custom-dropdown-option"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px 10px",
                      borderBottom: "1px solid #ccc",
                    }}
                  >
                    <Form.Check
                      type="checkbox"
                      id={`checkbox-${option.value}`}
                      label={option.value}
                      checked={
                        selectedOptions[heading]?.includes(option.value) || false
                      }
                      onChange={(e) => handleOptionChange(option.value, e)}
                      style={{ flexGrow: 1 }}
                    />
                    <span
                      className="count-badge"
                      style={{
                        color: "rgb(87, 84, 84)",
                        padding: "5px 12px",
                        borderRadius: "15px",
                        fontSize: "14px",
                        fontWeight: "600",
                        marginLeft: "10px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {option.occurrence_cnt}
                    </span>
                  </div>
                ))
              ) : fetching ? (
                <Loader />
              ) : (
                <div className="custom-dropdown-no-results">No options available</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

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
