import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import image from "/images/engine.jpg"

export const BerthCard = ({ item }) => {
  const {
    Berth_ID,
    Location,
    Type,
    Year_Established,
      // Destructure price fields and the label
    Price_PA,
    Price_PCM,
    Price_PW,
    Price_Label,
  } = item;

  // Helper to get styles for the price label tag
  const get_Label_Styles = (label_text) => {
    switch (label_text) {
      case "Great Price":
      case "Very Good Price":
        return "bg-green-100 text-green-800";
      case "Average Price":
        return "bg-blue-100 text-blue-800";
      case "Higher Price":
        return "bg-yellow-100 text-yellow-800";
      case "Poor Price":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Find the best available price to display and its period
  let displayPrice = 0;
  let pricePeriod = "";
  if (Price_PA) {
    displayPrice = Price_PA;
    pricePeriod = "/ year";
  } else if (Price_PCM) {
    displayPrice = Price_PCM;
    pricePeriod = "/ month";
  } else if (Price_PW) {
    displayPrice = Price_PW;
    pricePeriod = "/ week";
  }

  // Format the price to a currency string
  const formattedPrice = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(displayPrice);

  return (
    <Link
      to={`/detail/berth/${Berth_ID}`}
      className="block transform transition duration-300 hover:scale-102 no-underline hover:no-underline"
    >
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl border border-gray-100">
        {/* Image */}
        <img
          src={image}
          className="w-full h-48 object-cover"
        />
        
        <div className="p-5">

          {/* Year Badge */}
          {Year_Established && (
            <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-blue-600 rounded-full mb-2">
              {Year_Established}
            </span>
          )}

          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-800">{Type}</h3>

          {/* Price and Price Label */}
          <div className="flex items-center gap-2 mt-2">
            <p className="text-xl font-bold text-green-600">
              {formattedPrice}
              {pricePeriod && <span className="text-sm font-normal text-gray-500">{pricePeriod}</span>}
            </p>
            {Price_Label && (
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${get_Label_Styles(Price_Label)}`}>
                {Price_Label}
              </span>
            )}
          </div>
          <p className="text-sm font-normal text-gray-500">Tax Paid</p>

          {/* Location */}
          <p className="text-sm text-gray-500 mt-1">{Location}</p>
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
    Price_PA: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    Price_PCM: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    Price_PW: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    Price_Label: PropTypes.string,
  }).isRequired,
};


export const TrailerCard = ({ item }) => {
  const {
    Trailer_ID,
    Make,
    Model,
    Year,
    Asking_Price,
    Price_Label,
  } = item;

  // Helper to get styles for the price label tag
  const get_Label_Styles = (label_text) => {
    switch (label_text) {
      case "Great Price":
      case "Very Good Price":
        return "bg-green-100 text-green-800";
      case "Average Price":
        return "bg-blue-100 text-blue-800";
      case "Higher Price":
        return "bg-yellow-100 text-yellow-800";
      case "Poor Price":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format the price to a currency string
  const formattedPrice = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Asking_Price || 0);

  return (
    <Link
      to={`/detail/trailer/${Trailer_ID}`}
      className="block transform transition duration-300 hover:scale-105 no-underline hover:no-underline"
    >
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl border border-gray-100">
        {/* Image */}
        <img
          src={image}
          className="w-full h-48 object-cover"
        />
        
        <div className="p-5">
          {/* Year Badge */}
          {Year && (
            <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-yellow-600 rounded-full mb-2">
              {Year}
            </span>
          )}

          {/* Make */}
          <h3 className="text-lg font-semibold text-gray-800">{Make}</h3>

          {/* Price */}
            {/* Price and Price Label */}
          <div className="flex items-center gap-2 mt-2">
            <p className="text-xl font-bold text-green-600">
              {formattedPrice}
            </p>
            {Price_Label && (
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${get_Label_Styles(Price_Label)}`}>
                {Price_Label}
              </span>
            )}
          </div>
          <p className="text-sm font-normal text-gray-500">Tax Paid</p>

          {/* Model */}
          <p className="text-sm text-gray-500 mt-1">{Model}</p>
        </div>
      </div>
    </Link>
  );
};

TrailerCard.propTypes = {
  item: PropTypes.shape({
    Trailer_ID: PropTypes.number.isRequired,
    Make: PropTypes.string.isRequired,
    Model: PropTypes.string.isRequired,
    Year: PropTypes.string,
    Asking_Price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    Price_Label: PropTypes.string,
  }).isRequired,
};


export const TransportCard = ({ item }) => {
  const {
    Transport_ID,
    Departure_Destination,
    Category,
    Posted_Date = "",
    // Destructure the price and label
    Quote_Value,
    Price_Label,
  } = item;

    // Helper to get styles for the price label tag
  const get_Label_Styles = (label_text) => {
    switch (label_text) {
      case "Great Price":
      case "Very Good Price":
        return "bg-green-100 text-green-800";
      case "Average Price":
        return "bg-blue-100 text-blue-800";
      case "Higher Price":
        return "bg-yellow-100 text-yellow-800";
      case "Poor Price":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format the price to a currency string
  const formattedPrice = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Quote_Value || 0);


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
          <div className="flex items-center gap-2 mt-2">
            <p className="text-xl font-bold text-green-600">
              {formattedPrice}
            </p>
            {Price_Label && (
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${get_Label_Styles(Price_Label)}`}>
                {Price_Label}
              </span>
            )}
          </div>
          <p className="text-sm font-normal text-gray-500">Quote Value</p>

          {/* Location */}
          <p className="text-sm text-gray-500 mt-1">{Departure_Destination}</p>
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
    Quote_Value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    Price_Label: PropTypes.string,
  }).isRequired,
};


export const EngineCard = ({ item }) => {
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
        
        {/* Image */}
        <img
          src={image}
          className="w-full h-48 object-cover"
        />
        
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


export const CharterCard = ({ item }) => {
  const {
    Charter_ID,
    Crew_Accommodation,
    Yacht_Decor,
    Boardingport_Time = "",
    Price_Label,
    Summerrate_Per_Week,
    Total_Price,
    Summerrate_Per_Night,
  } = item;

    // Helper to get styles for the price label tag
  const get_Label_Styles = (label_text) => {
    switch (label_text) {
      case "Great Price":
      case "Very Good Price":
        return "bg-green-100 text-green-800";
      case "Average Price":
        return "bg-blue-100 text-blue-800";
      case "Higher Price":
        return "bg-yellow-100 text-yellow-800";
      case "Poor Price":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Find the best available price to display (weekly rate is preferred)
  const displayPrice = Summerrate_Per_Week || Total_Price || (Summerrate_Per_Night * 7) || 0;

  // Format the price to a currency string
  const formattedPrice = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(displayPrice);

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

              {/* Price and Price Label */}
          <div className="flex items-center gap-2 mt-2">
            <p className="text-xl font-bold text-green-600">
              {formattedPrice}
              {Summerrate_Per_Week || Summerrate_Per_Night ? <span className="text-sm font-normal text-gray-500"> / week</span> : ""}
            </p>
            {Price_Label && (
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${get_Label_Styles(Price_Label)}`}>
                {Price_Label}
              </span>
            )}
          </div>
          <p className="text-sm font-normal text-gray-500">Tax Paid</p>

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
    Price_Label: PropTypes.string,
    Summerrate_Per_Week: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    Total_Price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    Summerrate_Per_Night: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
};