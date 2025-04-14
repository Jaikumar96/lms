import React, { useEffect, useState } from "react";
import axios from "axios";

const GradesTab = ({ courseId }) => {
  const [grade, setGrade] = useState(null);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchGrade = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/courses/${courseId}/grade`, {
          headers: { Authorization: token },
        });
        setGrade(res.data);
      } catch (err) {
        setError("Failed to fetch grade.");
        console.error(err);
      }
    };

    fetchGrade();
  }, [courseId]);

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Your Grade</h3>
      {error && <p className="text-red-500">{error}</p>}
      {grade ? (
        <div className="bg-white p-4 shadow rounded">
          <p><strong>Status:</strong> {grade.status}</p>
          <p><strong>Total Score:</strong> {grade.totalScore}</p>
        </div>
      ) : (
        <p className="text-gray-500">No grade available.</p>
      )}
    </div>
  );
};

export default GradesTab;
