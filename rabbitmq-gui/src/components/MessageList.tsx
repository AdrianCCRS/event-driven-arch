import React from 'react';
import MessageItem from './MessageItem';
import { Message } from '../types/message';

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const sortedMessages = [...messages].sort((a, b) => {
    const timeA = new Date(a.timestamp).getTime();
    const timeB = new Date(b.timestamp).getTime();
    return timeB - timeA; // Most recent first
  });

  return (
    <div>
      {/* Header de la lista */}
      <div style={{
        padding: '20px 24px',
        background: '#ffffff',
        borderRadius: '16px 16px 0 0',
        border: '1px solid #f3f4f6',
        borderBottom: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px'
        }}>
          📋
        </div>
        <div>
          <h3 style={{ 
            margin: 0,
            fontSize: '18px',
            fontWeight: '700',
            color: '#111827'
          }}>
            Historial de Mensajes
          </h3>
          <p style={{
            margin: '2px 0 0 0',
            fontSize: '13px',
            color: '#6b7280',
            fontWeight: '500'
          }}>
            Mensajes más recientes primero
          </p>
        </div>
      </div>

      {/* Contenedor de mensajes */}
      <div style={{ 
        maxHeight: '700px', 
        overflowY: 'auto',
        background: '#ffffff',
        borderRadius: '0 0 16px 16px',
        padding: '20px',
        border: '1px solid #f3f4f6',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)'
      }}>
        {sortedMessages.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#6b7280'
          }}>
            <div style={{
              fontSize: '64px',
              marginBottom: '16px',
              opacity: 0.5
            }}>
              📭
            </div>
            <p style={{
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '8px',
              color: '#374151'
            }}>
              No hay mensajes aún
            </p>
            <p style={{
              fontSize: '14px',
              margin: 0
            }}>
              Esperando mensajes de RabbitMQ...
            </p>
          </div>
        ) : (
          sortedMessages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))
        )}
      </div>
    </div>
  );
};

export default MessageList;