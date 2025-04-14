import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const StudentNavbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [showProfileModal, setShowProfileModal] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/profile", {
          headers: { Authorization: token },
        });
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };

    fetchProfile();
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleProfileUpdate = async () => {
    try {
      await axios.put("http://localhost:8080/api/profile", profile, {
        headers: { Authorization: token },
      });
      alert("Profile updated successfully!");
      setShowProfileModal(false);
    } catch (err) {
      alert("Failed to update profile");
      console.error(err);
    }
  };

  return (
    <>
      <nav className="bg-white shadow-md px-6 py-4 flex flex-col md:flex-row justify-between items-center">
        {/* Brand */}
        <Link to="/" className="text-2xl font-bold text-purple-700 mb-2 md:mb-0">
          MyLMS
        </Link>

        {/* Search */}
        <div className="flex items-center w-full md:w-auto mb-2 md:mb-0">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="px-4 py-2 border border-gray-300 rounded-l-md w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleSearch}
            className="bg-purple-600 text-white px-4 py-2 rounded-r-md hover:bg-purple-700"
          >
            Search
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-4">
          <Link
            to="/dashboard/student"
            className="text-purple-600 font-semibold hover:underline"
          >
            Dashboard
          </Link>
          <button
            onClick={() => setShowProfileModal(true)}
            className="text-purple-600 font-semibold hover:underline"
          >
            Edit Profile
          </button>
          <button
            onClick={handleLogout}
            className="text-red-600 font-semibold hover:underline"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-bold text-purple-700 mb-4">Edit Profile</h2>
            <label className="block mb-2">
              Name:
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full border rounded px-3 py-2 mt-1"
              />
            </label>
            <label className="block mb-4">
              Email:
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full border rounded px-3 py-2 mt-1"
              />
            </label>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowProfileModal(false)}
                className="px-4 py-2 border rounded text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleProfileUpdate}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentNavbar;
