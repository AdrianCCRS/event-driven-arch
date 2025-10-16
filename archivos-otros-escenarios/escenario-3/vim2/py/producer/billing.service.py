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
queue = 'billing'
channel.queue_declare(queue=queue, durable=True)

# Sample billing data
customers = ["Laura", "Yeison", "Santiago", "María", "Carlos"]
items = ["Capuchino", "Latte", "Espresso doble", "Mocha", "Americano"]

print("[Billing Service] Generating invoices...")
for i in range(4):
    invoice_id = f"INV-{1001 + i}"
    customer = random.choice(customers)
    item = random.choice(items)
    quantity = random.randint(1, 3)
    unit_price = random.uniform(2.5, 5.5)
    total = round(quantity * unit_price, 2)
    
    billing = {
        "invoice_id": invoice_id,
        "customer": customer,
        "item": item,
        "quantity": quantity,
        "unit_price": round(unit_price, 2),
        "total": total,
        "status": "pending",
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ")
    }
    msg = json.dumps(billing)
    
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
    
    print(f"[Billing Service] Factura generada: {invoice_id} - {customer} - ${total}")
    time.sleep(1.5)  # Small delay between messages

print("[Billing Service] All invoices sent!")
connection.close()
