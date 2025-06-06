import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface LoginProps {
  onSwitchToRegister: () => void;
  onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ onSwitchToRegister, onClose }) => {
  const { login, isLoading, error } = useAuth();
  const [formData, setFormData] = useState({
    login: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(formData);
    if (!error) {
      onClose();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{ maxWidth: '28rem', margin: '0 auto', background: 'var(--party-card)', borderRadius: '12px', padding: '32px', border: '1px solid #4b5563' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', textAlign: 'center' }}>Login 🎮</h2>
      
      {error && (
        <div style={{ background: '#dc2626', color: 'white', padding: '12px', borderRadius: '8px', marginBottom: '16px', textAlign: 'center' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
            Username oder Email
          </label>
          <input
            type="text"
            name="login"
            value={formData.login}
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
            placeholder="dein-username oder email@example.com"
          />
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
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{ 
            width: '100%', 
            background: isLoading ? '#4b5563' : '#2563eb', 
            color: 'white', 
            fontWeight: 'bold', 
            padding: '12px 24px', 
            borderRadius: '8px',
            border: 'none',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          {isLoading ? 'Logge ein...' : 'Einloggen'}
        </button>
      </form>

      <div style={{ marginTop: '24px', textAlign: 'center', color: '#9ca3af' }}>
        <p>
          Noch kein Account?{' '}
          <button
            onClick={onSwitchToRegister}
            style={{ color: '#60a5fa', background: 'none', border: 'none', fontWeight: '500', cursor: 'pointer', fontSize: '16px' }}
          >
            Registrieren
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

export default Login;