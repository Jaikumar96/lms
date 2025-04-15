import React, { useEffect, useState } from "react";
import axios from "axios";

const AssignmentsTab = ({ courseId }) => {
  const [assignments, setAssignments] = useState([]);
  const [files, setFiles] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/assignments/course/${courseId}`, {
          headers: { Authorization: token },
        });
        setAssignments(res.data);
      } catch (err) {
        console.error("Failed to fetch assignments", err);
      }
    };

    fetchAssignments();
  }, [courseId]);

  const handleFileChange = (assignmentId, file) => {
    setFiles((prev) => ({ ...prev, [assignmentId]: file }));
  };

  const handleSubmit = async (assignmentId) => {
    const file = files[assignmentId];
    if (!file) return alert("Please upload a file");

    const formData = new FormData();
    formData.append("assignmentId", assignmentId);
    formData.append("file", file);

    try {
      await axios.post(`http://localhost:8080/api/assignments/submit`, formData, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Assignment submitted!");
    } catch (err) {
      console.error("Submission failed", err);
      alert("Submission failed");
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4 text-purple-700">Assignments</h3>
      {assignments.length === 0 ? (
        <p className="text-gray-500">No assignments available.</p>
      ) : (
        <div className="space-y-6">
          {assignments.map((a) => (
            <div key={a.id} className="bg-white p-4 shadow rounded">
              <h4 className="font-semibold text-purple-700">{a.title}</h4>
              <p className="text-gray-600 mb-2">{a.description}</p>
              <p className="text-sm text-gray-400 mb-2">Due: {a.dueDate}</p>

              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => handleFileChange(a.id, e.target.files[0])}
                className="mb-2"
              />

              <button
                onClick={() => handleSubmit(a.id)}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                Submit PDF
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignmentsTab;
