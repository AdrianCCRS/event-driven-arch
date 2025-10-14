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
      padding: '30px',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      {/* Header moderno */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px',
        padding: '24px 30px',
        background: '#ffffff',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
        border: '1px solid #f3f4f6'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '30px',
            boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)'
          }}>
            🐰
          </div>
          <div>
            <h1 style={{ 
              margin: 0,
              fontSize: '28px',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Monitor de Mensajes RabbitMQ
            </h1>
            <p style={{
              margin: '4px 0 0 0',
              color: '#6b7280',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              Sistema de mensajería en tiempo real
            </p>
          </div>
        </div>
        <div style={{
          padding: '12px 20px',
          borderRadius: '12px',
          backgroundColor: connectionStatus === 'connected' ? '#d1fae5' : 
                          connectionStatus === 'connecting' ? '#fef3c7' : '#fee2e2',
          border: `2px solid ${connectionStatus === 'connected' ? '#10b981' : 
                          connectionStatus === 'connecting' ? '#f59e0b' : '#ef4444'}`,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontWeight: '700',
          fontSize: '14px',
          color: connectionStatus === 'connected' ? '#065f46' : 
                 connectionStatus === 'connecting' ? '#92400e' : '#991b1b',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
        }}>
          <span style={{
            display: 'inline-block',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: connectionStatus === 'connected' ? '#10b981' : 
                            connectionStatus === 'connecting' ? '#f59e0b' : '#ef4444',
            animation: connectionStatus === 'connecting' ? 'pulse 2s infinite' : 'none'
          }}></span>
          {connectionStatus === 'connected' ? 'CONECTADO' :
           connectionStatus === 'connecting' ? 'CONECTANDO' : 'DESCONECTADO'}
        </div>
      </div>
      
      {/* Notificaciones modernas */}
      {notification && (
        <div style={{
          padding: '16px 24px',
          marginBottom: '24px',
          borderRadius: '16px',
          backgroundColor: notification.type === 'success' ? '#d1fae5' : '#fee2e2',
          color: notification.type === 'success' ? '#065f46' : '#991b1b',
          border: `2px solid ${notification.type === 'success' ? '#34d399' : '#f87171'}`,
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontWeight: '600',
          fontSize: '15px',
          animation: 'slideIn 0.3s ease-out'
        }}>
          <span style={{ fontSize: '24px' }}>
            {notification.type === 'success' ? '✅' : '❌'}
          </span>
          {notification.message}
        </div>
      )}
      
      {/* Formulario de mensaje */}
      <MessageForm onSendMessage={handleSendMessage} loading={sendingMessage} />
      
      {/* Stats card */}
      <div style={{ 
        marginBottom: '24px',
        padding: '20px 24px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px'
        }}>
          💬
        </div>
        <div>
          <div style={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '4px'
          }}>
            Total de Mensajes
          </div>
          <div style={{
            color: '#ffffff',
            fontSize: '32px',
            fontWeight: '700',
            lineHeight: '1'
          }}>
            {messages.length}
          </div>
        </div>
      </div>
      
      {/* Lista de mensajes */}
      <MessageList messages={messages} />

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