// src/context/MultiplayerContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface Player {
  id: number;
  userId?: number;
  username: string;
  avatar: string;
  score: number;
  correctAnswers: number;
  isHost: boolean;
  isReady: boolean;
  currentAnswer?: number;
  answerTime?: number;
}

interface Room {
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
  questionsPerRound: number;
  timePerQuestion: number;
  language: string;
  status: 'waiting' | 'playing' | 'finished';
  currentQuestionIndex: number;
  isPrivate: boolean;
  hasPassword: boolean;
  players: Player[];
}

interface Question {
  question: string;
  options: string[];
  correct: number; // This is the correct property name that matches backend
  category: string;
  difficulty: string;
}

interface QuestionResult {
  playerId: number;
  username: string;
  avatar: string;
  answer: number | null;
  isCorrect: boolean;
  points: number;
  totalScore: number;
  answerTime?: number;
}

interface ChatMessage {
  username: string;
  message: string;
  timestamp: string;
}

interface GameResults {
  playerId: number;
  username: string;
  avatar: string;
  totalScore: number;
  correctAnswers: number;
  accuracy: number;
  rank: number;
}

interface MultiplayerContextType {
  socket: Socket | null;
  room: Room | null;
  players: Player[];
  isConnected: boolean;
  isInRoom: boolean;
  isHost: boolean;
  gameState: 'lobby' | 'playing' | 'question-results' | 'final-results';
  currentQuestion: Question | null;
  questionIndex: number;
  totalQuestions: number;
  timeLeft: number;
  questionResults: QuestionResult[];
  finalResults: GameResults[];
  chatMessages: ChatMessage[];
  
  // Actions
  createRoom: (roomData: CreateRoomData) => Promise<string>;
  joinRoom: (roomId: string, password?: string) => Promise<void>;
  leaveRoom: () => void;
  setPlayerReady: () => void;
  submitAnswer: (answerIndex: number) => void;
  sendChatMessage: (message: string) => void;
  
  // State
  loading: boolean;
  error: string | null;
}

interface CreateRoomData {
  name: string;
  maxPlayers?: number;
  categoryId?: number;
  difficulty?: string;
  questionsPerRound?: number;
  timePerQuestion?: number;
  language?: string;
  isPrivate?: boolean;
  password?: string;
}

const MultiplayerContext = createContext<MultiplayerContextType | undefined>(undefined);

export const useMultiplayer = () => {
  const context = useContext(MultiplayerContext);
  if (!context) {
    throw new Error('useMultiplayer must be used within a MultiplayerProvider');
  }
  return context;
};

interface MultiplayerProviderProps {
  children: ReactNode;
}

