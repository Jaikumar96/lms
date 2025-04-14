// src/components/Courses.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Courses = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/courses')
      .then(response => setCourses(response.data))
      .catch(error => console.error("Error fetching courses:", error));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-purple-700 mb-4">All Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {courses.map(course => (
          <div key={course.id} className="border p-4 rounded-lg shadow hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-gray-800">{course.title}</h3>
            <p className="text-gray-600">{course.description}</p>
            <p className="mt-2 font-medium text-purple-600">Price: ₹{course.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
