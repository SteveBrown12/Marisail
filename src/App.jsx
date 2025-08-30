import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";

import Engines from "./pages/Engine";
import Services from "./pages/Service";
import Register from "./pages/Registration";
import Login from "./pages/Login";
import ProfileCompletion from "./components/ProfileCompletion.jsx";

import Landing from "./pages/Landing"; 
import GenericSearch from "./pages/Generic_Search";
import GenericAdvert from "./pages/Generic_Advert";
import GenericDetail from "./pages/Generic_Detail";

import HeaderNavbar from "./components/HeaderNavbar";
import AuthProvider from "./auth/AuthProvider.jsx";
import RequireAuth from "./components/RequireAuth.jsx";
import useSyncAuthUser from "./hooks/useSyncAuthUser.js";

const Home = () => {  
  // Automatically sync Auth0 user to local DB after login
  useSyncAuthUser();
  
  return (
    <main>
      <HeaderNavbar />
      <Outlet/>
    </main>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/complete-profile" element={<RequireAuth><ProfileCompletion /></RequireAuth>} />

          <Route path="/" element={<Home />} >
            <Route index element={<Landing />} />

            <Route path="/advert/:serviceName" element={<GenericAdvert />} />
            <Route path="/find/:serviceName" element={<GenericSearch />} />

            <Route path="/engines" element={<RequireAuth><Engines type="advert" /></RequireAuth>} />
            <Route path="/advert-engines" element={<RequireAuth><Engines type="search" /></RequireAuth>} />

            <Route path="/services" element={<RequireAuth><Services type="myEngines" /></RequireAuth>} />
            <Route path="/view-berth" element={<RequireAuth><Services type="myBerth" /></RequireAuth>} />
            <Route path="/view-transport" element={<RequireAuth><Services type="myTransport" /></RequireAuth>} />
            <Route path="/view-charter" element={<RequireAuth><Services type="myCharter" /></RequireAuth>} />
            <Route path="/view-trailer" element={<RequireAuth><Services type="myTrailer" /></RequireAuth>} />
            <Route path="/become-sponsor" element={<RequireAuth><Services type="Sponsor" /></RequireAuth>} />

            <Route path="/detail/:serviceName/:id" element={<GenericDetail />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
