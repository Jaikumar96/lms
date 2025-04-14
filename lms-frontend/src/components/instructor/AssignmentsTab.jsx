// src/components/instructor/AssignmentsTab.jsx
import React, { useState } from "react";
import axios from "axios";

const AssignmentsTab = () => {
  const [courseId, setCourseId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignments, setAssignments] = useState([]);

  const token = localStorage.getItem("token");

  const fetchAssignments = async () => {
    if (!courseId) return;
    try {
      const res = await axios.get(
        `http://localhost:8080/api/assignments/course/${courseId}`,
        { headers: { Authorization: token } }
      );
      setAssignments(res.data);
    } catch (err) {
      console.error("Failed to fetch assignments", err);
    }
  };

  const handleCreate = async () => {
    if (!title || !description || !dueDate || !courseId) {
      alert("All fields are required!");
      return;
    }
    try {
      await axios.post(
        "http://localhost:8080/api/assignments/create",
        { title, description, dueDate, courseId },
        { headers: { Authorization: token } }
      );
      alert("Assignment created successfully!");
      setTitle("");
      setDescription("");
      setDueDate("");
      fetchAssignments(); // refresh
    } catch (err) {
      console.error("Failed to create assignment", err);
      alert("Error creating assignment");
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-2xl font-bold text-purple-700 mb-4">Assignments</h2>

      {/* Course ID Input */}
      <input
        type="text"
        placeholder="Course ID"
        value={courseId}
        onChange={(e) => setCourseId(e.target.value)}
        className="w-full border p-2 rounded mb-4"
      />

      {/* Assignment Form */}
      <input
        type="text"
        placeholder="Assignment Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border p-2 rounded mb-2"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border p-2 rounded mb-2"
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="w-full border p-2 rounded mb-4"
      />

      {/* Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={handleCreate}
          className="bg-purple-700 text-white px-4 py-2 rounded"
        >
          Create Assignment
        </button>
        <button
          onClick={fetchAssignments}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          Load Assignments
        </button>
      </div>

      {/* Assignment List */}
      {assignments.length === 0 ? (
        <p className="text-gray-600">No assignments found.</p>
      ) : (
        <ul className="bg-white p-4 rounded shadow space-y-4">
          {assignments.map((a) => (
            <li key={a.id} className="border-b pb-2">
              <p className="font-semibold text-purple-700">{a.title}</p>
              <p className="text-gray-600">{a.description}</p>
              <p className="text-sm text-gray-500">Due: {a.dueDate}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AssignmentsTab;
