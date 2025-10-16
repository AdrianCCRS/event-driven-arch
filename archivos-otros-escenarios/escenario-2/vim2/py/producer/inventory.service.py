import pika, json, time, random
import sys

# Wait for RabbitMQ to be ready with retry logic
max_retries = 30
retry_count = 0

while retry_count < max_retries:
    try:
        print(f"Attempting to connect to RabbitMQ (attempt {retry_count + 1}/{max_retries})")
        connection = pika.BlockingConnection(pika.ConnectionParameters(
            host='10.0.0.9',
            port=5672,
            credentials=pika.PlainCredentials('admin', 'admin123')
        ))
        print("Successfully connected to RabbitMQ!")
        break
    except pika.exceptions.AMQPConnectionError:
        retry_count += 1
        if retry_count >= max_retries:
            print("Failed to connect to RabbitMQ after maximum retries")
            sys.exit(1)
        print(f"Connection failed, retrying in 5 seconds...")
        time.sleep(5)
channel = connection.channel()

# Declare queue directly (simple approach, no exchange)
queue = 'alerts'
channel.queue_declare(queue=queue, durable=True)

items = ["Leche", "Café molido", "Azúcar", "Tazas"]

print("[Inventory Service] Checking inventory...")
for i in range(5):
    item = random.choice(items)
    stock = random.randint(0, 10)
    if stock < 5:
        alert = {
            "type": "inventory_alert",
            "item": item,
            "stock_level": stock,
            "threshold": 5,
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ")
        }
        msg = json.dumps(alert)
        
        # Send to main queue for consumers
        channel.basic_publish(
            exchange='',
            routing_key=queue,
            body=msg,
            properties=pika.BasicProperties(
                delivery_mode=2,  # make message persistent
            )
        )
        
        # Also send to monitor queue for API
        monitor_queue = f"{queue}_monitor"
        channel.queue_declare(queue=monitor_queue, durable=True)
        channel.basic_publish(
            exchange='',
            routing_key=monitor_queue,
            body=msg,
            properties=pika.BasicProperties(
                delivery_mode=2,
            )
        )
        
        print(f"[Inventory Service] Stock bajo: {item} ({stock} unidades)")
    time.sleep(2)

print("[Inventory Service] Inventory check completed!")
connection.close()
