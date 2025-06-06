import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import AuthModal from '../Auth/AuthModal';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <>
      <header style={{ 
        background: 'var(--party-card)', 
        borderBottom: '1px solid #4b5563', 
        padding: '16px' 
      }}>
        <div style={{ 
          maxWidth: '72rem', 
          margin: '0 auto', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <a href="/" style={{ textDecoration: 'none', color: 'white' }}>
              <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>Party Games 🎮</h1>
            </a>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {user ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    background: 'var(--party-gray)', 
                    padding: '8px 16px', 
                    borderRadius: '8px',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  <span style={{ fontSize: '18px' }}>{user.avatar}</span>
                  <span style={{ fontWeight: '500' }}>{user.username}</span>
                  <span style={{ fontSize: '14px', color: '#60a5fa' }}>{user.totalScore}pts</span>
                </button>

                {showUserMenu && (
                  <div style={{ 
                    position: 'absolute', 
                    right: 0, 
                    marginTop: '8px', 
                    width: '192px', 
                    background: 'var(--party-card)', 
                    border: '1px solid #4b5563', 
                    borderRadius: '8px', 
                    boxShadow: '0 10px 15px rgba(0, 0, 0, 0.3)', 
                    zIndex: 50 
                  }}>
                    <a
                      href="/profile"
                      style={{ 
                        display: 'block', 
                        padding: '8px 16px', 
                        textDecoration: 'none', 
                        color: 'white',
                        borderRadius: '8px 8px 0 0'
                      }}
                      onClick={() => setShowUserMenu(false)}
                      onMouseOver={(e) => e.currentTarget.style.background = '#374151'}
                      onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      📊 Mein Profil
                    </a>
                    <a
                      href="/leaderboard"
                      style={{ 
                        display: 'block', 
                        padding: '8px 16px', 
                        textDecoration: 'none', 
                        color: 'white'
                      }}
                      onClick={() => setShowUserMenu(false)}
                      onMouseOver={(e) => e.currentTarget.style.background = '#374151'}
                      onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      🏆 Bestenliste
                    </a>
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      style={{ 
                        width: '100%', 
                        textAlign: 'left', 
                        padding: '8px 16px', 
                        background: 'transparent', 
                        border: 'none', 
                        borderRadius: '0 0 8px 8px', 
                        color: '#ef4444',
                        cursor: 'pointer',
                        fontSize: '16px'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = '#374151'}
                      onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                style={{ 
                  background: '#2563eb', 
                  color: 'white', 
                  fontWeight: '500', 
                  padding: '8px 24px', 
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#1d4ed8'}
                onMouseOut={(e) => e.currentTarget.style.background = '#2563eb'}
              >
                Login / Register
              </button>
            )}
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
};

export default Header;