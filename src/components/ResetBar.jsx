import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

const ResetBar = ({ selectedTags, removeTag, resetTags, removeFilter }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let temp = 0;
    for (const key in selectedTags) {
      temp += selectedTags[key].length;
    }
    setCount(temp);
  }, [selectedTags]);

  return (
    <div id="search-bar" style={{ maxWidth: "100%", }}>
      {/* {Object.keys(selectedTags).length !== 0 && ( */}
      <div>


        <div id="selected-tags" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "0.75rem" }}>
          <div style={{display:"flex",gap:"0.5rem"}}>
          {Object.keys(selectedTags).map((key) => (
            <div key={key}>
              
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {selectedTags[key].map((filter) => (
                  <div
                    key={filter}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      background: "#E0E7FF",
                      borderRadius: "5px",
                      padding: "5px 10px",
                      fontSize: "12px",
                      fontWeight: "500",
                      color: "#333",
                      transition: "background 0.3s ease",
                    }}
                  >

                    {filter}
                    <span
                      className="close-button"
                      onClick={() => removeFilter(key, filter)}
                      style={{
                        color: "#D93025",
                        marginLeft: "8px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "bold",
                        transition: "color 0.2s ease",
                      }}
                      onMouseOver={(e) => (e.target.style.color = "#B71C1C")}
                      onMouseOut={(e) => (e.target.style.color = "#D93025")}
                    >
                      ×
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
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
