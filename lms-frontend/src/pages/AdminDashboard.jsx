import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";

const AdminDashboard = () => {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSummary = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No token found. Please login again.');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get('http://localhost:8080/api/admin/analytics/summary', {
                    headers: {
                        Authorization: token,
                    },
                });
                setSummary(response.data);
            } catch (err) {
                setError('Failed to fetch summary data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, []);

    // Calculate percentages for visual representations
    const calculatePercentages = () => {
        if (!summary) return {};
        
        const totalUsers = summary.totalUsers || 0;
        const studentPercentage = totalUsers > 0 ? (summary.totalStudents / totalUsers) * 100 : 0;
        const instructorPercentage = totalUsers > 0 ? (summary.totalInstructors / totalUsers) * 100 : 0;
        const adminPercentage = totalUsers > 0 ? 100 - studentPercentage - instructorPercentage : 0;
        
        return {
            student: studentPercentage,
            instructor: instructorPercentage,
            admin: adminPercentage
        };
    };

    const percentages = calculatePercentages();

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-white text-purple-700 p-6 shadow-md">
                <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
                <ul className="space-y-4">
                    <li className="hover:underline cursor-pointer font-semibold border-l-4 border-purple-700 pl-3">
                        <Link to="/dashboard/admin/" className="block w-full h-full">Dashboard</Link>
                    </li>
                    <li className="hover:underline cursor-pointer pl-3">
                        <Link to="/dashboard/admin/users" className="block w-full h-full">Manage Users</Link>
                    </li>
                    <li className="hover:underline cursor-pointer pl-3">
                        <Link to="/dashboard/admin/analytics" className="block w-full h-full">Analytics</Link>
                    </li>
                </ul>
            </aside>

            {/* Main Dashboard Content */}
            <main className="flex-1 bg-gray-50 p-10">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-purple-700">Admin Dashboard</h1>
                    <div className="text-sm text-gray-500">
                        Last updated: {new Date().toLocaleDateString()}
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
                        <p className="text-lg">{error}</p>
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-20">
                        <p className="text-gray-600 text-lg">Loading dashboard data...</p>
                    </div>
                ) : summary && (
                    <>
                        {/* Main Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                            <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-purple-600">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-lg font-semibold text-gray-600">Total Users</h3>
                                    <div className="bg-purple-100 p-2 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <p className="text-3xl font-bold text-purple-700 mt-2">{summary.totalUsers}</p>
                                <p className="text-sm text-gray-500 mt-2">Platform users</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-600">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-lg font-semibold text-gray-600">Instructors</h3>
                                    <div className="bg-blue-100 p-2 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                </div>
                                <p className="text-3xl font-bold text-blue-600 mt-2">{summary.totalInstructors}</p>
                                <p className="text-sm text-gray-500 mt-2">Teaching staff</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-green-600">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-lg font-semibold text-gray-600">Students</h3>
                                    <div className="bg-green-100 p-2 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path d="M12 14l9-5-9-5-9 5 9 5z" />
                                            <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                                        </svg>
                                    </div>
                                </div>
                                <p className="text-3xl font-bold text-green-600 mt-2">{summary.totalStudents}</p>
                                <p className="text-sm text-gray-500 mt-2">Enrolled learners</p>
                            </div>
                            <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-amber-500">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-lg font-semibold text-gray-600">Courses</h3>
                                    <div className="bg-amber-100 p-2 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                    </div>
                                </div>
                                <p className="text-3xl font-bold text-amber-500 mt-2">{summary.totalCourses}</p>
                                <p className="text-sm text-gray-500 mt-2">Available courses</p>
                            </div>
                        </div>

                        {/* Additional Visual Presentations */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* User Distribution */}
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-700 mb-4">User Distribution</h3>
                                <div className="relative pt-1">
                                    <div className="flex h-4 mb-1 overflow-hidden text-xs rounded">
                                        <div style={{ width: `${percentages.student}%` }} className="flex flex-col justify-center text-center text-white bg-green-500 shadow-none whitespace-nowrap"></div>
                                        <div style={{ width: `${percentages.instructor}%` }} className="flex flex-col justify-center text-center text-white bg-blue-500 shadow-none whitespace-nowrap"></div>
                                        <div style={{ width: `${percentages.admin}%` }} className="flex flex-col justify-center text-center text-white bg-purple-500 shadow-none whitespace-nowrap"></div>
                                    </div>
                                </div>
                                <div className="flex justify-between mt-4">
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                        <span className="text-sm text-gray-600">Students ({summary.totalStudents})</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                                        <span className="text-sm text-gray-600">Instructors ({summary.totalInstructors})</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                                        <span className="text-sm text-gray-600">Admins ({summary.totalUsers - summary.totalStudents - summary.totalInstructors})</span>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-700 mb-4">Key Ratios</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-500">Students per Course</p>
                                        <p className="text-2xl font-bold text-purple-700">
                                            {summary.totalCourses > 0 ? (summary.totalStudents / summary.totalCourses).toFixed(1) : 0}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-500">Students per Instructor</p>
                                        <p className="text-2xl font-bold text-purple-700">
                                            {summary.totalInstructors > 0 ? (summary.totalStudents / summary.totalInstructors).toFixed(1) : 0}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-500">Courses per Instructor</p>
                                        <p className="text-2xl font-bold text-purple-700">
                                            {summary.totalInstructors > 0 ? (summary.totalCourses / summary.totalInstructors).toFixed(1) : 0}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-500">User Engagement</p>
                                        <p className="text-2xl font-bold text-purple-700">
                                            {(summary.totalStudents > 0 && summary.totalCourses > 0) ? 
                                                ((summary.totalStudents * summary.totalCourses) / 100).toFixed(0) + "%" : "0%"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;