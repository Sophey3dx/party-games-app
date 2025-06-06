import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface RegisterProps {
  onSwitchToLogin: () => void;
  onClose: () => void;
}

const Register: React.FC<RegisterProps> = ({ onSwitchToLogin, onClose }) => {
  const { register, isLoading, error } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    preferredLanguage: 'de'
  });

  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwörter stimmen nicht überein');
      return;
    }

    if (formData.password.length < 6) {
      setValidationError('Passwort muss mindestens 6 Zeichen lang sein');
      return;
    }

    if (formData.username.length < 3) {
      setValidationError('Username muss mindestens 3 Zeichen lang sein');
      return;
    }

    const { confirmPassword, ...registrationData } = formData;
    await register(registrationData);
    
    if (!error) {
      onClose();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{ maxWidth: '28rem', margin: '0 auto', background: 'var(--party-card)', borderRadius: '12px', padding: '32px', border: '1px solid #4b5563' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', textAlign: 'center' }}>Registrieren 🚀</h2>
      
      {(error || validationError) && (
        <div style={{ background: '#dc2626', color: 'white', padding: '12px', borderRadius: '8px', marginBottom: '16px', textAlign: 'center' }}>
          {error || validationError}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
            Username
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            style={{ 
              width: '100%', 
              padding: '12px', 
              background: 'var(--party-gray)', 
              border: '1px solid #4b5563', 
              borderRadius: '8px',
              color: 'white',
              fontSize: '16px'
            }}
            placeholder="dein-username"
            pattern="[a-zA-Z0-9]+"
            title="Nur Buchstaben und Zahlen erlaubt"
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ 
              width: '100%', 
              padding: '12px', 
              background: 'var(--party-gray)', 
              border: '1px solid #4b5563', 
              borderRadius: '8px',
              color: 'white',
              fontSize: '16px'
            }}
            placeholder="email@example.com"
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
            Sprache
          </label>
          <select
            name="preferredLanguage"
            value={formData.preferredLanguage}
            onChange={handleChange}
            style={{ 
              width: '100%', 
              padding: '12px', 
              background: 'var(--party-gray)', 
              border: '1px solid #4b5563', 
              borderRadius: '8px',
              color: 'white',
              fontSize: '16px'
            }}
          >
            <option value="de">🇩🇪 Deutsch</option>
            <option value="en">🇺🇸 English</option>
            <option value="es">🇪🇸 Español</option>
            <option value="fr">🇫🇷 Français</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
            Passwort
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ 
              width: '100%', 
              padding: '12px', 
              background: 'var(--party-gray)', 
              border: '1px solid #4b5563', 
              borderRadius: '8px',
              color: 'white',
              fontSize: '16px'
            }}
            placeholder="••••••••"
            minLength={6}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
            Passwort bestätigen
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            style={{ 
              width: '100%', 
              padding: '12px', 
              background: 'var(--party-gray)', 
              border: '1px solid #4b5563', 
              borderRadius: '8px',
              color: 'white',
              fontSize: '16px'
            }}
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{ 
            width: '100%', 
            background: isLoading ? '#4b5563' : '#16a34a', 
            color: 'white', 
            fontWeight: 'bold', 
            padding: '12px 24px', 
            borderRadius: '8px',
            border: 'none',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          {isLoading ? 'Registriere...' : 'Account erstellen'}
        </button>
      </form>

      <div style={{ marginTop: '24px', textAlign: 'center', color: '#9ca3af' }}>
        <p>
          Schon ein Account?{' '}
          <button
            onClick={onSwitchToLogin}
            style={{ color: '#60a5fa', background: 'none', border: 'none', fontWeight: '500', cursor: 'pointer', fontSize: '16px' }}
          >
            Einloggen
          </button>
        </p>
      </div>

      <button
        onClick={onClose}
        style={{ 
          marginTop: '16px', 
          width: '100%', 
          background: '#4b5563', 
          color: 'white', 
          padding: '8px 16px', 
          borderRadius: '8px',
          border: 'none',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        Als Gast spielen
      </button>
    </div>
  );
};

export default Register;