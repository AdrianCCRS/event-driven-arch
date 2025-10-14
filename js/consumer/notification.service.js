import amqp from "amqplib";

const RABBIT_URL = "amqp://admin:admin123@rabbitmq:5672";

const connectWithRetry = async (maxRetries = 30) => {
    for (let i = 0; i < maxRetries; i++) {
        try {
            console.log(`Attempting to connect to RabbitMQ (attempt ${i + 1}/${maxRetries})`);
            const conn = await amqp.connect(RABBIT_URL);
            
            // Handle connection errors to trigger reconnection
            conn.on('error', (err) => {
                console.error('Connection error:', err);
            });
            
            conn.on('close', () => {
                console.log('Connection closed');
            });
            
            console.log("Successfully connected to RabbitMQ!");
            return conn;
        } catch (error) {
            console.log(`Connection failed, retrying in 5 seconds...`);
            if (i === maxRetries - 1) {
                throw new Error("Failed to connect to RabbitMQ after maximum retries");
            }
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
};

const processMessage = (msg, ch) => {
    try {
        if (msg) {
            const alert = JSON.parse(msg.content.toString());
            console.log(`[Notification] ${alert.item} bajo en stock (${alert.stock_level} unidades restantes)`);
            ch.ack(msg);
        }
    } catch (error) {
        console.error('Error processing message:', error);
        // Reject message and don't requeue to avoid infinite loops
        ch.nack(msg, false, false);
    }
};

const startService = async () => {
    let conn = null;
    let ch = null;

    const setupConsumer = async () => {
        try {
            conn = await connectWithRetry();
            ch = await conn.createChannel();
            
            const queue = "alerts";
            
            await ch.assertQueue(queue, { durable: true });
            ch.prefetch(1);
            
            console.log("[Notification Service] Escuchando alertas de inventario...");
            
            ch.consume(queue, (msg) => processMessage(msg, ch));
            
            // Handle channel errors
            ch.on('error', async (err) => {
                console.error('Channel error:', err);
                await reconnect();
            });
            
        } catch (error) {
            console.error('Setup error:', error);
            await reconnect();
        }
    };

    const reconnect = async () => {
        console.log('Attempting to reconnect...');
        
        // Close existing connections gracefully
        try {
            if (ch) await ch.close();
            if (conn) await conn.close();
        } catch (closeError) {
            console.error('Error closing connections:', closeError);
        }
        
        // Wait before reconnecting
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Restart the consumer
        await setupConsumer();
    };

    await setupConsumer();
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('Received SIGINT, shutting down gracefully...');
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('Received SIGTERM, shutting down gracefully...');
    process.exit(0);
});

// Start the service
startService().catch(console.error);
