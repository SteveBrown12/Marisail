import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import image from "/images/engine.jpg"

const TransportCard = ({ item }) => {
  const {
    Transport_ID,
    Departure_Destination,
    Category,
    Posted_Date = "",
  } = item;

  return (
    <Link
      to={`/detail/transport/${Transport_ID}`}
      className="block transform transition duration-300 hover:scale-105 no-underline hover:no-underline"
    >
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl border border-gray-100">
        {/* Image */}
        <img
          src={image}
          className="w-full h-48 object-cover"
        />
        
        <div className="p-5">
          {/* Posted Date Badge */}
          {Posted_Date && (
            <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-teal-600 rounded-full mb-2">
              {Posted_Date}
            </span>
          )}

          {/* Category */}
          <h3 className="text-lg font-semibold text-gray-800">{Category}</h3>

          {/* Price */}
          <p className="text-xl font-bold text-green-600 mt-2">
            £ 249,950 <span className="text-sm font-normal text-gray-500">Tax Paid</span>
          </p>

          {/* Location */}
          <p className="text-sm text-gray-500 mt-1">{Departure_Destination}</p>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-gray-50 text-sm text-blue-600 font-medium hover:text-blue-800">
          View Details →
        </div>
      </div>
    </Link>
  );
};

TransportCard.propTypes = {
  item: PropTypes.shape({
    Transport_ID: PropTypes.number.isRequired,
    Departure_Destination: PropTypes.string.isRequired,
    Category: PropTypes.string.isRequired,
    Posted_Date: PropTypes.string,
  }).isRequired,
};

export default TransportCard;
