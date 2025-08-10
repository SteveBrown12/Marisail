import React, { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { format as formatDate, parseISO, isValid } from "date-fns";

// Utility to normalize incoming date-like values to Date or undefined
function toDate(val) {
  if (!val) return undefined;
  if (val instanceof Date) return isValid(val) ? val : undefined;
  if (typeof val === "string") {
    // try ISO first
    const d = parseISO(val);
    if (isValid(d)) return d;
    // fallback: attempt Date constructor
    const d2 = new Date(val);
    return isValid(d2) ? d2 : undefined;
  }
  return undefined;
}

function toISO(val) {
  if (!val) return "";
  const d = toDate(val);
  if (!d) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

const inputBaseStyle = {
  width: "100%",
  padding: "8px 12px",
  border: "1px solid #ced4da",
  borderRadius: 4,
  backgroundColor: "#fff",
  lineHeight: 1.4,
};

export default function DatePickerField({
  mode = "single", // 'single' | 'range' | 'multiple'
  value,
  onChange,
  placeholder = "dd MMM yyyy",
  displayFormat = "dd MMM yyyy",
  className = "",
  style = {},
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const selected = useMemo(() => {
    if (mode === "single") return toDate(value);
    if (mode === "range") {
      const from = value?.from ? toDate(value.from) : undefined;
      const to = value?.to ? toDate(value.to) : undefined;
      return { from, to };
    }
    if (mode === "multiple") {
      const arr = Array.isArray(value) ? value : [];
      return arr.map((v) => toDate(v)).filter(Boolean);
    }
    return undefined;
  }, [value, mode]);

  const displayText = useMemo(() => {
    try {
      if (mode === "single") {
        const d = toDate(value);
        return d ? formatDate(d, displayFormat) : "";
      }
      if (mode === "range") {
        const from = toDate(value?.from);
        const to = toDate(value?.to);
        if (!from && !to) return "";
        const left = from ? formatDate(from, displayFormat) : "";
        const right = to ? formatDate(to, displayFormat) : "";
        return `${left}${left || right ? " - " : ""}${right}`;
      }
      if (mode === "multiple") {
        const arr = Array.isArray(value) ? value : [];
        const formatted = arr
          .map((v) => toDate(v))
          .filter(Boolean)
          .map((d) => formatDate(d, displayFormat));
        return formatted.join(", ");
      }
      return "";
    } catch {
      return "";
    }
  }, [value, mode, displayFormat]);

  const handleSelect = (sel) => {
    if (mode === "single") {
      const iso = toISO(sel);
      onChange && onChange(iso);
      setOpen(false);
    } else if (mode === "range") {
      const iso = {
        from: sel?.from ? toISO(sel.from) : "",
        to: sel?.to ? toISO(sel.to) : "",
      };
      onChange && onChange(iso);
    } else if (mode === "multiple") {
      const isoArr = (Array.isArray(sel) ? sel : [])
        .map((d) => toISO(d))
        .filter(Boolean);
      onChange && onChange(isoArr);
    }
  };

  return (
    <div
      className={className}
      style={{ position: "relative", width: 220, ...style }}
      ref={ref}
    >
      <div
        className="form-control d-flex align-items-center justify-content-between"
        style={inputBaseStyle}
        onClick={() => setOpen((p) => !p)}
      >
        <span style={{ color: displayText ? "#212529" : "#6c757d" }}>
          {displayText || placeholder}
        </span>
        <span className="ms-2" aria-hidden>📅</span>
      </div>

      {open && (
        <div
          style={{
            position: "absolute",
            zIndex: 1000,
            background: "#fff",
            boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
            borderRadius: 8,
            marginTop: 8,
          }}
        >
          <DayPicker
            mode={mode}
            selected={selected}
            onSelect={handleSelect}
            numberOfMonths={1}
            styles={{
              caption: { fontWeight: 600 },
              day_selected: { backgroundColor: "#0d6efd" },
            }}
          />
        </div>
      )}
    </div>
  );
}

DatePickerField.propTypes = {
  mode: PropTypes.oneOf(["single", "range", "multiple"]),
  value: PropTypes.any,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  displayFormat: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
};
