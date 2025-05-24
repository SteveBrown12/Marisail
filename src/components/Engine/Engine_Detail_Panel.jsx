import PropTypes from 'prop-types';

const EngineDetailsPanel = ({ title, details }) => {
  return (
    <div className="details-panel-container">
      <div className="details-panel-header">
        <span className="panel-title ">
          <h6>{title}</h6>
        </span>
      </div>
      <div className="details-panel-content">
        <table className="details-panel-table">
          <tbody>
            {Object.entries(details).map(([key, value]) => (
              <tr key={key}>
                <td className="details-panel-key">
                  <strong>{key}:</strong>
                </td>
                <td className="details-panel-value">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


EngineDetailsPanel.propTypes = {
  title: PropTypes.string.isRequired,
  details: PropTypes.object.isRequired,
};

export default EngineDetailsPanel;
