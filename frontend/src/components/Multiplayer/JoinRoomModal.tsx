// src/components/Multiplayer/JoinRoomModal.tsx
import React, { useState } from 'react';
import { useMultiplayer } from '../../context/MultiplayerContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface JoinRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const JoinRoomModal: React.FC<JoinRoomModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { joinRoom, loading, error } = useMultiplayer();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    roomCode: '',
    password: ''
  });
  const [step, setStep] = useState<'code' | 'password'>('code');
  const [roomInfo, setRoomInfo] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 'code') {
      // First check if room exists and get info
      try {
        const response = await fetch(`/api/multiplayer/rooms/${formData.roomCode.toUpperCase()}`);
        const data = await response.json();
        
        if (response.ok) {
          setRoomInfo(data);
          
          // If room has password, go to password step
          if (data.hasPassword) {
            setStep('password');
          } else {
            // Join directly
            await joinRoom(formData.roomCode);
            navigate(`/multiplayer/room/${formData.roomCode.toUpperCase()}`);
            onClose();
          }
        } else {
          alert(data.error || 'Raum nicht gefunden');
        }
      } catch (error) {
        alert('Fehler beim Suchen des Raums');
      }
    } else {
      // Join room with password
      try {
        await joinRoom(formData.roomCode, formData.password);
        navigate(`/multiplayer/room/${formData.roomCode.toUpperCase()}`);
        onClose();
      } catch (error) {
        console.error('Failed to join room:', error);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value.toUpperCase()
    }));
  };

  const resetForm = () => {
    setFormData({ roomCode: '', password: '' });
    setStep('code');
    setRoomInfo(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      background: 'rgba(0, 0, 0, 0.7)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      zIndex: 50, 
      padding: '16px' 
    }}>
      <div style={{ 
        background: 'var(--party-card)', 
        borderRadius: '12px', 
        padding: '32px', 
        border: '1px solid #4b5563',
        maxWidth: '28rem',
        width: '100%'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '24px' 
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
            {step === 'code' ? 'Raum beitreten 🔗' : 'Passwort eingeben 🔒'}
          </h2>
          <button
            onClick={handleClose}
            style={{ 
              background: '#4b5563', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px', 
              width: '32px', 
              height: '32px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            ✕
          </button>
        </div>

        {error && (
          <div style={{ 
            background: '#dc2626', 
            color: 'white', 
            padding: '12px', 
            borderRadius: '8px', 
            marginBottom: '16px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {step === 'code' ? (
            <>
              {/* Room Code Input */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                  Raum Code *
                </label>
                <input
                  type="text"
                  name="roomCode"
                  value={formData.roomCode}
                  onChange={handleChange}
                  required
                  maxLength={6}
                  style={{ 
                    width: '100%', 
                    padding: '16px', 
                    background: 'var(--party-gray)', 
                    border: '1px solid #4b5563', 
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '24px',
                    textAlign: 'center',
                    letterSpacing: '4px',
                    fontFamily: 'monospace'
                  }}
                  placeholder="ABCD"
                />
                <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px', textAlign: 'center' }}>
                  Gib den 4-stelligen Raum-Code ein
                </p>
              </div>

              <div style={{ 
                background: 'var(--party-gray)', 
                padding: '16px', 
                borderRadius: '8px',
                border: '1px solid #4b5563'
              }}>
                <h4 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                  💡 Tipp
                </h4>
                <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>
                  Frage den Raum-Host nach dem Code oder schaue in die Einladung. 
                  Der Code besteht aus 4 Buchstaben (z.B. QUIZ).
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Room Info */}
              {roomInfo && (
                <div style={{ 
                  background: 'var(--party-gray)', 
                  padding: '16px', 
                  borderRadius: '8px',
                  border: '1px solid #4b5563',
                  marginBottom: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <div style={{ fontSize: '24px' }}>
                      {roomInfo.category?.icon || '🎯'}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>
                        {roomInfo.name}
                      </h4>
                      <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>
                        Host: {roomInfo.host.username} • {roomInfo.currentPlayers}/{roomInfo.maxPlayers} Spieler
                      </p>
                    </div>
                  </div>
                  <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                    {roomInfo.category?.name || 'Gemischt'} • {roomInfo.difficulty} • {roomInfo.questionsPerRound} Fragen
                  </div>
                </div>
              )}

              {/* Password Input */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                  Passwort *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
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
                  placeholder="Raum-Passwort eingeben"
                />
              </div>

              {/* Back Button */}
              <button
                type="button"
                onClick={() => setStep('code')}
                style={{ 
                  background: '#6b7280', 
                  color: 'white', 
                  border: 'none',
                  padding: '8px 16px', 
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  alignSelf: 'flex-start'
                }}
              >
                ← Zurück
              </button>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || (step === 'code' && formData.roomCode.length < 4)}
            style={{ 
              width: '100%', 
              background: loading ? '#4b5563' : '#3b82f6', 
              color: 'white', 
              fontWeight: 'bold', 
              padding: '16px', 
              borderRadius: '8px',
              border: 'none',
              cursor: (loading || (step === 'code' && formData.roomCode.length < 4)) ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              transition: 'background 0.2s'
            }}
          >
            {loading ? 'Trete bei...' : 
             step === 'code' ? '🔍 Raum suchen' : '🚀 Beitreten'}
          </button>

          {/* Guest Mode Info */}
          {!user && (
            <div style={{ 
              background: 'var(--party-gray)', 
              padding: '12px', 
              borderRadius: '8px',
              border: '1px solid #f59e0b'
            }}>
              <p style={{ fontSize: '12px', color: '#f59e0b', margin: 0, textAlign: 'center' }}>
                ℹ️ Du spielst als Gast - deine Ergebnisse werden nicht gespeichert
              </p>
            </div>
          )}
        </form>

        {/* Help Section */}
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', color: '#9ca3af' }}>
            Brauchst du Hilfe? Der Raum-Host kann dir den Code senden.
          </p>
        </div>
      </div>
    </div>
  );
};

export default JoinRoomModal;