export interface Message {
  id: string | number;
  content: string;
  timestamp: string | Date;
  type: 'sent' | 'received';
  queue?: string;
}

export interface OrderMessage {
  order_id: string;
  item: string;
  quantity: number;
  user: string;
  timestamp?: string;
}

export interface AlertMessage {
  type: string;
  item: string;
  stock_level: number;
  threshold: number;
  timestamp: string;
}