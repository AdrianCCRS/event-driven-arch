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
    <div style={{ 
      maxHeight: '600px', 
      overflowY: 'auto',
      border: '1px solid #ddd',
      borderRadius: '5px',
      padding: '10px'
    }}>
      {sortedMessages.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666' }}>
          No messages yet. Waiting for RabbitMQ messages...
        </p>
      ) : (
        sortedMessages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))
      )}
    </div>
  );
};

export default MessageList;