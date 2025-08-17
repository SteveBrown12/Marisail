import CharterAdvert from "../components/Charter/Charter_Advert";
import CharterSearch from "../components/Charter/Charter_Search";
import PropTypes from "prop-types";

const Charters = ({ type }) => {
  return (
    <main
      style={{
        minHeight: `100vh`,
        overflow: "hidden",
      }}
    >
      {type === "advert" ? <CharterAdvert /> : <CharterSearch />}
    </main>
  );
};

Charters.propTypes = {
  type: PropTypes.string.isRequired,
};

export default Charters;