import Form from "react-bootstrap/Form";
import Accordion from "react-bootstrap/Accordion";
import PropTypes from "prop-types";
// import { Button } from "react-bootstrap";
function SelectComponent({
  label,
  setValue,
  value,
  setOpenKey,
  openKey,
  type,
  options,
  isMandatory,
}) {
  
  
  return (
    <Accordion
      activeKey={openKey}
      onSelect={(eventKey) => setOpenKey(eventKey)}
    >
      <Accordion.Item eventKey={label}>
        {/* <Accordion.Header style={{position: 'relative'}}> */}
        <Accordion.Header>
          {label}
          {isMandatory && <span className="text-danger">&nbsp;*</span>}
        </Accordion.Header>
        <Accordion.Body style={{ maxHeight: 200, overflowY: "auto" }}>
          {options && options.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
              }}
              onClick={() => setValue(item)}
            >
              <Form.Check
                type="radio"
                className="custom-checkbox"
                aria-label={`radio-${index}`}
                name={label}
                checked={item === value}
                onChange={() => setValue(item)}
                label={item}
              />
            </div>
          ))}
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}

SelectComponent.propTypes = {
  label: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Date)
  ]),
  setOpenKey: PropTypes.func.isRequired,
  openKey: PropTypes.string,
  type: PropTypes.string,
  options: PropTypes.array.isRequired,
  isMandatory: PropTypes.bool.isRequired,
};
export default SelectComponent;
