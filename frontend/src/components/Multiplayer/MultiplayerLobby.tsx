// src/components/Multiplayer/MultiplayerLobby.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import CreateRoomModal from './CreateRoomModal';
import JoinRoomModal from './JoinRoomModal';
import PublicRoomsList from './PublicRoomsList';

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

const MultiplayerLobby: React.FC = () => {
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [publicRooms, setPublicRooms] = useState<PublicRoom[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPublicRooms();
    const interval = setInterval(fetchPublicRooms, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchPublicRooms = async () => {
    try {
      const response = await fetch('/api/multiplayer/rooms');
      if (response.ok) {
        const rooms = await response.json();
        setPublicRooms(rooms);
      }
    } catch (error) {
      console.error('Failed to fetch public rooms:', error);
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '24px' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ 
            fontSize: '48px', 
            fontWeight: 'bold', 
            marginBottom: '16px',
            background: 'linear-gradient(to right, #60a5fa, #a855f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Multiplayer Arena 🏆
          </h1>
          <p style={{ fontSize: '20px', color: '#d1d5db', maxWidth: '32rem', margin: '0 auto' }}>
            Spiele Quiz-Battles gegen Freunde oder tritt öffentlichen Räumen bei!
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '24px', 
          marginBottom: '48px' 
        }}>
          {/* Create Room Card */}
          <div 
            onClick={() => setShowCreateModal(true)}
            style={{ 
              background: 'var(--party-card)', 
              border: '1px solid #4b5563', 
              borderRadius: '12px', 
              padding: '32px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#10b981';
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = '#4b5563';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🚀</div>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', color: '#10b981' }}>
              Raum erstellen
            </h3>
            <p style={{ color: '#9ca3af', marginBottom: '16px' }}>
              Erstelle deinen eigenen Quiz-Raum und lade Freunde ein
            </p>
            <div style={{ 
              background: '#10b981', 
              color: 'white', 
              padding: '12px 24px', 
              borderRadius: '8px',
              fontWeight: 'bold',
              display: 'inline-block'
            }}>
              + Neuer Raum
            </div>
          </div>

          {/* Join Room Card */}
          <div 
            onClick={() => setShowJoinModal(true)}
            style={{ 
              background: 'var(--party-card)', 
              border: '1px solid #4b5563', 
              borderRadius: '12px', 
              padding: '32px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#3b82f6';
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = '#4b5563';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔗</div>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', color: '#3b82f6' }}>
              Raum beitreten
            </h3>
            <p style={{ color: '#9ca3af', marginBottom: '16px' }}>
              Tritt einem privaten Raum mit einem Code bei
            </p>
            <div style={{ 
              background: '#3b82f6', 
              color: 'white', 
              padding: '12px 24px', 
              borderRadius: '8px',
              fontWeight: 'bold',
              display: 'inline-block'
            }}>
              Code eingeben
            </div>
          </div>
        </div>

        {/* User Info */}
        {user && (
          <div style={{ 
            background: 'var(--party-card)', 
            border: '1px solid #4b5563', 
            borderRadius: '12px', 
            padding: '24px', 
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{ fontSize: '48px' }}>{user.avatar}</div>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '4px' }}>
                {user.username}
              </h3>
              <p style={{ color: '#9ca3af', fontSize: '14px' }}>
                Level {Math.floor(user.totalScore / 1000) + 1} • {user.totalScore} Punkte • {user.gamesPlayed} Spiele
              </p>
            </div>
            <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
              <div style={{ fontSize: '14px', color: '#9ca3af' }}>Bereit für Multiplayer!</div>
              <div style={{ fontSize: '12px', color: '#10b981' }}>● Online</div>
            </div>
          </div>
        )}

        {/* Public Rooms */}
        <div style={{ 
          background: 'var(--party-card)', 
          border: '1px solid #4b5563', 
          borderRadius: '12px', 
          padding: '32px' 
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '24px' 
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>
              Öffentliche Räume 🌐
            </h2>
            <button
              onClick={fetchPublicRooms}
              style={{ 
                background: '#6b7280', 
                color: 'white', 
                border: 'none', 
                borderRadius: '6px', 
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              🔄 Aktualisieren
            </button>
          </div>

          <PublicRoomsList rooms={publicRooms} loading={loading} />
        </div>

        {/* Statistics */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '24px', 
          marginTop: '32px' 
        }}>
          <div style={{ 
            background: 'var(--party-card)', 
            border: '1px solid #4b5563', 
            borderRadius: '12px', 
            padding: '24px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981' }}>
              {publicRooms.length}
            </div>
            <div style={{ color: '#9ca3af', fontSize: '14px' }}>Aktive Räume</div>
          </div>

          <div style={{ 
            background: 'var(--party-card)', 
            border: '1px solid #4b5563', 
            borderRadius: '12px', 
            padding: '24px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6' }}>
              {publicRooms.reduce((sum, room) => sum + room.currentPlayers, 0)}
            </div>
            <div style={{ color: '#9ca3af', fontSize: '14px' }}>Spieler Online</div>
          </div>

          <div style={{ 
            background: 'var(--party-card)', 
            border: '1px solid #4b5563', 
            borderRadius: '12px', 
            padding: '24px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f59e0b' }}>
              {user?.gamesPlayed || 0}
            </div>
            <div style={{ color: '#9ca3af', fontSize: '14px' }}>Deine Spiele</div>
          </div>

          <div style={{ 
            background: 'var(--party-card)', 
            border: '1px solid #4b5563', 
            borderRadius: '12px', 
            padding: '24px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#8b5cf6' }}>
              {user ? Math.round((user.correctAnswers / Math.max(user.totalQuestions, 1)) * 100) : 0}%
            </div>
            <div style={{ color: '#9ca3af', fontSize: '14px' }}>Deine Genauigkeit</div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateRoomModal 
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {showJoinModal && (
        <JoinRoomModal 
          isOpen={showJoinModal}
          onClose={() => setShowJoinModal(false)}
        />
      )}
    </div>
  );
};

export default MultiplayerLobby;