import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './i18n';
import App from './App';
import LoadingSpinner from './components/common/LoadingSpinner';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Suspense fallback={<div className="loading-container"><LoadingSpinner size="large" /></div>}>
      <App />
    </Suspense>
  </React.StrictMode>
);
