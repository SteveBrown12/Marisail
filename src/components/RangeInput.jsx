import PropTypes from "prop-types";
import { v4 as uuidv4 } from 'uuid';

const RangeInput = ({
  title,
  fromValue,
  toValue,
  setFromValue,
  setToValue,
  radioOptions,
  selectedRadio,
  onRadioChange,
  key2,
  isOpen,
  toggleAccordion,
}) => {
  const handleFromChange = (e) => {
    const value = e.target.value;
    if (!isNaN(value) || value === "") {
      setFromValue(value);
    }
  };

  const handleToChange = (e) => {
    const value = e.target.value;
    if (!isNaN(value) || value === "") {
      setToValue(value);
    }
  };

  const handleRadioChangeInternal = (value) => {
    onRadioChange(value);
  };

  return (
    <div className="custom-dropdown-container">
      <div
        className="custom-dropdown-header"
        onClick={toggleAccordion}
        aria-expanded={isOpen}
        aria-controls="dropdown-content"
        style={{ marginBottom: "10px" }}
      >
        <span>{title}</span>
        <span className={`dropdown-icon ${isOpen ? "open" : ""}`}>
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
              transform={isOpen ? "rotate(180 5 5)" : ""}
            />
          </svg>
        </span>
      </div>
      {isOpen && (
        <div>
          <input
            type="number"
            value={fromValue}
            onChange={handleFromChange}
            placeholder="From"
            style={{
              width: "65px",
              marginRight: "10px",
              padding: "8px 0px 8px 14px",
              margin: "0px 0 12px 0",
              display: "inline-block",
              border: "1px solid #fff",
              borderRadius: "4px",
              outline: "none",
              backgroundColor: "#f5f5f5",
            }}
          />
          <span style={{ marginRight: 8, marginLeft: 8 }}>-</span>
          <input
            style={{
              width: "65px",
              padding: "8px 0px 8px 14px",
              margin: "0px 0 12px 0",
              display: "inline-block",
              border: "1px solid #fff",
              borderRadius: "4px",
              outline: "none",
              backgroundColor: "#f5f5f5",
            }}
            type="number"
            value={toValue}
            onChange={handleToChange}
            placeholder="To"
          />
          {radioOptions.length > 0 && (
            <div
              className="btn-group"
              role="group"
              aria-label="Basic radio toggle button group"
              style={{
                border: "1px solid #ccc",
                borderRadius: "50px",
                justifyContent: "space-around",
                marginLeft: 10,
              }}
            >
              {radioOptions.map((option) => (
                <div key={uuidv4()}>
                  <input
                    data-attr={key2}
                    type="radio"
                    className="btn-check"
                    name={`btnradio-${key2}-${option.label}-${option.value}`}
                    id={`btnradio-${key2}-${option.label}-${option.value}`}
                    value={option.value}
                    onChange={(e) => handleRadioChangeInternal(e.target.value)}
                    checked={selectedRadio === option.value}
                    style={{ transform: "scale(0.8)" }}
                  />
                  <label
                    className="btn btn-outline-primary"
                    htmlFor={`btnradio-${key2}-${option.label}-${option.value}`}
                    style={{
                      fontSize: "12px",
                      padding: "4px 6px",
                      borderRadius: "10px",
                    }}
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

RangeInput.propTypes = {
  fromValue: PropTypes.string.isRequired,
  toValue: PropTypes.string.isRequired,
  setFromValue: PropTypes.func.isRequired,
  setToValue: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  selectedRadio: PropTypes.string,
  onRadioChange: PropTypes.func.isRequired,
  radioOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  key2: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggleAccordion: PropTypes.func.isRequired,
};

export default RangeInput;
