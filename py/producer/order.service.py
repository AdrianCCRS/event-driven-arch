import pika, json, time
import sys

# Wait for RabbitMQ to be ready with retry logic
max_retries = 30
retry_count = 0

while retry_count < max_retries:
    try:
        print(f"Attempting to connect to RabbitMQ (attempt {retry_count + 1}/{max_retries})")
        connection = pika.BlockingConnection(pika.ConnectionParameters(
            host='rabbitmq',
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
queue = 'orders'
channel.queue_declare(queue=queue, durable=True)

orders = [
    {"order_id": "ORD-101", "item": "Capuchino", "quantity": 1, "user": "Laura"},
    {"order_id": "ORD-102", "item": "Latte", "quantity": 2, "user": "Yeison"},
    {"order_id": "ORD-103", "item": "Espresso doble", "quantity": 1, "user": "Santiago"}
]

print("[Order Service] Sending orders...")
for order in orders:
    order['timestamp'] = time.strftime("%Y-%m-%dT%H:%M:%SZ")
    msg = json.dumps(order)
    
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
    
    print(f"[Order Service] Pedido enviado: {order['order_id']} ({order['item']})")
    time.sleep(1)  # Small delay between messages

print("[Order Service] All orders sent!")
connection.close()
