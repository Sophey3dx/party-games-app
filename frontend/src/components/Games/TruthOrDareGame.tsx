// TruthOrDareGame.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

interface TruthOrDareQuestion {
  id: number;
  type: 'truth' | 'dare';
  question: string;
  category: 'harmless' | 'spicy' | 'nsfw';
  difficulty: 'easy' | 'medium' | 'hard';
}

interface Player {
  id: number;
  name: string;
  avatar: string;
  points: number;
}

const TruthOrDareGame: React.FC = () => {
  const { user } = useAuth();
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<TruthOrDareQuestion | null>(null);
  const [gameMode, setGameMode] = useState<'setup' | 'playing' | 'finished'>('setup');
  const [category, setCategory] = useState<'harmless' | 'spicy' | 'nsfw'>('harmless');
  const [showQuestion, setShowQuestion] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');

  // Sample Questions Database
  const questionsDB: TruthOrDareQuestion[] = [
    // HARMLESS TRUTHS
    { id: 1, type: 'truth', question: 'Was war dein peinlichstes Erlebnis in der Schule?', category: 'harmless', difficulty: 'easy' },
    { id: 2, type: 'truth', question: 'Welchen Celebrity würdest du gerne mal treffen?', category: 'harmless', difficulty: 'easy' },
    { id: 3, type: 'truth', question: 'Was ist deine größte irrationale Angst?', category: 'harmless', difficulty: 'medium' },
    { id: 4, type: 'truth', question: 'Welches Geheimnis hast du mal versehentlich ausgeplaudert?', category: 'harmless', difficulty: 'medium' },
    
    // HARMLESS DARES
    { id: 5, type: 'dare', question: 'Singe 30 Sekunden lang ein Lied deiner Wahl', category: 'harmless', difficulty: 'easy' },
    { id: 6, type: 'dare', question: 'Mache 10 Liegestütze', category: 'harmless', difficulty: 'easy' },
    { id: 7, type: 'dare', question: 'Imitiere einen Promi für 1 Minute', category: 'harmless', difficulty: 'medium' },
    { id: 8, type: 'dare', question: 'Poste ein lustiges Selfie auf Social Media', category: 'harmless', difficulty: 'medium' },
    
    // SPICY TRUTHS
    { id: 9, type: 'truth', question: 'Wen in dieser Runde findest du am attraktivsten?', category: 'spicy', difficulty: 'medium' },
    { id: 10, type: 'truth', question: 'Was war dein schlechtester Kuss?', category: 'spicy', difficulty: 'medium' },
    { id: 11, type: 'truth', question: 'Hast du schon mal jemanden aus dieser Runde geküsst?', category: 'spicy', difficulty: 'hard' },
    
    // SPICY DARES
    { id: 12, type: 'dare', question: 'Gib jemandem aus der Runde einen Kuss auf die Wange', category: 'spicy', difficulty: 'medium' },
    { id: 13, type: 'dare', question: 'Schicke deinem Ex eine Nachricht "Ich denke an dich"', category: 'spicy', difficulty: 'hard' },
    
    // NSFW (18+)
    { id: 14, type: 'truth', question: 'Was ist deine versauteste Fantasie?', category: 'nsfw', difficulty: 'hard' },
    { id: 15, type: 'dare', question: 'Beschreibe deine beste... Erfahrung im Detail', category: 'nsfw', difficulty: 'hard' },
  ];

  const addPlayer = () => {
    if (newPlayerName.trim() && players.length < 8) {
      const newPlayer: Player = {
        id: Date.now(),
        name: newPlayerName.trim(),
        avatar: ['🤔', '😎', '🥳', '😈', '🔥', '💀', '👑', '🎭'][Math.floor(Math.random() * 8)],
        points: 0
      };
      setPlayers([...players, newPlayer]);
      setNewPlayerName('');
    }
  };

  const removePlayer = (id: number) => {
    setPlayers(players.filter(p => p.id !== id));
  };

  const startGame = () => {
    if (players.length >= 2) {
      setGameMode('playing');
      setCurrentPlayerIndex(0);
    }
  };

  const getRandomQuestion = (type: 'truth' | 'dare') => {
    const filteredQuestions = questionsDB.filter(q => 
      q.type === type && q.category === category
    );
    if (filteredQuestions.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
    return filteredQuestions[randomIndex];
  };

  const handleChoice = (choice: 'truth' | 'dare') => {
    const question = getRandomQuestion(choice);
    setCurrentQuestion(question);
    setShowQuestion(true);
  };

  const nextPlayer = () => {
    // Award points
    if (currentQuestion) {
      const updatedPlayers = [...players];
      updatedPlayers[currentPlayerIndex].points += 
        currentQuestion.difficulty === 'easy' ? 1 : 
        currentQuestion.difficulty === 'medium' ? 2 : 3;
      setPlayers(updatedPlayers);
    }

    setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
    setShowQuestion(false);
    setCurrentQuestion(null);
  };

  const skipQuestion = () => {
    setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
    setShowQuestion(false);
    setCurrentQuestion(null);
  };

  const getCategoryColor = () => {
    switch (category) {
      case 'harmless': return '#10b981';
      case 'spicy': return '#f59e0b';
      case 'nsfw': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getCategoryEmoji = () => {
    switch (category) {
      case 'harmless': return '😇';
      case 'spicy': return '🌶️';
      case 'nsfw': return '🔥';
      default: return '🎯';
    }
  };

  if (gameMode === 'setup') {
    return (
      <div style={{ minHeight: '100vh', padding: '24px', background: 'var(--party-dark)' }}>
        <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{ 
              fontSize: '48px', 
              fontWeight: 'bold', 
              marginBottom: '16px',
              background: 'linear-gradient(to right, #ef4444, #f59e0b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Truth or Dare 😈
            </h1>
            <p style={{ fontSize: '18px', color: '#9ca3af' }}>
              Das ultimative Party Game! Wähle deine Kategorie und füge Spieler hinzu.
            </p>
          </div>

          {/* Category Selection */}
          <div style={{ 
            background: 'var(--party-card)', 
            borderRadius: '12px', 
            padding: '24px', 
            marginBottom: '24px',
            border: '1px solid #4b5563'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
              Kategorie wählen:
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
              {[
                { key: 'harmless', label: 'Harmlos 😇', desc: 'Familie & Freunde safe' },
                { key: 'spicy', label: 'Scharf 🌶️', desc: 'Etwas pikanter' },
                { key: 'nsfw', label: 'Erwachsene 🔥', desc: '18+ Content' }
              ].map(cat => (
                <button
                  key={cat.key}
                  onClick={() => setCategory(cat.key as any)}
                  style={{
                    padding: '16px',
                    borderRadius: '8px',
                    border: `2px solid ${category === cat.key ? getCategoryColor() : '#4b5563'}`,
                    background: category === cat.key ? `${getCategoryColor()}20` : 'var(--party-gray)',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>
                    {cat.label}
                  </div>
                  <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                    {cat.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Add Players */}
          <div style={{ 
            background: 'var(--party-card)', 
            borderRadius: '12px', 
            padding: '24px', 
            marginBottom: '24px',
            border: '1px solid #4b5563'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
              Spieler hinzufügen: ({players.length}/8)
            </h3>
            
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <input
                type="text"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
                placeholder="Name eingeben..."
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #4b5563',
                  background: 'var(--party-gray)',
                  color: 'white',
                  fontSize: '16px'
                }}
              />
              <button
                onClick={addPlayer}
                disabled={!newPlayerName.trim() || players.length >= 8}
                style={{
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#10b981',
                  color: 'white',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                Hinzufügen
              </button>
            </div>

            {/* Players List */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
              {players.map(player => (
                <div
                  key={player.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    background: 'var(--party-gray)',
                    borderRadius: '8px',
                    border: '1px solid #4b5563'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '20px' }}>{player.avatar}</span>
                    <span style={{ fontWeight: '500' }}>{player.name}</span>
                  </div>
                  <button
                    onClick={() => removePlayer(player.id)}
                    style={{
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Start Game */}
          <button
            onClick={startGame}
            disabled={players.length < 2}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '12px',
              border: 'none',
              background: players.length >= 2 ? '#ef4444' : '#4b5563',
              color: 'white',
              fontSize: '20px',
              fontWeight: 'bold',
              cursor: players.length >= 2 ? 'pointer' : 'not-allowed'
            }}
          >
            {players.length < 2 ? 'Mindestens 2 Spieler benötigt' : `🚀 Spiel starten (${getCategoryEmoji()} ${category})`}
          </button>
        </div>
      </div>
    );
  }

  if (gameMode === 'playing') {
    const currentPlayer = players[currentPlayerIndex];

    return (
      <div style={{ minHeight: '100vh', padding: '24px', background: 'var(--party-dark)' }}>
        <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ 
              background: 'var(--party-card)', 
              borderRadius: '12px', 
              padding: '16px',
              border: '1px solid #4b5563',
              marginBottom: '16px'
            }}>
              <div style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '4px' }}>
                Runde {Math.floor(currentPlayerIndex / players.length) + 1}
              </div>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {currentPlayer.avatar} {currentPlayer.name} ist dran!
              </div>
              <div style={{ fontSize: '14px', color: getCategoryColor() }}>
                {getCategoryEmoji()} {category.toUpperCase()} Modus
              </div>
            </div>
          </div>

          {!showQuestion ? (
            /* Choice Selection */
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
              <button
                onClick={() => handleChoice('truth')}
                style={{
                  padding: '48px 24px',
                  borderRadius: '12px',
                  border: '2px solid #3b82f6',
                  background: 'var(--party-card)',
                  color: 'white',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#3b82f620';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'var(--party-card)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                🤔<br />TRUTH
              </button>

              <button
                onClick={() => handleChoice('dare')}
                style={{
                  padding: '48px 24px',
                  borderRadius: '12px',
                  border: '2px solid #ef4444',
                  background: 'var(--party-card)',
                  color: 'white',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#ef444420';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'var(--party-card)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                😈<br />DARE
              </button>
            </div>
          ) : (
            /* Question Display */
            <div style={{ marginBottom: '32px' }}>
              <div style={{
                background: 'var(--party-card)',
                borderRadius: '12px',
                padding: '32px',
                border: `2px solid ${currentQuestion?.type === 'truth' ? '#3b82f6' : '#ef4444'}`,
                textAlign: 'center',
                marginBottom: '24px'
              }}>
                <div style={{ 
                  fontSize: '48px', 
                  marginBottom: '16px' 
                }}>
                  {currentQuestion?.type === 'truth' ? '🤔' : '😈'}
                </div>
                <div style={{ 
                  fontSize: '14px', 
                  color: '#9ca3af', 
                  marginBottom: '8px' 
                }}>
                  {currentQuestion?.type === 'truth' ? 'TRUTH' : 'DARE'}
                </div>
                <div style={{ 
                  fontSize: '24px', 
                  fontWeight: 'bold',
                  lineHeight: '1.4'
                }}>
                  {currentQuestion?.question}
                </div>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#9ca3af',
                  marginTop: '16px'
                }}>
                  Schwierigkeit: {currentQuestion?.difficulty} • 
                  {currentQuestion?.difficulty === 'easy' ? ' 1' : 
                   currentQuestion?.difficulty === 'medium' ? ' 2' : ' 3'} Punkte
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <button
                  onClick={nextPlayer}
                  style={{
                    padding: '16px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#10b981',
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  ✅ Gemacht!
                </button>
                <button
                  onClick={skipQuestion}
                  style={{
                    padding: '16px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#6b7280',
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  ⏭️ Skip
                </button>
              </div>
            </div>
          )}

          {/* Players Scoreboard */}
          <div style={{
            background: 'var(--party-card)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid #4b5563'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
              🏆 Scoreboard
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px' }}>
              {players
                .sort((a, b) => b.points - a.points)
                .map((player, index) => (
                <div
                  key={player.id}
                  style={{
                    padding: '12px',
                    background: player.id === currentPlayer.id ? getCategoryColor() + '30' : 'var(--party-gray)',
                    border: player.id === currentPlayer.id ? `2px solid ${getCategoryColor()}` : '1px solid #4b5563',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '20px', marginBottom: '4px' }}>
                    {index === 0 ? '👑' : player.avatar}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '2px' }}>
                    {player.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                    {player.points} Punkte
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default TruthOrDareGame;