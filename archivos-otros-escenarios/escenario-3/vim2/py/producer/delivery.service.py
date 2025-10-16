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
queue = 'delivery'
channel.queue_declare(queue=queue, durable=True)

# Sample delivery data
addresses = [
    "Calle 45 #12-34, Bogotá",
    "Carrera 7 #85-20, Medellín",
    "Avenida 68 #45-67, Cali",
    "Calle 100 #9-50, Barranquilla"
]
customers = ["Laura", "Yeison", "Santiago", "María", "Carlos"]
statuses = ["pending", "in_transit", "out_for_delivery"]

print("[Delivery Service] Creating delivery orders...")
for i in range(4):
    delivery_id = f"DEL-{2001 + i}"
    order_id = f"ORD-{101 + i}"
    customer = random.choice(customers)
    address = random.choice(addresses)
    status = random.choice(statuses)
    estimated_time = random.randint(30, 120)
    
    delivery = {
        "delivery_id": delivery_id,
        "order_id": order_id,
        "customer": customer,
        "address": address,
        "status": status,
        "estimated_time_minutes": estimated_time,
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ")
    }
    msg = json.dumps(delivery)
    
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
    
    print(f"[Delivery Service] Envío creado: {delivery_id} - {customer} - {status} ({estimated_time} min)")
    time.sleep(1.5)  # Small delay between messages

print("[Delivery Service] All delivery orders sent!")
connection.close()
