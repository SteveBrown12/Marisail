import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import image from "/images/engine.jpg"

const CharterCard = ({ item }) => {
  const {
    Charter_ID,
    Crew_Accommodation,
    Yacht_Decor,
    Boardingport_Time = "",
  } = item;

  return (
    <Link
      to={`/detail/charter/${Charter_ID}`}
      className="block transform transition duration-300 hover:scale-105 no-underline hover:no-underline"
    >
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl border border-gray-100">
        {/* Image */}
        <img
          src={image}
          className="w-full h-48 object-cover"
        />
        
        <div className="p-5">
          {/* Boarding Time Badge */}
          {Boardingport_Time && (
            <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-purple-600 rounded-full mb-2">
              {Boardingport_Time}
            </span>
          )}

          {/* Yacht_Decor */}
          <h3 className="text-lg font-semibold text-gray-800">{Yacht_Decor}</h3>

          {/* Price */}
          <p className="text-xl font-bold text-green-600 mt-2">
            £ 249,950 <span className="text-sm font-normal text-gray-500">Tax Paid</span>
          </p>

          {/* Crew_Accommodation */}
          <p className="text-sm text-gray-500 mt-1">{Crew_Accommodation}</p>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-gray-50 text-sm text-blue-600 font-medium hover:text-blue-800">
          View Details →
        </div>
      </div>
    </Link>
  );
};

CharterCard.propTypes = {
  item: PropTypes.shape({
    Charter_ID: PropTypes.number.isRequired,
    Crew_Accommodation: PropTypes.string.isRequired,
    Yacht_Decor: PropTypes.string.isRequired,
    Boardingport_Time: PropTypes.string,
  }).isRequired,
};

export default CharterCard;
