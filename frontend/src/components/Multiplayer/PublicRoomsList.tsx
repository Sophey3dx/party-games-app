// src/components/Multiplayer/PublicRoomsList.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMultiplayer } from '../../context/MultiplayerContext';

interface PublicRoom {
  id: string;
  name: string;
  host: {
    id: number;
    username: string;
    avatar: string;
  };
  category?: {
    id: number;
    name: string;
    icon: string;
  };
  currentPlayers: number;
  maxPlayers: number;
  difficulty: string;
  status: string;
  players: Array<{
    username: string;
    avatar: string;
  }>;
}

interface PublicRoomsListProps {
  rooms: PublicRoom[];
  loading: boolean;
}

const PublicRoomsList: React.FC<PublicRoomsListProps> = ({ rooms, loading }) => {
  const navigate = useNavigate();
  const { joinRoom } = useMultiplayer();

  const handleJoinRoom = async (roomId: string) => {
    try {
      await joinRoom(roomId);
      navigate(`/multiplayer/room/${roomId}`);
    } catch (error) {
      console.error('Failed to join room:', error);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'hard': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '🟢';
      case 'medium': return '🟡';
      case 'hard': return '🔴';
      default: return '🎯';
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 0' }}>
        <div style={{ 
          width: '48px', 
          height: '48px', 
          border: '4px solid #374151', 
          borderTop: '4px solid #3b82f6', 
          borderRadius: '50%', 
          margin: '0 auto 16px',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ color: '#9ca3af' }}>Lade Räume...</p>
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 0' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🏜️</div>
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px', color: '#9ca3af' }}>
          Keine öffentlichen Räume
        </h3>
        <p style={{ color: '#6b7280', marginBottom: '24px' }}>
          Erstelle den ersten Raum oder tritt einem privaten Raum mit einem Code bei!
        </p>
        <div style={{ 
          background: 'var(--party-gray)', 
          padding: '16px', 
          borderRadius: '8px',
          border: '1px solid #4b5563',
          maxWidth: '24rem',
          margin: '0 auto'
        }}>
          <p style={{ fontSize: '14px', color: '#9ca3af', margin: 0 }}>
            💡 Tipp: Öffentliche Räume werden hier automatisch angezeigt. 
            Private Räume benötigen einen Code zum Beitreten.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {rooms.map((room) => (
        <div
          key={room.id}
          style={{ 
            background: 'var(--party-gray)', 
            border: '1px solid #4b5563', 
            borderRadius: '12px', 
            padding: '20px',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = '#3b82f6';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = '#4b5563';
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            {/* Room Info */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ fontSize: '32px' }}>
                  {room.category?.icon || '🎯'}
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 4px 0' }}>
                    {room.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#9ca3af' }}>
                      Host: {room.host.avatar} {room.host.username}
                    </span>
                  </div>
                </div>
              </div>

              {/* Room Details */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                <div style={{ 
                  background: 'var(--party-dark)', 
                  padding: '4px 8px', 
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: '#d1d5db'
                }}>
                  📂 {room.category?.name || 'Gemischt'}
                </div>
                <div style={{ 
                  background: 'var(--party-dark)', 
                  padding: '4px 8px', 
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: getDifficultyColor(room.difficulty),
                  border: `1px solid ${getDifficultyColor(room.difficulty)}`
                }}>
                  {getDifficultyIcon(room.difficulty)} {room.difficulty}
                </div>
                <div style={{ 
                  background: 'var(--party-dark)', 
                  padding: '4px 8px', 
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: '#d1d5db'
                }}>
                  👥 {room.currentPlayers}/{room.maxPlayers}
                </div>
              </div>

              {/* Players Preview */}
              {room.players.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#9ca3af' }}>Spieler:</span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {room.players.slice(0, 5).map((player, index) => (
                      <div
                        key={index}
                        style={{ 
                          fontSize: '16px',
                          title: player.username
                        }}
                        title={player.username}
                      >
                        {player.avatar}
                      </div>
                    ))}
                    {room.players.length > 5 && (
                      <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                        +{room.players.length - 5}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Join Button */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
              <button
                onClick={() => handleJoinRoom(room.id)}
                disabled={room.currentPlayers >= room.maxPlayers}
                style={{ 
                  background: room.currentPlayers >= room.maxPlayers ? '#4b5563' : '#3b82f6',
                  color: 'white', 
                  fontWeight: 'bold', 
                  padding: '12px 20px', 
                  borderRadius: '8px',
                  border: 'none',
                  cursor: room.currentPlayers >= room.maxPlayers ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  transition: 'background 0.2s',
                  minWidth: '100px'
                }}
                onMouseOver={(e) => {
                  if (room.currentPlayers < room.maxPlayers) {
                    e.currentTarget.style.background = '#2563eb';
                  }
                }}
                onMouseOut={(e) => {
                  if (room.currentPlayers < room.maxPlayers) {
                    e.currentTarget.style.background = '#3b82f6';
                  }
                }}
              >
                {room.currentPlayers >= room.maxPlayers ? '🔒 Voll' : '🚀 Beitreten'}
              </button>

              <div style={{ fontSize: '12px', color: '#9ca3af', textAlign: 'right' }}>
                Code: <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{room.id}</span>
              </div>
            </div>
          </div>

          {/* Room Status */}
          {room.status === 'playing' && (
            <div style={{ 
              marginTop: '12px',
              padding: '8px 12px',
              background: '#f59e0b',
              color: '#000',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 'bold',
              textAlign: 'center'
            }}>
              🎮 Spiel läuft - Beitreten als Zuschauer möglich
            </div>
          )}
        </div>
      ))}

      {/* Load More Hint */}
      {rooms.length >= 20 && (
        <div style={{ textAlign: 'center', padding: '16px' }}>
          <p style={{ fontSize: '14px', color: '#9ca3af' }}>
            Zeige die ersten 20 Räume. Aktualisiere für neue Räume.
          </p>
        </div>
      )}
    </div>
  );
};

export default PublicRoomsList;