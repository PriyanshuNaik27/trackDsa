import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Navbar = () => {
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
          setError('username not found');
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

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login'; // or use your router's navigate
  };

  return (
    <nav style={{ padding: '1rem', background: '#f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        {loading ? (
          <p>Loading user...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : (
          <p>Welcome, {userName} </p>
        )}
      </div>
      {token && (
        <button onClick={handleLogout} style={{ padding: '0.5rem 1rem', background: '#e53e3e', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Logout
        </button>
      )}
    </nav>
  );
};

export default Navbar;