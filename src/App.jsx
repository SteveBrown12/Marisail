import "bootstrap/dist/css/bootstrap.min.css";
import HeaderNavbar from "./components/HeaderNavbar";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Transport from "./pages/Transport";
import Charters from "./pages/Charter";
import Engines from "./pages/Engine";
import Trailers from "./pages/Trailer";
import Berths from "./pages/Berth";
import Buy from "./pages/Buy";
import Sell from "./pages/Sell";
import Services from "./pages/Service";
import EngineDetailPage from "./components/Engine/Engine_Detail";
import TrailerDetail from "./components/Trailers/Trailer_Detail";
import TransportDetail from "./components/Transport/Transport_Detail";
import CharterDetail from "./components/Charter/Charter_Details";
import Register from "./pages/auth/Registration";
import Login from "./pages/auth/Login";

function AppRoutes() {
  const location = useLocation();

  console.log("location.pathname :>> ", location.pathname);
  // Check if current path is /login or /register
  const hideNavbarRoutes = ["/login", "/register"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <HeaderNavbar />}
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/transport" element={<Transport type="search" />} />
        <Route path="/advert-transport" element={<Transport type="advert" />} />
        <Route path="/advert-charters" element={<Charters type="advert" />} />
        <Route path="/charter" element={<Charters type="search" />} />
        <Route path="/engines" element={<Engines type="advert" />} />
        <Route path="/advert-engines" element={<Engines type="search" />} />
        <Route path="/trailers" element={<Trailers type="search" />} />
        <Route path="/advert-trailers" element={<Trailers type="advert" />} />
        <Route path="/berths" element={<Berths type="search" />} />
        <Route path="/advert-berth" element={<Berths type="advert" />} />
        <Route path="/buy" element={<Buy />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="/services" element={<Services type="myEngines" />} />
        <Route path="/view-berth" element={<Services type="myBerth" />} />
        <Route
          path="/view-transport"
          element={<Services type="myTransport" />}
        />
        <Route path="/view-charter" element={<Services type="myCharter" />} />
        <Route path="/view-trailer" element={<Services type="myTrailer" />} />
        <Route path="/engines/:id" element={<EngineDetailPage />} />
        <Route path="/trailer/:id" element={<TrailerDetail />} />
        <Route path="/berth/:id" element={<TrailerDetail />} />
        <Route path="/transport/:id" element={<TransportDetail />} />
        <Route path="/charter/:id" element={<CharterDetail />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
