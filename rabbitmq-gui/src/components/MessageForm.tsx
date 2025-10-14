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

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderForm.order_id && orderForm.item && orderForm.user) {
      const orderMessage = {
        ...orderForm,
        timestamp: new Date().toISOString()
      };
      onSendMessage('orders', orderMessage);
      setOrderForm({ order_id: '', item: '', quantity: 1, user: '' });
    } else {
      alert('Por favor completa todos los campos requeridos');
    }
  };

  const handleAlertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (alertForm.item) {
      const alertMessage = {
        ...alertForm,
        timestamp: new Date().toISOString()
      };
      onSendMessage('alerts', alertMessage);
      setAlertForm({ 
        type: 'inventory_alert', 
        item: '', 
        stock_level: 0, 
        threshold: 5, 
        timestamp: '' 
      });
    } else {
      alert('Por favor completa todos los campos requeridos');
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    fontSize: '15px',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    outline: 'none',
    transition: 'all 0.2s',
    fontFamily: 'inherit',
    backgroundColor: '#ffffff'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#374151',
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
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    transform: loading ? 'scale(0.98)' : 'scale(1)'
  };

  return (
    <div style={{ 
      background: '#ffffff',
      borderRadius: '20px',
      padding: '0',
      marginBottom: '30px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
      overflow: 'hidden',
      border: '1px solid #f3f4f6'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '24px 28px',
        color: '#ffffff'
      }}>
        <h2 style={{ 
          margin: 0,
          fontSize: '24px',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{ fontSize: '28px' }}>📤</span>
          Enviar Nuevo Mensaje
        </h2>
        <p style={{
          margin: '8px 0 0 0',
          opacity: 0.95,
          fontSize: '14px',
          fontWeight: '400'
        }}>
          Selecciona el tipo de mensaje y completa la información
        </p>
      </div>

      <div style={{ 
        display: 'flex',
        padding: '0',
        background: '#f9fafb',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <button
          onClick={() => setActiveTab('orders')}
          style={{
            flex: 1,
            padding: '18px',
            backgroundColor: activeTab === 'orders' ? '#ffffff' : 'transparent',
            color: activeTab === 'orders' ? '#667eea' : '#6b7280',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '700',
            fontSize: '15px',
            transition: 'all 0.3s',
            borderBottom: activeTab === 'orders' ? '3px solid #667eea' : '3px solid transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <span style={{ fontSize: '20px' }}>🛒</span>
          Pedidos
        </button>
        <button
          onClick={() => setActiveTab('alerts')}
          style={{
            flex: 1,
            padding: '18px',
            backgroundColor: activeTab === 'alerts' ? '#ffffff' : 'transparent',
            color: activeTab === 'alerts' ? '#f5576c' : '#6b7280',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '700',
            fontSize: '15px',
            transition: 'all 0.3s',
            borderBottom: activeTab === 'alerts' ? '3px solid #f5576c' : '3px solid transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <span style={{ fontSize: '20px' }}>⚠️</span>
          Alertas
        </button>
      </div>

      <div style={{ padding: '28px' }}>
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
                background: loading ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#ffffff'
              }}
            >
              {loading ? 'Enviando...' : '🚀 Enviar Pedido'}
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
                style={inputStyle}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                ...buttonStyle,
                background: loading ? '#9ca3af' : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: '#ffffff'
              }}
            >
              {loading ? 'Enviando...' : '⚡ Enviar Alerta'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default MessageForm;
