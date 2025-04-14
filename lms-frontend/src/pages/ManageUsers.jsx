import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8080/api/admin/users', {
                headers: {
                    Authorization: token,
                },
            });
            setUsers(response.data.content || []);
            setError('');
        } catch (err) {
            setError('Failed to fetch users.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        try {
            await axios.delete(`http://localhost:8080/api/admin/users/${userId}`, {
                headers: {
                    Authorization: token,
                },
            });
            fetchUsers();
        } catch (err) {
            setError('Failed to delete user.');
            console.error(err);
        }
    };

    const handleEdit = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/admin/users/${userId}`, {
                headers: {
                    Authorization: token,
                },
            });
            setEditingUser(response.data);
            setShowModal(true);
        } catch (err) {
            setError('Failed to fetch user details.');
            console.error(err);
        }
    };

    const handleInputChange = (e) => {
        setEditingUser({ ...editingUser, [e.target.name]: e.target.value });
    };

    const handleSaveChanges = async () => {
        try {
            await axios.put(
                `http://localhost:8080/api/admin/users/${editingUser.id}/role`,
                { role: editingUser.role },
                {
                    headers: {
                        Authorization: token,
                        'Content-Type': 'application/json',
                    },
                }
            );
            setShowModal(false);
            fetchUsers();
        } catch (err) {
            setError('Failed to update user.');
            console.error(err);
        }
    };

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-white text-purple-700 p-6 shadow-md">
                <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
                <ul className="space-y-4">
                    <li className="hover:underline cursor-pointer">
                        <Link to="/dashboard/admin/" className="block w-full h-full">Dashboard</Link>
                    </li>
                    <li className="hover:underline cursor-pointer font-semibold">
                        <Link to="/dashboard/admin/users" className="block w-full h-full">Manage Users</Link>
                    </li>
                    <li className="hover:underline cursor-pointer">
                        <Link to="/dashboard/admin/analytics" className="block w-full h-full">Analytics</Link>
                    </li>
                </ul>
            </aside>

            {/* Main Content */}
            <main className="flex-1 bg-gray-50 p-10">
                <h1 className="text-3xl font-bold text-purple-700 mb-8">Manage Users</h1>
                
                {error && (
                    <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
                        <p>{error}</p>
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-8">
                        <p className="text-gray-600">Loading users...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border rounded-xl shadow-md">
                            <thead>
                                <tr className="bg-purple-100 text-purple-800">
                                    <th className="py-3 px-4 border-b">ID</th>
                                    <th className="py-3 px-4 border-b">Name</th>
                                    <th className="py-3 px-4 border-b">Email</th>
                                    <th className="py-3 px-4 border-b">Role</th>
                                    <th className="py-3 px-4 border-b">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center p-4 text-gray-500">No users found.</td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr key={user.id} className="text-center border-t hover:bg-gray-50">
                                            <td className="py-2 px-4">{user.id}</td>
                                            <td className="py-2 px-4">{user.name}</td>
                                            <td className="py-2 px-4">{user.email}</td>
                                            <td className="py-2 px-4">
                                                <span className="inline-block px-2 py-1 text-sm rounded-full bg-purple-100 text-purple-700">
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="py-2 px-4 space-x-2">
                                                <button 
                                                    onClick={() => handleEdit(user.id)} 
                                                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(user.id)} 
                                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Edit Modal */}
                {showModal && editingUser && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
                            <h2 className="text-xl font-bold mb-4 text-purple-700">Edit User</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">ID</label>
                                    <input
                                        type="text"
                                        value={editingUser.id}
                                        disabled
                                        className="w-full p-2 border rounded bg-gray-100"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={editingUser.name}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-300"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={editingUser.email}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-300"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">Role</label>
                                    <select
                                        name="role"
                                        value={editingUser.role}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-300"
                                    >
                                        <option value="STUDENT">Student</option>
                                        <option value="INSTRUCTOR">Instructor</option>
                                        <option value="ADMIN">Admin</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-between">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveChanges}
                                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ManageUsers;