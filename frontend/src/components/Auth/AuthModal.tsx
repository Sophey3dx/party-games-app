import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);

  if (!isOpen) return null;

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      background: 'rgba(0, 0, 0, 0.5)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      zIndex: 50, 
      padding: '16px' 
    }}>
      <div style={{ position: 'relative', maxWidth: '28rem', width: '100%' }}>
        <button
          onClick={onClose}
          style={{ 
            position: 'absolute', 
            top: '-16px', 
            right: '-16px', 
            background: '#4b5563', 
            color: 'white', 
            borderRadius: '50%', 
            width: '32px', 
            height: '32px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            zIndex: 10,
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          ✕
        </button>
        
        {isLoginMode ? (
          <Login
            onSwitchToRegister={() => setIsLoginMode(false)}
            onClose={onClose}
          />
        ) : (
          <Register
            onSwitchToLogin={() => setIsLoginMode(true)}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
};

export default AuthModal;