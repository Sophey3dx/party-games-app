import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header/Header';
import Home from './pages/Home';
import QuizGame from './components/Quiz/QuizGame';
import UserProfile from './components/UserStats/UserProfile';

function App() {
  return (
    <AuthProvider>
      <div style={{ minHeight: '100vh', background: 'var(--party-dark)', color: 'white' }}>
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/quiz" element={<QuizGame />} />
            <Route path="/profile" element={<UserProfile />} />
          </Routes>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;