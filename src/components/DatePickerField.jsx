import React, { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { format as formatDate, parseISO, isValid } from "date-fns";

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

export default function DatePickerField({
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
        className="w-full flex justify-between items-center py-2 text-[15px] text-gray-900 font-medium transition"
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
