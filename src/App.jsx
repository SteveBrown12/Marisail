import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Engines from "./pages/Engine";
import Services from "./pages/Service";

import GenericDetail from "./pages/Generic_Detail";

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

          <Route path="/detail/:serviceName/:id" element={<GenericDetail />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
