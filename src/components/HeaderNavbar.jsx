import { useState } from "react";
import { NavLink } from "react-router-dom";
import BrandIcon from "./BrandIcon";
import ProfileDropdown from "./Profile";
import PropTypes from "prop-types";

const menuItems = [
  {
    title: "boats",
    links: [
      { to: "/", label: "buy" },
      { to: "/", label: "sell" },
    ],
  },
  {
    title: "berths",
    links: [
      { to: "/find/berth", label: "find a berth" },
      { to: "/advert/berth", label: "advertise a berth" },
    ],
  },
  {
    title: "engines",
    links: [
      { to: "/engines", label: "find an engine" },
      { to: "/advert-engines", label: "advertise an engine" },
    ],
  },
  {
    title: "transportation",
    links: [
      { to: "/find/transport", label: "find a transportation" },
      { to: "/advert/transport", label: "advertise a transportation" },
    ],
  },
  {
    title: "trailers",
    links: [
      { to: "/find/trailer", label: "find a trailer" },
      { to: "/advert/trailer", label: "advertise a trailer" },
    ],
  },
  {
    title: "charters",
    links: [
      { to: "/find/charter", label: "find a charter" },
      { to: "/advert/charter", label: "advertise a charter" },
    ],
  },
  {
    title: "services",
    links: [
      { to: "/services", label: "My Engines" },
      { to: "/view-charter", label: "My Charters" },
      { to: "/view-trailer", label: "My Trailers" },
      { to: "/view-berth", label: "My Berths" },
      { to: "/view-transport", label: "My Transport" },
      { to: "/become-sponsor", label: "Become Sponsor" },
    ],
  },
];

const HeaderNavbar = ({ navbarRef }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      ref={navbarRef}
      className="bg-white shadow-sm sticky top-0 z-50 font-medium uppercase"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <NavLink
            to="/"
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <BrandIcon />
            <h1 className="text-lg tracking-wide">Marisail</h1>
          </NavLink>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-md text-blue-600 hover:bg-blue-50"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Desktop menu */}
          <nav className="hidden lg:flex space-x-8 items-center">
            {menuItems.map((menu) => (
              <div key={menu.title} className="relative group">
                <button className="hover:text-blue-600 tracking-wide cursor-pointer">
                  {menu.title.toUpperCase()}
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all">
                  {menu.links.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      className="block px-4 py-2 text-sm capitalize hover:bg-blue-50 hover:text-blue-600"
                    >
                      {link.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
            {/* Profile */}
            <div className="hidden lg:block">
              <ProfileDropdown />
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t shadow-md">
          <nav className="flex flex-col p-4 space-y-4">
            {menuItems.map((menu) => (
              <div key={menu.title}>
                <p className="font-bold text-gray-800">{menu.title}</p>
                <div className="ml-3 flex flex-col space-y-1">
                  {menu.links.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      className="text-sm capitalize hover:text-blue-600"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
            <div className="pt-4 border-t">
              <ProfileDropdown />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

HeaderNavbar.propTypes = {
  navbarRef: PropTypes.object,
};

export default HeaderNavbar;
