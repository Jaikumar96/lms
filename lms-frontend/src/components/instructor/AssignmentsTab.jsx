import React, { useState } from "react";
import axios from "axios";

const AssignmentsTab = () => {
  const [courseId, setCourseId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [assignments, setAssignments] = useState([]);
  const [submissionAssignmentId, setSubmissionAssignmentId] = useState("");
  const [submissions, setSubmissions] = useState([]);

  const token = localStorage.getItem("token");

  // Create Assignment
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
      setCourseId("");
    } catch (err) {
      console.error("Failed to create assignment", err);
      alert("Error creating assignment");
    }
  };

  // Fetch student submissions
  const fetchSubmissions = async () => {
    if (!submissionAssignmentId) return alert("Please enter assignment ID");
    try {
      const res = await axios.get(
        `http://localhost:8080/api/assignments/submissions/${submissionAssignmentId}`,
        {
          headers: { Authorization: token },
        }
      );
      setSubmissions(res.data);
    } catch (err) {
      console.error("Failed to fetch submissions", err);
      alert("Error fetching submissions");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-10">
      {/* SECTION 1: CREATE ASSIGNMENT */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold text-purple-700 mb-4">Create Assignment</h2>

        <input
          type="text"
          placeholder="Course ID"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          className="w-full border p-2 rounded mb-2"
        />
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

        <button
          onClick={handleCreate}
          className="bg-purple-700 text-white px-4 py-2 rounded"
        >
          Create
        </button>
      </div>

      {/* SECTION 2: VIEW SUBMISSIONS */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold text-purple-700 mb-4">View Submissions</h2>
        <input
          type="text"
          placeholder="Assignment ID"
          value={submissionAssignmentId}
          onChange={(e) => setSubmissionAssignmentId(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        />
        <button
          onClick={fetchSubmissions}
          className="bg-purple-600 text-white px-4 py-2 rounded mb-4"
        >
          Load Submissions
        </button>

        {submissions.length > 0 ? (
          <ul className="space-y-4 mt-2">
            {submissions.map((s) => (
              <li key={s.submissionId} className="border-b pb-2">
                <p className="text-purple-700 font-semibold">
                  {s.studentName} ({s.studentEmail})
                </p>
                <a
                  href={s.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Download Submission
                </a>
                <p className="text-gray-500 text-sm">
                  Submitted At: {new Date(s.submittedAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No submissions found.</p>
        )}
      </div>
    </div>
  );
};

export default AssignmentsTab;
