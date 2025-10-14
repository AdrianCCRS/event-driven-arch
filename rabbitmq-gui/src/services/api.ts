import { Message } from '../types/message';

// Use relative URL to go through nginx proxy instead of direct port access
const API_BASE_URL = '/api';

export const fetchMessages = async (): Promise<Message[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/messages`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
};

export const fetchSentMessages = async (): Promise<Message[]> => {
  const messages = await fetchMessages();
  return messages.filter(msg => msg.type === 'sent');
};

export const fetchReceivedMessages = async (): Promise<Message[]> => {
  const messages = await fetchMessages();
  return messages.filter(msg => msg.type === 'received');
};

export const sendMessage = async (queue: string, message: any): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ queue, message }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};