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
  const isOrder = parsed?.order_id && !parsed?.invoice_id && !parsed?.delivery_id;
  const isAlert = parsed?.stock_level !== undefined;
  const isBilling = parsed?.invoice_id !== undefined;
  const isDelivery = parsed?.delivery_id !== undefined;

  // Dark mode solid color schemes
  const colors = {
    orders: {
      bg: '#3b82f6',
      badge: '#3b82f6',
      text: '#ffffff',
      borderColor: 'rgba(59, 130, 246, 0.3)',
      icon: '🛒',
      label: 'Pedido'
    },
    alerts: {
      bg: '#eab308',
      badge: '#eab308',
      text: '#ffffff',
      borderColor: 'rgba(234, 179, 8, 0.3)',
      icon: '⚠️',
      label: 'Alerta'
    },
    billing: {
      bg: '#22c55e',
      badge: '#22c55e',
      text: '#ffffff',
      borderColor: 'rgba(34, 197, 94, 0.3)',
      icon: '💵',
      label: 'Factura'
    },
    delivery: {
      bg: '#ef4444',
      badge: '#ef4444',
      text: '#ffffff',
      borderColor: 'rgba(239, 68, 68, 0.3)',
      icon: '🚚',
      label: 'Envío'
    }
  };

  const getTheme = () => {
    if (message.queue === 'orders') return colors.orders;
    if (message.queue === 'alerts') return colors.alerts;
    if (message.queue === 'billing') return colors.billing;
    if (message.queue === 'delivery') return colors.delivery;
    return colors.orders;
  };

  const theme = getTheme();
  const isSent = message.type === 'sent';

  return (
    <div style={{
      margin: '12px 0',
      borderRadius: '14px',
      background: 'rgba(26, 26, 26, 0.6)',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
      overflow: 'hidden',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'pointer',
      border: `1px solid ${theme.borderColor}`
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.6)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.4)';
    }}>
      {/* Header con color sólido */}
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
            background: 'rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px'
          }}>
            {theme.icon}
          </div>
          <div>
            <div style={{
              color: theme.text,
              fontWeight: '600',
              fontSize: '16px',
              marginBottom: '2px'
            }}>
              {theme.label}
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
                background: isSent ? '#22c55e' : '#eab308'
              }}></span>
              {isSent ? 'Enviado' : 'Recibido'}
            </div>
          </div>
        </div>
        <div style={{
          color: 'rgba(255, 255, 255, 0.95)',
          fontSize: '13px',
          fontWeight: '500',
          background: 'rgba(0, 0, 0, 0.25)',
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
              <span style={{ color: '#9ca3af', fontSize: '14px', fontWeight: '500' }}>ID Pedido</span>
              <span style={{ 
                color: '#ffffff', 
                fontSize: '15px', 
                fontWeight: '600',
                fontFamily: 'monospace',
                background: 'rgba(59, 130, 246, 0.2)',
                padding: '4px 10px',
                borderRadius: '6px'
              }}>
                {parsed.order_id}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#9ca3af', fontSize: '14px', fontWeight: '500' }}>Cliente</span>
              <span style={{ color: '#ffffff', fontSize: '15px', fontWeight: '600' }}>
                👤 {parsed.user}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#9ca3af', fontSize: '14px', fontWeight: '500' }}>Producto</span>
              <span style={{ color: '#ffffff', fontSize: '15px', fontWeight: '600' }}>
                ☕ {parsed.item}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#9ca3af', fontSize: '14px', fontWeight: '500' }}>Cantidad</span>
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
              <span style={{ color: '#9ca3af', fontSize: '14px', fontWeight: '500' }}>Producto</span>
              <span style={{ color: '#ffffff', fontSize: '15px', fontWeight: '600' }}>
                📦 {parsed.item}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#9ca3af', fontSize: '14px', fontWeight: '500' }}>Stock Actual</span>
              <span style={{ 
                color: parsed.stock_level < parsed.threshold ? '#ef4444' : '#22c55e',
                fontSize: '20px',
                fontWeight: '700'
              }}>
                {parsed.stock_level}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#9ca3af', fontSize: '14px', fontWeight: '500' }}>Umbral Mínimo</span>
              <span style={{ color: '#ffffff', fontSize: '15px', fontWeight: '600' }}>
                {parsed.threshold}
              </span>
            </div>
            {parsed.stock_level < parsed.threshold && (
              <div style={{
                marginTop: '8px',
                padding: '12px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                color: '#ef4444',
                fontSize: '13px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backdropFilter: 'blur(10px)'
              }}>
                <span>🚨</span>
                Stock bajo - Se requiere reabastecimiento
              </div>
            )}
          </div>
        )}

        {isBilling && (
          <div style={{ display: 'grid', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#9ca3af', fontSize: '14px', fontWeight: '500' }}>ID Factura</span>
              <span style={{ 
                color: '#ffffff', 
                fontSize: '15px', 
                fontWeight: '600',
                fontFamily: 'monospace',
                background: 'rgba(34, 197, 94, 0.2)',
                padding: '4px 10px',
                borderRadius: '6px'
              }}>
                {parsed.invoice_id}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#9ca3af', fontSize: '14px', fontWeight: '500' }}>Cliente</span>
              <span style={{ color: '#ffffff', fontSize: '15px', fontWeight: '600' }}>
                👤 {parsed.customer}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#9ca3af', fontSize: '14px', fontWeight: '500' }}>Producto</span>
              <span style={{ color: '#ffffff', fontSize: '15px', fontWeight: '600' }}>
                ☕ {parsed.item}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#9ca3af', fontSize: '14px', fontWeight: '500' }}>Cantidad</span>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#9ca3af', fontSize: '14px', fontWeight: '500' }}>Precio Unitario</span>
              <span style={{ color: '#ffffff', fontSize: '15px', fontWeight: '600' }}>
                ${parsed.unit_price?.toFixed(2)}
              </span>
            </div>
            <div style={{
              marginTop: '8px',
              padding: '12px',
              background: 'rgba(34, 197, 94, 0.2)',
              border: '1px solid rgba(34, 197, 94, 0.4)',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backdropFilter: 'blur(10px)'
            }}>
              <span style={{ color: '#22c55e', fontSize: '14px', fontWeight: '600' }}>Total</span>
              <span style={{ color: '#22c55e', fontSize: '24px', fontWeight: '700' }}>
                ${parsed.total?.toFixed(2)}
              </span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              paddingTop: '8px'
            }}>
              <span style={{
                background: parsed.status === 'pending' ? 'rgba(234, 179, 8, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                color: parsed.status === 'pending' ? '#eab308' : '#22c55e',
                padding: '6px 16px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600',
                border: parsed.status === 'pending' ? '1px solid #eab308' : '1px solid #22c55e'
              }}>
                {parsed.status === 'pending' ? '⏳ Pendiente' : '✅ Pagado'}
              </span>
            </div>
          </div>
        )}

        {isDelivery && (
          <div style={{ display: 'grid', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#9ca3af', fontSize: '14px', fontWeight: '500' }}>ID Envío</span>
              <span style={{ 
                color: '#ffffff', 
                fontSize: '15px', 
                fontWeight: '600',
                fontFamily: 'monospace',
                background: 'rgba(239, 68, 68, 0.2)',
                padding: '4px 10px',
                borderRadius: '6px'
              }}>
                {parsed.delivery_id}
              </span>
            </div>
            {parsed.order_id && parsed.order_id !== 'N/A' && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#9ca3af', fontSize: '14px', fontWeight: '500' }}>ID Pedido</span>
                <span style={{ 
                  color: '#ffffff', 
                  fontSize: '14px', 
                  fontWeight: '600',
                  fontFamily: 'monospace'
                }}>
                  {parsed.order_id}
                </span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#9ca3af', fontSize: '14px', fontWeight: '500' }}>Cliente</span>
              <span style={{ color: '#ffffff', fontSize: '15px', fontWeight: '600' }}>
                👤 {parsed.customer}
              </span>
            </div>
            <div style={{ 
              padding: '12px',
              background: 'rgba(239, 68, 68, 0.1)',
              borderRadius: '8px',
              border: '1px solid rgba(239, 68, 68, 0.2)'
            }}>
              <div style={{ color: '#9ca3af', fontSize: '13px', fontWeight: '500', marginBottom: '6px' }}>
                📍 Dirección de Entrega
              </div>
              <div style={{ color: '#ffffff', fontSize: '14px', fontWeight: '600' }}>
                {parsed.address}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#9ca3af', fontSize: '14px', fontWeight: '500' }}>Tiempo Estimado</span>
              <span style={{ 
                color: '#ffffff',
                background: theme.badge,
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '700'
              }}>
                ⏱️ {parsed.estimated_time_minutes} min
              </span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              paddingTop: '8px'
            }}>
              <span style={{
                background: 
                  parsed.status === 'delivered' ? 'rgba(34, 197, 94, 0.2)' :
                  parsed.status === 'out_for_delivery' ? 'rgba(59, 130, 246, 0.2)' :
                  parsed.status === 'in_transit' ? 'rgba(234, 179, 8, 0.2)' :
                  'rgba(156, 163, 175, 0.2)',
                color: 
                  parsed.status === 'delivered' ? '#22c55e' :
                  parsed.status === 'out_for_delivery' ? '#3b82f6' :
                  parsed.status === 'in_transit' ? '#eab308' :
                  '#9ca3af',
                padding: '6px 16px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600',
                border: `1px solid ${
                  parsed.status === 'delivered' ? '#22c55e' :
                  parsed.status === 'out_for_delivery' ? '#3b82f6' :
                  parsed.status === 'in_transit' ? '#eab308' :
                  '#9ca3af'
                }`
              }}>
                {parsed.status === 'delivered' ? '✅ Entregado' :
                 parsed.status === 'out_for_delivery' ? '🚚 En reparto' :
                 parsed.status === 'in_transit' ? '📦 En tránsito' :
                 '⏳ Pendiente'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem;