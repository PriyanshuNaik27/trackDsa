import React from 'react';

const spinnerStyle = {
  display: 'inline-block',
  width: '40px',
  height: '40px',
  border: '4px solid #ccc',
  borderTop: '4px solid #007bff',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite'
};

const spinnerKeyframes = `
@keyframes spin {
  0% { transform: rotate(0deg);}
  100% { transform: rotate(360deg);}
}
`;

const LoadingSpinner = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60px' }}>
    <style>{spinnerKeyframes}</style>
    <div style={spinnerStyle}></div>
  </div>
);

export default LoadingSpinner;