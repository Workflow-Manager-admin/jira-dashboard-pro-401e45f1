import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'medium', overlay = false }) => {
  const spinnerClass = `spinner spinner-${size}${overlay ? ' spinner-overlay' : ''}`;
  
  return (
    <div className={spinnerClass} role="progressbar" aria-label="Loading">
      <div className="spinner-inner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
