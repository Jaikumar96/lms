import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

// Component imports
import CourseOverview from "../components/course/CourseOverview";
import MaterialsTab from "../components/course/MaterialsTab";
import AssignmentsTab from "../components/course/AssignmentsTab";
import QuizzesTab from "../components/course/QuizzesTab";
import GradesTab from "../components/course/GradesTab";
import CertificateTab from "../components/course/CertificateTab";
import DiscussionsTab from "../components/course/DiscussionsTab";
import ReviewsTab from "../components/course/ReviewsTab";
import VideoTab from "../components/course/VideoTab";

const StudentCourseDetails = () => {
  const { courseId } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(0);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCourse();
    fetchProgress();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/courses/${courseId}`, {
        headers: { Authorization: token },
      });
      setCourse(res.data);
    } catch (err) {
      console.error("Failed to fetch course info", err);
    }
  };

  const fetchProgress = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/progress/student/1`, {
        headers: { Authorization: token },
      });

      const courseProgress = res.data.find(p => p.course.id == courseId);
      setProgress(courseProgress?.percentage || 0);
    } catch (err) {
      console.error("Failed to fetch progress", err);
    }
  };

  if (!course) return <p className="p-4">Loading course info...</p>;

  // ✅ Tabs Array
  const tabs = [
  
    "materials",
    "assignments",
    "quizzes",
    "grades",
    "certificate",
    "discussions",
    "reviews",
  ];
  

  return (
    <div className="p-6">

      <CourseOverview courseId={courseId} />



      {/* ✅ Tabs Navigation */}
      <div className="flex gap-4 mt-6 border-b pb-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-t-md font-semibold ${activeTab === tab ? "bg-purple-700 text-white" : "bg-gray-200"
              }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* ✅ Active Tab Display */}
      <div className="mt-6">
        {activeTab === "overview" && <CourseOverview course={course} progress={progress} />}
        {activeTab === "materials" && <MaterialsTab courseId={courseId} />}
        {activeTab === "assignments" && <AssignmentsTab courseId={courseId} />}
        {activeTab === "quizzes" && <QuizzesTab courseId={courseId} />}
        {activeTab === "grades" && <GradesTab courseId={courseId} />}
        {activeTab === "certificate" && (
          <CertificateTab courseId={courseId} progress={progress} />
        )}
        {activeTab === "discussions" && <DiscussionsTab courseId={courseId} />}
        {activeTab === "reviews" && <ReviewsTab courseId={courseId} />}

      </div>
    </div>
  );
};

export default StudentCourseDetails;
