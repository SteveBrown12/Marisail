// import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const TransportCard = ({
  //   image,
  Transport_Item_ID,
  Location,
  Category,
  Posted_Date = "",
}) => {
  return (
    <Link to={`/transport/${Transport_Item_ID}`} className="custom-card-link">
      <div className="custom-card" style={{ marginBottom: "30px" }}>
        <div className="card-content">
          <div className="card-header">
            <span className="year">{Posted_Date}</span>
            <h3 className="title">{Category}</h3>
            <p className="price">£ 249,950 Tax Paid</p>
            <p className="price">{Location}</p>
            {/* <p className="price">{Transport_Item_ID}</p> */}
          </div>
          <div className="card-description">{/* <p>{description}</p> */}</div>
        </div>
      </div>
    </Link>
  );
};

TransportCard.propTypes = {
  Marisail_Berth_ID: PropTypes.number.isRequired,
  Location: PropTypes.string.isRequired,
  Type: PropTypes.string.isRequired,
  year: PropTypes.string,
};

export default TransportCard;
