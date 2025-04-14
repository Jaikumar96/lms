import React, { useState } from "react";
import axios from "axios";

const CourseCreateTab = () => {
  const initialFormState = {
    title: "",
    description: "",
    price: "",
  };
  
  const [formData, setFormData] = useState(initialFormState);
  const [message, setMessage] = useState({ text: "", isError: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await axios.post("http://localhost:8080/api/courses", formData, {
        headers: { Authorization: token },
      });
      setMessage({ text: "Course created successfully!", isError: false });
      setFormData(initialFormState);
    } catch (err) {
      console.error("Failed to create course", err);
      setMessage({ 
        text: err.response?.data?.message || "Failed to create course. Please try again.", 
        isError: true 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow mb-6">
      <h2 className="text-2xl font-bold text-purple-700 mb-4">Create New Course</h2>
      
      <form onSubmit={handleCreate}>
        <div className="space-y-4">
          <input
            type="text"
            name="title"
            value={formData.title}
            placeholder="Course Title"
            onChange={handleChange}
            required
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          
          <textarea
            name="description"
            value={formData.description}
            placeholder="Course Description"
            onChange={handleChange}
            required
            rows="3"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          
          <input
            type="number"
            name="price"
            value={formData.price}
            placeholder="Price"
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-purple-700 text-white px-6 py-2 rounded ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-purple-800"
            }`}
          >
            {isSubmitting ? "Creating..." : "Create Course"}
          </button>
        </div>
      </form>
      
      {message.text && (
        <p className={`mt-4 text-sm ${
          message.isError ? "text-red-600" : "text-green-600"
        }`}>
          {message.isError ? "❌ " : "✅ "}{message.text}
        </p>
      )}
    </div>
  );
};

export default CourseCreateTab;