export const MultiplayerProvider: React.FC<MultiplayerProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [gameState, setGameState] = useState<'lobby' | 'playing' | 'question-results' | 'final-results'>('lobby');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [questionResults, setQuestionResults] = useState<QuestionResult[]>([]);
  const [finalResults, setFinalResults] = useState<GameResults[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isInRoom = !!room;
  const isHost = user ? players.some(p => p.userId === user.id && p.isHost) : false;

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3001');
    
    newSocket.on('connect', () => {
      console.log('Connected to multiplayer server');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from multiplayer server');
      setIsConnected(false);
    });

    // Room events
    newSocket.on('join-success', (data) => {
      console.log('Successfully joined room:', data);
      setError(null);
    });

    newSocket.on('join-error', (data) => {
      console.error('Failed to join room:', data.error);
      setError(data.error);
      setLoading(false);
    });

    newSocket.on('player-joined', (data) => {
      console.log('Player joined:', data);
      setRoom(data.room);
      setPlayers(data.room.players);
    });

    newSocket.on('player-left', (data) => {
      console.log('Player left:', data);
      setPlayers(prev => prev.filter(p => p.userId !== data.playerId));
    });

    newSocket.on('player-ready-update', (data) => {
      console.log('Player ready update:', data);
      setPlayers(prev => prev.map(p => 
        p.userId === data.playerId ? { ...p, isReady: true } : p
      ));
    });

    // Game events
    newSocket.on('game-started', (data) => {
      console.log('Game started:', data);
      setGameState('playing');
      setTotalQuestions(data.totalQuestions);
      setChatMessages([]);
    });

    newSocket.on('new-question', (data) => {
      console.log('New question:', data);
      setCurrentQuestion(data.question);
      setQuestionIndex(data.questionIndex);
      setTimeLeft(data.timeLimit);
      setGameState('playing');
      setQuestionResults([]);
      
      // Reset player answers
      setPlayers(prev => prev.map(p => ({ ...p, currentAnswer: undefined })));
    });

    newSocket.on('answer-submitted', (data) => {
      console.log('Answer submitted:', data);
      setPlayers(prev => prev.map(p => 
        p.userId === data.playerId ? { ...p, currentAnswer: 0 } : p
      ));
    });

    newSocket.on('question-results', (data) => {
      console.log('Question results:', data);
      setQuestionResults(data.playerResults);
      setPlayers(data.leaderboard.map((result: any) => {
        const player = players.find(p => p.userId === result.playerId);
        return {
          ...player,
          score: result.totalScore,
          correctAnswers: result.correctAnswers || player?.correctAnswers || 0
        } as Player;
      }));
      setGameState('question-results');
    });

    newSocket.on('game-ended', (data) => {
      console.log('Game ended:', data);
      setFinalResults(data.finalResults);
      setGameState('final-results');
    });

    // Chat events
    newSocket.on('chat-message', (data) => {
      setChatMessages(prev => [...prev, data]);
    });

    newSocket.on('room-closed', (data) => {
      console.log('Room closed:', data);
      setRoom(null);
      setPlayers([]);
      setGameState('lobby');
      setError('Room has been closed');
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && gameState === 'playing') {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, gameState]);

  // Actions
  const createRoom = async (roomData: CreateRoomData): Promise<string> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/multiplayer/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(roomData)
      });

      const data = await response.json();

      if (response.ok) {
        return data.roomCode;
      } else {
        throw new Error(data.error || 'Failed to create room');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create room');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const joinRoom = async (roomId: string, password?: string): Promise<void> => {
    if (!socket || !isConnected) {
      throw new Error('Not connected to server');
    }

    setLoading(true);
    setError(null);

    const joinData = {
      roomId: roomId.toUpperCase(),
      username: user?.username || `Guest_${Math.random().toString(36).substr(2, 5)}`,
      avatar: user?.avatar || '🎮',
      userId: user?.id,
      password
    };

    socket.emit('join-room', joinData);
  };

  const leaveRoom = () => {
    if (socket) {
      socket.emit('leave-room');
    }
    setRoom(null);
    setPlayers([]);
    setGameState('lobby');
    setCurrentQuestion(null);
    setQuestionResults([]);
    setFinalResults([]);
    setChatMessages([]);
    setError(null);
  };

  const setPlayerReady = () => {
    if (socket && room) {
      socket.emit('player-ready', { roomId: room.id });
    }
  };

  const submitAnswer = (answerIndex: number) => {
    if (socket && room && currentQuestion) {
      socket.emit('submit-answer', {
        roomId: room.id,
        questionIndex,
        answerIndex,
        timeLeft
      });
    }
  };

  const sendChatMessage = (message: string) => {
    if (socket && room && message.trim()) {
      socket.emit('chat-message', {
        roomId: room.id,
        message: message.trim()
      });
    }
  };

  return (
    <MultiplayerContext.Provider value={{
      socket,
      room,
      players,
      isConnected,
      isInRoom,
      isHost,
      gameState,
      currentQuestion,
      questionIndex,
      totalQuestions,
      timeLeft,
      questionResults,
      finalResults,
      chatMessages,
      createRoom,
      joinRoom,
      leaveRoom,
      setPlayerReady,
      submitAnswer,
      sendChatMessage,
      loading,
      error
    }}>
      {children}
    </MultiplayerContext.Provider>
  );
};