import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FiSun, FiMoon } from "react-icons/fi";
import Dashboard from '../pages/Dashboard';


const Navbar = ({ darkMode, toggleDarkMode }) => {
  const token = localStorage.getItem('token');
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserName = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/auth/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.data) {
          setUserName(response.data.data.fullName);
        } else {
          setError('Username not found');
        }
      } catch (error) {
        setError('Error fetching username');
        console.error('Error fetching username:', error);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchUserName();
    else setError('No token found.');
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');``
    window.location.href = '/login';
  };

  return (
    <header className={`shadow-md ${darkMode ? "bg-gray-900" : "bg-white"} transition-colors duration-300`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
        
        {/* Logo and User Section */}
        
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
          <Link to="/" className="flex items-center gap-2">
          <span className={`text-2xl font-bold tracking-tight ${darkMode ? "text-indigo-300" : "text-indigo-600"}`}>
            TrackDSA
          </span>
          </Link>
          <Link to="/heatmap" className="flex items-center gap-2">
          <span className={`text-2xl font-bold tracking-tight ${darkMode ? "text-indigo-300" : "text-indigo-600"}`}>
            progress
          </span>
          </Link>

          {loading ? (
            <span className={`${darkMode ? "text-gray-400" : "text-gray-600"} animate-pulse`}>
              Loading user...
            </span>
          ) : error ? (
            <span className="text-red-500 text-sm">{error}</span>
          ) : (
            <span className={`text-sm sm:text-base font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
              Welcome, <span className={darkMode ? "text-indigo-200" : "text-indigo-700"}>{userName}</span>
            </span>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4 flex-wrap justify-center md:justify-end">
          <Link
            to="/Upcomingcontests"
            className={`font-semibold text-sm sm:text-base transition-colors duration-200 
              ${darkMode ? "text-indigo-300 hover:text-indigo-100" : "text-indigo-600 hover:text-indigo-800"}`}
          >
            Upcoming Contests
          </Link>

          <button
            onClick={toggleDarkMode}
            className="text-2xl p-1 rounded-full transition hover:scale-105"
            title="Toggle Theme"
          >
            {darkMode ? (
              <FiSun className="text-yellow-300" />
            ) : (
              <FiMoon className="text-gray-700" />
            )}
          </button>

          {token && (
            <button
              onClick={handleLogout}
              className={`px-4 py-2 text-sm rounded-md font-semibold shadow transition duration-200
                ${darkMode
                  ? "bg-indigo-700 text-white hover:bg-indigo-600"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"}`}
            >
              Logout
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
