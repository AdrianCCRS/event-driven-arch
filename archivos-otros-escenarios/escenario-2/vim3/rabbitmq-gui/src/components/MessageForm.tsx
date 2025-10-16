import React, { useState } from 'react';
import { OrderMessage, AlertMessage, BillingMessage, DeliveryMessage } from '../types/message';

interface MessageFormProps {
  onSendMessage: (queue: string, message: any) => void;
  loading?: boolean;
}

const MessageForm: React.FC<MessageFormProps> = ({ onSendMessage, loading = false }) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'alerts' | 'billing' | 'delivery'>('orders');
  
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

  const [billingForm, setBillingForm] = useState<BillingMessage>({
    invoice_id: '',
    customer: '',
    item: '',
    quantity: 1,
    unit_price: 0,
    total: 0,
    status: 'pending'
  });

  const [deliveryForm, setDeliveryForm] = useState<DeliveryMessage>({
    delivery_id: '',
    order_id: '',
    customer: '',
    address: '',
    status: 'pending',
    estimated_time_minutes: 30
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

  const handleBillingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (billingForm.invoice_id && billingForm.customer && billingForm.item && billingForm.total) {
      const billingMessage = {
        ...billingForm,
        timestamp: new Date().toISOString()
      };
      await onSendMessage('billing', billingMessage);
      setBillingForm({
        invoice_id: '',
        customer: '',
        item: '',
        quantity: 1,
        unit_price: 0,
        total: 0,
        status: 'pending'
      });
      // Reload the page after sending
      setTimeout(() => window.location.reload(), 500);
    } else {
      alert('Por favor completa todos los campos requeridos');
    }
  };

  const handleDeliverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (deliveryForm.delivery_id && deliveryForm.customer && deliveryForm.address) {
      const deliveryMessage = {
        ...deliveryForm,
        timestamp: new Date().toISOString()
      };
      await onSendMessage('delivery', deliveryMessage);
      setDeliveryForm({
        delivery_id: '',
        order_id: '',
        customer: '',
        address: '',
        status: 'pending',
        estimated_time_minutes: 30
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
        <button
          onClick={() => setActiveTab('billing')}
          style={{
            flex: 1,
            padding: '16px',
            backgroundColor: activeTab === 'billing' ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
            color: activeTab === 'billing' ? '#8b5cf6' : '#9ca3af',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '700',
            fontSize: '14px',
            transition: 'all 0.3s',
            borderBottom: activeTab === 'billing' ? '2px solid #8b5cf6' : '2px solid transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <span style={{ fontSize: '18px' }}>💵</span>
          Facturas
        </button>
        <button
          onClick={() => setActiveTab('delivery')}
          style={{
            flex: 1,
            padding: '16px',
            backgroundColor: activeTab === 'delivery' ? 'rgba(34, 197, 94, 0.2)' : 'transparent',
            color: activeTab === 'delivery' ? '#22c55e' : '#9ca3af',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '700',
            fontSize: '14px',
            transition: 'all 0.3s',
            borderBottom: activeTab === 'delivery' ? '2px solid #22c55e' : '2px solid transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <span style={{ fontSize: '18px' }}>🚚</span>
          Envíos
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
        ) : activeTab === 'alerts' ? (
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
        ) : activeTab === 'billing' ? (
          <form onSubmit={handleBillingSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>
                <span style={{ color: '#ef4444' }}>*</span> ID de Factura
              </label>
              <input
                type="text"
                value={billingForm.invoice_id}
                onChange={(e) => setBillingForm({ ...billingForm, invoice_id: e.target.value })}
                onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                placeholder="Ej: INV-001"
                style={inputStyle}
                required
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>
                <span style={{ color: '#ef4444' }}>*</span> Cliente
              </label>
              <input
                type="text"
                value={billingForm.customer}
                onChange={(e) => setBillingForm({ ...billingForm, customer: e.target.value })}
                onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                placeholder="Ej: Juan Pérez"
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
                value={billingForm.item}
                onChange={(e) => setBillingForm({ ...billingForm, item: e.target.value })}
                onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                placeholder="Ej: Café Latte"
                style={inputStyle}
                required
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>
                Cantidad
              </label>
              <input
                type="number"
                min="1"
                value={billingForm.quantity}
                onChange={(e) => {
                  const qty = parseInt(e.target.value) || 1;
                  const total = qty * billingForm.unit_price;
                  setBillingForm({ ...billingForm, quantity: qty, total: parseFloat(total.toFixed(2)) });
                }}
                onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>
                Precio Unitario
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={billingForm.unit_price}
                onChange={(e) => {
                  const price = parseFloat(e.target.value) || 0;
                  const total = billingForm.quantity * price;
                  setBillingForm({ ...billingForm, unit_price: price, total: parseFloat(total.toFixed(2)) });
                }}
                onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                placeholder="0.00"
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>
                <span style={{ color: '#ef4444' }}>*</span> Total
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={billingForm.total}
                onChange={(e) => setBillingForm({ ...billingForm, total: parseFloat(e.target.value) || 0 })}
                onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                placeholder="0.00"
                style={inputStyle}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                ...buttonStyle,
                background: loading ? '#6b7280' : '#8b5cf6',
                color: '#ffffff'
              }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.background = '#7c3aed')}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.background = '#8b5cf6')}
            >
              {loading ? 'Enviando...' : 'Enviar Factura'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleDeliverySubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>
                <span style={{ color: '#ef4444' }}>*</span> ID de Envío
              </label>
              <input
                type="text"
                value={deliveryForm.delivery_id}
                onChange={(e) => setDeliveryForm({ ...deliveryForm, delivery_id: e.target.value })}
                onFocus={(e) => e.target.style.borderColor = '#22c55e'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                placeholder="Ej: DEL-001"
                style={inputStyle}
                required
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>
                ID del Pedido
              </label>
              <input
                type="text"
                value={deliveryForm.order_id}
                onChange={(e) => setDeliveryForm({ ...deliveryForm, order_id: e.target.value })}
                onFocus={(e) => e.target.style.borderColor = '#22c55e'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                placeholder="Ej: ORD-001"
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>
                <span style={{ color: '#ef4444' }}>*</span> Cliente
              </label>
              <input
                type="text"
                value={deliveryForm.customer}
                onChange={(e) => setDeliveryForm({ ...deliveryForm, customer: e.target.value })}
                onFocus={(e) => e.target.style.borderColor = '#22c55e'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                placeholder="Ej: Ana Martínez"
                style={inputStyle}
                required
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>
                <span style={{ color: '#ef4444' }}>*</span> Dirección
              </label>
              <input
                type="text"
                value={deliveryForm.address}
                onChange={(e) => setDeliveryForm({ ...deliveryForm, address: e.target.value })}
                onFocus={(e) => e.target.style.borderColor = '#22c55e'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                placeholder="Ej: Calle 45 #12-34, Bogotá"
                style={inputStyle}
                required
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>
                Estado
              </label>
              <select
                value={deliveryForm.status}
                onChange={(e) => setDeliveryForm({ ...deliveryForm, status: e.target.value })}
                onFocus={(e) => e.target.style.borderColor = '#22c55e'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                style={inputStyle}
              >
                <option value="pending">Pendiente</option>
                <option value="in_transit">En tránsito</option>
                <option value="out_for_delivery">En reparto</option>
                <option value="delivered">Entregado</option>
              </select>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>
                Tiempo Estimado (minutos)
              </label>
              <input
                type="number"
                min="0"
                value={deliveryForm.estimated_time_minutes}
                onChange={(e) => setDeliveryForm({ ...deliveryForm, estimated_time_minutes: parseInt(e.target.value) || 30 })}
                onFocus={(e) => e.target.style.borderColor = '#22c55e'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                style={inputStyle}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                ...buttonStyle,
                background: loading ? '#6b7280' : '#22c55e',
                color: '#ffffff'
              }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.background = '#16a34a')}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.background = '#22c55e')}
            >
              {loading ? 'Enviando...' : 'Enviar Orden de Envío'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default MessageForm;
