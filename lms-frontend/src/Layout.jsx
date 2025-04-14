// src/Layout.jsx
import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import StudentNavbar from "./components/StudentNavbar";
import InstructorNavbar from "./components/instructor/InstructorNavbar";

const Layout = ({ children }) => {
  const location = useLocation();
  const path = location.pathname;

  const isStudent = path.startsWith("/dashboard/student");
  const isInstructor = path.startsWith("/dashboard/instructor");
  const isAdmin = path.startsWith("/dashboard/admin");

  return (
    <>
      {isStudent ? (
        <StudentNavbar />
      ) : isInstructor ? (
        <InstructorNavbar />
      ) : (
        <Navbar />
      )}
      {children}
    </>
  );
};

export default Layout;
