import { useState } from "react";
import PropTypes from "prop-types";

const DropdownWithRadio = ({
  heading,
  title,
  options = [],
  selectedOption,
  setSelectedOption,
  isMandatory = false,
  openKey = null,
  setOpenKey,
}) => {
  const [list] = useState(options);
  // console.log("001 List--",list);
  // console.log("001 Selected Value--",selectedOption);

  // if (typeof options === Number){
  //   console.log("001 Number Title--",title);
  // }
  // if (typeof options === String){
  //   console.log("001 String Title--",title);
  // }
  const handleOptionChange = (optionName) => {
    setSelectedOption(optionName);
  };

  function convertNonArrayOrObject(value) {
    if (!Array.isArray(value) && typeof value !== "object") {
      return [value]?.[0];
    } else {
      return value?.[0];
    }
  }

  return (
    <div className="ml-[-10px]">
      {/* Accordion header */}
      <button
        className="w-full text-left border-b py-2"
        onClick={() => setOpenKey(openKey === heading ? null : heading)}
      >
        {title}
        {isMandatory && <span className="text-red-500">&nbsp;*</span>}
      </button>

      {/* Accordion body */}
      {openKey === heading && (
        <div className="max-h-[200px] overflow-y-auto max-w-[472px]">
          {list.length > 0 ? (
            list.map((item, index) => (
              <div key={`${item?.[0] ?? index}-${index}`}>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`radio-options-${heading}`}
                    checked={convertNonArrayOrObject(selectedOption) === item[0]}
                    onChange={() => handleOptionChange(item[0])}
                  />
                  <span>{item[0]}</span>
                </label>
              </div>
            ))
          ) : (
            <div className="text-gray-500">No options available</div>
          )}
        </div>
      )}
    </div>
  );
};

DropdownWithRadio.propTypes = {
  heading: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.array),
  selectedOption: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.object,
  ]),
  setSelectedOption: PropTypes.func.isRequired,
  isMandatory: PropTypes.bool,
  openKey: PropTypes.string, // allow null/undefined
  setOpenKey: PropTypes.func,
};

export default DropdownWithRadio;
