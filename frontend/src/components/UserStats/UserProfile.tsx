import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

interface CategoryStat {
  category: {
    id: number;
    name: string;
    icon: string;
  };
  questionsPlayed: number;
  correctAnswers: number;
  accuracy: number;
  performance: string;
  averageScore: number;
  averageTime: number;
  lastPlayed: string | null;
}

interface UserStats {
  user: {
    id: number;
    username: string;
    avatar: string;
    totalScore: number;
    gamesPlayed: number;
    overallAccuracy: number;
  };
  categoryStats: CategoryStat[];
  recentSessions: any[];
}

const UserProfile: React.FC = () => {
  const { user, token } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user && token) {
      fetchUserStats();
    }
  }, [user, token]);

  const fetchUserStats = async () => {
    try {
      const response = await fetch(`/api/users/${user!.id}/stats?lang=de`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'Expert': return '#10b981';
      case 'Advanced': return '#3b82f6';
      case 'Good': return '#f59e0b';
      case 'Beginner': return '#f97316';
      default: return '#6b7280';
    }
  };

  const getPerformanceIcon = (performance: string) => {
    switch (performance) {
      case 'Expert': return '👑';
      case 'Advanced': return '⭐';
      case 'Good': return '👍';
      case 'Beginner': return '🌱';
      default: return '❓';
    }
  };

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 0' }}>
        <p style={{ fontSize: '20px', color: '#9ca3af' }}>Bitte logge dich ein, um deine Statistiken zu sehen.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 0' }}>
        <div style={{ 
          width: '128px', 
          height: '128px', 
          border: '4px solid #374151', 
          borderTop: '4px solid #3b82f6', 
          borderRadius: '50%', 
          margin: '0 auto 16px',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ fontSize: '20px' }}>Lade Statistiken...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 0' }}>
        <p style={{ fontSize: '20px', color: '#ef4444' }}>Fehler beim Laden der Statistiken.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* User Overview */}
      <div style={{ background: 'var(--party-card)', borderRadius: '12px', padding: '32px', border: '1px solid #4b5563' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '24px' }}>
          <div style={{ fontSize: '64px' }}>{stats.user.avatar}</div>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: '0 0 8px 0' }}>{stats.user.username}</h1>
            <p style={{ color: '#9ca3af', margin: 0 }}>Level {Math.floor(stats.user.totalScore / 1000) + 1} Spieler</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6' }}>{stats.user.totalScore}</div>
            <div style={{ color: '#9ca3af' }}>Gesamt-Punkte</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981' }}>{stats.user.gamesPlayed}</div>
            <div style={{ color: '#9ca3af' }}>Spiele gespielt</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#8b5cf6' }}>{stats.user.overallAccuracy}%</div>
            <div style={{ color: '#9ca3af' }}>Genauigkeit</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f59e0b' }}>
              {stats.user.gamesPlayed > 0 ? Math.round(stats.user.totalScore / stats.user.gamesPlayed) : 0}
            </div>
            <div style={{ color: '#9ca3af' }}>⌀ Punkte/Spiel</div>
          </div>
        </div>
      </div>

      {/* Category Performance */}
      <div style={{ background: 'var(--party-card)', borderRadius: '12px', padding: '32px', border: '1px solid #4b5563' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>Leistung nach Kategorien</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {stats.categoryStats.map((categoryStat, index) => (
            <div
              key={categoryStat.category.id}
              style={{ 
                background: 'var(--party-gray)', 
                borderRadius: '8px', 
                padding: '24px', 
                border: '1px solid #4b5563' 
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '24px' }}>{categoryStat.category.icon}</span>
                  <span style={{ fontWeight: '500' }}>{categoryStat.category.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>{getPerformanceIcon(categoryStat.performance)}</span>
                  <span style={{ 
                    fontSize: '14px', 
                    fontWeight: '500', 
                    color: getPerformanceColor(categoryStat.performance) 
                  }}>
                    {categoryStat.performance}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#9ca3af' }}>Gespielt:</span>
                  <span>{categoryStat.questionsPlayed} Fragen</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#9ca3af' }}>Richtig:</span>
                  <span style={{ color: '#10b981' }}>{categoryStat.correctAnswers}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#9ca3af' }}>Genauigkeit:</span>
                  <span style={{ fontWeight: '500' }}>{categoryStat.accuracy}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#9ca3af' }}>⌀ Zeit:</span>
                  <span>{categoryStat.averageTime}s</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ marginTop: '16px' }}>
                <div style={{ background: '#374151', borderRadius: '4px', height: '8px' }}>
                  <div
                    style={{ 
                      height: '8px', 
                      borderRadius: '4px',
                      width: `${categoryStat.accuracy}%`,
                      background: getPerformanceColor(categoryStat.performance)
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {stats.categoryStats.length === 0 && (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <p style={{ color: '#9ca3af', fontSize: '18px' }}>Noch keine Spiele gespielt.</p>
            <p style={{ color: '#6b7280' }}>Spiele ein Quiz um deine Statistiken zu sehen!</p>
          </div>
        )}
      </div>

      {/* Recent Sessions */}
      {stats.recentSessions.length > 0 && (
        <div style={{ background: 'var(--party-card)', borderRadius: '12px', padding: '32px', border: '1px solid #4b5563' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>Letzte Spiele</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {stats.recentSessions.map((session, index) => (
              <div
                key={session.id}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  background: 'var(--party-gray)', 
                  borderRadius: '8px', 
                  padding: '16px', 
                  border: '1px solid #4b5563' 
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontSize: '24px' }}>{session.category.icon}</span>
                  <div>
                    <div style={{ fontWeight: '500' }}>{session.category.name}</div>
                    <div style={{ fontSize: '14px', color: '#9ca3af' }}>
                      {new Date(session.completedAt).toLocaleDateString('de-DE')}
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#3b82f6' }}>{session.score}</div>
                    <div style={{ fontSize: '12px', color: '#9ca3af' }}>Punkte</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981' }}>{session.accuracy}%</div>
                    <div style={{ fontSize: '12px', color: '#9ca3af' }}>Richtig</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;