import React, { useState } from 'react';
import { OrderMessage, AlertMessage } from '../types/message';

interface MessageFormProps {
  onSendMessage: (queue: string, message: any) => void;
  loading?: boolean;
}

const MessageForm: React.FC<MessageFormProps> = ({ onSendMessage, loading = false }) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'alerts'>('orders');
  
  // Order form state
  const [orderForm, setOrderForm] = useState<OrderMessage>({
    order_id: '',
    item: '',
    quantity: 1,
    user: ''
  });

  // Alert form state
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
      alert('Please fill all required fields');
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
      alert('Please fill all required fields');
    }
  };

  const tabStyle = (isActive: boolean) => ({
    padding: '10px 20px',
    backgroundColor: isActive ? '#007bff' : '#e9ecef',
    color: isActive ? 'white' : '#495057',
    border: 'none',
    cursor: 'pointer',
    marginRight: '5px',
    borderRadius: '4px 4px 0 0',
    fontWeight: 'bold'
  });

  const inputStyle = {
    width: '100%',
    padding: '8px',
    marginBottom: '15px',
    borderRadius: '4px',
    border: '1px solid #ced4da',
    fontSize: '14px'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#495057'
  };

  return (
    <div style={{ 
      backgroundColor: '#f8f9fa', 
      padding: '20px', 
      borderRadius: '8px', 
      marginBottom: '20px',
      border: '1px solid #dee2e6'
    }}>
      <h2 style={{ marginTop: 0, color: '#495057' }}>Send New Message</h2>
      
      {/* Tab buttons */}
      <div style={{ marginBottom: '20px', borderBottom: '1px solid #dee2e6' }}>
        <button 
          style={tabStyle(activeTab === 'orders')}
          onClick={() => setActiveTab('orders')}
          disabled={loading}
        >
          📦 Create Order
        </button>
        <button 
          style={tabStyle(activeTab === 'alerts')}
          onClick={() => setActiveTab('alerts')}
          disabled={loading}
        >
          ⚠️ Send Alert
        </button>
      </div>

      {/* Orders Form */}
      {activeTab === 'orders' && (
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '0 8px 8px 8px' }}>
          <form onSubmit={handleOrderSubmit}>
            <h3 style={{ marginTop: 0, color: '#007bff' }}>New Coffee Order</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={labelStyle}>Order ID *:</label>
                <input
                  type="text"
                  value={orderForm.order_id}
                  onChange={(e) => setOrderForm({...orderForm, order_id: e.target.value})}
                  placeholder="ORD-104"
                  style={inputStyle}
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label style={labelStyle}>Customer *:</label>
                <input
                  type="text"
                  value={orderForm.user}
                  onChange={(e) => setOrderForm({...orderForm, user: e.target.value})}
                  placeholder="Customer name"
                  style={inputStyle}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px' }}>
              <div>
                <label style={labelStyle}>Coffee Item *:</label>
                <select
                  value={orderForm.item}
                  onChange={(e) => setOrderForm({...orderForm, item: e.target.value})}
                  style={inputStyle}
                  required
                  disabled={loading}
                >
                  <option value="">Select a coffee</option>
                  <option value="Capuchino">☕ Capuchino</option>
                  <option value="Latte">🥛 Latte</option>
                  <option value="Espresso doble">💪 Espresso doble</option>
                  <option value="Americano">🇺🇸 Americano</option>
                  <option value="Mocha">🍫 Mocha</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Quantity *:</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={orderForm.quantity}
                  onChange={(e) => setOrderForm({...orderForm, quantity: parseInt(e.target.value) || 1})}
                  style={inputStyle}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              style={{ 
                backgroundColor: loading ? '#6c757d' : '#28a745', 
                color: 'white', 
                padding: '12px 24px', 
                border: 'none', 
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              {loading ? 'Sending...' : '📦 Send Order'}
            </button>
          </form>
        </div>
      )}

      {/* Alerts Form */}
      {activeTab === 'alerts' && (
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '0 8px 8px 8px' }}>
          <form onSubmit={handleAlertSubmit}>
            <h3 style={{ marginTop: 0, color: '#dc3545' }}>New Inventory Alert</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={labelStyle}>Alert Type:</label>
                <select
                  value={alertForm.type}
                  onChange={(e) => setAlertForm({...alertForm, type: e.target.value})}
                  style={inputStyle}
                  disabled={loading}
                >
                  <option value="inventory_alert">📊 Inventory Alert</option>
                  <option value="low_stock">📉 Low Stock</option>
                  <option value="out_of_stock">❌ Out of Stock</option>
                  <option value="critical_stock">🚨 Critical Stock</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Item *:</label>
                <select
                  value={alertForm.item}
                  onChange={(e) => setAlertForm({...alertForm, item: e.target.value})}
                  style={inputStyle}
                  required
                  disabled={loading}
                >
                  <option value="">Select an item</option>
                  <option value="Leche">🥛 Leche</option>
                  <option value="Café molido">☕ Café molido</option>
                  <option value="Azúcar">🍯 Azúcar</option>
                  <option value="Tazas">☕ Tazas</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={labelStyle}>Current Stock Level *:</label>
                <input
                  type="number"
                  min="0"
                  max="1000"
                  value={alertForm.stock_level}
                  onChange={(e) => setAlertForm({...alertForm, stock_level: parseInt(e.target.value) || 0})}
                  style={inputStyle}
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label style={labelStyle}>Alert Threshold:</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={alertForm.threshold}
                  onChange={(e) => setAlertForm({...alertForm, threshold: parseInt(e.target.value) || 5})}
                  style={inputStyle}
                  disabled={loading}
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              style={{ 
                backgroundColor: loading ? '#6c757d' : '#dc3545', 
                color: 'white', 
                padding: '12px 24px', 
                border: 'none', 
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              {loading ? 'Sending...' : '⚠️ Send Alert'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default MessageForm;