const SearchBar = ({ selectedTags, removeTag, resetTags, onChange }) => {
  return (
    <div id="search-bar">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "80%",
        }}
      >
        {selectedTags.length > 0 && (
          <span
            onClick={resetTags}
            style={{
              cursor: "pointer",
              color: "Black",
              fontSize: "12px",
              marginRight: "10px",
            }}
          >
            Reset
          </span>
        )}
      </div>

      <div id="selected-tags">
        {selectedTags.map((tag, index) => (
          <div
            className="tag"
            key={index}
            style={{
              display: "inline-block",
              marginBottom: "1rem",
              padding: "5px",
              background: "#e0e0e0",
              borderRadius: "5px",
            }}
          >
            {tag}
            <span
              className="close-button"
              onClick={() => removeTag(tag)}
              style={{ color: "black", marginLeft: "10px", cursor: "pointer" }}
            >
              ×
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
