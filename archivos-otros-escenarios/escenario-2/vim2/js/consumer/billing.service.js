import amqp from "amqplib";

const RABBIT_URL = "amqp://admin:admin123@10.0.0.9:5672";

const connectWithRetry = async (maxRetries = 30) => {
    for (let i = 0; i < maxRetries; i++) {
        try {
            console.log(`Attempting to connect to RabbitMQ (attempt ${i + 1}/${maxRetries})`);
            const conn = await amqp.connect(RABBIT_URL);
            
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
            const billing = JSON.parse(msg.content.toString());
            console.log(`[Billing Service] Procesando factura ${billing.invoice_id} - Cliente: ${billing.customer} - Total: $${billing.total}`);
            ch.ack(msg);
        }
    } catch (error) {
        console.error('Error processing message:', error);
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
            
            const queue = "billing";
            
            await ch.assertQueue(queue, { durable: true });
            ch.prefetch(1);
            
            console.log("[Billing Service] Esperando facturas...");
            
            ch.consume(queue, (msg) => processMessage(msg, ch));
            
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
        
        try {
            if (ch) await ch.close();
            if (conn) await conn.close();
        } catch (closeError) {
            console.error('Error closing connections:', closeError);
        }
        
        await new Promise(resolve => setTimeout(resolve, 5000));
        await setupConsumer();
    };

    await setupConsumer();
};

// Start the service
startService().catch(console.error);

// Keep process alive
process.on('SIGINT', async () => {
    console.log('\nShutting down gracefully...');
    process.exit(0);
});
