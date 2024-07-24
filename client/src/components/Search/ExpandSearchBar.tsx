import React, { useState } from "react";

const ExpandSearchBar = React.memo(() => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSearch = () => {
    setIsExpanded((prevExpanded) => !prevExpanded);
  };

  return (
    <div className="relative w-64">
      <div
        className={`flex items-center border border-gray-300 rounded-lg px-3 py-2 ${
          isExpanded ? "w-auto" : "w-0"
        }`}
      >
        {/* Search Input */}
        <input
          type="text"
          className={`${
            isExpanded
              ? "pl-3 pr-10 " // Expanded: Add padding on the left to show input text
              : "pl-10 pr-3 w-0" // Collapsed: Add padding on the right to hide input text
          } outline-none bg-gray-100 text-sm px-3 py-2 font-semibold text-gray-800 rounded-lg transition-all duration-300 flex-grow`}
          placeholder="Search..."
        />

        {/* Search Icon (on right side) */}
        <svg
          className="h-5 w-5 text-gray-500 cursor-pointer absolute right-3 top-2/4 transform -translate-y-2/4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          onClick={toggleSearch}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </div>
    </div>
  );
});

export default ExpandSearchBar;
