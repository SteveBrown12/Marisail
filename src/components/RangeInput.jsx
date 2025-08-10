import PropTypes from "prop-types";
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';

const RangeInput = ({
  // Common/simple API (used by Generic_Search)
  title = "Range",
  min,
  max,
  valueFrom,
  valueTo,
  onChange,

  // Back-compat API (legacy callers)
  fromValue,
  toValue,
  setFromValue,
  setToValue,

  // Optional radios
  radioOptions = [],
  selectedRadio = "",
  onRadioChange = () => {},
  key2 = "range",

  // Optional accordion controls
  isOpen,
  toggleAccordion,
}) => {
  // Fallback open state if parent doesn't control accordion
  const [isOpenInternal, setIsOpenInternal] = useState(false);
  const open = typeof isOpen === "boolean" ? isOpen : isOpenInternal;
  const handleToggle = toggleAccordion || (() => setIsOpenInternal((p) => !p));

  const effectiveFrom = valueFrom !== undefined ? valueFrom : (fromValue ?? "");
  const effectiveTo = valueTo !== undefined ? valueTo : (toValue ?? "");

  const numMin = min !== undefined && min !== null && min !== "" ? Number(min) : undefined;
  const numMax = max !== undefined && max !== null && max !== "" ? Number(max) : undefined;
  const step = 1;

  const clamp = (val) => {
    if (val === "" || isNaN(Number(val))) return "";
    let n = Number(val);
    if (numMin !== undefined && n < numMin) n = numMin;
    if (numMax !== undefined && n > numMax) n = numMax;
    return n;
  };

  const handleFromChange = (e) => {
    const value = e.target.value.replace(/[^0-9.-]/g, "");
    if (!isNaN(value) || value === "") {
      if (typeof onChange === "function") {
        onChange(value, effectiveTo);
      } else if (typeof setFromValue === "function") {
        setFromValue(value);
      }
    }
  };

  const handleToChange = (e) => {
    const value = e.target.value.replace(/[^0-9.-]/g, "");
    if (!isNaN(value) || value === "") {
      if (typeof onChange === "function") {
        onChange(effectiveFrom, value);
      } else if (typeof setToValue === "function") {
        setToValue(value);
      }
    }
  };

  const bumpFrom = (dir) => {
    const current = effectiveFrom === "" ? (numMin ?? 0) : Number(effectiveFrom);
    const next = clamp(current + (dir > 0 ? step : -step));
    const nextStr = next === "" ? "" : String(next);
    if (typeof onChange === "function") onChange(nextStr, effectiveTo);
    else if (typeof setFromValue === "function") setFromValue(nextStr);
  };

  const bumpTo = (dir) => {
    const current = effectiveTo === "" ? (numMin ?? 0) : Number(effectiveTo);
    const next = clamp(current + (dir > 0 ? step : -step));
    const nextStr = next === "" ? "" : String(next);
    if (typeof onChange === "function") onChange(effectiveFrom, nextStr);
    else if (typeof setToValue === "function") setToValue(nextStr);
  };

  const handleRadioChangeInternal = (value) => {
    onRadioChange(value);
  };

  return (
    <div className="custom-dropdown-container">
      <div
        className="custom-dropdown-header"
        onClick={handleToggle}
        aria-expanded={open}
        aria-controls="dropdown-content"
        style={{ marginBottom: "10px" }}
      >
        <span>{title}</span>
        <span className={`dropdown-icon ${open ? "open" : ""}`}>
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
              transform={open ? "rotate(180 5 5)" : ""}
            />
          </svg>
        </span>
      </div>
      {open && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', background: '#fff', border: '1px solid #dee2e6', borderRadius: 10, overflow: 'hidden', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
            <button type="button" aria-label="Decrease from" onClick={() => bumpFrom(-1)}
              style={{ padding: '6px 10px', border: 'none', background: 'transparent', cursor: 'pointer' }}>←</button>
            <input
              type="text"
              inputMode="numeric"
              value={effectiveFrom}
              onChange={handleFromChange}
              placeholder="From"
              style={{ width: 70, padding: '8px 10px', border: 'none', outline: 'none', textAlign: 'center' }}
            />
            <button type="button" aria-label="Increase from" onClick={() => bumpFrom(1)}
              style={{ padding: '6px 10px', border: 'none', background: 'transparent', cursor: 'pointer' }}>→</button>
          </div>

          <span style={{ opacity: 0.7 }}>–</span>

          <div style={{ display: 'inline-flex', alignItems: 'center', background: '#fff', border: '1px solid #dee2e6', borderRadius: 10, overflow: 'hidden', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
            <button type="button" aria-label="Decrease to" onClick={() => bumpTo(-1)}
              style={{ padding: '6px 10px', border: 'none', background: 'transparent', cursor: 'pointer' }}>←</button>
            <input
              type="text"
              inputMode="numeric"
              value={effectiveTo}
              onChange={handleToChange}
              placeholder="To"
              style={{ width: 70, padding: '8px 10px', border: 'none', outline: 'none', textAlign: 'center' }}
            />
            <button type="button" aria-label="Increase to" onClick={() => bumpTo(1)}
              style={{ padding: '6px 10px', border: 'none', background: 'transparent', cursor: 'pointer' }}>→</button>
          </div>

          {Array.isArray(radioOptions) && radioOptions.length > 0 && (
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
  // Simple API
  title: PropTypes.string,
  min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  valueFrom: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  valueTo: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,

  // Back-compat API
  fromValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  toValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setFromValue: PropTypes.func,
  setToValue: PropTypes.func,

  // Optional radios
  selectedRadio: PropTypes.string,
  onRadioChange: PropTypes.func,
  radioOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  key2: PropTypes.string,

  // Optional accordion controls
  isOpen: PropTypes.bool,
  toggleAccordion: PropTypes.func,
};

export default RangeInput;
