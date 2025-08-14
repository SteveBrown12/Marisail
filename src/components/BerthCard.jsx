import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const BerthCard = ({ item }) => {
  const {
    Berth_ID,
    Location,
    Type,
    Year_Established,
  } = item;

  return (
    <Link
      to={`/detail/berth/${Berth_ID}`}
      className="block transform transition duration-300 hover:scale-102 no-underline hover:no-underline"
    >
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl border border-gray-100">
        <div className="p-5">
          {/* Year Badge */}
          {Year_Established && (
            <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-blue-600 rounded-full mb-2">
              {Year_Established}
            </span>
          )}

          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-800">{Type}</h3>

          {/* Price */}
          <p className="text-xl font-bold text-green-600 mt-2">
            £ 249,950 <span className="text-sm font-normal text-gray-500">Tax Paid</span>
          </p>

          {/* Location */}
          <p className="text-sm text-gray-500 mt-1">{Location}</p>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-gray-50 text-sm text-blue-600 font-medium hover:text-blue-800">
          View Details →
        </div>
      </div>
    </Link>
  );
};

BerthCard.propTypes = {
  item: PropTypes.shape({
    Berth_ID: PropTypes.number.isRequired,
    Location: PropTypes.string.isRequired,
    Type: PropTypes.string.isRequired,
    Year_Established: PropTypes.string,
  }).isRequired,
};

export default BerthCard;
