// MostLikelyToGame.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

interface Scenario {
  id: number;
  text: string;
  category: 'harmless' | 'spicy' | 'nsfw';
}

interface Player {
  id: number;
  name: string;
  avatar: string;
  votes: number;
  hasVoted: boolean;
}

interface Vote {
  voterId: number;
  targetId: number;
}

const MostLikelyToGame: React.FC = () => {
  const { user } = useAuth();
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [gameMode, setGameMode] = useState<'setup' | 'playing' | 'results'>('setup');
  const [category, setCategory] = useState<'harmless' | 'spicy' | 'nsfw'>('harmless');
  const [currentRound, setCurrentRound] = useState(1);
  const [maxRounds, setMaxRounds] = useState(10);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [showRoundResults, setShowRoundResults] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [gameResults, setGameResults] = useState<{[playerId: number]: number}>({});

  // Scenarios Database
  const scenariosDB: Scenario[] = [
    // HARMLESS
    { id: 1, text: 'am ehesten vergisst wo die Schlüssel sind', category: 'harmless' },
    { id: 2, text: 'am ehesten eine ganze Pizza alleine isst', category: 'harmless' },
    { id: 3, text: 'am ehesten bei einem Horrorfilm schreit', category: 'harmless' },
    { id: 4, text: 'am ehesten den ganzen Tag im Pyjama verbringt', category: 'harmless' },
    { id: 5, text: 'am ehesten ein berühmter YouTuber wird', category: 'harmless' },
    { id: 6, text: 'am ehesten vergisst den eigenen Geburtstag', category: 'harmless' },
    { id: 7, text: 'am ehesten in einem Reality TV-Show mitmacht', category: 'harmless' },
    { id: 8, text: 'am ehesten bei Karaoke als erstes singt', category: 'harmless' },
    { id: 9, text: 'am ehesten ein Millionär wird', category: 'harmless' },
    { id: 10, text: 'am ehesten von einem Hund gejagt wird', category: 'harmless' },

    // SPICY
    { id: 11, text: 'am ehesten heimlich jemanden stalkt (Social Media)', category: 'spicy' },
    { id: 12, text: 'am ehesten bei der ersten Verabredung einen Korb bekommt', category: 'spicy' },
    { id: 13, text: 'am ehesten bei Truth or Dare das krasseste Dare wählt', category: 'spicy' },
    { id: 14, text: 'am ehesten einen Promi datet', category: 'spicy' },
    { id: 15, text: 'am ehesten nackt erwischt wird', category: 'spicy' },
    { id: 16, text: 'am ehesten einen Ex zurück will', category: 'spicy' },
    { id: 17, text: 'am ehesten bei einer Party zu viel trinkt', category: 'spicy' },
    { id: 18, text: 'am ehesten einen One-Night-Stand bereut', category: 'spicy' },

    // NSFW (18+)
    { id: 19, text: 'am ehesten einen Dreier hat', category: 'nsfw' },
    { id: 20, text: 'am ehesten Sexting mit einem Fremden macht', category: 'nsfw' },
    { id: 21, text: 'am ehesten in einem... Video mitmacht', category: 'nsfw' },
    { id: 22, text: 'am ehesten fremdgeht', category: 'nsfw' },
  ];

  const addPlayer = () => {
    if (newPlayerName.trim() && players.length < 8) {
      const newPlayer: Player = {
        id: Date.now(),
        name: newPlayerName.trim(),
        avatar: ['😎', '🥳', '😈', '🔥', '💀', '👑', '🎭', '🤯'][Math.floor(Math.random() * 8)],
        votes: 0,
        hasVoted: false
      };
      setPlayers([...players, newPlayer]);
      setNewPlayerName('');
    }
  };

  const removePlayer = (id: number) => {
    setPlayers(players.filter(p => p.id !== id));
  };

  const startGame = () => {
    if (players.length >= 3) {
      setGameMode('playing');
      setGameResults(players.reduce((acc, p) => ({ ...acc, [p.id]: 0 }), {}));
      nextRound();
    }
  };

  const nextRound = () => {
    const availableScenarios = scenariosDB.filter(s => s.category === category);
    if (availableScenarios.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * availableScenarios.length);
    setCurrentScenario(availableScenarios[randomIndex]);
    
    // Reset voting for new round
    setPlayers(prev => prev.map(p => ({ ...p, votes: 0, hasVoted: false })));
    setVotes([]);
    setShowRoundResults(false);
  };

  const castVote = (voterId: number, targetId: number) => {
    // Remove previous vote from this voter
    const newVotes = votes.filter(v => v.voterId !== voterId);
    newVotes.push({ voterId, targetId });
    setVotes(newVotes);

    // Update player voting status
    setPlayers(prev => prev.map(p => 
      p.id === voterId ? { ...p, hasVoted: true } : p
    ));

    // Update vote counts
    const voteCounts = newVotes.reduce((acc, vote) => {
      acc[vote.targetId] = (acc[vote.targetId] || 0) + 1;
      return acc;
    }, {} as {[key: number]: number});

    setPlayers(prev => prev.map(p => ({
      ...p,
      votes: voteCounts[p.id] || 0
    })));
  };

  const allPlayersVoted = players.every(p => p.hasVoted);

  useEffect(() => {
    if (allPlayersVoted && gameMode === 'playing' && !showRoundResults) {
      setShowRoundResults(true);
      
      // Update game results
      const winner = players.reduce((prev, current) => 
        prev.votes > current.votes ? prev : current
      );
      
      setGameResults(prev => ({
        ...prev,
        [winner.id]: (prev[winner.id] || 0) + 1
      }));
    }
  }, [allPlayersVoted, gameMode, players, showRoundResults]);

  const nextRoundHandler = () => {
    if (currentRound < maxRounds) {
      setCurrentRound(currentRound + 1);
      nextRound();
    } else {
      setGameMode('results');
    }
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
              background: 'linear-gradient(to right, #f59e0b, #ef4444)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Most Likely To... 🤔
            </h1>
            <p style={{ fontSize: '18px', color: '#9ca3af' }}>
              Wer in eurer Gruppe würde am ehesten...? Findet es heraus!
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

            {/* Rounds Setting */}
            <div>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>
                Anzahl Runden: {maxRounds}
              </label>
              <input
                type="range"
                min="5"
                max="20"
                value={maxRounds}
                onChange={(e) => setMaxRounds(parseInt(e.target.value))}
                style={{ width: '100%' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#9ca3af' }}>
                <span>5 (Kurz)</span>
                <span>20 (Marathon)</span>
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

            {players.length < 3 && (
              <div style={{ 
                background: '#f59e0b20',
                border: '1px solid #f59e0b',
                borderRadius: '8px',
                padding: '12px',
                marginTop: '16px'
              }}>
                <p style={{ fontSize: '14px', color: '#f59e0b', margin: 0 }}>
                  💡 Mindestens 3 Spieler benötigt für Most Likely To
                </p>
              </div>
            )}
          </div>

          {/* Start Game */}
          <button
            onClick={startGame}
            disabled={players.length < 3}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '12px',
              border: 'none',
              background: players.length >= 3 ? '#f59e0b' : '#4b5563',
              color: 'white',
              fontSize: '20px',
              fontWeight: 'bold',
              cursor: players.length >= 3 ? 'pointer' : 'not-allowed'
            }}
          >
            {players.length < 3 ? 'Mindestens 3 Spieler benötigt' : `🚀 Spiel starten (${maxRounds} Runden)`}
          </button>
        </div>
      </div>
    );
  }

  if (gameMode === 'playing') {
    const sortedPlayers = [...players].sort((a, b) => b.votes - a.votes);
    const topVoted = sortedPlayers[0];

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
                Runde {currentRound} von {maxRounds}
              </div>
              <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                Wer ist am ehesten...
              </div>
              <div style={{ fontSize: '14px', color: getCategoryColor() }}>
                {getCategoryEmoji()} {category.toUpperCase()}
              </div>
            </div>
          </div>

          {/* Current Scenario */}
          {currentScenario && (
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
                🤔
              </div>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: 'bold',
                lineHeight: '1.4',
                marginBottom: '16px'
              }}>
                Wer {currentScenario.text}?
              </div>
              {!allPlayersVoted && (
                <div style={{ fontSize: '14px', color: '#9ca3af' }}>
                  Jeder wählt eine Person (auch sich selbst)
                </div>
              )}
            </div>
          )}

          {/* Voting Section */}
          {!showRoundResults && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', textAlign: 'center' }}>
                Wählt einen Spieler:
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                {players.map(voter => (
                  <div key={`voter-${voter.id}`} style={{
                    background: 'var(--party-card)',
                    borderRadius: '12px',
                    padding: '16px',
                    border: voter.hasVoted ? '2px solid #10b981' : '1px solid #4b5563'
                  }}>
                    <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                      <div style={{ fontSize: '24px', marginBottom: '4px' }}>{voter.avatar}</div>
                      <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{voter.name}</div>
                      <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                        {voter.hasVoted ? '✅ Hat gewählt' : 'Wähle jemanden...'}
                      </div>
                    </div>
                    
                    {!voter.hasVoted && (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                        {players.map(target => (
                          <button
                            key={`vote-${voter.id}-${target.id}`}
                            onClick={() => castVote(voter.id, target.id)}
                            style={{
                              padding: '8px 4px',
                              borderRadius: '6px',
                              border: 'none',
                              background: '#4b5563',
                              color: 'white',
                              fontSize: '12px',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.background = getCategoryColor();
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.background = '#4b5563';
                            }}
                          >
                            {target.avatar} {target.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Round Results */}
          {showRoundResults && (
            <div style={{
              background: 'var(--party-card)',
              borderRadius: '12px',
              padding: '24px',
              border: '2px solid #f59e0b',
              marginBottom: '24px'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', textAlign: 'center' }}>
                🏆 Runden-Ergebnis
              </h3>
              
              {/* Winner */}
              <div style={{
                background: '#f59e0b20',
                border: '2px solid #f59e0b',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center',
                marginBottom: '20px'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '8px' }}>{topVoted?.avatar}</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px', color: '#f59e0b' }}>
                  {topVoted?.name}
                </div>
                <div style={{ fontSize: '16px', color: '#9ca3af', marginBottom: '8px' }}>
                  {topVoted?.votes} Stimme{topVoted?.votes !== 1 ? 'n' : ''}
                </div>
                <div style={{ fontSize: '14px', color: '#f59e0b' }}>
                  🎯 {currentScenario?.text}
                </div>
              </div>

              {/* All Results */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                {sortedPlayers.map((player, index) => (
                  <div
                    key={player.id}
                    style={{
                      padding: '12px',
                      background: index === 0 ? '#f59e0b20' : 'var(--party-gray)',
                      border: `1px solid ${index === 0 ? '#f59e0b' : '#4b5563'}`,
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
                      {player.votes} Stimme{player.votes !== 1 ? 'n' : ''}
                    </div>
                  </div>
                ))}
              </div>

              {/* Next Round Button */}
              <button
                onClick={nextRoundHandler}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: currentRound < maxRounds ? '#f59e0b' : '#8b5cf6',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                {currentRound < maxRounds ? `➡️ Nächste Runde (${currentRound + 1}/${maxRounds})` : '🏁 Spiel beenden'}
              </button>
            </div>
          )}

          {/* Game Progress */}
          <div style={{
            background: 'var(--party-card)',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid #4b5563'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', color: '#9ca3af' }}>Spielfortschritt</span>
              <span style={{ fontSize: '14px', color: '#9ca3af' }}>{currentRound}/{maxRounds}</span>
            </div>
            <div style={{ width: '100%', background: '#374151', borderRadius: '4px', height: '8px' }}>
              <div 
                style={{ 
                  background: getCategoryColor(),
                  height: '8px', 
                  borderRadius: '4px', 
                  width: `${(currentRound / maxRounds) * 100}%`,
                  transition: 'width 0.3s'
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameMode === 'results') {
    const finalResults = Object.entries(gameResults)
      .map(([playerId, wins]) => {
        const player = players.find(p => p.id === parseInt(playerId));
        return { player, wins };
      })
      .filter(result => result.player)
      .sort((a, b) => b.wins - a.wins);

    const winner = finalResults[0];

    return (
      <div style={{ minHeight: '100vh', padding: '24px', background: 'var(--party-dark)' }}>
        <div style={{ maxWidth: '48rem', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: '48px', 
            fontWeight: 'bold', 
            marginBottom: '24px',
            background: 'linear-gradient(to right, #f59e0b, #ef4444)',
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
                {winner.player?.name} ist der Champion!
              </h2>
              <p style={{ fontSize: '18px', color: '#9ca3af', marginBottom: '16px' }}>
                Mit {winner.wins} Runden-Siegen - definitiv das "wahrscheinlichste" Mitglied der Gruppe! 😄
              </p>
              <div style={{ fontSize: '48px' }}>{winner.player?.avatar}</div>
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
              {finalResults.map((result, index) => (
                <div
                  key={result.player?.id}
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
                      {index === 0 ? '👑' : result.player?.avatar}
                    </span>
                    <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
                      {result.player?.name}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: index === 0 ? '#f59e0b' : 'white' }}>
                      {result.wins}
                    </div>
                    <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                      Siege
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fun Stats */}
          <div style={{
            background: 'var(--party-card)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid #4b5563',
            marginBottom: '24px'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
              📊 Spiel-Stats
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '16px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>
                  {maxRounds}
                </div>
                <div style={{ fontSize: '12px', color: '#9ca3af' }}>Runden gespielt</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
                  {players.length}
                </div>
                <div style={{ fontSize: '12px', color: '#9ca3af' }}>Spieler</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: getCategoryColor() }}>
                  {getCategoryEmoji()}
                </div>
                <div style={{ fontSize: '12px', color: '#9ca3af' }}>{category}</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button
              onClick={() => {
                setGameMode('setup');
                setPlayers([]);
                setCurrentScenario(null);
                setCurrentRound(1);
                setGameResults({});
                setVotes([]);
                setShowRoundResults(false);
              }}
              style={{
                padding: '16px 32px',
                borderRadius: '12px',
                border: 'none',
                background: '#f59e0b',
                color: 'white',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: 'pointer'
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
      </div>
    );
  }

  return null;
};

export default MostLikelyToGame;