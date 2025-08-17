// src/components/CustomCard.js
import { Link } from "react-router-dom";

const EngineCard = ({
  image,
  Engine_Model_Year,
  Engine_Model,
  asking_price,
  engine_id,
  Engine_Make,
}) => {
  return (
    <Link to={`/engines/${engine_id}`} className="custom-card-link">
      <div className="custom-card" style={{ marginBottom: "30px" }}>
        <div className="card-image">
          <img src="./images/engine.jpg" alt={`${Engine_Model}`} />
        </div>
        <div className="card-content">
          <div className="card-header">
            <span className="year">{Engine_Model_Year}</span>
            <h3 className="title">{Engine_Model}</h3>
            <p className="price">£ 249,950 Tax Paid</p>
            <p className="price">{Engine_Make}</p>
          </div>
          <div className="card-description">{/* <p>{description}</p> */}</div>
        </div>
      </div>
    </Link>
  );
};

export default EngineCard;
