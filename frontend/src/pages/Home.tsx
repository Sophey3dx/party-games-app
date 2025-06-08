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
          {/* Solo Quiz Card */}
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
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Solo Quiz</h3>
              <p style={{ color: '#9ca3af' }}>Teste dein Wissen in verschiedenen Kategorien</p>
              <div style={{ marginTop: '16px', color: '#3b82f6' }}>
                Jetzt spielen →
              </div>
            </div>
          </Link>

          {/* Multiplayer Card */}
          <Link to="/multiplayer" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ 
              background: 'var(--party-card)', 
              border: '1px solid #4b5563', 
              borderRadius: '12px', 
              padding: '24px',
              transition: 'all 0.3s',
              cursor: 'pointer',
              position: 'relative'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#10b981';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = '#4b5563';
              e.currentTarget.style.transform = 'scale(1)';
            }}>
              {/* NEW Badge */}
              <div style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                background: '#ef4444',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                HOT!
              </div>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏆</div>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Multiplayer Quiz</h3>
              <p style={{ color: '#9ca3af' }}>Battle gegen Freunde in Echtzeit Quiz-Duellen</p>
              <div style={{ marginTop: '16px', color: '#10b981' }}>
                Arena betreten →
              </div>
            </div>
          </Link>

          {/* Truth or Dare - NOW ACTIVE! */}
          <Link to="/truth-or-dare" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ 
              background: 'var(--party-card)', 
              border: '1px solid #4b5563', 
              borderRadius: '12px', 
              padding: '24px',
              transition: 'all 0.3s',
              cursor: 'pointer',
              position: 'relative'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#ef4444';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = '#4b5563';
              e.currentTarget.style.transform = 'scale(1)';
            }}>
              {/* NEW Badge */}
              <div style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                background: '#ef4444',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                NEU!
              </div>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>😈</div>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Truth or Dare</h3>
              <p style={{ color: '#9ca3af' }}>Wahrheit oder Pflicht - von harmlos bis spicy!</p>
              <div style={{ marginTop: '16px', color: '#ef4444' }}>
                Jetzt spielen →
              </div>
            </div>
          </Link>

          {/* Never Have I Ever - NEW! */}
          <Link to="/never-have-i-ever" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ 
              background: 'var(--party-card)', 
              border: '1px solid #4b5563', 
              borderRadius: '12px', 
              padding: '24px',
              transition: 'all 0.3s',
              cursor: 'pointer',
              position: 'relative'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#8b5cf6';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = '#4b5563';
              e.currentTarget.style.transform = 'scale(1)';
            }}>
              {/* NEW Badge */}
              <div style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                background: '#8b5cf6',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                NEU!
              </div>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🙈</div>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Never Have I Ever</h3>
              <p style={{ color: '#9ca3af' }}>Finde heraus, wer was schon mal gemacht hat</p>
              <div style={{ marginTop: '16px', color: '#8b5cf6' }}>
                Jetzt spielen →
              </div>
            </div>
          </Link>

          {/* Most Likely To - NEW! */}
          <Link to="/most-likely-to" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ 
              background: 'var(--party-card)', 
              border: '1px solid #4b5563', 
              borderRadius: '12px', 
              padding: '24px',
              transition: 'all 0.3s',
              cursor: 'pointer',
              position: 'relative'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#f59e0b';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = '#4b5563';
              e.currentTarget.style.transform = 'scale(1)';
            }}>
              {/* NEW Badge */}
              <div style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                background: '#f59e0b',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                NEU!
              </div>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🤔</div>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Most Likely To</h3>
              <p style={{ color: '#9ca3af' }}>Wer aus der Gruppe würde am ehesten...?</p>
              <div style={{ marginTop: '16px', color: '#f59e0b' }}>
                Jetzt spielen →
              </div>
            </div>
          </Link>

          {/* Coming Soon - Future Games */}
          <div style={{ 
            background: 'var(--party-card)', 
            border: '1px solid #4b5563', 
            borderRadius: '12px', 
            padding: '24px',
            opacity: 0.5
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🃏</div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Cards Against Humanity</h3>
            <p style={{ color: '#9ca3af' }}>Das umstrittene Kartenspiel - digital</p>
            <div style={{ marginTop: '16px', color: '#6b7280' }}>
              Coming Soon...
            </div>
          </div>

          {/* Coming Soon - Couples Games */}
          <div style={{ 
            background: 'var(--party-card)', 
            border: '1px solid #4b5563', 
            borderRadius: '12px', 
            padding: '24px',
            opacity: 0.5
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>💕</div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Couple Games</h3>
            <p style={{ color: '#9ca3af' }}>Wie gut kennst du deinen Partner?</p>
            <div style={{ marginTop: '16px', color: '#6b7280' }}>
              Coming Soon...
            </div>
          </div>

          {/* Coming Soon - NSFW */}
          <div style={{ 
            background: 'var(--party-card)', 
            border: '1px solid #4b5563', 
            borderRadius: '12px', 
            padding: '24px',
            opacity: 0.5
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔥</div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>NSFW Collection</h3>
            <p style={{ color: '#9ca3af' }}>Erwachsenen-Spiele für mutige Gruppen (18+)</p>
            <div style={{ marginTop: '16px', color: '#6b7280' }}>
              Coming Soon...
            </div>
          </div>
        </div>

        {/* User Stats - nur wenn eingeloggt */}
        {user && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
            gap: '16px', 
            marginTop: '48px',
            maxWidth: '32rem',
            margin: '48px auto 0'
          }}>
            <div style={{ 
              background: 'var(--party-card)', 
              border: '1px solid #4b5563', 
              borderRadius: '8px', 
              padding: '16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>
                {user.gamesPlayed}
              </div>
              <div style={{ fontSize: '12px', color: '#9ca3af' }}>Spiele</div>
            </div>

            <div style={{ 
              background: 'var(--party-card)', 
              border: '1px solid #4b5563', 
              borderRadius: '8px', 
              padding: '16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
                {user.totalScore}
              </div>
              <div style={{ fontSize: '12px', color: '#9ca3af' }}>Punkte</div>
            </div>

            <div style={{ 
              background: 'var(--party-card)', 
              border: '1px solid #4b5563', 
              borderRadius: '8px', 
              padding: '16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>
                {user.totalQuestions > 0 ? Math.round((user.correctAnswers / user.totalQuestions) * 100) : 0}%
              </div>
              <div style={{ fontSize: '12px', color: '#9ca3af' }}>Genauigkeit</div>
            </div>
          </div>
        )}

        {/* Guest Mode - Buttons für nicht eingeloggte User */}
        {!user && (
          <div style={{ marginTop: '48px', color: '#9ca3af' }}>
            <p style={{ marginBottom: '24px' }}>Erstelle einen Account für erweiterte Features oder spiele als Gast!</p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link 
                to="/truth-or-dare"
                style={{ 
                  display: 'inline-block',
                  background: '#ef4444', 
                  color: 'white', 
                  fontWeight: 'bold', 
                  padding: '12px 24px', 
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '16px',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#dc2626'}
                onMouseOut={(e) => e.currentTarget.style.background = '#ef4444'}
              >
                😈 Truth or Dare
              </Link>

              <Link 
                to="/multiplayer"
                style={{ 
                  display: 'inline-block',
                  background: '#10b981', 
                  color: 'white', 
                  fontWeight: 'bold', 
                  padding: '12px 24px', 
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '16px',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#059669'}
                onMouseOut={(e) => e.currentTarget.style.background = '#10b981'}
              >
                🚀 Multiplayer
              </Link>
              
              <Link 
                to="/quiz"
                style={{ 
                  display: 'inline-block',
                  background: '#3b82f6', 
                  color: 'white', 
                  fontWeight: 'bold', 
                  padding: '12px 24px', 
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '16px',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#2563eb'}
                onMouseOut={(e) => e.currentTarget.style.background = '#3b82f6'}
              >
                🧠 Solo Quiz
              </Link>
            </div>
          </div>
        )}

        {/* Updated Features Preview */}
        <div style={{ 
          background: 'var(--party-card)', 
          border: '1px solid #4b5563', 
          borderRadius: '12px', 
          padding: '24px',
          marginTop: '48px',
          maxWidth: '40rem',
          margin: '48px auto 0'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
            🌟 Features
          </h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '16px',
            fontSize: '14px',
            color: '#d1d5db'
          }}>
            <div>
              <div style={{ color: '#10b981', fontWeight: 'bold', marginBottom: '4px' }}>
                ✅ 5 Party Games
              </div>
              <div style={{ color: '#9ca3af' }}>
                Quiz, Truth or Dare, Never Have I Ever & mehr
              </div>
            </div>
            
            <div>
              <div style={{ color: '#10b981', fontWeight: 'bold', marginBottom: '4px' }}>
                ✅ Real-time Multiplayer
              </div>
              <div style={{ color: '#9ca3af' }}>
                Live Quiz Battles mit Freunden
              </div>
            </div>
            
            <div>
              <div style={{ color: '#10b981', fontWeight: 'bold', marginBottom: '4px' }}>
                ✅ 3 Schwierigkeitsstufen
              </div>
              <div style={{ color: '#9ca3af' }}>
                Harmlos, Spicy & NSFW (18+)
              </div>
            </div>
            
            <div>
              <div style={{ color: '#10b981', fontWeight: 'bold', marginBottom: '4px' }}>
                ✅ 4 Sprachen
              </div>
              <div style={{ color: '#9ca3af' }}>
                DE, EN, ES, FR
              </div>
            </div>
            
            <div>
              <div style={{ color: '#10b981', fontWeight: 'bold', marginBottom: '4px' }}>
                ✅ Live Chat
              </div>
              <div style={{ color: '#9ca3af' }}>
                Mit Quick-Reactions
              </div>
            </div>
            
            <div>
              <div style={{ color: '#10b981', fontWeight: 'bold', marginBottom: '4px' }}>
                ✅ Statistiken
              </div>
              <div style={{ color: '#9ca3af' }}>
                Detaillierte Performance
              </div>
            </div>
          </div>
        </div>

        {/* New Games Badge */}
        <div style={{
          background: 'linear-gradient(45deg, #ef4444, #f59e0b, #8b5cf6)',
          borderRadius: '12px',
          padding: '2px',
          marginTop: '32px',
          maxWidth: '24rem',
          margin: '32px auto 0'
        }}>
          <div style={{
            background: 'var(--party-dark)',
            borderRadius: '10px',
            padding: '16px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🎉</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>
              3 neue Party Games verfügbar!
            </div>
            <div style={{ fontSize: '12px', color: '#9ca3af' }}>
              Truth or Dare • Never Have I Ever • Most Likely To
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;