import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import EnrolledStudents from "./EnrolledStudents";

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedCourse, setExpandedCourse] = useState(null);
  const token = localStorage.getItem("token");

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8080/api/courses/instructor", {
        headers: { Authorization: token },
      });
      setCourses(res.data);
      setError("");
    } catch (err) {
      console.error("Failed to fetch courses", err);
      setError("Failed to load courses. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const toggleStudents = (courseId) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
  };

  if (loading) return <div className="text-center py-4">Loading courses...</div>;
  
  if (error) return (
    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
      {error}
      <button 
        onClick={fetchCourses} 
        className="ml-2 underline text-purple-700"
      >
        Retry
      </button>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-purple-700">My Courses</h2>
        <span className="text-gray-500 text-sm">{courses.length} course(s)</span>
      </div>

      {courses.length === 0 ? (
        <div className="bg-white p-8 rounded shadow text-center">
          <p className="text-gray-600">No courses found. Create your first course above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="p-5 border rounded-lg shadow-sm bg-white hover:shadow transition-shadow">
              <div className="flex justify-between">
                <h3 className="text-lg font-bold text-purple-700">{course.title}</h3>
                <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded">
                  ₹{course.price}
                </span>
              </div>
              
              <p className="text-xs text-gray-500 mb-2">ID: {course.id}</p>
              <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
              
              <button
                onClick={() => toggleStudents(course.id)}
                className="w-full mt-2 bg-purple-50 text-purple-700 border border-purple-200 px-3 py-2 rounded hover:bg-purple-100 transition-colors"
              >
                {expandedCourse === course.id ? "Hide Students" : "View Students"}
              </button>
              
              {expandedCourse === course.id && (
                <div className="mt-4 border-t pt-4">
                  <EnrolledStudents courseId={course.id} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;