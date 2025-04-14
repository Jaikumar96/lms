// src/components/course/VideoTab.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const VideoTab = () => {
  const { courseId } = useParams();
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/courses/${courseId}/videos`, {
          headers: { Authorization: token },
        });
        setVideos(res.data);
      } catch (err) {
        console.error("Failed to fetch videos", err);
        setError("Could not load videos.");
      }
    };

    fetchVideos();
  }, [courseId]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold text-purple-700 mb-4">Course Videos</h2>
      
      {error && <p className="text-red-500">{error}</p>}
      {videos.length === 0 ? (
        <p className="text-gray-500">No videos available for this course.</p>
      ) : (
        <div className="grid gap-6">
          {videos.map((video) => (
            <div key={video.id} className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold text-purple-700 mb-2">{video.title}</h3>
              <video controls width="100%" className="rounded">
                <source src={`http://localhost:8080/${video.filePath}`} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <p className="text-sm text-gray-600 mt-2">Duration: {video.duration} min</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoTab;
