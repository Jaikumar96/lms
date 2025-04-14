// src/components/instructor/CourseContent.jsx
import React, { useState } from "react";
import axios from "axios";

const CourseContent = () => {
  const [courseId, setCourseId] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  const handleUpload = async () => {
    if (!courseId || !file) return alert("Course ID and file are required");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(`http://localhost:8080/api/materials/upload?courseId=${courseId}`, formData, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage("Material uploaded successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Upload failed");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-purple-700 mb-4">Upload Materials</h2>
      <input
        type="text"
        placeholder="Course ID"
        value={courseId}
        onChange={(e) => setCourseId(e.target.value)}
        className="border p-2 rounded w-full mb-2"
      />
      <input type="file" onChange={(e) => setFile(e.target.files[0])} className="mb-2" />
      <button onClick={handleUpload} className="bg-purple-600 text-white px-4 py-2 rounded">Upload</button>
      {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}
    </div>
  );
};

export default CourseContent;
