import React, { useEffect, useState } from 'react';
import MessageList from './MessageList';
import MessageForm from './MessageForm';
import { fetchMessages, sendMessage } from '../services/api';
import { connectWebSocket } from '../utils/websocket';
import { Message } from '../types/message';

const Dashboard: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    // Fetch initial messages
    const getMessages = async () => {
      try {
        const fetchedMessages = await fetchMessages();
        setMessages(fetchedMessages);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };

    getMessages();

    // Connect to WebSocket for real-time updates
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${window.location.host}/ws`;
    
    console.log('Attempting WebSocket connection to:', wsUrl);
    
    const ws = connectWebSocket(wsUrl, {
      onMessage: (messageData) => {
        try {
          const data = JSON.parse(messageData);
          
          if (data.type === 'history') {
            setMessages(data.messages || []);
          } else {
            // Add new message to the list
            setMessages((prev: any) => [...prev, data].slice(-100)); // Keep last 100 messages
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      },
      onOpen: () => {
        console.log('WebSocket connected successfully');
        setConnectionStatus('connected');
      },
      onClose: () => {
        console.log('WebSocket disconnected');
        setConnectionStatus('disconnected');
      },
      onError: (error) => {
        console.error('WebSocket connection error:', error);
        setConnectionStatus('disconnected');
      }
    });

    // Cleanup on unmount
    return () => {
      ws.close();
    };
  }, []);

  const handleSendMessage = async (queue: string, message: any) => {
    setSendingMessage(true);
    try {
      await sendMessage(queue, message);
      setNotification({ type: 'success', message: `${queue === 'orders' ? 'Order' : 'Alert'} sent successfully!` });
      
      // Clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error('Failed to send message:', error);
      setNotification({ 
        type: 'error', 
        message: `Failed to send message: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
      
      // Clear notification after 5 seconds for errors
      setTimeout(() => setNotification(null), 5000);
    } finally {
      setSendingMessage(false);
    }
  };

  return (
    <div style={{ 
      padding: '20px',
      minHeight: '100vh',
      background: '#0a0a0a'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '24px',
        padding: '20px 24px',
        background: 'rgba(26, 26, 26, 0.6)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '12px',
            background: '#3b82f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)'
          }}>
            🐰
          </div>
          <div>
            <h1 style={{ 
              margin: 0,
              fontSize: '26px',
              fontWeight: '700',
              color: '#ffffff'
            }}>
              Monitor de Mensajes RabbitMQ
            </h1>
            <p style={{
              margin: '4px 0 0 0',
              color: '#9ca3af',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              Sistema de mensajería en tiempo real
            </p>
          </div>
        </div>
        <div style={{
          padding: '10px 18px',
          borderRadius: '10px',
          backgroundColor: connectionStatus === 'connected' ? 'rgba(34, 197, 94, 0.15)' : 
                          connectionStatus === 'connecting' ? 'rgba(234, 179, 8, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          border: `1px solid ${connectionStatus === 'connected' ? '#22c55e' : 
                          connectionStatus === 'connecting' ? '#eab308' : '#ef4444'}`,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: '600',
          fontSize: '13px',
          color: connectionStatus === 'connected' ? '#22c55e' : 
                 connectionStatus === 'connecting' ? '#eab308' : '#ef4444'
        }}>
          <span style={{
            display: 'inline-block',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: connectionStatus === 'connected' ? '#22c55e' : 
                            connectionStatus === 'connecting' ? '#eab308' : '#ef4444',
            animation: connectionStatus === 'connecting' ? 'pulse 2s infinite' : 'none'
          }}></span>
          {connectionStatus === 'connected' ? 'CONECTADO' :
           connectionStatus === 'connecting' ? 'CONECTANDO' : 'DESCONECTADO'}
        </div>
      </div>
      
      {/* Notificaciones */}
      {notification && (
        <div style={{
          padding: '14px 20px',
          marginBottom: '20px',
          borderRadius: '12px',
          backgroundColor: notification.type === 'success' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          color: notification.type === 'success' ? '#22c55e' : '#ef4444',
          border: `1px solid ${notification.type === 'success' ? '#22c55e' : '#ef4444'}`,
          backdropFilter: 'blur(20px)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontWeight: '600',
          fontSize: '14px',
          animation: 'slideIn 0.3s ease-out'
        }}>
          <span style={{ fontSize: '20px' }}>
            {notification.type === 'success' ? '✅' : '❌'}
          </span>
          {notification.message}
        </div>
      )}
      
      {/* Bento Grid Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gap: '20px',
        gridAutoRows: 'minmax(100px, auto)'
      }}>
        
        {/* Message Form - Left side, spans 4 columns */}
        <div style={{ gridColumn: 'span 4', gridRow: 'span 1' }}>
          <MessageForm onSendMessage={handleSendMessage} loading={sendingMessage} />
        </div>
        
        {/* Message List - Center/Right, spans 8 columns */}
        <div style={{ gridColumn: 'span 8', gridRow: 'span 1', position: 'relative' }}>
          <MessageList messages={messages} />
          
        </div>
      </div>

      {/* CSS para animaciones */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        @keyframes slideIn {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;