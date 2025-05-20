import React, { useState } from 'react';
import Router from './routes/router'; // Import the Router component

const App = () => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || ''); // Initialize token from localStorage

  return (
    <div>
      <Router token={token} setToken={setToken} />
    </div>
  );
};
export default App;
