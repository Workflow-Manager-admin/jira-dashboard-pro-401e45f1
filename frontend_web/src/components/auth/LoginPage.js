import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';
import './LoginPage.css';

const LoginPage = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    api_token: '',
    domain: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.api_token) {
      newErrors.api_token = 'API token is required';
    }
    if (!formData.domain) {
      newErrors.domain = 'Domain is required';
    } else if (!/^[a-zA-Z0-9-]+\.atlassian\.net$/.test(formData.domain)) {
      newErrors.domain = 'Please enter a valid Atlassian domain (e.g., company.atlassian.net)';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await login(formData);
      if (!result.success) {
        setSubmitError(result.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      setSubmitError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Jira Dashboard</h1>
        <p className="login-subtitle">Sign in with your Jira account</p>

        {submitError && (
          <div className="error-message" role="alert">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@company.com"
              className={errors.email ? 'error' : ''}
              aria-invalid={errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? 'email-error' : undefined}
              disabled={isLoading}
            />
            {errors.email && (
              <span className="error-text" id="email-error" role="alert">
                {errors.email}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="api_token">
              API Token
              <a
                href="https://id.atlassian.com/manage/api-tokens"
                target="_blank"
                rel="noopener noreferrer"
                className="token-link"
              >
                Get Token
              </a>
            </label>
            <input
              type="password"
              id="api_token"
              name="api_token"
              value={formData.api_token}
              onChange={handleChange}
              placeholder="Your Jira API token"
              className={errors.api_token ? 'error' : ''}
              aria-invalid={errors.api_token ? 'true' : 'false'}
              aria-describedby={errors.api_token ? 'token-error' : undefined}
              disabled={isLoading}
            />
            {errors.api_token && (
              <span className="error-text" id="token-error" role="alert">
                {errors.api_token}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="domain">Domain</label>
            <input
              type="text"
              id="domain"
              name="domain"
              value={formData.domain}
              onChange={handleChange}
              placeholder="company.atlassian.net"
              className={errors.domain ? 'error' : ''}
              aria-invalid={errors.domain ? 'true' : 'false'}
              aria-describedby={errors.domain ? 'domain-error' : undefined}
              disabled={isLoading}
            />
            {errors.domain && (
              <span className="error-text" id="domain-error" role="alert">
                {errors.domain}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? <LoadingSpinner size="small" /> : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
