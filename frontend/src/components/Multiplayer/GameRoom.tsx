// src/components/Multiplayer/GameRoom.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMultiplayer } from '../../context/MultiplayerContext';
import { useAuth } from '../../context/AuthContext';
import MultiplayerGame from './MultiplayerGame';
import GameResults from './GameResults';
import Chat from './Chat';

const GameRoom: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    room,
    players,
    gameState,
    isInRoom,
    isHost,
    error,
    joinRoom,
    leaveRoom,
    setPlayerReady
  } = useMultiplayer();
  
  const [isJoining, setIsJoining] = useState(true);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    if (roomId && !isInRoom) {
      handleJoinRoom();
    }
  }, [roomId, isInRoom]);

  const handleJoinRoom = async () => {
    if (!roomId) return;
    
    try {
      setIsJoining(true);
      await joinRoom(roomId);
    } catch (error) {
      console.error('Failed to join room:', error);
      navigate('/multiplayer');
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeaveRoom = () => {
    leaveRoom();
    navigate('/multiplayer');
  };

  const handleReady = () => {
    setPlayerReady();
  };

  if (isJoining) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            border: '4px solid #374151', 
            borderTop: '4px solid #3b82f6', 
            borderRadius: '50%', 
            margin: '0 auto 16px',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ fontSize: '18px' }}>Trete Raum bei... 🚀</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
        <div style={{ 
          background: 'var(--party-card)', 
          borderRadius: '12px', 
          padding: '32px', 
          border: '1px solid #ef4444',
          textAlign: 'center',
          maxWidth: '24rem'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>😵</div>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#ef4444' }}>
            Oops! Fehler aufgetreten
          </h2>
          <p style={{ color: '#9ca3af', marginBottom: '24px' }}>{error}</p>
          <button
            onClick={() => navigate('/multiplayer')}
            style={{ 
              background: '#3b82f6', 
              color: 'white', 
              fontWeight: 'bold', 
              padding: '12px 24px', 
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Zurück zur Lobby
          </button>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
          <p style={{ fontSize: '18px', color: '#9ca3af' }}>Raum wird geladen...</p>
        </div>
      </div>
    );
  }

  // Zeige das Spiel oder die Ergebnisse basierend auf dem Status
  if (gameState === 'playing' || gameState === 'question-results') {
    return <MultiplayerGame />;
  }

  if (gameState === 'final-results') {
    return <GameResults />;
  }

  // Lobby/Warteraum
  const readyPlayers = players.filter(p => p.isReady).length;
  const canStartGame = players.length >= 2 && readyPlayers === players.length;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--party-dark)', color: 'white' }}>
      {/* Header */}
      <div style={{ 
        background: 'var(--party-card)', 
        borderBottom: '1px solid #4b5563', 
        padding: '16px' 
      }}>
        <div style={{ 
          maxWidth: '80rem', 
          margin: '0 auto', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={handleLeaveRoom}
              style={{ 
                background: '#4b5563', 
                color: 'white', 
                border: 'none', 
                borderRadius: '6px', 
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              ← Verlassen
            </button>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>{room.name}</h1>
              <p style={{ fontSize: '14px', color: '#9ca3af', margin: 0 }}>
                Code: <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{room.id}</span>
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => setShowChat(!showChat)}
              style={{ 
                background: showChat ? '#3b82f6' : '#4b5563', 
                color: 'white', 
                border: 'none', 
                borderRadius: '6px', 
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              💬 Chat
            </button>
            <div style={{ fontSize: '14px', color: '#9ca3af' }}>
              {players.length}/{room.maxPlayers} Spieler
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '24px', display: 'flex', gap: '24px' }}>
        {/* Main Content */}
        <div style={{ flex: 1 }}>
          {/* Room Info */}
          <div style={{ 
            background: 'var(--party-card)', 
            borderRadius: '12px', 
            padding: '24px', 
            border: '1px solid #4b5563',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{ fontSize: '48px' }}>
                {room.category?.icon || '🎯'}
              </div>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
                  {room.category?.name || 'Gemischte Kategorien'}
                </h2>
                <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: '#9ca3af' }}>
                  <span>🎯 {room.difficulty}</span>
                  <span>❓ {room.questionsPerRound} Fragen</span>
                  <span>⏱️ {room.timePerQuestion}s pro Frage</span>
                  <span>🌍 {room.language.toUpperCase()}</span>
                </div>
              </div>
            </div>
            
            {isHost && (
              <div style={{ 
                background: '#059669', 
                color: 'white', 
                padding: '12px', 
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                👑 Du bist der Host - das Spiel startet automatisch wenn alle bereit sind!
              </div>
            )}
          </div>

          {/* Players Grid */}
          <div style={{ 
            background: 'var(--party-card)', 
            borderRadius: '12px', 
            padding: '24px', 
            border: '1px solid #4b5563',
            marginBottom: '24px'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '20px' 
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>
                Spieler ({players.length}/{room.maxPlayers})
              </h3>
              <div style={{ fontSize: '14px', color: '#9ca3af' }}>
                {readyPlayers}/{players.length} bereit
              </div>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
              gap: '16px' 
            }}>
              {players.map((player) => (
                <div
                  key={player.id}
                  style={{ 
                    background: player.isReady ? '#059669' : 'var(--party-gray)', 
                    border: player.isHost ? '2px solid #f59e0b' : '1px solid #4b5563',
                    borderRadius: '8px', 
                    padding: '16px',
                    textAlign: 'center',
                    position: 'relative'
                  }}
                >
                  {player.isHost && (
                    <div style={{ 
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      background: '#f59e0b',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px'
                    }}>
                      👑
                    </div>
                  )}
                  
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>{player.avatar}</div>
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{player.username}</div>
                  <div style={{ fontSize: '12px', color: '#d1d5db' }}>
                    {player.score} Punkte
                  </div>
                  
                  {player.isReady ? (
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#fff', 
                      marginTop: '8px',
                      fontWeight: 'bold'
                    }}>
                      ✅ Bereit!
                    </div>
                  ) : (
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#9ca3af', 
                      marginTop: '8px' 
                    }}>
                      ⏳ Warten...
                    </div>
                  )}
                </div>
              ))}

              {/* Empty slots */}
              {Array.from({ length: room.maxPlayers - players.length }).map((_, index) => (
                <div
                  key={`empty-${index}`}
                  style={{ 
                    background: 'var(--party-gray)', 
                    border: '1px dashed #4b5563',
                    borderRadius: '8px', 
                    padding: '16px',
                    textAlign: 'center',
                    color: '#6b7280'
                  }}
                >
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>👤</div>
                  <div style={{ fontSize: '14px' }}>Warten auf Spieler...</div>
                </div>
              ))}
            </div>
          </div>

          {/* Ready Button & Game Start */}
          <div style={{ 
            background: 'var(--party-card)', 
            borderRadius: '12px', 
            padding: '24px', 
            border: '1px solid #4b5563',
            textAlign: 'center'
          }}>
            {user && !players.find(p => p.userId === user.id)?.isReady ? (
              <button
                onClick={handleReady}
                style={{ 
                  background: '#10b981', 
                  color: 'white', 
                  fontWeight: 'bold', 
                  padding: '16px 32px', 
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '18px',
                  marginBottom: '16px'
                }}
              >
                ✅ Ich bin bereit!
              </button>
            ) : (
              <div style={{ 
                background: '#059669', 
                color: 'white', 
                padding: '16px 32px', 
                borderRadius: '8px',
                fontSize: '18px',
                fontWeight: 'bold',
                marginBottom: '16px'
              }}>
                ✅ Du bist bereit!
              </div>
            )}

            {canStartGame ? (
              <div style={{ 
                background: '#10b981', 
                color: 'white', 
                padding: '12px', 
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold'
              }}>
                🚀 Spiel startet automatisch...
              </div>
            ) : (
              <div style={{ color: '#9ca3af', fontSize: '14px' }}>
                {players.length < 2 ? 
                  `Mindestens 2 Spieler benötigt (${2 - players.length} fehlen)` :
                  `Warten auf ${players.length - readyPlayers} Spieler...`
                }
              </div>
            )}
          </div>
        </div>

        {/* Chat Sidebar */}
        {showChat && (
          <div style={{ width: '300px', flexShrink: 0 }}>
            <Chat />
          </div>
        )}
      </div>
    </div>
  );
};

export default GameRoom;