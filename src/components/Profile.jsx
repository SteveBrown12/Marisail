import { useState } from "react";

const ProfileDropdown = () => {
  const [open, setOpen] = useState(false);

  const user = {
    name: "Maulik Solanki",
    email: "mauliksolanki2002@gmail.com",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToiRnzzyrDtkmRzlAvPPbh77E-Mvsk3brlxQ&s",
  };

  return (
    <div className="relative">
      {/* Avatar button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 focus:outline-none cursor-pointer"
      >
        <img
          src={user?.avatar}
          alt="Profile Avatar"
          className="w-10 h-10 rounded-full border-2 border-transparent hover:border-blue-500 transition-all"
        />
      </button>

      {/* Dropdown menu */}
      {open && (
        <div
          className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-md overflow-hidden z-50"
          onMouseLeave={() => setOpen(false)}
        >
          {user ? (
            <>
              <div className="px-4 py-3">
                <h6 className="text-sm font-medium text-gray-900">
                  {user.name}
                </h6>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <div className="border-t border-gray-200">
                <a
                  href="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </a>
                <a
                  href="/logout"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </a>
              </div>
            </>
          ) : (
            <div className="px-4 py-3">
              <a
                href="/login"
                className="block text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Login
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
