import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from './Navbar';
import './Layout.css';

const Layout = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="layout">
      {isAuthenticated && <Navbar />}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
