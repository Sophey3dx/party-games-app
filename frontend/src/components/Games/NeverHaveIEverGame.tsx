// NeverHaveIEverGame.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

interface Statement {
  id: number;
  text: string;
  category: 'harmless' | 'spicy' | 'nsfw';
}

interface Player {
  id: number;
  name: string;
  avatar: string;
  lives: number;
  hasAnswered: boolean;
}

const NeverHaveIEverGame: React.FC = () => {
  const { user } = useAuth();
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentStatement, setCurrentStatement] = useState<Statement | null>(null);
  const [gameMode, setGameMode] = useState<'setup' | 'playing' | 'results'>('setup');
  const [category, setCategory] = useState<'harmless' | 'spicy' | 'nsfw'>('harmless');
  const [currentStatementIndex, setCurrentStatementIndex] = useState(0);
  const [maxLives, setMaxLives] = useState(5);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [showResults, setShowResults] = useState(false);

  // Statements Database
  const statementsDB: Statement[] = [
    // HARMLESS
    { id: 1, text: 'Ich habe noch nie eine ganze Pizza alleine gegessen', category: 'harmless' },
    { id: 2, text: 'Ich habe noch nie einen Film im Kino geweint', category: 'harmless' },
    { id: 3, text: 'Ich habe noch nie ein Videospiel durchgespielt', category: 'harmless' },
    { id: 4, text: 'Ich habe noch nie Kaffee getrunken', category: 'harmless' },
    { id: 5, text: 'Ich habe noch nie einen ganzen Tag im Pyjama verbracht', category: 'harmless' },
    { id: 6, text: 'Ich habe noch nie ein Buch in einem Tag gelesen', category: 'harmless' },
    { id: 7, text: 'Ich habe noch nie eine Prüfung nicht bestanden', category: 'harmless' },
    { id: 8, text: 'Ich habe noch nie eine Achterbahn gefahren', category: 'harmless' },
    { id: 9, text: 'Ich habe noch nie einen ganzen Tag ohne Handy verbracht', category: 'harmless' },
    { id: 10, text: 'Ich habe noch nie einen Horrorfilm alleine geschaut', category: 'harmless' },

    // SPICY
    { id: 11, text: 'Ich habe noch nie jemanden am ersten Date geküsst', category: 'spicy' },
    { id: 12, text: 'Ich habe noch nie bei Truth or Dare gelogen', category: 'spicy' },
    { id: 13, text: 'Ich habe noch nie heimlich jemanden gestalkt (Social Media)', category: 'spicy' },
    { id: 14, text: 'Ich habe noch nie einen Liebesbrief geschrieben', category: 'spicy' },
    { id: 15, text: 'Ich habe noch nie bei einer Party gekotzt', category: 'spicy' },
    { id: 16, text: 'Ich habe noch nie nackt gebadet/geduscht', category: 'spicy' },
    { id: 17, text: 'Ich habe noch nie zwei Personen gleichzeitig gedatet', category: 'spicy' },
    { id: 18, text: 'Ich habe noch nie einen Kater gehabt', category: 'spicy' },

    // NSFW (18+)
    { id: 19, text: 'Ich habe noch nie einen One-Night-Stand gehabt', category: 'nsfw' },
    { id: 20, text: 'Ich habe noch nie Sexting gemacht', category: 'nsfw' },
    { id: 21, text: 'Ich habe noch nie... (explicit content)', category: 'nsfw' },
    { id: 22, text: 'Ich habe noch nie von einem Freund/einer Freundin geträumt', category: 'nsfw' },
  ];

  const addPlayer = () => {
    if (newPlayerName.trim() && players.length < 8) {
      const newPlayer: Player = {
        id: Date.now(),
        name: newPlayerName.trim(),
        avatar: ['😎', '🥳', '😈', '🔥', '💀', '👑', '🎭', '🤯'][Math.floor(Math.random() * 8)],
        lives: maxLives,
        hasAnswered: false
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
      nextStatement();
    }
  };

  const nextStatement = () => {
    const availableStatements = statementsDB.filter(s => s.category === category);
    if (availableStatements.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * availableStatements.length);
    setCurrentStatement(availableStatements[randomIndex]);
    setCurrentStatementIndex(currentStatementIndex + 1);
    
    // Reset player answers
    setPlayers(prev => prev.map(p => ({ ...p, hasAnswered: false })));
    setShowResults(false);
  };

  const handlePlayerAnswer = (playerId: number, hasNever: boolean) => {
    setPlayers(prev => prev.map(p => {
      if (p.id === playerId) {
        return {
          ...p,
          hasAnswered: true,
          lives: hasNever ? p.lives : Math.max(0, p.lives - 1)
        };
      }
      return p;
    }));
  };

  const allPlayersAnswered = players.every(p => p.hasAnswered);
  const activePlayers = players.filter(p => p.lives > 0);
  const eliminatedPlayers = players.filter(p => p.lives === 0);

  useEffect(() => {
    if (allPlayersAnswered && gameMode === 'playing') {
      setShowResults(true);
      
      // Check if game should end
      if (activePlayers.length <= 1) {
        setTimeout(() => setGameMode('results'), 3000);
      }
    }
  }, [allPlayersAnswered, activePlayers.length, gameMode]);

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
              background: 'linear-gradient(to right, #8b5cf6, #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Never Have I Ever 🙈
            </h1>
            <p style={{ fontSize: '18px', color: '#9ca3af' }}>
              Das klassische Party Game! Finde heraus, wer was schon gemacht hat.
            </p>
          </div>

          {/* Game Settings */}
          <div style={{ 
            background: 'var(--party-card)', 
            borderRadius: '12px', 
            padding: '24px', 
            marginBottom: '24px',
            border: '1px solid #4b5563'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
              Spiel-Einstellungen
            </h3>
            
            {/* Category Selection */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', marginBottom: '12px' }}>
                Kategorie:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
                {[
                  { key: 'harmless', label: 'Harmlos 😇', desc: 'Familie & Freunde safe' },
                  { key: 'spicy', label: 'Scharf 🌶️', desc: 'Etwas pikanter' },
                  { key: 'nsfw', label: 'Erwachsene 🔥', desc: '18+ Content' }
                ].map(cat => (
                  <button
                    key={cat.key}
                    onClick={() => setCategory(cat.key as any)}
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      border: `2px solid ${category === cat.key ? getCategoryColor() : '#4b5563'}`,
                      background: category === cat.key ? `${getCategoryColor()}20` : 'var(--party-gray)',
                      color: 'white',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '2px' }}>
                      {cat.label}
                    </div>
                    <div style={{ fontSize: '11px', color: '#9ca3af' }}>
                      {cat.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Lives Setting */}
            <div>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>
                Leben pro Spieler: {maxLives}
              </label>
              <input
                type="range"
                min="3"
                max="10"
                value={maxLives}
                onChange={(e) => setMaxLives(parseInt(e.target.value))}
                style={{ width: '100%' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#9ca3af' }}>
                <span>3 (Kurz)</span>
                <span>10 (Lang)</span>
              </div>
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
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {Array.from({ length: maxLives }, (_, i) => (
                        <span key={i} style={{ fontSize: '12px', color: '#ef4444' }}>❤️</span>
                      ))}
                    </div>
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
              background: players.length >= 2 ? '#8b5cf6' : '#4b5563',
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
    return (
      <div style={{ minHeight: '100vh', padding: '24px', background: 'var(--party-dark)' }}>
        <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ 
              background: 'var(--party-card)', 
              borderRadius: '12px', 
              padding: '16px',
              border: '1px solid #4b5563',
              marginBottom: '16px'
            }}>
              <div style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '4px' }}>
                Statement #{currentStatementIndex}
              </div>
              <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                Never Have I Ever...
              </div>
              <div style={{ fontSize: '14px', color: getCategoryColor() }}>
                {getCategoryEmoji()} {category.toUpperCase()} • {activePlayers.length} Spieler übrig
              </div>
            </div>
          </div>

          {/* Current Statement */}
          {currentStatement && (
            <div style={{
              background: 'var(--party-card)',
              borderRadius: '12px',
              padding: '32px',
              border: `2px solid ${getCategoryColor()}`,
              textAlign: 'center',
              marginBottom: '32px'
            }}>
              <div style={{ 
                fontSize: '48px', 
                marginBottom: '16px' 
              }}>
                🙈
              </div>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: 'bold',
                lineHeight: '1.4',
                marginBottom: '16px'
              }}>
                {currentStatement.text}
              </div>
              {!allPlayersAnswered && (
                <div style={{ fontSize: '14px', color: '#9ca3af' }}>
                  Wer hat das schon mal gemacht? 🤔
                </div>
              )}
            </div>
          )}

          {/* Show Results */}
          {showResults && (
            <div style={{
              background: 'var(--party-card)',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid #4b5563',
              marginBottom: '24px'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', textAlign: 'center' }}>
                Ergebnisse dieser Runde:
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
                {players.map(player => {
                  const lostLife = !player.hasAnswered ? false : 
                    currentStatement ? 
                    !players.find(p => p.id === player.id)?.hasAnswered || 
                    players.find(p => p.id === player.id)?.lives !== (players.find(p => p.id === player.id)?.lives || 0) + 1 
                    : false;
                  
                  return (
                    <div
                      key={player.id}
                      style={{
                        padding: '12px',
                        background: lostLife ? '#ef444420' : '#10b98120',
                        border: `1px solid ${lostLife ? '#ef4444' : '#10b981'}`,
                        borderRadius: '8px',
                        textAlign: 'center'
                      }}
                    >
                      <div style={{ fontSize: '20px', marginBottom: '4px' }}>
                        {player.avatar}
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '4px' }}>
                        {player.name}
                      </div>
                      <div style={{ fontSize: '12px', color: lostLife ? '#ef4444' : '#10b981' }}>
                        {lostLife ? '😅 Hat schon!' : '😇 Noch nie!'}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {activePlayers.length > 1 && (
                <button
                  onClick={nextStatement}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#8b5cf6',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    marginTop: '16px'
                  }}
                >
                  Nächstes Statement ➡️
                </button>
              )}
            </div>
          )}

          {/* Player Answer Buttons */}
          {!showResults && currentStatement && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', textAlign: 'center' }}>
                Klickt auf euren Namen:
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                {activePlayers.map(player => (
                  <div key={player.id} style={{
                    background: 'var(--party-card)',
                    borderRadius: '8px',
                    padding: '16px',
                    border: player.hasAnswered ? '2px solid #10b981' : '1px solid #4b5563'
                  }}>
                    <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                      <div style={{ fontSize: '24px', marginBottom: '4px' }}>{player.avatar}</div>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>{player.name}</div>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '2px' }}>
                        {Array.from({ length: player.lives }, (_, i) => (
                          <span key={i} style={{ fontSize: '14px' }}>❤️</span>
                        ))}
                      </div>
                    </div>
                    
                    {!player.hasAnswered ? (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <button
                          onClick={() => handlePlayerAnswer(player.id, true)}
                          style={{
                            padding: '8px',
                            borderRadius: '6px',
                            border: 'none',
                            background: '#10b981',
                            color: 'white',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                          }}
                        >
                          😇 Noch nie
                        </button>
                        <button
                          onClick={() => handlePlayerAnswer(player.id, false)}
                          style={{
                            padding: '8px',
                            borderRadius: '6px',
                            border: 'none',
                            background: '#ef4444',
                            color: 'white',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                          }}
                        >
                          😅 Schon mal
                        </button>
                      </div>
                    ) : (
                      <div style={{ 
                        textAlign: 'center', 
                        padding: '8px',
                        background: '#10b981',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        ✅ Geantwortet
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Eliminated Players */}
          {eliminatedPlayers.length > 0 && (
            <div style={{
              background: 'var(--party-card)',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid #ef4444'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px', color: '#ef4444' }}>
                💀 Ausgeschieden:
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {eliminatedPlayers.map(player => (
                  <div key={player.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    background: '#ef444420',
                    borderRadius: '6px',
                    border: '1px solid #ef4444'
                  }}>
                    <span style={{ fontSize: '16px' }}>{player.avatar}</span>
                    <span style={{ fontSize: '14px', color: '#ef4444' }}>{player.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (gameMode === 'results') {
    const winner = activePlayers[0];
    const allPlayersSorted = [...players].sort((a, b) => b.lives - a.lives);

    return (
      <div style={{ minHeight: '100vh', padding: '24px', background: 'var(--party-dark)' }}>
        <div style={{ maxWidth: '48rem', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: '48px', 
            fontWeight: 'bold', 
            marginBottom: '24px',
            background: 'linear-gradient(to right, #8b5cf6, #ec4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Spiel beendet! 🎉
          </h1>

          {winner && (
            <div style={{
              background: 'var(--party-card)',
              borderRadius: '12px',
              padding: '32px',
              border: '2px solid #f59e0b',
              marginBottom: '32px'
            }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>👑</div>
              <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px', color: '#f59e0b' }}>
                {winner.name} gewinnt!
              </h2>
              <p style={{ fontSize: '18px', color: '#9ca3af' }}>
                Mit {winner.lives} Leben übrig - definitiv die unschuldigste Person hier! 😇
              </p>
            </div>
          )}

          {/* Final Leaderboard */}
          <div style={{
            background: 'var(--party-card)',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #4b5563',
            marginBottom: '24px'
          }}>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
              🏆 Endstand
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {allPlayersSorted.map((player, index) => (
                <div
                  key={player.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px',
                    background: index === 0 ? '#f59e0b20' : 'var(--party-gray)',
                    border: index === 0 ? '2px solid #f59e0b' : '1px solid #4b5563',
                    borderRadius: '8px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '20px', fontWeight: 'bold', minWidth: '30px' }}>
                      #{index + 1}
                    </span>
                    <span style={{ fontSize: '24px' }}>
                      {index === 0 ? '👑' : player.avatar}
                    </span>
                    <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
                      {player.name}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {Array.from({ length: player.lives }, (_, i) => (
                        <span key={i} style={{ fontSize: '14px' }}>❤️</span>
                      ))}
                    </div>
                    <span style={{ fontSize: '14px', color: '#9ca3af' }}>
                      {player.lives === 0 ? '💀' : `${player.lives} Leben`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Play Again Button */}
          <button
            onClick={() => {
              setGameMode('setup');
              setPlayers([]);
              setCurrentStatement(null);
              setCurrentStatementIndex(0);
              setShowResults(false);
            }}
            style={{
              padding: '16px 32px',
              borderRadius: '12px',
              border: 'none',
              background: '#8b5cf6',
              color: 'white',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginRight: '16px'
            }}
          >
            🔄 Nochmal spielen
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            style={{
              padding: '16px 32px',
              borderRadius: '12px',
              border: 'none',
              background: '#4b5563',
              color: 'white',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            🏠 Zur Startseite
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default NeverHaveIEverGame;