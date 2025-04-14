import React, { useState } from "react";

import { Link, useNavigate } from "react-router-dom";


const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white shadow-md">
      {/* Logo / Brand */}
      <Link to="/" className="text-2xl font-bold text-purple-700 hover:underline">
  MyLMS
</Link>


      {/* Search Bar */}
      <div className="mt-2 sm:mt-0 flex items-center w-full sm:w-auto">
        <input
          type="text"
          placeholder="Search courses by title or instructor..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="w-full sm:w-72 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={handleSearch}
          className="bg-purple-600 text-white px-4 py-2 rounded-r-md hover:bg-purple-700"
        >
          Search
        </button>
      </div>

      {/* Auth Links */}
      <div className="mt-2 sm:mt-0 flex space-x-4">
        <a
          href="/login"
          className="text-purple-600 font-semibold hover:underline"
        >
          Login
        </a>
        <a
          href="/register"
          className="text-purple-600 font-semibold hover:underline"
        >
          Sign Up
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
