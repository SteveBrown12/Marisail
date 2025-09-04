import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";

import Services from "./pages/Service";
import Register from "./pages/Registration";
import Login from "./pages/Login";
import ProfileCompletion from "./components/ProfileCompletion.jsx";

import Landing from "./pages/Landing"; 
import GenericSearch from "./pages/Generic_Search";
import GenericAdvert from "./pages/Generic_Advert";
import GenericDetail from "./pages/Generic_Search_Detail";
import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentDemo from "./pages/PaymentDemo";
import Engine from "./pages/Engine";
import HeaderNavbar from "./components/HeaderNavbar";
import AuthProvider from "./auth/AuthProvider.jsx";
import RequireAuth from "./components/RequireAuth.jsx";
import useSyncAuthUser from "./hooks/useSyncAuthUser.js";
import GoogleAnalyticsProvider from "./components/GoogleAnalyticsProvider.jsx";

const Home = () => {  
  // Automatically sync Auth0 user to local DB after login
  useSyncAuthUser();
  
  return (
    <main className="w-full max-w-full overflow-hidden">
      <HeaderNavbar />
      <Outlet/>
    </main>
  );
};

function App() {
  return (
    <GoogleAnalyticsProvider>
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

            <Route path="/engines" element={<RequireAuth><Engine type="advert" /></RequireAuth>} />
            <Route path="/advert-engines" element={<RequireAuth><Engine type="search" /></RequireAuth>} />

            <Route path="/services" element={<RequireAuth><Services type="myEngines" /></RequireAuth>} />
            <Route path="/view-berth" element={<RequireAuth><Services type="myBerth" /></RequireAuth>} />
            <Route path="/view-transport" element={<RequireAuth><Services type="myTransport" /></RequireAuth>} />
            <Route path="/view-charter" element={<RequireAuth><Services type="myCharter" /></RequireAuth>} />
            <Route path="/view-trailer" element={<RequireAuth><Services type="myTrailer" /></RequireAuth>} />
            <Route path="/become-sponsor" element={<RequireAuth><Services type="Sponsor" /></RequireAuth>} />

            <Route path="/detail/:serviceName/:id" element={<GenericDetail />} />
            
            {/* Payment Routes */}
            <Route path="/payment" element={<Payment />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-demo" element={<PaymentDemo />} />
          </Route>
        </Routes>
      </BrowserRouter>
        </AuthProvider>
      </GoogleAnalyticsProvider>
  );
}

export default App;
