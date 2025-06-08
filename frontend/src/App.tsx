import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MultiplayerProvider } from './context/MultiplayerContext';
import Header from './components/Header/Header';
import Home from './pages/Home';
import QuizGame from './components/Quiz/QuizGame';
import UserProfile from './components/UserStats/UserProfile';
import MultiplayerLobby from './components/Multiplayer/MultiplayerLobby';
import GameRoom from './components/Multiplayer/GameRoom';

function App() {
  return (
    <AuthProvider>
      <MultiplayerProvider>
        <div style={{ minHeight: '100vh', background: 'var(--party-dark)', color: 'white' }}>
          <Router>
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/quiz" element={<QuizGame />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/multiplayer" element={<MultiplayerLobby />} />
              <Route path="/multiplayer/room/:roomId" element={<GameRoom />} />
            </Routes>
          </Router>
        </div>
      </MultiplayerProvider>
    </AuthProvider>
  );
}

export default App;