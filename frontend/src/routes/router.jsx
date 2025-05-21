import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Navbar from '../components/Navbar';
import UpcomingContest from '../pages/UpcomingContest';
import QuestionsByTag from "../pages/QuestionsByTag";

const AppRouter = ({ token, setToken }) => {
  return (
    <Router>
      <Routes>
        {/* Root route that redirects based on the token */}
        <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        
        {/* Login route */}
        <Route path="/login" element={<Login setToken={setToken} />} />
        
        {/* Register route */}
        <Route path="/register" element={<Register setToken={setToken} />} />
        
        {/* Dashboard route */}
        <Route
          path="/dashboard"
          element={token ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route path="/questions" element={<QuestionsByTag />} />
        <Route path="/UpcomingContests" element={<UpcomingContest />} />

        {/* 404 Page Not Found */}
        <Route path="*" element={<div className="p-8 text-center text-xl text-red-500">404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
