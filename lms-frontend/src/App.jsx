import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";

import Home from "./Home";
import Login from "./pages/Login";
import PasswordReset from "./pages/PasswordReset";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import InstructorDashboard from "./pages/InstructorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ManageUsers from "./pages/ManageUsers";
import AdminAnalytics from "./pages/AdminAnalytics";
import StudentCourseDetails from "./pages/StudentCourseDetails";
import SearchResults from "./SearchResults";
import Courses from "./pages/Courses";
import UploadVideo from "./pages/UploadVideo";
import MyCourses from "./components/instructor/MyCourses";
import SendNotification from "./components/instructor/SendNotification";
import AssignmentsTab from "./components/instructor/AssignmentsTab";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/reset-password" element={<PasswordReset />} />


          {/* Student */}
          <Route path="/dashboard/student" element={<StudentDashboard />} />
          <Route path="/dashboard/student/course/:courseId" element={<StudentCourseDetails />} />



          {/* Instructor */}
          <Route path="/dashboard/instructor" element={<InstructorDashboard />} />
          <Route path="/dashboard/instructor/upload-video" element={<UploadVideo />} />
          <Route path="/dashboard/instructor/courses" element={<MyCourses />} />
          <Route path="/dashboard/instructor/notify" element={<SendNotification />} />
          <Route path="/dashboard/instructor/assignments" element={<AssignmentsTab />} />



          {/* Admin */}
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/dashboard/admin/users" element={<ManageUsers />} />
          <Route path="/dashboard/admin/analytics" element={<AdminAnalytics />} />

        </Routes>
      </Layout>
    </Router>
  );
}
