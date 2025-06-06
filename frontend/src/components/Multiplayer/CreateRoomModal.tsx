// src/components/Multiplayer/CreateRoomModal.tsx
import React, { useState, useEffect } from 'react';
import { useMultiplayer } from '../../context/MultiplayerContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Category {
  id: number;
  name: string;
  displayName: string;
  icon: string;
  difficulty: string;
}

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateRoomModal: React.FC<CreateRoomModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { createRoom, loading, error } = useMultiplayer();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    maxPlayers: 8,
    categoryId: 0, // 0 = Mixed
    difficulty: 'mixed',
    questionsPerRound: 10,
    timePerQuestion: 30,
    language: 'de',
    isPrivate: false,
    password: ''
  });

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      // Set default room name
      if (user && !formData.name) {
        setFormData(prev => ({
          ...prev,
          name: `${user.username}'s Quiz Room`
        }));
      }
    }
  }, [isOpen, user]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/quiz/categories?lang=de');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('Du musst eingeloggt sein um einen Raum zu erstellen!');
      return;
    }

    try {
      const roomData = {
        ...formData,
        categoryId: formData.categoryId === 0 ? undefined : formData.categoryId,
        password: formData.isPrivate && formData.password ? formData.password : undefined
      };

      const roomCode = await createRoom(roomData);
      
      // Navigate to game room
      navigate(`/multiplayer/room/${roomCode}`);
      onClose();
    } catch (error) {
      console.error('Failed to create room:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseInt(value) : value
    }));
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
        maxWidth: '32rem',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '24px' 
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
            Neuen Raum erstellen 🚀
          </h2>
          <button
            onClick={onClose}
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
          {/* Room Name */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
              Raum Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
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
              placeholder="z.B. Episches Quiz Battle"
            />
          </div>

          {/* Max Players */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
              Maximale Spieler: {formData.maxPlayers}
            </label>
            <input
              type="range"
              name="maxPlayers"
              min="2"
              max="12"
              value={formData.maxPlayers}
              onChange={handleChange}
              style={{ width: '100%' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#9ca3af' }}>
              <span>2</span>
              <span>12</span>
            </div>
          </div>

          {/* Category */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
              Kategorie
            </label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              style={{ 
                width: '100%', 
                padding: '12px', 
                background: 'var(--party-gray)', 
                border: '1px solid #4b5563', 
                borderRadius: '8px',
                color: 'white',
                fontSize: '16px'
              }}
            >
              <option value={0}>🎯 Gemischt (Alle Kategorien)</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.displayName}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
              Schwierigkeit
            </label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              style={{ 
                width: '100%', 
                padding: '12px', 
                background: 'var(--party-gray)', 
                border: '1px solid #4b5563', 
                borderRadius: '8px',
                color: 'white',
                fontSize: '16px'
              }}
            >
              <option value="mixed">🎯 Gemischt</option>
              <option value="easy">🟢 Einfach</option>
              <option value="medium">🟡 Mittel</option>
              <option value="hard">🔴 Schwer</option>
            </select>
          </div>

          {/* Game Settings */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                Fragen pro Runde
              </label>
              <select
                name="questionsPerRound"
                value={formData.questionsPerRound}
                onChange={handleChange}
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  background: 'var(--party-gray)', 
                  border: '1px solid #4b5563', 
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px'
                }}
              >
                <option value={5}>5 Fragen</option>
                <option value={10}>10 Fragen</option>
                <option value={15}>15 Fragen</option>
                <option value={20}>20 Fragen</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                Zeit pro Frage
              </label>
              <select
                name="timePerQuestion"
                value={formData.timePerQuestion}
                onChange={handleChange}
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  background: 'var(--party-gray)', 
                  border: '1px solid #4b5563', 
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px'
                }}
              >
                <option value={15}>15 Sekunden</option>
                <option value={20}>20 Sekunden</option>
                <option value={30}>30 Sekunden</option>
                <option value={45}>45 Sekunden</option>
                <option value={60}>60 Sekunden</option>
              </select>
            </div>
          </div>

          {/* Language */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
              Sprache
            </label>
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
              style={{ 
                width: '100%', 
                padding: '12px', 
                background: 'var(--party-gray)', 
                border: '1px solid #4b5563', 
                borderRadius: '8px',
                color: 'white',
                fontSize: '16px'
              }}
            >
              <option value="de">🇩🇪 Deutsch</option>
              <option value="en">🇺🇸 English</option>
              <option value="es">🇪🇸 Español</option>
              <option value="fr">🇫🇷 Français</option>
            </select>
          </div>

          {/* Privacy Settings */}
          <div style={{ 
            background: 'var(--party-gray)', 
            padding: '16px', 
            borderRadius: '8px',
            border: '1px solid #4b5563'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <input
                type="checkbox"
                name="isPrivate"
                checked={formData.isPrivate}
                onChange={handleChange}
                style={{ marginRight: '8px' }}
              />
              <label style={{ fontSize: '14px', fontWeight: '500' }}>
                🔒 Privater Raum
              </label>
            </div>
            <p style={{ fontSize: '12px', color: '#9ca3af', margin: '0 0 12px 0' }}>
              Private Räume erscheinen nicht in der öffentlichen Liste
            </p>

            {formData.isPrivate && (
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                  Passwort (optional)
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    background: 'var(--party-dark)', 
                    border: '1px solid #4b5563', 
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '14px'
                  }}
                  placeholder="Passwort für den Raum"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !user}
            style={{ 
              width: '100%', 
              background: loading ? '#4b5563' : '#10b981', 
              color: 'white', 
              fontWeight: 'bold', 
              padding: '16px', 
              borderRadius: '8px',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              transition: 'background 0.2s'
            }}
          >
            {loading ? 'Erstelle Raum...' : '🚀 Raum erstellen'}
          </button>

          {!user && (
            <p style={{ 
              fontSize: '14px', 
              color: '#ef4444', 
              textAlign: 'center',
              margin: 0
            }}>
              Du musst eingeloggt sein um einen Raum zu erstellen!
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateRoomModal;