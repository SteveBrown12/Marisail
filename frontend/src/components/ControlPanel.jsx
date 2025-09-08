import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import image from "/images/engine.jpg";

// =================================================================
// ## 1. ViewControls Component (Styling Adjusted) ##
// =================================================================

export const ViewControls = ({
  viewMode,
  onViewChange,
  sortOptions,
  sortConfig,
  onSortChange,
  itemsPerPage,
  onItemsPerPageChange,
}) => {
  const baseButtonClass = "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150";
  const selectedButtonClass = "bg-white border border-gray-300 shadow-sm text-gray-800";
  const unselectedButtonClass = "bg-transparent border border-transparent text-gray-600 hover:bg-gray-100";

  return (
    <div className="flex justify-between items-center gap-4">
      <div className="flex items-center p-1 bg-gray-100 rounded-lg">
        <button
          onClick={() => onViewChange("grid")}
          className={`${baseButtonClass} ${viewMode === 'grid' ? selectedButtonClass : unselectedButtonClass}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3z"/>
          </svg>
          <span>Grid View</span>
        </button>
        <button
          onClick={() => onViewChange("list")}
          className={`${baseButtonClass} ${viewMode === 'list' ? selectedButtonClass : unselectedButtonClass}`}
        >
           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
          </svg>
          <span>List View</span>
        </button>
      </div>

      {/* Dropdowns */}
      <div className="flex items-center gap-4">
        <select
          id="sort-by"
          value={sortConfig.key}
          onChange={(e) => onSortChange(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="default" disabled={sortConfig.key !== 'default'}>Sort by</option>
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          id="per-page"
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="" disabled>Per page</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
      </div>
    </div>
  );
};

ViewControls.propTypes = {
  viewMode: PropTypes.oneOf(["grid", "list"]).isRequired,
  onViewChange: PropTypes.func.isRequired,
  sortOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    })
  ).isRequired,
  sortConfig: PropTypes.shape({
    key: PropTypes.string,
    direction: PropTypes.string,
  }).isRequired,
  onSortChange: PropTypes.func.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  onItemsPerPageChange: PropTypes.func.isRequired,
};

// =================================================================
// ## 2. Pagination Component (Styling Adjusted) ##
// =================================================================

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) {
    return null;
  }

  return (
    // Outer margin, padding, border and background removed
    <div className="flex justify-between items-center">
      <div className="flex-1 flex justify-between sm:justify-end gap-3">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <div className="flex items-center">
            <p className="text-sm text-gray-700">
                Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
            </p>
        </div>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};


// =================================================================
// ## 3. List Item Components (No changes) ##
// =================================================================

// A generic List Item wrapper to keep styling consistent
const ListItemWrapper = ({ to, children }) => (
  <Link to={to} className="block no-underline hover:no-underline">
    <div className="flex items-center bg-white p-3 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-100 gap-4">
      {children}
    </div>
  </Link>
);

ListItemWrapper.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export const BerthListItem = ({ item }) => {
  const formattedPrice = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(item.Price_PA || item.Price_PCM || item.Price_PW || 0);
  return (
    <ListItemWrapper to={`/detail/berth/${item.Berth_ID}`}>
      <img src={image} className="w-24 h-24 object-cover rounded-md flex-shrink-0" alt="berth"/>
      <div className="flex-grow">
        <h4 className="font-bold text-gray-800">{item.Type}</h4>
        <p className="text-sm text-gray-500">{item.Location}</p>
        <p className="text-lg font-semibold text-green-600 mt-1">{formattedPrice}</p>
      </div>
    </ListItemWrapper>
  );
};

export const TrailerListItem = ({ item }) => {
    const formattedPrice = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(item.Asking_Price || 0);
    return (
    <ListItemWrapper to={`/detail/trailer/${item.Trailer_ID}`}>
      <img src={image} className="w-24 h-24 object-cover rounded-md flex-shrink-0" alt="trailer"/>
      <div className="flex-grow">
        <h4 className="font-bold text-gray-800">{item.Make} {item.Model} ({item.Year})</h4>
        <p className="text-sm text-gray-500">Asking Price</p>
        <p className="text-lg font-semibold text-green-600 mt-1">{formattedPrice}</p>
      </div>
    </ListItemWrapper>
  );
};

export const TransportListItem = ({ item }) => {
    const formattedPrice = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(item.Quote_Value || 0);
    return (
    <ListItemWrapper to={`/detail/transport/${item.Transport_ID}`}>
      <img src={image} className="w-24 h-24 object-cover rounded-md flex-shrink-0" alt="transport"/>
      <div className="flex-grow">
        <h4 className="font-bold text-gray-800">{item.Category}</h4>
        <p className="text-sm text-gray-500">{item.Departure_Destination}</p>
        <p className="text-lg font-semibold text-green-600 mt-1">{formattedPrice}</p>
      </div>
    </ListItemWrapper>
  );
};

export const EngineListItem = ({ item }) => {
    const formattedPrice = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(item.asking_price || 0);
    return (
    <ListItemWrapper to={`/detail/engines/${item.engine_id}`}>
      <img src={image} className="w-24 h-24 object-cover rounded-md flex-shrink-0" alt="engine"/>
      <div className="flex-grow">
        <h4 className="font-bold text-gray-800">{item.Engine_Make} {item.Engine_Model}</h4>
        <p className="text-sm text-gray-500">Year: {item.Engine_Model_Year}</p>
        <p className="text-lg font-semibold text-green-600 mt-1">{formattedPrice}</p>
      </div>
    </ListItemWrapper>
  );
};

export const CharterListItem = ({ item }) => {
    const displayPrice = item.Summerrate_Per_Week || item.Total_Price || (item.Summerrate_Per_Night * 7) || 0;
    const formattedPrice = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(displayPrice);
    return (
    <ListItemWrapper to={`/detail/charter/${item.Charter_ID}`}>
      <img src={image} className="w-24 h-24 object-cover rounded-md flex-shrink-0" alt="charter"/>
      <div className="flex-grow">
        <h4 className="font-bold text-gray-800">{item.Yacht_Decor}</h4>
        <p className="text-sm text-gray-500">{item.Crew_Accommodation}</p>
        <p className="text-lg font-semibold text-green-600 mt-1">{formattedPrice} / week</p>
      </div>
    </ListItemWrapper>
  );
};

BerthListItem.propTypes = TrailerListItem.propTypes = TransportListItem.propTypes = EngineListItem.propTypes = CharterListItem.propTypes = {
  item: PropTypes.object.isRequired
};