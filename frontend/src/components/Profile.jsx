import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { NavLink } from "react-router-dom";

const ProfileDropdown = () => {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user, loginWithRedirect, logout, isLoading } = useAuth0();

  // Debug logging
  useEffect(() => {
    console.log('ProfileDropdown - Auth state:', { isAuthenticated, user, isLoading });
  }, [isAuthenticated, user, isLoading]);

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
    setOpen(false);
  };

  const handleLogin = () => {
    loginWithRedirect();
    setOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (open && !event.target.closest('.profile-dropdown')) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  // Show loading state while Auth0 is initializing
  if (isLoading) {
    return (
      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="relative profile-dropdown">
      {/* Avatar button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 focus:outline-none cursor-pointer hover:opacity-80 transition-opacity"
      >
        {isAuthenticated && user ? (
          <img
            src={user.picture || `https://ui-avatars.com/api/?name=${user.name || user.email}&background=0D9488&color=fff`}
            alt="Profile Avatar"
            className="w-10 h-10 rounded-full border-2 border-transparent hover:border-blue-500 transition-all"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center border-2 border-transparent hover:border-blue-500 transition-all">
            <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </button>

      {/* Dropdown menu */}
      {open && (
        <div
          className="dropdown-menu absolute right-0 mt-2 w-56 bg-white shadow-xl rounded-md overflow-hidden border border-gray-200"
        >
          {isAuthenticated && user ? (
            <>
              <div className="px-4 py-3">
                <h6 className="text-sm font-medium text-gray-900">
                  {user.name || 'User'}
                </h6>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <div className="border-t border-gray-200">
                <NavLink
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  Profile
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="px-4 py-3">
              <p className="text-sm text-gray-600 mb-3 text-center">Sign in to your account</p>
              <button
                onClick={handleLogin}
                className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors"
              >
                Sign in / Sign Up
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
