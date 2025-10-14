import React from 'react';
import { Message } from '../types/message';

interface MessageItemProps {
  message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const formatTimestamp = (timestamp: string | Date) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const parseMessageContent = (content: string) => {
    try {
      const parsed = JSON.parse(content);
      
      // Format orders
      if (parsed.order_id) {
        return `Order ID: ${parsed.order_id}
Customer: ${parsed.user}
Item: ${parsed.item}
Quantity: ${parsed.quantity}
Timestamp: ${parsed.timestamp}`;
      }
      
      // Format alerts
      if (parsed.type && parsed.stock_level !== undefined) {
        return `Alert Type: ${parsed.type}
Item: ${parsed.item}
Stock Level: ${parsed.stock_level}
Threshold: ${parsed.threshold}
Timestamp: ${parsed.timestamp}`;
      }
      
      return JSON.stringify(parsed, null, 2);
    } catch {
      return content;
    }
  };

  return (
    <div style={{
      margin: '10px 0',
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      backgroundColor: message.type === 'sent' ? '#e3f2fd' : '#f3e5f5'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
        <strong style={{ color: message.type === 'sent' ? '#1976d2' : '#7b1fa2' }}>
          {message.queue ? `Queue: ${message.queue}` : message.type.toUpperCase()}
        </strong>
        <span style={{ fontSize: '12px', color: '#666' }}>
          {formatTimestamp(message.timestamp)}
        </span>
      </div>
      <pre style={{
        margin: 0,
        fontSize: '14px',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        backgroundColor: '#f5f5f5',
        padding: '5px',
        borderRadius: '3px'
      }}>
        {parseMessageContent(message.content)}
      </pre>
    </div>
  );
};

export default MessageItem;