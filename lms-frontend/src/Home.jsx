import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Book, Code, Server, Coffee, Star, Users, Clock, Search } from "lucide-react";

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [homeContent, setHomeContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch homepage content
    axios
      .get("http://localhost:8080/api/home")
      .then((response) => setHomeContent(response.data))
      .catch((error) => {
        console.error("Failed to load homepage content:", error);
        setHomeContent("Welcome to MyLMS 🚀 Learn anything. Anytime. Anywhere.");
      });

    // Fetch courses data
    axios
      .get("http://localhost:8080/api/courses")
      .then((response) => {
        // Only show the first 4 courses for the landing page
        setCourses(response.data.slice(0, 4));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load courses:", error);
        setLoading(false);
      });
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleBrowseAllCourses = () => {
    navigate('/search');
  };

  // Map course titles to appropriate icons
  const getIconForCourse = (title) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("java") && !lowerTitle.includes("script")) {
      return <Coffee className="text-purple-600" size={32} />;
    } else if (lowerTitle.includes("python")) {
      return <Code className="text-purple-600" size={32} />;
    } else if (lowerTitle.includes("c ")) {
      return <Server className="text-purple-600" size={32} />;
    } else if (lowerTitle.includes("spring")) {
      return <Book className="text-purple-600" size={32} />;
    }
    // Default icon
    return <Book className="text-purple-600" size={32} />;
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">MyLMS Platform</h1>
          <p className="text-xl mb-8">{homeContent || "Loading..."}</p>
          <button className="bg-white text-purple-700 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition">
            Get Started
          </button>
        </div>
      </div>



      {/* Features Section */}
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Why Choose MyLMS?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="flex justify-center mb-4">
                <Star className="text-purple-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Content</h3>
              <p className="text-gray-600">Expert-led courses designed to help you master new skills quickly.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="flex justify-center mb-4">
                <Users className="text-purple-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Active Community</h3>
              <p className="text-gray-600">Connect with peers and instructors for collaborative learning.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="flex justify-center mb-4">
                <Clock className="text-purple-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Learn at Your Pace</h3>
              <p className="text-gray-600">Access course materials anytime and learn on your own schedule.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Courses */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Featured Courses</h2>
          
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading courses...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No courses available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {courses.map((course) => (
                <div key={course.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md transition-transform hover:shadow-lg hover:scale-105">
                  <div className="bg-purple-100 p-4 flex justify-center">
                    {getIconForCourse(course.title)}
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-2 text-gray-800">{course.title}</h3>
                    <p className="text-gray-600 mb-4">{course.description}</p>
                    <div className="flex items-center mb-4">
                      <span className="text-sm text-gray-500">Instructor: {course.instructor?.name || "Unknown"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-purple-600">${course.price}</span>
                      <span className="text-sm text-gray-500">
                        {course.enrolledStudents?.length || 0} student{(course.enrolledStudents?.length || 0) !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                    <button className="w-full py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition">
                      Enroll Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-xl mb-8">Join thousands of students already learning on MyLMS</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button 
              onClick={handleBrowseAllCourses}
              className="bg-white text-purple-700 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition"
            >
              Browse All Courses
            </button>
            <button 
              onClick={() => navigate('/register')}
              className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-700 transition"
            >
              Sign Up Free
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">MyLMS</h3>
              <p className="text-gray-400">Learn anything. Anytime. Anywhere.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-purple-400">About</a>
              <a href="#" className="hover:text-purple-400">Courses</a>
              <a href="#" className="hover:text-purple-400">Instructors</a>
              <a href="#" className="hover:text-purple-400">Contact</a>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-6 pt-6 text-center text-gray-400">
            <p>&copy; 2025 MyLMS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;