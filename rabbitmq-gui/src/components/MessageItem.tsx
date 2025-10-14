import React from 'react';
import { Message } from '../types/message';

interface MessageItemProps {
  message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const formatTimestamp = (timestamp: string | Date) => {
    const date = new Date(timestamp);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const parseMessageContent = (content: string) => {
    try {
      return JSON.parse(content);
    } catch {
      return null;
    }
  };

  const parsed = parseMessageContent(message.content);
  const isOrder = parsed?.order_id;
  const isAlert = parsed?.stock_level !== undefined;

  // Modern color schemes
  const colors = {
    orders: {
      bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      badge: '#667eea',
      text: '#ffffff'
    },
    alerts: {
      bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      badge: '#f5576c',
      text: '#ffffff'
    }
  };

  const theme = message.queue === 'orders' ? colors.orders : colors.alerts;
  const isSent = message.type === 'sent';

  return (
    <div style={{
      margin: '12px 0',
      borderRadius: '16px',
      background: '#ffffff',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
      overflow: 'hidden',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'pointer',
      border: '1px solid rgba(0, 0, 0, 0.06)'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.12)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
    }}>
      {/* Header con gradiente */}
      <div style={{
        background: theme.bg,
        padding: '16px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px'
          }}>
            {isOrder ? '🛒' : '⚠️'}
          </div>
          <div>
            <div style={{
              color: theme.text,
              fontWeight: '600',
              fontSize: '16px',
              marginBottom: '2px'
            }}>
              {message.queue === 'orders' ? 'Pedido' : 'Alerta'}
            </div>
            <div style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span style={{
                display: 'inline-block',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: isSent ? '#4ade80' : '#fbbf24'
              }}></span>
              {isSent ? 'Enviado' : 'Recibido'}
            </div>
          </div>
        </div>
        <div style={{
          color: 'rgba(255, 255, 255, 0.95)',
          fontSize: '13px',
          fontWeight: '500',
          background: 'rgba(255, 255, 255, 0.15)',
          padding: '6px 12px',
          borderRadius: '8px',
          backdropFilter: 'blur(10px)'
        }}>
          {formatTimestamp(message.timestamp)}
        </div>
      </div>

      {/* Contenido del mensaje */}
      <div style={{ padding: '20px' }}>
        {isOrder && (
          <div style={{ display: 'grid', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#6b7280', fontSize: '14px', fontWeight: '500' }}>ID Pedido</span>
              <span style={{ 
                color: '#111827', 
                fontSize: '15px', 
                fontWeight: '600',
                fontFamily: 'monospace',
                background: '#f3f4f6',
                padding: '4px 10px',
                borderRadius: '6px'
              }}>
                {parsed.order_id}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#6b7280', fontSize: '14px', fontWeight: '500' }}>Cliente</span>
              <span style={{ color: '#111827', fontSize: '15px', fontWeight: '600' }}>
                👤 {parsed.user}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#6b7280', fontSize: '14px', fontWeight: '500' }}>Producto</span>
              <span style={{ color: '#111827', fontSize: '15px', fontWeight: '600' }}>
                ☕ {parsed.item}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#6b7280', fontSize: '14px', fontWeight: '500' }}>Cantidad</span>
              <span style={{ 
                color: '#ffffff',
                background: theme.badge,
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '700'
              }}>
                ×{parsed.quantity}
              </span>
            </div>
          </div>
        )}

        {isAlert && (
          <div style={{ display: 'grid', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#6b7280', fontSize: '14px', fontWeight: '500' }}>Producto</span>
              <span style={{ color: '#111827', fontSize: '15px', fontWeight: '600' }}>
                📦 {parsed.item}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#6b7280', fontSize: '14px', fontWeight: '500' }}>Stock Actual</span>
              <span style={{ 
                color: parsed.stock_level < parsed.threshold ? '#dc2626' : '#059669',
                fontSize: '20px',
                fontWeight: '700'
              }}>
                {parsed.stock_level}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#6b7280', fontSize: '14px', fontWeight: '500' }}>Umbral Mínimo</span>
              <span style={{ color: '#111827', fontSize: '15px', fontWeight: '600' }}>
                {parsed.threshold}
              </span>
            </div>
            {parsed.stock_level < parsed.threshold && (
              <div style={{
                marginTop: '8px',
                padding: '12px',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                color: '#991b1b',
                fontSize: '13px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>🚨</span>
                Stock bajo - Se requiere reabastecimiento
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem;