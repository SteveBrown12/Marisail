import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";

import Register from "./pages/Registration";
import Login from "./pages/Login";

import Landing from "./pages/Landing"; 
import GenericSearch from "./pages/Generic_Search";
import GenericAdvert from "./pages/Generic_Advert";
import GenericDetail from "./pages/Generic_Search_Detail";
import GenericServices from "./pages/Generic_Services";
import BecomeSponsor from "./pages/Become_Sponsor";

import { HeaderNavbar } from "./components/Header_Components";

const Home = () => {  
  return (
    <main className="w-full max-w-full overflow-hidden">
      <HeaderNavbar />
      <Outlet/>
    </main>
  );
};

const Services = () => {  
  return (
    <main className="w-full max-w-full overflow-hidden">
      <HeaderNavbar />
      <Outlet/>
    </main>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<Home />} >
          <Route index element={<Landing />} />
          <Route path="/advert/:serviceName" element={<GenericAdvert />} />
          <Route path="/find/:serviceName" element={<GenericSearch />} />
          <Route path="/detail/:serviceName/:id" element={<GenericDetail />} />
        </Route>
        
        <Route path="/services" element={<Services />} >
          <Route path="/services/sponsor" element={<BecomeSponsor />} />
          <Route path="/services/:serviceName" element={<GenericServices />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
