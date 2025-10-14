import React, { useState } from 'react';
import MessageItem from './MessageItem';
import { Message } from '../types/message';

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'orders' | 'alerts' | 'billing' | 'delivery'>('all');

  const filteredMessages = activeFilter === 'all' 
    ? messages 
    : messages.filter(msg => msg.queue === activeFilter);

  const sortedMessages = [...filteredMessages].sort((a, b) => {
    const timeA = new Date(a.timestamp).getTime();
    const timeB = new Date(b.timestamp).getTime();
    return timeB - timeA; // Most recent first
  });

  const getMessageCount = (queue: string) => {
    if (queue === 'all') return messages.length;
    return messages.filter(msg => msg.queue === queue).length;
  };

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

      {/* Tab Filters */}
      <div style={{
        display: 'flex',
        gap: '8px',
        padding: '16px 20px',
        background: 'rgba(26, 26, 26, 0.4)',
        borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        overflowX: 'auto'
      }}>
        <button
          onClick={() => setActiveFilter('all')}
          style={{
            padding: '10px 20px',
            borderRadius: '10px',
            border: 'none',
            background: activeFilter === 'all' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255, 255, 255, 0.05)',
            color: activeFilter === 'all' ? '#3b82f6' : '#9ca3af',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap',
            backdropFilter: 'blur(10px)',
            borderBottom: activeFilter === 'all' ? '2px solid #3b82f6' : '2px solid transparent'
          }}
          onMouseEnter={(e) => {
            if (activeFilter !== 'all') {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }
          }}
          onMouseLeave={(e) => {
            if (activeFilter !== 'all') {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            }
          }}
        >
          <span>📋</span>
          Todos
          <span style={{
            background: activeFilter === 'all' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255, 255, 255, 0.1)',
            padding: '2px 8px',
            borderRadius: '10px',
            fontSize: '12px',
            fontWeight: '700'
          }}>
            {getMessageCount('all')}
          </span>
        </button>

        <button
          onClick={() => setActiveFilter('orders')}
          style={{
            padding: '10px 20px',
            borderRadius: '10px',
            border: 'none',
            background: activeFilter === 'orders' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255, 255, 255, 0.05)',
            color: activeFilter === 'orders' ? '#3b82f6' : '#9ca3af',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap',
            backdropFilter: 'blur(10px)',
            borderBottom: activeFilter === 'orders' ? '2px solid #3b82f6' : '2px solid transparent'
          }}
          onMouseEnter={(e) => {
            if (activeFilter !== 'orders') {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }
          }}
          onMouseLeave={(e) => {
            if (activeFilter !== 'orders') {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            }
          }}
        >
          <span>🛒</span>
          Pedidos
          <span style={{
            background: activeFilter === 'orders' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255, 255, 255, 0.1)',
            padding: '2px 8px',
            borderRadius: '10px',
            fontSize: '12px',
            fontWeight: '700'
          }}>
            {getMessageCount('orders')}
          </span>
        </button>

        <button
          onClick={() => setActiveFilter('alerts')}
          style={{
            padding: '10px 20px',
            borderRadius: '10px',
            border: 'none',
            background: activeFilter === 'alerts' ? 'rgba(234, 179, 8, 0.3)' : 'rgba(255, 255, 255, 0.05)',
            color: activeFilter === 'alerts' ? '#eab308' : '#9ca3af',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap',
            backdropFilter: 'blur(10px)',
            borderBottom: activeFilter === 'alerts' ? '2px solid #eab308' : '2px solid transparent'
          }}
          onMouseEnter={(e) => {
            if (activeFilter !== 'alerts') {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }
          }}
          onMouseLeave={(e) => {
            if (activeFilter !== 'alerts') {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            }
          }}
        >
          <span>⚠️</span>
          Alertas
          <span style={{
            background: activeFilter === 'alerts' ? 'rgba(234, 179, 8, 0.3)' : 'rgba(255, 255, 255, 0.1)',
            padding: '2px 8px',
            borderRadius: '10px',
            fontSize: '12px',
            fontWeight: '700'
          }}>
            {getMessageCount('alerts')}
          </span>
        </button>

        <button
          onClick={() => setActiveFilter('billing')}
          style={{
            padding: '10px 20px',
            borderRadius: '10px',
            border: 'none',
            background: activeFilter === 'billing' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(255, 255, 255, 0.05)',
            color: activeFilter === 'billing' ? '#22c55e' : '#9ca3af',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap',
            backdropFilter: 'blur(10px)',
            borderBottom: activeFilter === 'billing' ? '2px solid #22c55e' : '2px solid transparent'
          }}
          onMouseEnter={(e) => {
            if (activeFilter !== 'billing') {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }
          }}
          onMouseLeave={(e) => {
            if (activeFilter !== 'billing') {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            }
          }}
        >
          <span>💵</span>
          Facturas
          <span style={{
            background: activeFilter === 'billing' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(255, 255, 255, 0.1)',
            padding: '2px 8px',
            borderRadius: '10px',
            fontSize: '12px',
            fontWeight: '700'
          }}>
            {getMessageCount('billing')}
          </span>
        </button>

        <button
          onClick={() => setActiveFilter('delivery')}
          style={{
            padding: '10px 20px',
            borderRadius: '10px',
            border: 'none',
            background: activeFilter === 'delivery' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255, 255, 255, 0.05)',
            color: activeFilter === 'delivery' ? '#ef4444' : '#9ca3af',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap',
            backdropFilter: 'blur(10px)',
            borderBottom: activeFilter === 'delivery' ? '2px solid #ef4444' : '2px solid transparent'
          }}
          onMouseEnter={(e) => {
            if (activeFilter !== 'delivery') {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }
          }}
          onMouseLeave={(e) => {
            if (activeFilter !== 'delivery') {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            }
          }}
        >
          <span>🚚</span>
          Envíos
          <span style={{
            background: activeFilter === 'delivery' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255, 255, 255, 0.1)',
            padding: '2px 8px',
            borderRadius: '10px',
            fontSize: '12px',
            fontWeight: '700'
          }}>
            {getMessageCount('delivery')}
          </span>
        </button>
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