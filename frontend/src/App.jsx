import React, { useState ,useEffect} from 'react';
import Router from './routes/router'; // Import the Router component

const App = () => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || ''); 
  // Initialize token from localStorage
   const [darkMode, setDarkMode] = useState(() => {
     const savedMode = localStorage.getItem('darkMode');
     if (savedMode !== null) {
      return savedMode === 'true';
    }
    // Default to user's system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };
  return (
    <Router token={token} setToken={setToken} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
  );
};
export default App;
