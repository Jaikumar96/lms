import React, { useEffect, useState } from "react";
import axios from "axios";

const StudentDashboard = () => {
  const [dashboardData, setDashboardData] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([fetchDashboard(), fetchNotifications()]);
      } catch (err) {
        console.error("Dashboard loading error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchDashboard = async () => {
    try {
      // Fetch general dashboard stats
      const res = await axios.get("http://localhost:8080/api/student/dashboard", {
        headers: { Authorization: token },
      });
  
      // Fetch real enrolled courses
      const courseRes = await axios.get("http://localhost:8080/api/courses/student", {
        headers: { Authorization: token },
      });
  
      setDashboardData({
        ...res.data,
        enrolledCourses: courseRes.data, // real enrolled courses array
      });
    } catch (err) {
      console.error(err);
      setError("Failed to fetch dashboard data");
    }
  };
  
  const fetchNotifications = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/notifications", {
        headers: { Authorization: token },
      });
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch notifications");
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      await axios.put(
        `http://localhost:8080/api/notifications/${notificationId}/read`,
        {},
        { headers: { Authorization: token } }
      );
      setNotifications(
        notifications.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const StatCard = ({ title, value, icon }) => (
    <div className="bg-white rounded-xl p-6 text-center shadow hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-center mb-3">
        {icon && <div className="text-purple-600 mr-2">{icon}</div>}
        <h2 className="text-lg font-medium text-gray-600">{title}</h2>
      </div>
      <p className="text-3xl font-bold text-purple-700">{value}</p>
    </div>
  );

  const CourseCard = ({ course }) => (
    <div
      className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition-all duration-300 border border-transparent hover:border-purple-200"
      onClick={() => window.location.href = `/dashboard/student/course/${course.id}`}
    >
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-bold text-purple-700">{course.title}</h3>
        {course.progress && (
          <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {course.progress}%
          </span>
        )}
      </div>
      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{course.description}</p>
      <div className="mt-4 flex justify-between items-center">
        <p className="text-sm text-gray-500">Instructor: {course.instructor?.name}</p>
        {course.nextDeadline && (
          <p className="text-xs text-red-500">Due: {course.nextDeadline}</p>
        )}
      </div>
    </div>
  );

  const NotificationItem = ({ notification }) => (
    <div
      onClick={() => markNotificationAsRead(notification.id)}
      className={`border-l-4 pl-4 py-3 cursor-pointer transition-colors duration-200 hover:bg-purple-50 ${
        notification.read ? "border-gray-300" : "border-purple-600 bg-purple-50"
      }`}
    >
      <p className="text-gray-800 font-medium">{notification.message}</p>
      <p className="text-xs text-gray-400">
        {new Date(notification.createdAt).toLocaleString("en-IN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-700 mx-auto"></div>
          <p className="mt-4 text-purple-700">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-purple-700">Student Dashboard</h1>
          <div className="relative">
            <span className="text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
          </div>
        </header>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <StatCard 
            title="Enrolled" 
            value={dashboardData.enrolledCourses?.length || 0} 
          />
          <StatCard 
            title="Ongoing" 
            value={dashboardData.ongoingCourses || 0} 
          />
          <StatCard 
            title="Completed" 
            value={dashboardData.completedCourses || 0} 
          />
          <StatCard 
            title="Deadlines" 
            value={dashboardData.upcomingDeadlines?.length || 0} 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enrolled Courses Section */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-purple-700">Your Courses</h2>
              <a href="/courses" className="text-sm text-purple-600 hover:text-purple-800 transition-colors">
                Browse more courses
              </a>
            </div>
            
            {!dashboardData.enrolledCourses?.length ? (
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <p className="text-gray-500 mb-4">You haven't enrolled in any courses yet.</p>
                <a 
                  href="/courses" 
                  className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Explore Courses
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(dashboardData.enrolledCourses || []).map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            )}
            
            {/* Upcoming Assignments Section */}
            {dashboardData.upcomingDeadlines?.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-semibold text-purple-700 mb-4">Upcoming Deadlines</h2>
                <div className="bg-white rounded-lg shadow-md p-4">
                  <table className="min-w-full">
                    <thead>
                      <tr>
                        <th className="text-left py-2 px-3 text-sm font-medium text-gray-500">Assignment</th>
                        <th className="text-left py-2 px-3 text-sm font-medium text-gray-500">Course</th>
                        <th className="text-left py-2 px-3 text-sm font-medium text-gray-500">Due Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.upcomingDeadlines.map((deadline, index) => (
                        <tr key={index} className="hover:bg-purple-50 transition-colors">
                          <td className="py-3 px-3">{deadline.title}</td>
                          <td className="py-3 px-3 text-sm text-gray-600">{deadline.courseName}</td>
                          <td className="py-3 px-3 text-sm text-red-500">{deadline.dueDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Notifications Column */}
          <div className="lg:col-span-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-purple-700">Notifications</h2>
              {unreadNotificationsCount > 0 && (
                <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                  {unreadNotificationsCount} new
                </span>
              )}
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow space-y-1">
              {notifications.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <NotificationItem key={notification.id} notification={notification} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;