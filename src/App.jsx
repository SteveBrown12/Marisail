import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Engines from "./pages/Engine";
import Services from "./pages/Service";

import EngineDetailPage from "./pages/detail/Engine_Detail";
import TrailerDetail from "./pages/detail/Trailer_Detail";
import TransportDetail from "./pages/detail/Transport_Detail";
import CharterDetail from "./pages/detail/Charter_Details";

import Register from "./pages/Registration";
import Login from "./pages/Login";

import GenericSearch from "./pages/Generic_Search";
import GenericAdvert from "./pages/Generic_Advert";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<Home />}>

          <Route path="/advert/:serviceName" element={<GenericAdvert />} />
          <Route path="/find/:serviceName" element={<GenericSearch />} />

          <Route path="/engines" element={<Engines type="advert" />} />
          <Route path="/advert-engines" element={<Engines type="search" />} />

          <Route path="/services" element={<Services type="myEngines" />} />
          <Route path="/view-berth" element={<Services type="myBerth" />} />
          <Route path="/view-transport" element={<Services type="myTransport" />}/>
          <Route path="/view-charter" element={<Services type="myCharter" />} />
          <Route path="/view-trailer" element={<Services type="myTrailer" />} />

          <Route path="/engines/:id" element={<EngineDetailPage />} />
          <Route path="/trailer/:id" element={<TrailerDetail />} />
          <Route path="/berth/:id" element={<TrailerDetail />} />
          <Route path="/transport/:id" element={<TransportDetail />} />
          <Route path="/charter/:id" element={<CharterDetail />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
