import BerthAdvert from "../components/Berth/Berth_Advert";
import BerthSearch from "../components/Berth/Berth_Search";
import PropTypes from "prop-types";

const Berths = ({ type }) => {
  return (
    <main
      style={{
        minHeight: `100vh`,
        overflow: "hidden",
      }}
    >
      {type === "search" ? <BerthSearch /> : <BerthAdvert/>}
    </main>
  );
};

Berths.propTypes = {
  type: PropTypes.string.isRequired,
};

export default Berths;
