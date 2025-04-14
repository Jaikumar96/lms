// src/components/instructor/GradesReviewsTab.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const GradesReviewsTab = () => {
  const [courseId, setCourseId] = useState("");
  const [grade, setGrade] = useState(null);
  const [reviews, setReviews] = useState([]);
  const token = localStorage.getItem("token");

  const fetchGradeAndReviews = async () => {
    if (!courseId) return;
    try {
      const gradeRes = await axios.get(`http://localhost:8080/api/courses/${courseId}/grade`, {
        headers: { Authorization: token },
      });
      setGrade(gradeRes.data);

      const reviewRes = await axios.get(`http://localhost:8080/api/courses/${courseId}/reviews`, {
        headers: { Authorization: token },
      });
      setReviews(reviewRes.data);
    } catch (err) {
      console.error("Failed to fetch grade or reviews", err);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-purple-700 mb-4">Grades & Reviews</h2>
      <input
        type="text"
        placeholder="Course ID"
        value={courseId}
        onChange={(e) => setCourseId(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />
      <button onClick={fetchGradeAndReviews} className="bg-purple-600 text-white px-4 py-2 rounded mb-6">
        Load Grades & Reviews
      </button>

      {grade && (
        <div className="mb-6 bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Grade Summary</h3>
          <p><strong>Status:</strong> {grade.status}</p>
          <p><strong>Total Score:</strong> {grade.totalScore}</p>
        </div>
      )}

      {reviews.length > 0 && (
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Student Reviews</h3>
          {reviews.map((r) => (
            <div key={r.id} className="border-b py-2">
              <p className="text-purple-700 font-medium">Rating: {r.rating}</p>
              <p className="text-gray-700 italic">"{r.comment}"</p>
              <p className="text-sm text-gray-400">- {r.student.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GradesReviewsTab;
