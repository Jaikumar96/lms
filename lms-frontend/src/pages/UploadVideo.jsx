import React, { useState, useEffect } from "react";
import axios from "axios";

const UploadVideo = () => {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    courseId: "",
    title: "",
    order: "",
    durationMinutes: "",
  });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isUploading, setIsUploading] = useState(false);
  
  const token = localStorage.getItem("token");
  
  useEffect(() => {
    // Fetch instructor's courses for the dropdown
    const fetchCourses = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/courses/instructor", {
          headers: { Authorization: token },
        });
        setCourses(res.data);
      } catch (err) {
        console.error("Failed to fetch courses", err);
      }
    };
    
    fetchCourses();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!formData.courseId || !formData.title || !formData.order || !formData.durationMinutes || !file) {
      setMessage({ text: "Please fill all fields", type: "error" });
      return;
    }
    
    setIsUploading(true);
    
    const uploadData = new FormData();
    uploadData.append("title", formData.title);
    uploadData.append("order", formData.order);
    uploadData.append("durationMinutes", formData.durationMinutes);
    uploadData.append("file", file);

    try {
      const response = await axios.post(
        `http://localhost:8080/api/courses/${formData.courseId}/videos`,
        uploadData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage({ text: "Video uploaded successfully!", type: "success" });
      // Reset form after successful upload
      setFormData({
        courseId: "",
        title: "",
        order: "",
        durationMinutes: "",
      });
      setFile(null);
      document.getElementById("file-input").value = "";
    } catch (err) {
      console.error(err);
      setMessage({ 
        text: err.response?.data?.message || "Failed to upload video", 
        type: "error" 
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-bold text-purple-700 mb-6">Upload Course Video</h2>
      
      <form onSubmit={handleUpload} className="space-y-4">
        <select
          name="courseId"
          value={formData.courseId}
          onChange={handleChange}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        >
          <option value="">Select Course</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>
        
        <input
          type="text"
          name="title"
          placeholder="Video Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />
        
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            name="order"
            placeholder="Order in Course"
            value={formData.order}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            min="1"
            required
          />
          
          <input
            type="number"
            name="durationMinutes"
            placeholder="Duration (minutes)"
            value={formData.durationMinutes}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            min="1"
            required
          />
        </div>
        
        <div className="border-2 border-dashed border-gray-300 p-4 rounded">
          <input
            id="file-input"
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="w-full"
            required
          />
          <p className="text-xs text-gray-500 mt-2">Supported formats: MP4, MOV, AVI (max 500MB)</p>
        </div>
        
        <button
          type="submit"
          disabled={isUploading}
          className={`w-full bg-purple-600 text-white py-2 rounded ${
            isUploading ? "opacity-70 cursor-not-allowed" : "hover:bg-purple-700"
          }`}
        >
          {isUploading ? "Uploading..." : "Upload Video"}
        </button>
      </form>
      
      {message.text && (
        <div className={`mt-4 p-3 rounded text-center text-sm ${
          message.type === "error" ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
        }`}>
          {message.type === "error" ? "❌ " : "✅ "}{message.text}
        </div>
      )}
    </div>
  );
};

export default UploadVideo;