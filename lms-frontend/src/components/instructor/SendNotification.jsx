// src/pages/instructor/SendNotification.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const SendNotification = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCourses = async () => {
      const res = await axios.get("http://localhost:8080/api/courses/instructor", {
        headers: { Authorization: token },
      });
      setCourses(res.data);
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedCourseId) return;
      const res = await axios.get(`http://localhost:8080/api/enrollments/course/${selectedCourseId}`, {
        headers: { Authorization: token },
      });
      setStudents(res.data);
    };
    fetchStudents();
  }, [selectedCourseId]);

  const handleSend = async () => {
    if (!selectedUserId || !message) return alert("Please select student and write a message.");
    try {
      const res = await axios.post(
        "http://localhost:8080/api/notifications/send",
        { userId: selectedUserId, message },
        { headers: { Authorization: token } }
      );
      alert(res.data); // Notification sent!
      setMessage("");
    } catch (err) {
      console.error("Failed to send notification", err);
      alert("Failed to send notification");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow rounded">
      <h2 className="text-2xl font-bold text-purple-700 mb-4">Send Notification</h2>

      <label className="block mb-2 font-semibold">Select Course:</label>
      <select
        value={selectedCourseId}
        onChange={(e) => setSelectedCourseId(e.target.value)}
        className="w-full border px-3 py-2 rounded mb-4"
      >
        <option value="">-- Select --</option>
        {courses.map((course) => (
          <option key={course.id} value={course.id}>{course.title}</option>
        ))}
      </select>

      {students.length > 0 && (
        <>
          <label className="block mb-2 font-semibold">Select Student:</label>
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="w-full border px-3 py-2 rounded mb-4"
          >
            <option value="">-- Select --</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name} ({student.email})
              </option>
            ))}
          </select>
        </>
      )}

      <textarea
        placeholder="Enter your message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full border px-3 py-2 rounded mb-4"
        rows={4}
      />

      <button
        onClick={handleSend}
        className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800"
      >
        Send Notification
      </button>
    </div>
  );
};

export default SendNotification;
