import TransportAdvert from "../components/Transport/Transport_Advert";
import TransportSearch from "../components/Transport/Transport_Search";
import PropTypes from "prop-types";


const Transport = ({ type }) => {
  return (
    <main
      style={{
        minHeight: `100vh`,
        overflow: "hidden",
      }}
    >

      {type === "search" ? <TransportSearch /> : <TransportAdvert />}
    </main>
  );
};

Transport.propTypes = {
  type: PropTypes.string.isRequired,
};

export default Transport;
