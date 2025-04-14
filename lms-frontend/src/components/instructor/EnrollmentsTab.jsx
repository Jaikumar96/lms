// src/components/instructor/EnrollmentsTab.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const EnrollmentsTab = () => {
  const [courseId, setCourseId] = useState("");
  const [progressData, setProgressData] = useState([]);
  const token = localStorage.getItem("token");

  const fetchProgress = async () => {
    if (!courseId) return;
    try {
      const res = await axios.get(`http://localhost:8080/api/progress/course/${courseId}`, {
        headers: { Authorization: token },
      });
      setProgressData(res.data);
    } catch (err) {
      console.error("Failed to fetch progress data", err);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-purple-700 mb-4">Enrolled Students & Progress</h2>
      <input
        type="text"
        placeholder="Course ID"
        value={courseId}
        onChange={(e) => setCourseId(e.target.value)}
        className="border p-2 rounded w-full mb-3"
      />
      <button onClick={fetchProgress} className="bg-purple-600 text-white px-4 py-2 rounded mb-4">
        Load Progress
      </button>

      {progressData.length === 0 ? (
        <p>No student data found.</p>
      ) : (
        <div className="bg-white p-4 rounded shadow">
          <table className="w-full text-left">
            <thead>
              <tr className="text-purple-700 border-b">
                <th className="py-2">Student</th>
                <th>Progress (%)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {progressData.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="py-2">{p.student.name}</td>
                  <td>{p.percentage}</td>
                  <td>{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EnrollmentsTab;
