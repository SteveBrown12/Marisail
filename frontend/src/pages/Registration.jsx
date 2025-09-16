import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Register = () => {
  const { loginWithRedirect, isAuthenticated, isLoading, user, logout } = useAuth0();
  const [showAuth0Signup, setShowAuth0Signup] = useState(false);

  // If already authenticated, show user info and logout option
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
            <p className="text-gray-600 mb-4">Your account has been created successfully.</p>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">
                <strong>Email:</strong> {user?.email}
              </p>
              {user?.email_verified && (
                <p className="text-sm text-green-600">
                  ✓ Email verified
                </p>
              )}
            </div>
            <button
              onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
              className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white py-2 rounded-md font-medium transition-colors duration-200"
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

  // Show registration options
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-md shadow-md p-6 w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Create an Account
        </h2>
        
        <div className="space-y-4">
          {/* Auth0 Registration Button */}
          <button
            onClick={() => {
              setShowAuth0Signup(true);
              loginWithRedirect({
                screen_hint: 'signup' // This tells Auth0 to show the signup page
              });
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-medium transition-colors duration-200 flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Sign Up with Auth0
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or</span>
            </div>
          </div>

          {/* Legacy Registration Form (Optional - you can remove this) */}
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-3">
              Prefer traditional registration?
            </p>
            <button
              onClick={() => setShowAuth0Signup(false)}
              className="text-blue-600 hover:underline font-medium text-sm"
            >
              Use Legacy Registration Form
            </button>
          </div>

          {/* Legacy Form (Hidden by default) */}
          {!showAuth0Signup && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600 mb-3">
                <strong>Note:</strong> Legacy registration is available but Auth0 is recommended for better security and features.
              </p>
              <button
                onClick={() => setShowAuth0Signup(true)}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-medium transition-colors duration-200"
              >
                Switch to Auth0 Registration
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-sm mt-6 text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline font-medium">
            Login
          </a>
        </p>

        {/* Auth0 Benefits */}
        <div className="mt-6 p-4 bg-blue-50 rounded-md">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Why Auth0 Registration?</h3>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Secure social login (Google, Facebook, Twitter)</li>
            <li>• Two-factor authentication</li>
            <li>• Password strength requirements</li>
            <li>• Email verification</li>
            <li>• Account recovery options</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Register;
