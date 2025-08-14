import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const EngineCard = ({ item }) => {
  const {
    image,
    Engine_Model_Year,
    Engine_Model,
    asking_price,
    engine_id,
    Engine_Make,
  } = item;

  return (
    <Link
      to={`/detail/engines/${engine_id}`}
      className="block transform transition duration-300 hover:scale-105 no-underline hover:no-underline"
    >
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl border border-gray-100">
        
        {/* Engine Image */}
        <div className="w-full h-48 overflow-hidden">
          <img
            src={image || "/images/engine.jpg"}
            alt={Engine_Model}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Card Content */}
        <div className="p-5">
          {/* Year Badge */}
          {Engine_Model_Year && (
            <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-red-600 rounded-full mb-2">
              {Engine_Model_Year}
            </span>
          )}

          {/* Engine Model */}
          <h3 className="text-lg font-semibold text-gray-800">{Engine_Model}</h3>

          {/* Price */}
          <p className="text-xl font-bold text-green-600 mt-2">
            £ {asking_price || "249,950"}{" "}
            <span className="text-sm font-normal text-gray-500">Tax Paid</span>
          </p>

          {/* Engine Make */}
          <p className="text-sm text-gray-500 mt-1">{Engine_Make}</p>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-gray-50 text-sm text-blue-600 font-medium hover:text-blue-800">
          View Details →
        </div>
      </div>
    </Link>
  );
};

EngineCard.propTypes = {
  item: PropTypes.shape({
    image: PropTypes.string,
    Engine_Model_Year: PropTypes.string,
    Engine_Model: PropTypes.string.isRequired,
    asking_price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    engine_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    Engine_Make: PropTypes.string.isRequired,
  }).isRequired,
};

export default EngineCard;
