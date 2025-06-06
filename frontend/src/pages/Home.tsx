import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ maxWidth: '64rem', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ 
          fontSize: '64px', 
          fontWeight: 'bold', 
          marginBottom: '24px',
          background: 'linear-gradient(to right, #60a5fa, #a855f6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Party Games 🎮
        </h1>
        
        <p style={{ fontSize: '20px', color: '#d1d5db', marginBottom: '32px', maxWidth: '32rem', margin: '0 auto 32px' }}>
          Die ultimative Multiplayer Party Game Platform! Spiele Quizzes, Truth or Dare und vieles mehr mit deinen Freunden.
        </p>

        {user && (
          <div style={{ 
            background: 'var(--party-card)', 
            border: '1px solid #4b5563', 
            borderRadius: '8px', 
            padding: '16px', 
            marginBottom: '32px',
            display: 'inline-block'
          }}>
            <p style={{ margin: 0, color: '#d1d5db' }}>
              Willkommen zurück, <strong>{user.username}</strong>! 
              <span style={{ color: '#3b82f6', marginLeft: '8px' }}>{user.totalScore} Punkte</span>
            </p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginTop: '48px' }}>
          {/* Quiz Card */}
          <Link to="/quiz" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ 
              background: 'var(--party-card)', 
              border: '1px solid #4b5563', 
              borderRadius: '12px', 
              padding: '24px',
              transition: 'all 0.3s',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#3b82f6';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = '#4b5563';
              e.currentTarget.style.transform = 'scale(1)';
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🧠</div>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Quiz Battle</h3>
              <p style={{ color: '#9ca3af' }}>Teste dein Wissen in verschiedenen Kategorien</p>
              <div style={{ marginTop: '16px', color: '#3b82f6' }}>
                Jetzt spielen →
              </div>
            </div>
          </Link>

          {/* Truth or Dare */}
          <div style={{ 
            background: 'var(--party-card)', 
            border: '1px solid #4b5563', 
            borderRadius: '12px', 
            padding: '24px',
            opacity: 0.5
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>💭</div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Truth or Dare</h3>
            <p style={{ color: '#9ca3af' }}>Klassisches Partyspiel mit modernem Twist</p>
            <div style={{ marginTop: '16px', color: '#6b7280' }}>
              Coming Soon...
            </div>
          </div>

          {/* NSFW Games */}
          <div style={{ 
            background: 'var(--party-card)', 
            border: '1px solid #4b5563', 
            borderRadius: '12px', 
            padding: '24px',
            opacity: 0.5
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔥</div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>NSFW Games</h3>
            <p style={{ color: '#9ca3af' }}>Erwachsenen-Spiele für mutige Gruppen (18+)</p>
            <div style={{ marginTop: '16px', color: '#6b7280' }}>
              Coming Soon...
            </div>
          </div>
        </div>

        {!user && (
          <div style={{ marginTop: '48px', color: '#9ca3af' }}>
            <p>Erstelle einen Account für erweiterte Features oder spiele als Gast!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;