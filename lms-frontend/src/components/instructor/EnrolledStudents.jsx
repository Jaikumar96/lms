import React, { useEffect, useState } from "react";
import axios from "axios";

const EnrolledStudents = ({ courseId }) => {
  const [students, setStudents] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchEnrolledStudents = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/enrollments/course/${courseId}`, {
          headers: { Authorization: token },
        });
        setStudents(res.data);
      } catch (err) {
        console.error("Failed to fetch enrolled students", err);
      }
    };
    fetchEnrolledStudents();
  }, [courseId]);

  return (
    <div className="mt-6">
      <h3 className="text-lg font-bold text-purple-700">Enrolled Students</h3>
      {students.length === 0 ? (
        <p className="text-gray-500 mt-2">No students enrolled yet.</p>
      ) : (
        <ul className="mt-2 space-y-2">
          {students.map((student) => (
            <li key={student.id} className="bg-gray-50 p-3 rounded shadow">
              <p className="text-purple-800 font-semibold">{student.name}</p>
              <p className="text-sm text-gray-600">{student.email}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EnrolledStudents;
