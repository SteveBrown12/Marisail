// src/components/CustomCard.js
// import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const TrailerCard = ({
  //   image,
  Trailer_ID,
  make,
  model,
  year,
}) => {
  return (
    <Link to={`/trailer/${Trailer_ID}`} className="custom-card-link">
      <div className="custom-card" style={{ marginBottom: "30px" }}>
        <div className="card-content">
          <div className="card-header">
            <span className="year">{year}</span>
            <h3 className="title">{make}</h3>
            <p className="price">£ 249,950 Tax Paid</p>
            <p className="price">{model}</p>
            {/* <p className="price">{Trailer_ID}</p> */}
          </div>
          <div className="card-description">{/* <p>{description}</p> */}</div>
        </div>
      </div>
    </Link>
  );
};

TrailerCard.propTypes = {
  Trailer_ID: PropTypes.number.isRequired,
  make: PropTypes.string.isRequired,
  model: PropTypes.string.isRequired,
  year: PropTypes.string,
};

export default TrailerCard;
