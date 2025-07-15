import { useState } from "react";
import { Form, Accordion } from "react-bootstrap";
import PropTypes from "prop-types";

const DropdownWithRadio = ({
  heading,
  title,
  options,
  selectedOption,
  setSelectedOption,
  isMandatory,
  openKey,
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
      activeKey={openKey}
      style={{ marginLeft: "-10px" }}
      onSelect={(eventKey) => setOpenKey(eventKey)}
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
                <div key={index}>
                  <Form.Check
                    type="radio"
                    name={`radio-options-${heading}`}
                    label={`${item}`}
                    checked={
                      convertNonArrayOrObject(selectedOption) === item
                    }
                    onChange={() => handleOptionChange(item)}
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
  options: PropTypes.arrayOf(PropTypes.array).isRequired,
  selectedOption: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.number.isRequired,
    PropTypes.object.isRequired,
  ]),
  setSelectedOption: PropTypes.func.isRequired,
  isMandatory: PropTypes.bool.isRequired,
  openKey: PropTypes.string.isRequired,
  setOpenKey: PropTypes.func.isRequired,
};

export default DropdownWithRadio;
