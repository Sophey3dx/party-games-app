import React, { useState } from 'react';

const LanguageSwitcher: React.FC = () => {
  const [currentLang, setCurrentLang] = useState('de');

  const languages = [
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
  ];

  const changeLanguage = (langCode: string) => {
    setCurrentLang(langCode);
    // TODO: Implement i18n language change later
    console.log('Switching to:', langCode);
  };

  const currentLanguage = languages.find(lang => lang.code === currentLang) || languages[0];

  return (
    <div style={{ position: 'relative' }}>
      <button
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--party-card)',
          border: '1px solid #4b5563',
          borderRadius: '8px',
          padding: '8px 12px',
          color: 'white',
          cursor: 'pointer'
        }}
      >
        <span style={{ fontSize: '18px' }}>{currentLanguage.flag}</span>
        <span>{currentLanguage.name}</span>
      </button>
    </div>
  );
};

export default LanguageSwitcher;