import EngineAdvert from "../components/Engine/Engine_Advert";
import EngineSearch from "../components/Engine/Engine_Search";
import PropTypes from "prop-types";

const Engines = ({ type }) => {
  return (
    <main
      style={{
        minHeight: `100vh`,
        overflow: "hidden",
      }}
    >
      {type === "search" ? <EngineAdvert /> : <EngineSearch />}
    </main>
  );
};

Engines.propTypes = {
  type: PropTypes.string.isRequired,
};

export default Engines;
