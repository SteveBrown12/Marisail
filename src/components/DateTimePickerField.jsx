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

// ✅ Convert to MySQL DATETIME format
function toMySQL(val) {
  if (!val) return "";
  const d = toDate(val);
  if (!d) return "";
  return formatDate(d, "yyyy-MM-dd HH:mm:ss");
}

export default function DateTimePickerField({
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
