import { Outlet } from "react-router-dom";
import HeaderNavbar from "../components/HeaderNavbar";

const Home = () => {
  
  return (
    <>
      <main>
        <HeaderNavbar />
        <Outlet/>
      </main>
    </>
  );
};

Home.propTypes = {};

export default Home;
