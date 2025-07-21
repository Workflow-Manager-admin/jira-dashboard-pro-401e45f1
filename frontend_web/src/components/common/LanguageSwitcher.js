import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="language-switcher">
      <button
        className={`language-btn ${i18n.language === 'en' ? 'active' : ''}`}
        onClick={() => changeLanguage('en')}
      >
        {t('language.en')}
      </button>
      <button
        className={`language-btn ${i18n.language === 'es' ? 'active' : ''}`}
        onClick={() => changeLanguage('es')}
      >
        {t('language.es')}
      </button>
    </div>
  );
};

export default LanguageSwitcher;
