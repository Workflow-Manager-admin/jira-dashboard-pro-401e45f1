import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';
import './LoginPage.css';

const LoginPage = () => {
  const { t } = useTranslation();
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
      newErrors.email = t('auth.requiredField');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('auth.invalidEmail');
    }
    if (!formData.api_token) {
      newErrors.api_token = t('auth.requiredField');
    }
    if (!formData.domain) {
      newErrors.domain = t('auth.requiredField');
    } else if (!/^[a-zA-Z0-9-]+\.atlassian\.net$/.test(formData.domain)) {
      newErrors.domain = t('auth.invalidDomain');
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
        <h1 className="login-title">{t('auth.loginTitle')}</h1>
        <p className="login-subtitle">{t('auth.loginSubtitle')}</p>

        {submitError && (
          <div className="error-message" role="alert">
            {t('auth.loginFailed')}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">{t('auth.email')}</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t('auth.emailPlaceholder')}
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
              {t('auth.apiToken')}
              <a
                href="https://id.atlassian.com/manage/api-tokens"
                target="_blank"
                rel="noopener noreferrer"
                className="token-link"
              >
                {t('auth.getToken')}
              </a>
            </label>
            <input
              type="password"
              id="api_token"
              name="api_token"
              value={formData.api_token}
              onChange={handleChange}
              placeholder={t('auth.apiTokenPlaceholder')}
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
            <label htmlFor="domain">{t('auth.domain')}</label>
            <input
              type="text"
              id="domain"
              name="domain"
              value={formData.domain}
              onChange={handleChange}
              placeholder={t('auth.domainPlaceholder')}
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
            {isLoading ? <LoadingSpinner size="small" /> : t('auth.login')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
