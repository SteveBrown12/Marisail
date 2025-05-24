import PropTypes from "prop-types";
import { varToScreen } from "./Charter_Search_Info";

const CharterDetailPanel = ({ title, details }) => {
  console.log("title :>> ", title);
  return (
    <div className="details-panel-container">
      <div className="details-panel-header">
        <span className="panel-title ">
          <h6>{varToScreen[title]?.displayText}</h6>
        </span>
      </div>
      <div className="details-panel-content">
        <table className="details-panel-table">
          <tbody>
            {Object.entries(details).map(([key, value]) => {
              return (
                <tr key={key}>
                  <td className="details-panel-key">
                    <strong>{varToScreen?.[key]?.displayText}:</strong>
                  </td>
                  <td className="details-panel-value">{value}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

CharterDetailPanel.propTypes = {
  title: PropTypes.string.isRequired,
  details: PropTypes.object.isRequired,
};

export default CharterDetailPanel;
