import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const AdminAnalytics = () => {
  const [summary, setSummary] = useState({});
  const [quizPerformance, setQuizPerformance] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError('No token found. Please login again.');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [summaryRes, quizRes, enrollRes] = await Promise.all([
          axios.get("http://localhost:8080/api/admin/analytics/summary", {
            headers: { Authorization: token },
          }),
          axios.get("http://localhost:8080/api/admin/analytics/quiz-performance", {
            headers: { Authorization: token },
          }),
          axios.get("http://localhost:8080/api/admin/analytics/enrollments", {
            headers: { Authorization: token },
          }),
        ]);

        setSummary(summaryRes.data);
        setQuizPerformance(quizRes.data);
        setEnrollments(enrollRes.data);
      } catch (error) {
        setError('Failed to fetch analytics data.');
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Count enrollments per course title
  const groupedEnrollments = enrollments.reduce((acc, item) => {
    const title = item.courseTitle;
    if (!acc[title]) {
      acc[title] = 0;
    }
    acc[title] += item.enrollmentCount;
    return acc;
  }, {});

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white text-purple-700 p-6 shadow-md">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <ul className="space-y-4">
          <li className="hover:underline cursor-pointer">
            <Link to="/dashboard/admin/" className="block w-full h-full">Dashboard</Link>
          </li>
          <li className="hover:underline cursor-pointer">
            <Link to="/dashboard/admin/users" className="block w-full h-full">Manage Users</Link>
          </li>
          <li className="hover:underline cursor-pointer font-semibold">
            <Link to="/dashboard/admin/analytics" className="block w-full h-full">Analytics</Link>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-50 p-10">
        <h1 className="text-3xl font-bold mb-8 text-purple-700">Admin Analytics</h1>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading analytics data...</p>
          </div>
        ) : (
          <>
            {/* Summary Section */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Summary</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(summary).map(([key, value]) => (
                  <div key={key} className="bg-white p-4 rounded-lg shadow text-center hover:shadow-lg transition-shadow">
                    <p className="text-sm text-gray-500 capitalize">{key.replace(/([A-Z])/g, " $1")}</p>
                    <p className="text-xl font-bold text-purple-700 mt-1">{value}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Quiz Performance */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Quiz Performance</h2>
              {quizPerformance ? (
                <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-gray-500 mb-1">Total Submissions</p>
                      <p className="text-2xl font-bold text-purple-700">{quizPerformance.totalSubmissions}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-500 mb-1">Average Score</p>
                      <p className="text-2xl font-bold text-purple-700">{quizPerformance.averageScore}%</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No quiz performance data available.</p>
              )}
            </section>

            {/* Course Enrollments */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Course Enrollments</h2>
              {Object.entries(groupedEnrollments).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(groupedEnrollments).map(([courseTitle, count], index) => (
                    <div key={index} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
                      <h3 className="font-semibold text-purple-700 truncate">{courseTitle}</h3>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-gray-500">Enrollments:</span>
                        <span className="text-xl font-bold">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No enrollments found.</p>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminAnalytics;