import { useState, useEffect } from "react";
import PropTypes from "prop-types";

function InputComponentDual({
  label,
  value,
  setValue,
  formType,
  isMandatory,
  openKey,
  setOpenKey,
  radioOptions,
  setSelectedOption
}) {
  const [inputText, setInputText] = useState(value);
  const [selectedRadio, setSelectedRadio] = useState(radioOptions.length > 0 ? radioOptions[0].value : "" );

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setInputText(inputValue);
    setSelectedOption(inputValue, selectedRadio);
};

const handleRadioChange = (e) => {
    const radioValue = e.target.value;
    setSelectedRadio(radioValue);
    setSelectedOption(inputText, radioValue);
};


  useEffect(() => {
    setInputText(value);
  }, [value]);

  useEffect(() => {
    if (radioOptions.length > 0) {
      setSelectedRadio(radioOptions[0]?.value);
    }
  }, [radioOptions]);
  

  return (
    <div className="ml-[-10px]">
      {/* Accordion header */}
      <button
        className="w-full text-left border-b py-2"
        onClick={() => setOpenKey(openKey === label ? null : label)}
      >
        {label}
        {isMandatory && <span className="text-red-500">&nbsp;*</span>}
      </button>

      {/* Accordion body */}
      {openKey === label && (
        <div className="py-3">
          <div className="flex flex-wrap gap-4">
            {/* Input field */}
            <div className="flex items-center flex-grow max-w-[66%]">
              <input
                value={inputText}
                onChange={handleInputChange}
                type={formType}
                placeholder=""
                name={label}
                className="flex-grow border rounded px-3 py-2"
              />
            </div>

            {/* Radio buttons */}
            {radioOptions.length > 0 && (
              <div className="flex items-center w-[34%]">
                <div className="flex border border-gray-300 rounded-full justify-around w-[65%]">
                  {radioOptions.map((option) => (
                    <div key={option.id} className="flex">
                      <input
                        type="radio"
                        id={`btnradio-${label}-${option.value}`}
                        name={`btnradio-${label}`}
                        value={option.value}
                        onChange={handleRadioChange}
                        checked={selectedRadio === option.value}
                        className="hidden"
                      />
                      <label
                        htmlFor={`btnradio-${label}-${option.value}`}
                        className="flex-1 px-3 py-1 text-center border-r last:border-none cursor-pointer"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

InputComponentDual.propTypes = {
  label: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  formType: PropTypes.string.isRequired,
  isMandatory: PropTypes.bool,
  openKey: PropTypes.string.isRequired,
  setOpenKey: PropTypes.func.isRequired,
  radioOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  setSelectedOption: PropTypes.func.isRequired,
};

export default InputComponentDual;
