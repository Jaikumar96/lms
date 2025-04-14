// src/SearchResults.jsx
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
 


const SearchResults = () => {
  const location = useLocation();
  const [courses, setCourses] = useState([]);
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('query');

  const token = localStorage.getItem("token"); // ✅ Get token

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/courses/search?title=${query}`);
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    };

    if (query) fetchResults();
  }, [query]);

  // ✅ Enroll handler
  const handleEnroll = async (courseId) => {
    try {
      const res = await axios.post(
        `http://localhost:8080/api/courses/${courseId}/enroll`,
        {},
        {
          headers: { Authorization: token },
        }
      );
      alert(res.data); // "Enrolled successfully"
    } catch (err) {
      alert("Enrollment failed: " + (err.response?.data || "Unknown error"));
      console.error(err);
    }
  };

  return (
    <>

      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-purple-700">Search Results for "{query}"</h2>
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {courses.map((course) => (
              <div key={course.id} className="border p-4 rounded shadow bg-white">
                <h3 className="text-lg font-semibold text-purple-700">{course.title}</h3>
                <p className="text-gray-600">Instructor: {course.instructor?.name || "Unknown"}</p>
                <p className="text-purple-700 font-bold">₹{course.price}</p>
                <button
                  onClick={() => handleEnroll(course.id)}
                  className="mt-3 bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800"
                >
                  Enroll Now
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>No courses found.</p>
        )}
      </div>
    </>
  );
};

export default SearchResults;
