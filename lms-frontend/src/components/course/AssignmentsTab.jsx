import React, { useEffect, useState } from "react";
import axios from "axios";

const AssignmentsTab = ({ courseId }) => {
  const [assignments, setAssignments] = useState([]);
  const [submissionContent, setSubmissionContent] = useState({});
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

  const handleSubmit = async (assignmentId) => {
    try {
      await axios.post(
        `http://localhost:8080/api/assignments/submit`,
        {
          assignmentId,
          content: submissionContent[assignmentId] || "",
        },
        { headers: { Authorization: token } }
      );
      alert("Assignment submitted!");
    } catch (err) {
      alert("Submission failed.");
      console.error(err);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Assignments</h3>
      {assignments.length === 0 ? (
        <p className="text-gray-500">No assignments available.</p>
      ) : (
        <div className="space-y-6">
          {assignments.map((a) => (
            <div key={a.id} className="bg-white p-4 shadow rounded">
              <h4 className="font-semibold">{a.title}</h4>
              <textarea
                rows={3}
                className="w-full mt-2 p-2 border rounded"
                placeholder="Enter your answer..."
                value={submissionContent[a.id] || ""}
                onChange={(e) =>
                  setSubmissionContent((prev) => ({ ...prev, [a.id]: e.target.value }))
                }
              />
              <button
                onClick={() => handleSubmit(a.id)}
                className="mt-2 bg-purple-600 text-white px-4 py-2 rounded"
              >
                Submit
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignmentsTab;
