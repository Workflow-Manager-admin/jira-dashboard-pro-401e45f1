import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import LanguageSwitcher from '../common/LanguageSwitcher';
import './Navbar.css';

const Navbar = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand">
          <Link to="/dashboard" className="navbar-logo">
            {t('auth.loginTitle')}
          </Link>
        </div>
        
        <div className="navbar-menu">
          <Link to="/dashboard" className="navbar-item">
            {t('dashboard.title')}
          </Link>
        </div>

        <div className="navbar-end">
          <span className="navbar-item user-info">
            {user?.email} ({user?.domain})
          </span>
          <LanguageSwitcher />
          <button 
            onClick={handleLogout} 
            className="btn btn-logout"
            aria-label={t('auth.logout')}
          >
            {t('auth.logout')}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
