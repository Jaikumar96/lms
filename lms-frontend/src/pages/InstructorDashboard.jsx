import React, { useState } from "react";
import MyCourses from "../components/instructor/MyCourses";
import CourseContent from "../components/instructor/CourseContent";
import QuizzesTab from "../components/instructor/QuizzesTab";
import EnrollmentsTab from "../components/instructor/EnrollmentsTab";
import GradesReviewsTab from "../components/instructor/GradesReviewsTab";
import AssignmentsTab from "../components/instructor/AssignmentsTab";
import CourseCreateTab from "../components/instructor/CourseCreateTab";
import { Link } from "react-router-dom";

const InstructorDashboard = () => {
  const [activeTab, setActiveTab] = useState("courses");
  
  const tabs = [
    { id: "courses", label: "My Courses", component: <MyCourses /> },
    { id: "content", label: "Course Content", component: <CourseContent /> },
    { id: "quizzes", label: "Quizzes", component: <QuizzesTab /> },
    { id: "enrollments", label: "Students & Progress", component: <EnrollmentsTab /> },
    { id: "grades", label: "Reviews & Grades", component: <GradesReviewsTab /> },
    { id: "assignments", label: "Assignments", component: <AssignmentsTab /> }
  ];

  const tabClass = (tabId) => 
    `px-4 py-2 rounded transition-colors ${
      activeTab === tabId 
        ? "bg-purple-600 text-white" 
        : "bg-white text-purple-600 border hover:bg-purple-100"
    }`;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-purple-700">Instructor Dashboard</h1>
        <Link
          to="/dashboard/instructor/upload-video"
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
        >
          Upload Video
        </Link>
      </div>
      
      <CourseCreateTab />
      
      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 my-6">
        {tabs.map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)} 
            className={tabClass(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Tab Content */}
      {tabs.find(tab => tab.id === activeTab)?.component}
    </div>
  );
};

export default InstructorDashboard;