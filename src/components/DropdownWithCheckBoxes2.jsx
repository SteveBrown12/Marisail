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
  open
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

  // Toggle dropdown
  const handleDropdownToggle = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      safeOnOpen(inputText, offSet);
    }
  };

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

  // Checkbox change
  const handleOptionChange = (value, e) => {
    e.stopPropagation();
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
    <div className="dropdown w-100">
      {/* Toggle Button */}
      <button
        className="btn btn-light dropdown-toggle w-100 text-start"
        type="button"
        onClick={handleDropdownToggle}
        aria-expanded={isOpen}
      >
        {title}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="dropdown-menu show w-100 p-3 shadow-lg border-0 rounded-3"
          style={{
            maxHeight: "280px",
            overflowY: "auto",
            backgroundColor: "#fff",
            scrollbarWidth: "thin",
            scrollbarColor: "#ccc transparent",
          }}
          ref={dropdownRef}
          onScroll={handleScroll}
        >
          {/* Search Box */}
          <input
            type="text"
            className="form-control mb-3 rounded-pill px-3"
            style={{ border: "1px solid #ddd" }}
            placeholder={
              defaultUnit ? `Search in ${defaultUnit}...` : "Search..."
            }
            value={inputText}
            onChange={handleInputChange}
          />

          <hr className="my-2" style={{ borderColor: "#eee" }} />

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
                <div
                  key={`${valueKey}-${idx}`}
                  className="dropdown-item px-auto py-2 rounded-2"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    transition: "background 0.2s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f0f0f0ff")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <Form.Check
                    type="checkbox"
                    id={`checkbox-${heading || "opt"}-${idx}`}
                    checked={isChecked}
                    onChange={(e) => handleOptionChange(valueKey, e)}
                    label={
                      <div className="d-flex justify-content-between align-items-center w-100">
                        <span className="ms-1">{valueKey}</span>
                        {option.occurrence_cnt !== undefined && (
                          <span
                            className="badge rounded-pill"
                            style={{
                              backgroundColor: "#f1f3f5",
                              color: "#333",
                              fontSize: "0.75rem",
                            }}
                          >
                            {option.occurrence_cnt}
                          </span>
                        )}
                      </div>
                    }
                    className="m-0 px-2 py-1"
                    style={{ flexGrow: 1 }}
                  />
                </div>
              );
            })
          ) : fetching ? (
            <Loader />
          ) : (
            <div className="text-muted text-center p-2">No options available</div>
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
