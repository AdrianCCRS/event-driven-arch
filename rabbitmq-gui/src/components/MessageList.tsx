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
        padding: '18px 22px',
        background: 'rgba(26, 26, 26, 0.6)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px 16px 0 0',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderBottom: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        justifyContent: 'space-between'
      }}>
        <div style={{display: 'flex', gap: '15px'}}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: '#3b82f6',
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
              fontSize: '17px',
              fontWeight: '700',
              color: '#ffffff'
            }}>
              Historial de Mensajes
            </h3>
            <p style={{
              margin: '2px 0 0 0',
              fontSize: '13px',
              color: '#9ca3af',
              fontWeight: '500'
            }}>
              Mensajes más recientes primero
            </p>
          </div>
        </div>

              {/* Stats Card - Compact */}
            <div style={{ 
              padding: '16px 20px',
              backdropFilter: 'blur(20px)',
              borderRadius: '12px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              minWidth: '160px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'rgba(59, 130, 246, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                💬
              </div>
              <div>
                <div style={{
                  color: '#9ca3af',
                  fontSize: '11px',
                  fontWeight: '600',
                  marginBottom: '2px'
                }}>
                  Total Mensajes
                </div>
                <div style={{
                  color: '#3b82f6',
                  fontSize: '24px',
                  fontWeight: '700',
                  lineHeight: '1'
                }}>
                  {messages.length}
                </div>
              </div>
            </div>

      </div>

      {/* Contenedor de mensajes */}
      <div style={{ 
        maxHeight: '700px', 
        overflowY: 'auto',
        background: 'rgba(26, 26, 26, 0.4)',
        backdropFilter: 'blur(20px)',
        borderRadius: '0 0 16px 16px',
        padding: '20px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)'
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
              color: '#9ca3af'
            }}>
              No hay mensajes aún
            </p>
            <p style={{
              fontSize: '14px',
              margin: 0,
              color: '#6b7280'
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