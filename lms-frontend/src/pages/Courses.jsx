import React, { useEffect, useState } from "react";
import axios from "axios";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [instructorId, setInstructorId] = useState("");

  const token = localStorage.getItem("token");

  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/courses");
      setCourses(res.data);
    } catch (err) {
      console.error("Failed to fetch courses", err);
    }
  };

  const handleSearch = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/courses/search?title=${search}`
      );
      setCourses(res.data);
    } catch (err) {
      console.error("Search failed", err);
    }
  };

  const handlePriceFilter = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/courses/filter/price?min=${minPrice}&max=${maxPrice}`
      );
      setCourses(res.data);
    } catch (err) {
      console.error("Price filter failed", err);
    }
  };

  const handleInstructorFilter = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/courses/filter/instructor?instructorId=${instructorId}`
      );
      setCourses(res.data);
    } catch (err) {
      console.error("Instructor filter failed", err);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      const res = await axios.post(
        `http://localhost:8080/api/courses/${courseId}/enroll`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );
      alert(res.data); // "Enrolled successfully"
    } catch (err) {
      alert("Failed to enroll: " + err.response?.data || "Unknown error");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-4 text-purple-700">Courses</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by title"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded"
        />
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>
        <input
          type="number"
          placeholder="Instructor ID"
          value={instructorId}
          onChange={(e) => setInstructorId(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      <div className="flex gap-4 mb-6">
        <button onClick={handleSearch} className="bg-purple-600 text-white px-4 py-2 rounded">
          Search
        </button>
        <button onClick={handlePriceFilter} className="bg-purple-600 text-white px-4 py-2 rounded">
          Filter by Price
        </button>
        <button onClick={handleInstructorFilter} className="bg-purple-600 text-white px-4 py-2 rounded">
          Filter by Instructor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="p-4 border rounded shadow bg-white">
            <h3 className="text-xl font-semibold text-purple-700">{course.title}</h3>
            <p className="text-gray-600">{course.description}</p>
            <p className="mt-2 font-bold text-green-600">₹{course.price}</p>
            <p className="text-sm text-gray-500">
              Instructor: {course.instructor?.name || "Unknown"}
            </p>
            <button
              onClick={() => handleEnroll(course.id)}
              className="mt-4 bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800"
            >
              Enroll Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
