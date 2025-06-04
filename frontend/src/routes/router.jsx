import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Heatmap from '../components/Heatmap';

import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Navbar from '../components/Navbar';
import UpcomingContest from '../pages/UpcomingContest';
import QuestionsByTag from "../pages/QuestionsByTag";

const AppRouter = ({ token, setToken , darkMode, toggleDarkMode }) => {
  return (
    <Router>
      <Routes>
  <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
  <Route path="/login" element={<Login setToken={setToken} />} />
  <Route path="/register" element={<Register setToken={setToken} />} />
  <Route
    path="/dashboard"
    element={token ? <Dashboard darkMode={darkMode} toggleDarkMode={toggleDarkMode} /> : <Navigate to="/login" />}
  />
  <Route
    path="/questions"
    element={<QuestionsByTag darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}
  />
  <Route
    path="/UpcomingContests"
    element={<UpcomingContest darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}
  />
  <Route
    path="/heatmap"
    element={<Heatmap darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}
  />
  <Route path="*" element={<div className="p-8 text-center text-xl text-red-500">404 - Page Not Found</div>} />
</Routes>
    </Router>
  );
};

export default AppRouter;
