import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const InstructorNavbar = () => {
  const [showModal, setShowModal] = useState(false);
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/profile", {
        headers: { Authorization: token },
      });
      setProfile(res.data);
    } catch (err) {
      console.error("Failed to load profile", err);
    }
  };

  const updateProfile = async () => {
    try {
      setLoading(true);
      await axios.put("http://localhost:8080/api/profile", profile, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });
      alert("Profile updated successfully");
      setShowModal(false);
    } catch (err) {
      console.error("Failed to update profile", err);
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showModal) {
      fetchProfile();
    }
  }, [showModal]);

  return (
    <>
      <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
        <Link to="/" className="text-2xl font-bold text-purple-700 hover:underline">
          MyLMS
        </Link>
        <div className="flex space-x-6">
          <Link to="/dashboard/instructor" className="text-purple-600 font-semibold hover:underline">
            Dashboard
          </Link>
          <Link to="/dashboard/instructor/courses" className="text-purple-600 font-semibold hover:underline">
            My Courses
          </Link>
          <Link to="/dashboard/instructor/notify" className="text-purple-600 font-semibold hover:underline">
            Notify Students
          </Link>


          <button
            onClick={() => setShowModal(true)}
            className="text-purple-600 font-semibold hover:underline"
          >
            Profile
          </button>
          <Link to="/" className="text-red-500 font-semibold hover:underline">
            Logout
          </Link>
        </div>
      </nav>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h3 className="text-xl font-semibold text-purple-700 mb-4">Edit Profile</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  readOnly
                  className="w-full border p-2 rounded bg-gray-100"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={updateProfile}
                  disabled={loading}
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InstructorNavbar;
