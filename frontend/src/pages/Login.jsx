import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Login = () => {
  const { loginWithRedirect, isAuthenticated, isLoading, user, logout } = useAuth0();

  // If already authenticated, show logout option
  if (isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white rounded-md shadow-md p-6 w-full max-w-sm">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
              {user?.picture ? (
                <img src={user.picture} alt="Profile" className="w-20 h-20 rounded-full" />
              ) : (
                <span className="text-2xl text-gray-500">
                  {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </span>
              )}
            </div>
            <h2 className="text-xl font-semibold mb-2">Welcome, {user?.name || user?.email}!</h2>
            <p className="text-gray-600 mb-4">You are successfully logged in.</p>
            <button
              onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md font-medium transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white rounded-md shadow-md p-6 w-full max-w-sm">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show login form
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-md shadow-md p-6 w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center mb-6">Welcome to Marisail</h2>
        <div className="space-y-4">
          <button
            onClick={() => loginWithRedirect()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-medium transition-colors duration-200 flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Sign In / Sign Up
          </button>
          <p className="text-center text-sm text-gray-600">
            Secure authentication powered by Auth0
          </p>
          <p className="text-center text-xs text-gray-500">
            Supports Google, Facebook, Twitter, and email
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
