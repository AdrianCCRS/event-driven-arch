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
    <div style={{ padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px',
        padding: '10px',
        backgroundColor: '#f5f5f5',
        borderRadius: '5px'
      }}>
        <h1 style={{ margin: 0 }}>RabbitMQ Messages</h1>
        <div style={{
          padding: '5px 10px',
          borderRadius: '3px',
          backgroundColor: connectionStatus === 'connected' ? '#4caf50' : 
                          connectionStatus === 'connecting' ? '#ff9800' : '#f44336',
          color: 'white',
          fontSize: '12px'
        }}>
          {connectionStatus.toUpperCase()}
        </div>
      </div>
      
      {/* Notification */}
      {notification && (
        <div style={{
          padding: '10px',
          marginBottom: '20px',
          borderRadius: '4px',
          backgroundColor: notification.type === 'success' ? '#d4edda' : '#f8d7da',
          color: notification.type === 'success' ? '#155724' : '#721c24',
          border: `1px solid ${notification.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          {notification.message}
        </div>
      )}
      
      {/* Message Form */}
      <MessageForm onSendMessage={handleSendMessage} loading={sendingMessage} />
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Total Messages: {messages.length}</strong>
      </div>
      
      <MessageList messages={messages} />
    </div>
  );
};

export default Dashboard;