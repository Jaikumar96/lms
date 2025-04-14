import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const CourseOverview = ({ courseId }) => {
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(0);
  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem("token");

  const fetchCourseData = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      // Fetch course details
      const courseRes = await axios.get(`http://localhost:8080/api/courses/${courseId}`, {
        headers: { Authorization: token },
      });
      setCourse(courseRes.data);
      
      // Fetch progress data
      try {
        const progressRes = await axios.get(`http://localhost:8080/api/progress/student/1`, {
          headers: { Authorization: token },
        });
        const courseProgress = progressRes.data.find(
          (p) => p.course.id === parseInt(courseId)
        );
        setProgress(courseProgress ? courseProgress.percentage : 0);
      } catch (progressErr) {
        console.warn("Could not fetch progress, using default value", progressErr);
        // Don't set error state for progress issues
      }
      
      // Fetch videos
      const videosRes = await axios.get(`http://localhost:8080/api/courses/${courseId}/videos`, {
        headers: { Authorization: token },
      });
      
      // Sort videos by order
      const sortedVideos = videosRes.data.sort((a, b) => a.order - b.order);
      setVideos(sortedVideos);
      
      // Set first video as current if we have videos and no current video is selected
      if (sortedVideos.length > 0) {
        setCurrentVideo(sortedVideos[0]);
      }
    } catch (err) {
      console.error("Failed to fetch course data", err);
      setError('Failed to load course content. Please try refreshing the page.');
    } finally {
      setLoading(false);
    }
  }, [courseId, token]);

  useEffect(() => {
    fetchCourseData();
  }, [fetchCourseData]);

  // Track video completion
  const handleVideoEnded = async () => {
    try {
      // Here you would typically call an API to update progress
      console.log('Video completed:', currentVideo?.id);
      // Refresh progress data - silently handle errors
      try {
        const progressRes = await axios.get(`http://localhost:8080/api/progress/student/1`, {
          headers: { Authorization: token },
        });
        const courseProgress = progressRes.data.find(
          (p) => p.course.id === parseInt(courseId)
        );
        setProgress(courseProgress ? courseProgress.percentage : 0);
      } catch (err) {
        console.warn("Failed to update progress", err);
        // Don't show error to user for progress updates
      }
    } catch (err) {
      console.warn("Error in video ended handler", err);
    }
  };

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-700 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-purple-700">Loading course content...</p>
        </div>
      </div>
    );
  }



  if (!course) {
    return (
      <div>

      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-purple-700 mb-2">{course.title}</h2>
        <p className="text-gray-600 mb-3">{course.description}</p>
        
        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-purple-600 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {videos.length === 0 ? (
        <div className="bg-purple-50 text-purple-700 p-4 rounded-lg text-center">
          No videos available for this course yet.
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left: Video Player */}
          <div className="md:w-2/3">
            <div className="bg-black rounded-xl overflow-hidden shadow-md">
              {currentVideo && (
                <video
                  key={currentVideo.id}
                  src={`http://localhost:8080${currentVideo.videoUrl}`}
                  controls
                  className="w-full h-[400px] object-contain"
                  onEnded={handleVideoEnded}
                />
              )}
            </div>
            
            {/* Current video title and info */}
            {currentVideo && (
              <div className="mt-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {currentVideo.order}. {currentVideo.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {currentVideo.durationMinutes} minutes
                </p>
              </div>
            )}
          </div>

          {/* Right: Playlist */}
          <div className="md:w-1/3 bg-white rounded-xl shadow-md p-4 max-h-[500px] overflow-y-auto">
            <h3 className="text-lg font-semibold text-purple-700 mb-3 sticky top-0 bg-white pb-2 border-b">
              Course Content ({videos.length} videos)
            </h3>
            
            <div className="space-y-2">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    currentVideo?.id === video.id 
                      ? "bg-purple-100 border-l-4 border-purple-600" 
                      : "hover:bg-gray-50 border-l-4 border-transparent"
                  }`}
                  onClick={() => setCurrentVideo(video)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      currentVideo?.id === video.id 
                        ? "bg-purple-600 text-white" 
                        : "bg-gray-200 text-gray-700"
                    }`}>
                      {video.order}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{video.title}</p>
                      <p className="text-xs text-gray-500">{video.durationMinutes} min</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseOverview;