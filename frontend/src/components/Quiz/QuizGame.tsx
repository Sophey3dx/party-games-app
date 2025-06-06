import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  category: string;
  difficulty: string;
}

const QuizGame: React.FC = () => {
  const { user, token } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [gameStartTime, setGameStartTime] = useState<number>(Date.now());

  // Load questions from backend
  useEffect(() => {
    fetch('/api/quiz/questions?lang=de&limit=10')
      .then(res => res.json())
      .then(data => {
        setQuestions(data);
        // Start quiz session
        if (data.length > 0) {
          startQuizSession();
        }
      })
      .catch(err => console.error('Error loading questions:', err));
  }, []);

  // Start quiz session
  const startQuizSession = async () => {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/quiz/sessions', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          sessionType: 'singleplayer',
          language: 'de'
        })
      });

      if (response.ok) {
        const session = await response.json();
        setSessionId(session.id);
        setGameStartTime(Date.now());
      }
    } catch (error) {
      console.error('Failed to start quiz session:', error);
    }
  };

  // Complete quiz session
  const completeQuizSession = async (finalScore: number, correctAnswers: number, totalTime: number) => {
    if (!sessionId) return;

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/quiz/sessions/${sessionId}/complete`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          totalQuestions: questions.length,
          correctAnswers,
          timeSpent: Math.round(totalTime / 1000) // Convert to seconds
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Quiz session completed:', result);
      }
    } catch (error) {
      console.error('Failed to complete quiz session:', error);
    }
  };

  // Timer
  useEffect(() => {
    if (timeLeft > 0 && !showResult && !isGameFinished) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleAnswer(null); // Time's up
    }
  }, [timeLeft, showResult, isGameFinished]);

  const handleAnswer = (answerIndex: number | null) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    let newScore = score;
    let newCorrectCount = correctCount;
    
    if (answerIndex === questions[currentQuestion]?.correct) {
      const timeBonus = Math.max(0, timeLeft);
      newScore = score + 10 + timeBonus;
      newCorrectCount = correctCount + 1;
      setScore(newScore);
      setCorrectCount(newCorrectCount);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
        setTimeLeft(30);
      } else {
        setIsGameFinished(true);
        // Complete the quiz session
        const totalTime = Date.now() - gameStartTime;
        completeQuizSession(newScore, newCorrectCount, totalTime);
      }
    }, 2000);
  };

  const resetGame = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setCorrectCount(0);
    setShowResult(false);
    setIsGameFinished(false);
    setTimeLeft(30);
    setSessionId(null);
    setGameStartTime(Date.now());
    
    // Reload questions
    fetch('/api/quiz/questions?lang=de&limit=10')
      .then(res => res.json())
      .then(data => {
        setQuestions(data);
        if (data.length > 0) {
          startQuizSession();
        }
      })
      .catch(err => console.error('Error loading questions:', err));
  };

  if (questions.length === 0) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '128px', 
            height: '128px', 
            border: '4px solid #374151', 
            borderTop: '4px solid #3b82f6', 
            borderRadius: '50%', 
            margin: '0 auto 16px',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ fontSize: '20px' }}>Loading Quiz...</p>
        </div>
      </div>
    );
  }

  if (isGameFinished) {
    const accuracy = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
    
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
        <div style={{ maxWidth: '28rem', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '24px' }}>Quiz Beendet! 🎉</h2>
          <div style={{ 
            background: 'var(--party-card)', 
            border: '1px solid #4b5563', 
            borderRadius: '12px', 
            padding: '32px', 
            marginBottom: '24px' 
          }}>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '16px' }}>
              {correctCount}/{questions.length}
            </div>
            <p style={{ fontSize: '20px', marginBottom: '8px' }}>
              Du hast {correctCount} von {questions.length} Fragen richtig beantwortet!
            </p>
            <p style={{ color: '#9ca3af', marginBottom: '16px' }}>
              Das sind {accuracy}%
            </p>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>
              {score} Punkte
            </div>
            {user && (
              <p style={{ color: '#10b981', marginTop: '8px', fontSize: '14px' }}>
                ✅ Ergebnis gespeichert in deinem Profil!
              </p>
            )}
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <button
              onClick={resetGame}
              style={{ 
                width: '100%', 
                background: '#2563eb', 
                color: 'white', 
                fontWeight: 'bold', 
                padding: '12px 24px', 
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Nochmal spielen
            </button>
            <Link 
              to="/"
              style={{ 
                display: 'block', 
                width: '100%', 
                background: '#4b5563', 
                color: 'white', 
                fontWeight: 'bold', 
                padding: '12px 24px', 
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '16px'
              }}
            >
              Zurück zur Startseite
            </Link>
            {user && (
              <Link 
                to="/profile"
                style={{ 
                  display: 'block', 
                  width: '100%', 
                  background: '#059669', 
                  color: 'white', 
                  fontWeight: 'bold', 
                  padding: '12px 24px', 
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '16px'
                }}
              >
                📊 Meine Statistiken ansehen
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div style={{ minHeight: '100vh', padding: '16px' }}>
      <div style={{ maxWidth: '32rem', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <Link to="/" style={{ color: '#60a5fa', textDecoration: 'none' }}>
            ← Zurück
          </Link>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '14px', color: '#9ca3af' }}>Frage {currentQuestion + 1} von {questions.length}</div>
            <div style={{ fontSize: '14px', color: '#9ca3af' }}>Score: {score}</div>
          </div>
          <div style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: timeLeft <= 10 ? '#ef4444' : '#3b82f6' 
          }}>
            {timeLeft}s
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ width: '100%', background: '#374151', borderRadius: '4px', height: '8px', marginBottom: '32px' }}>
          <div 
            style={{ 
              background: '#3b82f6', 
              height: '8px', 
              borderRadius: '4px', 
              transition: 'width 0.3s',
              width: `${((currentQuestion + 1) / questions.length) * 100}%`
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
          <div style={{ fontSize: '14px', color: '#3b82f6', marginBottom: '16px' }}>{question.category}</div>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '32px' }}>{question.question}</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {question.options.map((option, index) => {
              let buttonStyle: React.CSSProperties = {
                width: '100%',
                padding: '16px',
                textAlign: 'left',
                borderRadius: '8px',
                border: '1px solid #4b5563',
                background: 'var(--party-gray)',
                color: 'white',
                cursor: showResult ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                transition: 'all 0.2s'
              };
              
              if (showResult) {
                if (index === question.correct) {
                  buttonStyle = { ...buttonStyle, background: '#059669', borderColor: '#10b981' };
                } else if (index === selectedAnswer && index !== question.correct) {
                  buttonStyle = { ...buttonStyle, background: '#dc2626', borderColor: '#ef4444' };
                } else {
                  buttonStyle = { ...buttonStyle, background: '#374151', borderColor: '#4b5563' };
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => !showResult && handleAnswer(index)}
                  disabled={showResult}
                  style={buttonStyle}
                  onMouseOver={!showResult ? (e) => {
                    e.currentTarget.style.background = '#4b5563';
                    e.currentTarget.style.borderColor = '#3b82f6';
                  } : undefined}
                  onMouseOut={!showResult ? (e) => {
                    e.currentTarget.style.background = 'var(--party-gray)';
                    e.currentTarget.style.borderColor = '#4b5563';
                  } : undefined}
                >
                  <span style={{ fontWeight: 'bold', marginRight: '12px' }}>{String.fromCharCode(65 + index)})</span>
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        {/* Timer Bar */}
        <div style={{ width: '100%', background: '#374151', borderRadius: '4px', height: '4px' }}>
          <div 
            style={{ 
              height: '4px', 
              borderRadius: '4px', 
              transition: 'all 1s linear',
              width: `${(timeLeft / 30) * 100}%`,
              background: timeLeft <= 10 ? '#ef4444' : '#3b82f6'
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default QuizGame;