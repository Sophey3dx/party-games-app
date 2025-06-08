// src/components/Multiplayer/GameResults.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMultiplayer } from '../../context/MultiplayerContext';
import { useAuth } from '../../context/AuthContext';

const GameResults: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { finalResults, room, totalQuestions, leaveRoom } = useMultiplayer();

  const myResult = finalResults.find(r => r.playerId === user?.id);
  const winner = finalResults[0];

  const handleBackToLobby = () => {
    leaveRoom();
    navigate('/multiplayer');
  };

  const handlePlayAgain = () => {
    // TODO: Implement play again functionality
    handleBackToLobby();
  };

  const getPlacementEmoji = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '🏅';
    }
  };

  const getPlacementColor = (rank: number) => {
    switch (rank) {
      case 1: return '#f59e0b';
      case 2: return '#9ca3af';
      case 3: return '#cd7c2f';
      default: return '#6b7280';
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--party-dark)', color: 'white', padding: '24px' }}>
      <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
        {/* Header & Winner Announcement */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ 
            fontSize: '48px', 
            fontWeight: 'bold', 
            marginBottom: '16px',
            background: 'linear-gradient(to right, #f59e0b, #ef4444)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Spiel Beendet! 🎉
          </h1>
          
          {winner && (
            <div style={{ 
              background: 'var(--party-card)',
              border: '2px solid #f59e0b',
              borderRadius: '16px',
              padding: '32px',
              marginBottom: '24px'
            }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>👑</div>
              <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px', color: '#f59e0b' }}>
                {winner.username} gewinnt!
              </h2>
              <p style={{ fontSize: '18px', color: '#d1d5db' }}>
                {winner.totalScore} Punkte • {winner.correctAnswers}/{totalQuestions} richtig ({winner.accuracy}%)
              </p>
            </div>
          )}

          {/* My Performance */}
          {myResult && (
            <div style={{ 
              background: myResult.rank <= 3 ? getPlacementColor(myResult.rank) : 'var(--party-card)',
              color: myResult.rank <= 3 ? '#000' : '#fff',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px',
              border: `2px solid ${getPlacementColor(myResult.rank)}`
            }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>
                {getPlacementEmoji(myResult.rank)}
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
                Platz {myResult.rank}
              </h3>
              <div style={{ fontSize: '16px', opacity: 0.8 }}>
                Du hast {myResult.totalScore} Punkte erreicht!
              </div>
            </div>
          )}
        </div>

        {/* Full Leaderboard */}
        <div style={{ 
          background: 'var(--party-card)', 
          borderRadius: '16px', 
          padding: '32px', 
          border: '1px solid #4b5563',
          marginBottom: '32px'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', textAlign: 'center' }}>
            🏆 Finale Rangliste
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {finalResults.map((result) => (
              <div
                key={result.playerId}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  background: result.rank <= 3 ? getPlacementColor(result.rank) : 'var(--party-gray)',
                  color: result.rank <= 3 ? '#000' : '#fff',
                  padding: '20px', 
                  borderRadius: '12px',
                  border: result.playerId === user?.id ? '3px solid #3b82f6' : 'none',
                  position: 'relative'
                }}
              >
                {/* Rank & Player Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ 
                    fontSize: '32px',
                    minWidth: '48px',
                    textAlign: 'center'
                  }}>
                    {getPlacementEmoji(result.rank)}
                  </div>
                  
                  <div style={{ fontSize: '40px' }}>{result.avatar}</div>
                  
                  <div>
                    <div style={{ 
                      fontSize: '20px', 
                      fontWeight: 'bold',
                      marginBottom: '4px'
                    }}>
                      {result.username}
                      {result.playerId === user?.id && (
                        <span style={{ 
                          fontSize: '14px', 
                          marginLeft: '8px',
                          opacity: 0.7
                        }}>
                          (Du)
                        </span>
                      )}
                    </div>
                    <div style={{ 
                      fontSize: '14px', 
                      opacity: 0.8,
                      display: 'flex',
                      gap: '16px'
                    }}>
                      <span>✅ {result.correctAnswers}/{totalQuestions}</span>
                      <span>📊 {result.accuracy}%</span>
                    </div>
                  </div>
                </div>

                {/* Score */}
                <div style={{ textAlign: 'right' }}>
                  <div style={{ 
                    fontSize: '24px', 
                    fontWeight: 'bold',
                    marginBottom: '4px'
                  }}>
                    {result.totalScore}
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    opacity: 0.7 
                  }}>
                    Punkte
                  </div>
                </div>

                {/* Special badges */}
                {result.rank === 1 && (
                  <div style={{ 
                    position: 'absolute',
                    top: '-8px',
                    right: '16px',
                    background: '#fbbf24',
                    color: '#000',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    SIEGER
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Game Statistics */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '16px',
          marginBottom: '32px'
        }}>
          <div style={{ 
            background: 'var(--party-card)', 
            borderRadius: '12px', 
            padding: '20px',
            textAlign: 'center',
            border: '1px solid #4b5563'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6' }}>
              {finalResults.length}
            </div>
            <div style={{ color: '#9ca3af', fontSize: '14px' }}>Teilnehmer</div>
          </div>

          <div style={{ 
            background: 'var(--party-card)', 
            borderRadius: '12px', 
            padding: '20px',
            textAlign: 'center',
            border: '1px solid #4b5563'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981' }}>
              {totalQuestions}
            </div>
            <div style={{ color: '#9ca3af', fontSize: '14px' }}>Fragen</div>
          </div>

          <div style={{ 
            background: 'var(--party-card)', 
            borderRadius: '12px', 
            padding: '20px',
            textAlign: 'center',
            border: '1px solid #4b5563'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f59e0b' }}>
              {winner?.totalScore || 0}
            </div>
            <div style={{ color: '#9ca3af', fontSize: '14px' }}>Höchste Punktzahl</div>
          </div>

          <div style={{ 
            background: 'var(--party-card)', 
            borderRadius: '12px', 
            padding: '20px',
            textAlign: 'center',
            border: '1px solid #4b5563'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#8b5cf6' }}>
              {Math.round(finalResults.reduce((sum, r) => sum + r.accuracy, 0) / finalResults.length)}%
            </div>
            <div style={{ color: '#9ca3af', fontSize: '14px' }}>Durchschnitt</div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '16px',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={handlePlayAgain}
              style={{ 
                background: '#10b981', 
                color: 'white', 
                fontWeight: 'bold', 
                padding: '16px 32px', 
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'background 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#059669'}
              onMouseOut={(e) => e.currentTarget.style.background = '#10b981'}
            >
              🔄 Nochmal spielen
            </button>

            <button
              onClick={handleBackToLobby}
              style={{ 
                background: '#4b5563', 
                color: 'white', 
                fontWeight: 'bold', 
                padding: '16px 32px', 
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'background 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#374151'}
              onMouseOut={(e) => e.currentTarget.style.background = '#4b5563'}
            >
              🏠 Zurück zur Lobby
            </button>

            {user && (
              <button
                onClick={() => navigate('/profile')}
                style={{ 
                  background: '#3b82f6', 
                  color: 'white', 
                  fontWeight: 'bold', 
                  padding: '16px 32px', 
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#2563eb'}
                onMouseOut={(e) => e.currentTarget.style.background = '#3b82f6'}
              >
                📊 Meine Stats
              </button>
            )}
          </div>

          {/* Room Info */}
          {room && (
            <div style={{ 
              background: 'var(--party-gray)', 
              padding: '16px', 
              borderRadius: '8px',
              textAlign: 'center',
              maxWidth: '24rem',
              marginTop: '16px'
            }}>
              <p style={{ fontSize: '14px', color: '#9ca3af', margin: 0 }}>
                Gespielt in: <span style={{ fontWeight: 'bold' }}>{room.name}</span>
                <br />
                Kategorie: {room.category?.name || 'Gemischt'} • {room.difficulty}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameResults;