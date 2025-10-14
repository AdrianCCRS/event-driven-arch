import React, { useState } from 'react';
import { OrderMessage, AlertMessage } from '../types/message';

interface MessageFormProps {
  onSendMessage: (queue: string, message: any) => void;
  loading?: boolean;
}

const MessageForm: React.FC<MessageFormProps> = ({ onSendMessage, loading = false }) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'alerts'>('orders');
  
  const [orderForm, setOrderForm] = useState<OrderMessage>({
    order_id: '',
    item: '',
    quantity: 1,
    user: ''
  });

  const [alertForm, setAlertForm] = useState<AlertMessage>({
    type: 'inventory_alert',
    item: '',
    stock_level: 0,
    threshold: 5,
    timestamp: ''
  });

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (orderForm.order_id && orderForm.item && orderForm.user) {
      const orderMessage = {
        ...orderForm,
        timestamp: new Date().toISOString()
      };
      await onSendMessage('orders', orderMessage);
      setOrderForm({ order_id: '', item: '', quantity: 1, user: '' });
      // Reload the page after sending
      setTimeout(() => window.location.reload(), 500);
    } else {
      alert('Por favor completa todos los campos requeridos');
    }
  };

  const handleAlertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (alertForm.item) {
      const alertMessage = {
        ...alertForm,
        timestamp: new Date().toISOString()
      };
      await onSendMessage('alerts', alertMessage);
      setAlertForm({ 
        type: 'inventory_alert', 
        item: '', 
        stock_level: 0, 
        threshold: 5, 
        timestamp: '' 
      });
      // Reload the page after sending
      setTimeout(() => window.location.reload(), 500);
    } else {
      alert('Por favor completa todos los campos requeridos');
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    fontSize: '15px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    outline: 'none',
    transition: 'all 0.2s',
    fontFamily: 'inherit',
    backgroundColor: 'rgba(26, 26, 26, 0.6)',
    color: '#ffffff',
    backdropFilter: 'blur(20px)',
    boxSizing: 'border-box' as const
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#e5e5e5',
    fontSize: '14px'
  };

  const buttonStyle = {
    width: '100%',
    padding: '16px',
    fontSize: '16px',
    fontWeight: '700',
    border: 'none',
    borderRadius: '12px',
    cursor: loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s',
    fontFamily: 'inherit',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
    transform: loading ? 'scale(0.98)' : 'scale(1)',
    boxSizing: 'border-box' as const
  };

  return (
    <div style={{ 
      background: 'rgba(26, 26, 26, 0.6)',
      backdropFilter: 'blur(20px)',
      borderRadius: '16px',
      padding: '0',
      marginBottom: '0',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
      overflow: 'hidden',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      height: 'fit-content'
    }}>
      <div style={{
        background: '#3b82f6',
        padding: '20px 24px',
        color: '#ffffff'
      }}>
        <h2 style={{ 
          margin: 0,
          fontSize: '20px',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span style={{ fontSize: '24px' }}>📤</span>
          Enviar Nuevo Mensaje
        </h2>
        <p style={{
          margin: '6px 0 0 0',
          opacity: 0.9,
          fontSize: '13px',
          fontWeight: '400'
        }}>
          Selecciona el tipo de mensaje
        </p>
      </div>

      <div style={{ 
        display: 'flex',
        padding: '0',
        background: 'rgba(0, 0, 0, 0.2)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <button
          onClick={() => setActiveTab('orders')}
          style={{
            flex: 1,
            padding: '16px',
            backgroundColor: activeTab === 'orders' ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
            color: activeTab === 'orders' ? '#3b82f6' : '#9ca3af',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '700',
            fontSize: '14px',
            transition: 'all 0.3s',
            borderBottom: activeTab === 'orders' ? '2px solid #3b82f6' : '2px solid transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <span style={{ fontSize: '18px' }}>🛒</span>
          Pedidos
        </button>
        <button
          onClick={() => setActiveTab('alerts')}
          style={{
            flex: 1,
            padding: '16px',
            backgroundColor: activeTab === 'alerts' ? 'rgba(234, 179, 8, 0.2)' : 'transparent',
            color: activeTab === 'alerts' ? '#eab308' : '#9ca3af',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '700',
            fontSize: '14px',
            transition: 'all 0.3s',
            borderBottom: activeTab === 'alerts' ? '2px solid #eab308' : '2px solid transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <span style={{ fontSize: '18px' }}>⚠️</span>
          Alertas
        </button>
      </div>

      <div style={{ padding: '24px' }}>
        {activeTab === 'orders' ? (
          <form onSubmit={handleOrderSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>
                <span style={{ color: '#ef4444' }}>*</span> ID del Pedido
              </label>
              <input
                type="text"
                value={orderForm.order_id}
                onChange={(e) => setOrderForm({ ...orderForm, order_id: e.target.value })}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                placeholder="Ej: ORD-001"
                style={inputStyle}
                required
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>
                <span style={{ color: '#ef4444' }}>*</span> Producto
              </label>
              <input
                type="text"
                value={orderForm.item}
                onChange={(e) => setOrderForm({ ...orderForm, item: e.target.value })}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                placeholder="Ej: Café Latte"
                style={inputStyle}
                required
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>
                <span style={{ color: '#ef4444' }}>*</span> Cantidad
              </label>
              <input
                type="number"
                min="1"
                value={orderForm.quantity}
                onChange={(e) => setOrderForm({ ...orderForm, quantity: parseInt(e.target.value) || 1 })}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                style={inputStyle}
                required
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>
                <span style={{ color: '#ef4444' }}>*</span> Cliente
              </label>
              <input
                type="text"
                value={orderForm.user}
                onChange={(e) => setOrderForm({ ...orderForm, user: e.target.value })}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                placeholder="Ej: María García"
                style={inputStyle}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                ...buttonStyle,
                background: loading ? '#6b7280' : '#3b82f6',
                color: '#ffffff'
              }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.background = '#2563eb')}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.background = '#3b82f6')}
            >
              {loading ? 'Enviando...' : 'Enviar Pedido'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleAlertSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>
                <span style={{ color: '#ef4444' }}>*</span> Producto
              </label>
              <input
                type="text"
                value={alertForm.item}
                onChange={(e) => setAlertForm({ ...alertForm, item: e.target.value })}
                onFocus={(e) => e.target.style.borderColor = '#eab308'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                placeholder="Ej: Leche"
                style={inputStyle}
                required
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>
                <span style={{ color: '#ef4444' }}>*</span> Nivel de Stock
              </label>
              <input
                type="number"
                min="0"
                value={alertForm.stock_level}
                onChange={(e) => setAlertForm({ ...alertForm, stock_level: parseInt(e.target.value) || 0 })}
                onFocus={(e) => e.target.style.borderColor = '#eab308'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                style={inputStyle}
                required
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>
                Umbral Mínimo
              </label>
              <input
                type="number"
                min="0"
                value={alertForm.threshold}
                onChange={(e) => setAlertForm({ ...alertForm, threshold: parseInt(e.target.value) || 5 })}
                onFocus={(e) => e.target.style.borderColor = '#eab308'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                style={inputStyle}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                ...buttonStyle,
                background: loading ? '#6b7280' : '#eab308',
                color: '#ffffff'
              }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.background = '#ca8a04')}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.background = '#eab308')}
            >
              {loading ? 'Enviando...' : 'Enviar Alerta'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default MessageForm;
