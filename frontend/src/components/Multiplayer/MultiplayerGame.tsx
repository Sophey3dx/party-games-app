// src/components/Multiplayer/MultiplayerGame.tsx - FINAL FIXED VERSION
import React, { useState, useEffect } from 'react';
import { useMultiplayer } from '../../context/MultiplayerContext';
import { useAuth } from '../../context/AuthContext';

const MultiplayerGame: React.FC = () => {
  const { user } = useAuth();
  const {
    room,
    players,
    gameState,
    currentQuestion,
    questionIndex,
    totalQuestions,
    timeLeft,
    questionResults,
    submitAnswer
  } = useMultiplayer();

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  // Reset state bei neuer Frage
  useEffect(() => {
    if (gameState === 'playing') {
      setSelectedAnswer(null);
      setHasAnswered(false);
    }
  }, [questionIndex, gameState]);

  const handleAnswer = (answerIndex: number) => {
    if (hasAnswered || gameState !== 'playing') return;

    setSelectedAnswer(answerIndex);
    setHasAnswered(true);
    submitAnswer(answerIndex);
  };

  if (!room || !currentQuestion) {
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
          <p style={{ fontSize: '18px' }}>Lade nächste Frage... 🤔</p>
        </div>
      </div>
    );
  }

  // Question Results anzeigen
  if (gameState === 'question-results') {
    const correctAnswer = currentQuestion.correct; // FIXED: use .correct instead of .correctAnswer
    const myResult = questionResults.find(r => r.playerId === user?.id);
    const sortedResults = [...questionResults].sort((a, b) => b.totalScore - a.totalScore);

    return (
      <div style={{ minHeight: '100vh', background: 'var(--party-dark)', color: 'white', padding: '24px' }}>
        <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
              Frage {questionIndex + 1} Ergebnisse 📊
            </h1>
            <p style={{ color: '#9ca3af', fontSize: '16px' }}>
              Die richtige Antwort war: <span style={{ color: '#10b981', fontWeight: 'bold' }}>
                {currentQuestion.options[correctAnswer]}
              </span>
            </p>
          </div>

          {/* My Result */}
          {myResult && (
            <div style={{ 
              background: myResult.isCorrect ? '#059669' : '#dc2626',
              borderRadius: '12px', 
              padding: '24px', 
              marginBottom: '24px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                {myResult.isCorrect ? '🎉' : '😅'}
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
                {myResult.isCorrect ? 'Richtig!' : 'Falsch!'}
              </h2>
              <p style={{ fontSize: '18px', marginBottom: '8px' }}>
                +{myResult.points} Punkte
              </p>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
                Gesamt: {myResult.totalScore} Punkte
                {myResult.answerTime && ` • ${myResult.answerTime}s`}
              </p>
            </div>
          )}

          {/* Leaderboard */}
          <div style={{ 
            background: 'var(--party-card)', 
            borderRadius: '12px', 
            padding: '24px', 
            border: '1px solid #4b5563' 
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
              🏆 Aktuelle Rankings
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {sortedResults.map((result, index) => (
                <div
                  key={result.playerId}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    background: index === 0 ? '#f59e0b' : 'var(--party-gray)',
                    color: index === 0 ? '#000' : '#fff',
                    padding: '16px', 
                    borderRadius: '8px',
                    border: result.playerId === user?.id ? '2px solid #3b82f6' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                      fontSize: '18px', 
                      fontWeight: 'bold',
                      minWidth: '24px',
                      textAlign: 'center'
                    }}>
                      {index === 0 ? '👑' : `#${index + 1}`}
                    </div>
                    <div style={{ fontSize: '24px' }}>{result.avatar}</div>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{result.username}</div>
                      <div style={{ 
                        fontSize: '12px', 
                        color: index === 0 ? 'rgba(0,0,0,0.6)' : '#9ca3af' 
                      }}>
                        {result.isCorrect ? '✅' : '❌'} 
                        {result.answerTime ? ` ${result.answerTime}s` : ''}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                      {result.totalScore}
                    </div>
                    <div style={{ 
                      fontSize: '12px', 
                      color: index === 0 ? 'rgba(0,0,0,0.6)' : '#9ca3af' 
                    }}>
                      +{result.points}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next Question Hint */}
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <p style={{ color: '#9ca3af', fontSize: '14px' }}>
              {questionIndex + 1 < totalQuestions ? 
                'Nächste Frage kommt in 5 Sekunden... 🔜' :
                'Das war die letzte Frage! Endergebnis kommt gleich... 🏁'
              }
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Main Game Interface
  const playersAnswered = players.filter(p => p.currentAnswer !== undefined).length;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--party-dark)', color: 'white', padding: '16px' }}>
      <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '24px' 
        }}>
          <div style={{ fontSize: '14px', color: '#9ca3af' }}>
            Frage {questionIndex + 1} von {totalQuestions}
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '14px', color: '#9ca3af' }}>
              {playersAnswered}/{players.length} haben geantwortet
            </div>
          </div>
          <div style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            color: timeLeft <= 10 ? '#ef4444' : '#3b82f6',
            textAlign: 'center'
          }}>
            {timeLeft}s
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ 
          width: '100%', 
          background: '#374151', 
          borderRadius: '4px', 
          height: '8px', 
          marginBottom: '32px' 
        }}>
          <div 
            style={{ 
              background: '#3b82f6', 
              height: '8px', 
              borderRadius: '4px', 
              transition: 'width 0.3s',
              width: `${((questionIndex + 1) / totalQuestions) * 100}%`
            }}
          ></div>
        </div>

        {/* Question Card */}
        <div style={{ 
          background: 'var(--party-card)', 
          border: '1px solid #4b5563', 
          borderRadius: '12px', 
          padding: '32px', 
          marginBottom: '24px' 
        }}>
          <div style={{ 
            fontSize: '14px', 
            color: '#3b82f6', 
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>{currentQuestion.category}</span>
            <span>•</span>
            <span>{currentQuestion.difficulty}</span>
          </div>
          
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            marginBottom: '32px',
            lineHeight: '1.4'
          }}>
            {currentQuestion.question}
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {currentQuestion.options.map((option, index) => {
              let buttonStyle: React.CSSProperties = {
                width: '100%',
                padding: '20px',
                textAlign: 'left',
                borderRadius: '12px',
                border: selectedAnswer === index ? '2px solid #3b82f6' : '1px solid #4b5563',
                background: selectedAnswer === index ? '#1e40af' : 'var(--party-gray)',
                color: 'white',
                cursor: hasAnswered ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                transition: 'all 0.2s',
                opacity: hasAnswered ? 0.7 : 1
              };

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={hasAnswered}
                  style={buttonStyle}
                  onMouseOver={!hasAnswered ? (e) => {
                    if (selectedAnswer !== index) {
                      e.currentTarget.style.background = '#4b5563';
                      e.currentTarget.style.borderColor = '#6b7280';
                    }
                  } : undefined}
                  onMouseOut={!hasAnswered ? (e) => {
                    if (selectedAnswer !== index) {
                      e.currentTarget.style.background = 'var(--party-gray)';
                      e.currentTarget.style.borderColor = '#4b5563';
                    }
                  } : undefined}
                >
                  <span style={{ 
                    fontWeight: 'bold', 
                    marginRight: '16px',
                    color: selectedAnswer === index ? '#fbbf24' : '#9ca3af'
                  }}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        {/* Answer Status */}
        {hasAnswered && (
          <div style={{ 
            background: '#059669', 
            color: 'white', 
            padding: '16px', 
            borderRadius: '8px',
            textAlign: 'center',
            marginBottom: '16px'
          }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>
              ✅ Antwort eingereicht!
            </div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>
              Warten auf andere Spieler... ({playersAnswered}/{players.length})
            </div>
          </div>
        )}

        {/* Players Status */}
        <div style={{ 
          background: 'var(--party-card)', 
          border: '1px solid #4b5563', 
          borderRadius: '12px', 
          padding: '20px' 
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px' }}>
            Spieler Status
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {players.map((player) => (
              <div
                key={player.id}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  background: player.currentAnswer !== undefined ? '#059669' : 'var(--party-gray)',
                  padding: '8px 12px', 
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              >
                <span style={{ fontSize: '16px' }}>{player.avatar}</span>
                <span>{player.username}</span>
                <span>
                  {player.currentAnswer !== undefined ? '✅' : '⏳'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Timer Bar */}
        <div style={{ 
          width: '100%', 
          background: '#374151', 
          borderRadius: '4px', 
          height: '4px',
          marginTop: '24px'
        }}>
          <div 
            style={{ 
              height: '4px', 
              borderRadius: '4px', 
              transition: 'all 1s linear',
              width: `${(timeLeft / (room?.timePerQuestion || 30)) * 100}%`,
              background: timeLeft <= 10 ? '#ef4444' : '#3b82f6'
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default MultiplayerGame;