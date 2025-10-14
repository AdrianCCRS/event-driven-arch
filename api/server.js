const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const amqp = require('amqplib');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server, path: '/ws' });

app.use(cors());
app.use(express.json());

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://admin:admin123@rabbitmq:5672';

let messages = [];
let rabbitChannel = null;

const connectToRabbitMQ = async (retries = 30) => {
    for (let i = 0; i < retries; i++) {
        try {
            console.log(`Attempting to connect to RabbitMQ (attempt ${i + 1}/${retries})...`);
            const connection = await amqp.connect(RABBITMQ_URL);
            const channel = await connection.createChannel();
            
            rabbitChannel = channel;
            
            const queues = ['orders', 'alerts'];
            
            for (const queueName of queues) {
                //await channel.assertQueue(queueName, { durable: true });
                
                const monitorQueue = `${queueName}_monitor`;
                await channel.assertQueue(monitorQueue, { durable: true });
                
                console.log(`Monitoring queue: ${queueName}`);
                
                channel.consume(monitorQueue, (msg) => {
                    if (msg) {
                        const message = {
                            id: Date.now() + Math.random(),
                            queue: queueName,
                            content: msg.content.toString(),
                            timestamp: new Date().toISOString(),
                            type: 'received'
                        };
                        
                        messages.push(message);
                        console.log(`New message in ${queueName}:`, message.content);
                        
                        if (messages.length > 100) {
                            messages = messages.slice(-100);
                        }
                        
                        wss.clients.forEach(client => {
                            if (client.readyState === WebSocket.OPEN) {
                                client.send(JSON.stringify(message));
                            }
                        });
                        
                        channel.ack(msg);
                    }
                });
            }
            
            console.log('Connected to RabbitMQ and monitoring all queues');
            return;
            
        } catch (error) {
            console.error(`Failed to connect to RabbitMQ (attempt ${i + 1}/${retries}):`, error.message);
            if (i === retries - 1) {
                console.error('Failed to connect to RabbitMQ after maximum retries');
                throw error;
            }
            console.log('Retrying in 5 seconds...');
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
};

wss.on('connection', (ws) => {
    console.log('Client connected via WebSocket');
    ws.send(JSON.stringify({ type: 'history', messages }));
    
    ws.on('close', () => {
        console.log('Client disconnected');
    });
    
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

app.get('/api/messages', (req, res) => {
    res.json(messages);
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', messagesCount: messages.length });
});

app.post('/api/messages', async (req, res) => {
    try {
        const { queue, message } = req.body;
        
        if (!queue || !message) {
            return res.status(400).json({ error: 'Queue and message are required' });
        }
        
        if (!['orders', 'alerts'].includes(queue)) {
            return res.status(400).json({ error: 'Invalid queue' });
        }
        
        if (!rabbitChannel) {
            return res.status(503).json({ error: 'RabbitMQ not connected' });
        }
        
        let messagePayload;
        
        if (queue === 'orders') {
            if (!message.order_id || !message.item || !message.user || !message.quantity) {
                return res.status(400).json({ error: 'Order must include order_id, item, user, and quantity' });
            }
            
            messagePayload = {
                order_id: message.order_id,
                item: message.item,
                quantity: message.quantity,
                user: message.user,
                timestamp: message.timestamp || new Date().toISOString()
            };
        } else if (queue === 'alerts') {
            if (!message.item || message.stock_level === undefined) {
                return res.status(400).json({ error: 'Alert must include item and stock_level' });
            }
            
            messagePayload = {
                type: message.type || 'inventory_alert',
                item: message.item,
                stock_level: message.stock_level,
                threshold: message.threshold || 5,
                timestamp: message.timestamp || new Date().toISOString()
            };
        }
        
        await rabbitChannel.assertQueue(queue, { durable: true });
        
        const messageBuffer = Buffer.from(JSON.stringify(messagePayload));
        rabbitChannel.sendToQueue(queue, messageBuffer, { persistent: true });
        
        const monitorQueue = `${queue}_monitor`;
        await rabbitChannel.assertQueue(monitorQueue, { durable: true });
        rabbitChannel.sendToQueue(monitorQueue, messageBuffer, { persistent: true });
        
        console.log(`[API] Message sent to ${queue}:`, messagePayload);
        
        const uiMessage = {
            id: Date.now() + Math.random(),
            queue: queue,
            content: JSON.stringify(messagePayload),
            timestamp: new Date().toISOString(),
            type: 'sent'
        };
        
        messages.push(uiMessage);
        
        if (messages.length > 100) {
            messages = messages.slice(-100);
        }
        
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(uiMessage));
            }
        });
        
        res.status(201).json({ success: true, message: 'Message sent successfully', data: messagePayload });
        
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Failed to send message', details: error.message });
    }
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
    console.log(`WebSocket endpoint: ws://localhost:${PORT}/ws`);
    connectToRabbitMQ();
});
