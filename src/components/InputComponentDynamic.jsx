import { useState, useEffect } from "react";
import PropTypes from "prop-types";

function InputComponentDynamic({
  label,
  value,
  setValue,
  formType,
  isMandatory,
  openKey,
  setOpenKey,
}) {
  const [inputText, setInputText] = useState(value);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
    setValue(e);
  };

  useEffect(() => {
    setInputText(value);
  }, [value]);

  return (
    <div className="ml-[-10px]">
      <div>
        <button
          className="w-full text-left font-semibold py-2 border-b"
          onClick={() => setOpenKey(openKey === label ? "" : label)}
        >
          {label}
          {isMandatory && <span className="text-red-500">&nbsp;*</span>}
        </button>
        {openKey === label && (
          <div className="pt-2">
            <input
              value={inputText}
              onChange={handleInputChange}
              type={formType}
              placeholder=""
              name={label}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        )}
      </div>
    </div>
  );
}

InputComponentDynamic.propTypes = {
  label: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  formType: PropTypes.string.isRequired,
  isMandatory: PropTypes.bool.isRequired,
  openKey: PropTypes.string.isRequired,
  setOpenKey: PropTypes.func.isRequired,
};

export default InputComponentDynamic;
