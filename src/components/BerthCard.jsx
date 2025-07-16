// import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const BerthCard = ({
  //   image,
  Berth_ID,
  Location,
  Type,
  year = "",
}) => {
  return (
    <Link to={`/berth/${Berth_ID}`} className="custom-card-link">
      <div className="custom-card" style={{ marginBottom: "30px" }}>
        <div className="card-content">
          <div className="card-header">
            <span className="year">{year}</span>
            <h3 className="title">{Type}</h3>
            <p className="price">£ 249,950 Tax Paid</p>
            <p className="price">{Location}</p>
            {/* <p className="price">{Berth_ID}</p> */}
          </div>
          <div className="card-description">{/* <p>{description}</p> */}</div>
        </div>
      </div>
    </Link>
  );
};

BerthCard.propTypes = {
  Berth_ID: PropTypes.number.isRequired,
  Location: PropTypes.string.isRequired,
  Type: PropTypes.string.isRequired,
  year: PropTypes.string,
};

export default BerthCard;
