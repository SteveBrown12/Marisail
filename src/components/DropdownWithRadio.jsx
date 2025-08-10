import { useState } from "react";
import { Form, Accordion } from "react-bootstrap";
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
    <Accordion
      activeKey={openKey ?? undefined}
      style={{ marginLeft: "-10px" }}
      onSelect={typeof setOpenKey === "function" ? (eventKey) => setOpenKey(eventKey) : undefined}
    >
      <Accordion.Item eventKey={heading}>
        <Accordion.Header>
          {title}
          {isMandatory && <span className="text-danger">&nbsp;*</span>}
        </Accordion.Header>
        <Accordion.Body
          style={{ maxHeight: 200, overflowY: "auto", maxWidth: 472 }}
        >
          <div>
            {list.length > 0 ? (
              list.map((item, index) => (
                <div key={`${item?.[0] ?? index}-${index}`}>
                  <Form.Check
                    type="radio"
                    name={`radio-options-${heading}`}
                    label={`${item[0]}`}
                    checked={
                      convertNonArrayOrObject(selectedOption) === item[0]
                    }
                    onChange={() => handleOptionChange(item[0])}
                  />
                </div>
              ))
            ) : (
              <div className="custom-dropdown-no-results">
                No options available
              </div>
            )}
          </div>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
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
