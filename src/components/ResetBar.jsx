import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

const ResetBar = ({ selectedTags, removeTag, resetTags, removeFilter }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let temp = 0;
    for (const section of Object.values(selectedTags)) {
      for (const val of Object.values(section)) {
        if (Array.isArray(val)) temp += val.length;
        else temp += 1;
      }
    }
    setCount(temp);
  }, [selectedTags]);

  return (
    <div id="search-bar" style={{ maxWidth: "100%" }}>
      <div>
        <div
          id="selected-tags"
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: "0.75rem",
          }}
        >
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {Object.entries(selectedTags).map(([sectionKey, fields]) =>
              Object.entries(fields).map(([fieldKey, value]) => {
                if (Array.isArray(value)) {
                  return value.map((val) => (
                    <div
                      key={`${fieldKey}-${val}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        background: "#E0E7FF",
                        borderRadius: "5px",
                        padding: "5px 10px",
                        fontSize: "12px",
                        fontWeight: "500",
                        color: "#333",
                      }}
                    >
                      {val}
                      <span
                        className="close-button"
                        onClick={() => removeFilter(sectionKey, fieldKey, val)}
                        style={{
                          color: "#D93025",
                          marginLeft: "8px",
                          cursor: "pointer",
                          fontSize: "14px",
                          fontWeight: "bold",
                        }}
                        onMouseOver={(e) =>
                          (e.target.style.color = "#B71C1C")
                        }
                        onMouseOut={(e) =>
                          (e.target.style.color = "#D93025")
                        }
                      >
                        ×
                      </span>
                    </div>
                  ));
                } else if (typeof value === "object" && value !== null) {
                  return (
                    <div
                      key={fieldKey}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        background: "#E0E7FF",
                        borderRadius: "5px",
                        padding: "5px 10px",
                        fontSize: "12px",
                        fontWeight: "500",
                        color: "#333",
                      }}
                    >
                      {fieldKey}: {value.value} {value.unit}
                      <span
                        className="close-button"
                        onClick={() => removeTag(sectionKey, fieldKey)}
                        style={{
                          color: "#D93025",
                          marginLeft: "8px",
                          cursor: "pointer",
                          fontSize: "14px",
                          fontWeight: "bold",
                        }}
                        onMouseOver={(e) =>
                          (e.target.style.color = "#B71C1C")
                        }
                        onMouseOut={(e) =>
                          (e.target.style.color = "#D93025")
                        }
                      >
                        ×
                      </span>
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={fieldKey}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        background: "#E0E7FF",
                        borderRadius: "5px",
                        padding: "5px 10px",
                        fontSize: "12px",
                        fontWeight: "500",
                        color: "#333",
                      }}
                    >
                      {fieldKey}: {value}
                      <span
                        className="close-button"
                        onClick={() => removeTag(sectionKey, fieldKey)}
                        style={{
                          color: "#D93025",
                          marginLeft: "8px",
                          cursor: "pointer",
                          fontSize: "14px",
                          fontWeight: "bold",
                        }}
                        onMouseOver={(e) =>
                          (e.target.style.color = "#B71C1C")
                        }
                        onMouseOut={(e) =>
                          (e.target.style.color = "#D93025")
                        }
                      >
                        ×
                      </span>
                    </div>
                  );
                }
              })
            )}
          </div>

          <span
            onClick={resetTags}
            style={{
              cursor: "pointer",
              color: "#007BFF",
              fontSize: "14px",
              fontWeight: "600",
              textDecoration: "underline",
            }}
          >
            Reset Filters
          </span>
        </div>
      </div>
    </div>
  );
};

ResetBar.propTypes = {
  selectedTags: PropTypes.object.isRequired,
  removeTag: PropTypes.func.isRequired,
  resetTags: PropTypes.func.isRequired,
  removeFilter: PropTypes.func.isRequired,
};

export default ResetBar;
