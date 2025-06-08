// src/components/Multiplayer/Chat.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useMultiplayer } from '../../context/MultiplayerContext';
import { useAuth } from '../../context/AuthContext';

const Chat: React.FC = () => {
  const { user } = useAuth();
  const { chatMessages, sendChatMessage } = useMultiplayer();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendChatMessage(message.trim());
      setMessage('');
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getQuickMessages = () => [
    '😄 Haha!',
    '👍 Nice!',
    '😱 Wow!',
    '🤔 Hmm...',
    '🔥 Fire!',
    '😅 Oops!',
    '👏 GG!',
    '❤️ Love it!'
  ];

  return (
    <div style={{ 
      background: 'var(--party-card)', 
      borderRadius: '12px', 
      border: '1px solid #4b5563',
      height: '600px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Chat Header */}
      <div style={{ 
        padding: '16px', 
        borderBottom: '1px solid #4b5563',
        background: 'var(--party-gray)',
        borderRadius: '12px 12px 0 0'
      }}>
        <h3 style={{ 
          fontSize: '16px', 
          fontWeight: 'bold', 
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          💬 Chat
          <span style={{ 
            fontSize: '12px', 
            background: '#10b981', 
            color: 'white',
            padding: '2px 6px',
            borderRadius: '10px',
            fontWeight: 'normal'
          }}>
            {chatMessages.length}
          </span>
        </h3>
      </div>

      {/* Messages Area */}
      <div style={{ 
        flex: 1, 
        padding: '16px', 
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {chatMessages.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            color: '#9ca3af', 
            fontSize: '14px',
            marginTop: '20px'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>💬</div>
            <p>Keine Nachrichten bisher...</p>
            <p style={{ fontSize: '12px' }}>Sag Hi zu den anderen! 👋</p>
          </div>
        ) : (
          chatMessages.map((msg, index) => {
            const isMyMessage = msg.username === user?.username;
            
            return (
              <div
                key={index}
                style={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isMyMessage ? 'flex-end' : 'flex-start'
                }}
              >
                <div style={{ 
                  background: isMyMessage ? '#3b82f6' : 'var(--party-gray)',
                  color: 'white',
                  padding: '12px 16px',
                  borderRadius: isMyMessage ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  maxWidth: '80%',
                  wordBreak: 'break-word'
                }}>
                  {!isMyMessage && (
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#d1d5db',
                      marginBottom: '4px',
                      fontWeight: 'bold'
                    }}>
                      {msg.username}
                    </div>
                  )}
                  <div style={{ fontSize: '14px' }}>
                    {msg.message}
                  </div>
                </div>
                <div style={{ 
                  fontSize: '10px', 
                  color: '#6b7280',
                  marginTop: '2px',
                  marginLeft: isMyMessage ? '0' : '8px',
                  marginRight: isMyMessage ? '8px' : '0'
                }}>
                  {formatTime(msg.timestamp)}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Messages */}
      <div style={{ 
        padding: '8px 16px',
        borderTop: '1px solid #4b5563'
      }}>
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '4px',
          marginBottom: '8px'
        }}>
          {getQuickMessages().map((quickMsg, index) => (
            <button
              key={index}
              onClick={() => {
                sendChatMessage(quickMsg);
              }}
              style={{ 
                background: 'var(--party-gray)', 
                color: 'white',
                border: '1px solid #4b5563',
                borderRadius: '12px',
                padding: '4px 8px',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#4b5563';
                e.currentTarget.style.borderColor = '#6b7280';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'var(--party-gray)';
                e.currentTarget.style.borderColor = '#4b5563';
              }}
            >
              {quickMsg}
            </button>
          ))}
        </div>
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} style={{ 
        padding: '16px',
        borderTop: '1px solid #4b5563'
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={user ? "Nachricht eingeben..." : "Login für Chat"}
            disabled={!user}
            maxLength={200}
            style={{ 
              flex: 1,
              padding: '12px',
              background: 'var(--party-gray)',
              border: '1px solid #4b5563',
              borderRadius: '8px',
              color: 'white',
              fontSize: '14px'
            }}
          />
          <button
            type="submit"
            disabled={!message.trim() || !user}
            style={{ 
              background: (!message.trim() || !user) ? '#4b5563' : '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 16px',
              cursor: (!message.trim() || !user) ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              transition: 'background 0.2s'
            }}
          >
            📤
          </button>
        </div>
        
        {!user && (
          <p style={{ 
            fontSize: '12px', 
            color: '#9ca3af', 
            margin: '8px 0 0 0',
            textAlign: 'center'
          }}>
            Du musst eingeloggt sein um zu chatten
          </p>
        )}
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          fontSize: '10px',
          color: '#6b7280',
          marginTop: '4px'
        }}>
          <span>Max. 200 Zeichen</span>
          <span>{message.length}/200</span>
        </div>
      </form>
    </div>
  );
};

export default Chat;