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

export interface BillingMessage {
  invoice_id: string;
  customer: string;
  item: string;
  quantity: number;
  unit_price: number;
  total: number;
  status: string;
  timestamp?: string;
}

export interface DeliveryMessage {
  delivery_id: string;
  order_id: string;
  customer: string;
  address: string;
  status: string;
  estimated_time_minutes: number;
  timestamp?: string;
}
