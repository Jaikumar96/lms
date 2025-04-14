import React, { useEffect, useState } from "react";
import axios from "axios";

const DiscussionsTab = ({ courseId }) => {
  const [discussions, setDiscussions] = useState([]);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  const fetchDiscussions = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/courses/${courseId}/discussions`, {
        headers: { Authorization: token },
      });
      setDiscussions(res.data);
    } catch (err) {
      console.error("Failed to fetch discussions", err);
    }
  };

  useEffect(() => {
    fetchDiscussions();
  }, [courseId]);

  const handleSubmit = async () => {
    if (!message.trim()) return;

    try {
      await axios.post(
        `http://localhost:8080/api/courses/${courseId}/discussions`,
        { message },
        { headers: { Authorization: token } }
      );
      setMessage("");
      fetchDiscussions(); // Refresh
    } catch (err) {
      alert("Failed to post discussion.");
      console.error(err);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Discussions</h3>
      <div className="space-y-4 mb-6">
        {discussions.map((d) => (
          <div key={d.id} className="bg-white p-4 shadow rounded">
            <p className="text-gray-800 font-semibold">{d.author?.name}</p>
            <p className="text-gray-600">{d.message}</p>
            <p className="text-xs text-gray-400">{new Date(d.timestamp).toLocaleString()}</p>
          </div>
        ))}
      </div>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask a question..."
        className="w-full p-3 border rounded mb-2"
      />
      <button
        onClick={handleSubmit}
        className="bg-purple-700 text-white px-4 py-2 rounded"
      >
        Post Message
      </button>
    </div>
  );
};

export default DiscussionsTab;
