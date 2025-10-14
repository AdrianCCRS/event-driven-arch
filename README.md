# Sistema de Mensajería con RabbitMQ

Este proyecto implementa un sistema de mensajería distribuido utilizando RabbitMQ, con productores en Python, consumidores en JavaScript, un API REST para monitoreo y una interfaz web (GUI) para visualización en tiempo real.

## 📋 Tabla de Contenidos

- [Arquitectura](#arquitectura)
- [Componentes](#componentes)
- [Flujo de Mensajes](#flujo-de-mensajes)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Instalación y Ejecución](#instalación-y-ejecución)
- [Colas de RabbitMQ](#colas-de-rabbitmq)
- [Endpoints del API](#endpoints-del-api)

## 🏗️ Arquitectura

El sistema sigue una arquitectura de microservicios con los siguientes componentes:

```
┌─────────────────┐
│   RabbitMQ      │ ◄──────────────────┐
│   (Broker)      │                    │
└────────┬────────┘                    │
         │                             │
    ┌────┴─────────────────────┐      │
    │                          │      │
    ▼                          ▼      │
┌──────────┐              ┌──────────┐│
│ orders   │              │ alerts   ││
│  queue   │              │  queue   ││
└────┬─────┘              └────┬─────┘│
     │                         │      │
     ▼                         ▼      │
┌──────────┐              ┌──────────┐│
│ Kitchen  │              │Notification│
│ Service  │              │  Service  ││
│   (JS)   │              │    (JS)   ││
└──────────┘              └───────────┘│
                                       │
┌──────────────────────────────────────┘
│ Productores Python envían aquí
│
├─► orders_monitor ──► API Service
└─► alerts_monitor ──► API Service
                         │
                         ▼
                    ┌──────────┐
                    │WebSocket │
                    │   GUI    │
                    └──────────┘
```

### Principios de Diseño

1. **Separación de Responsabilidades**: 
   - Python = Productores (envían mensajes)
   - JavaScript = Consumidores (procesan mensajes)
   - API = Monitoreo (observa sin interferir)

2. **Patrón de Colas Duales**:
   - Cada tipo de mensaje tiene 2 colas:
     - Cola principal (`orders`, `alerts`) → Para procesamiento
     - Cola de monitoreo (`orders_monitor`, `alerts_monitor`) → Para la GUI

3. **Orden de Inicio**:
   ```
   RabbitMQ → Productores → API → Consumidores → GUI
   ```

## 🔧 Componentes

### 1. RabbitMQ (Broker de Mensajes)

- **Imagen**: `rabbitmq:3-management`
- **Puertos**:
  - `5672`: Puerto AMQP para conexiones
  - `15672`: Consola de administración web
- **Credenciales**: 
  - Usuario: `admin`
  - Contraseña: `admin123`

### 2. Productores Python (`py-producers`)

#### 📦 `producer/order.service.py`
Genera y envía pedidos de cafetería a la cola `orders`.

**Mensajes que envía**:
```python
{
    "order_id": "ORD-101",
    "item": "Capuchino",
    "quantity": 1,
    "user": "Laura",
    "timestamp": "2025-10-14T13:16:01Z"
}
```

**Comportamiento**:
- Envía 3 pedidos predefinidos
- Pausa de 1 segundo entre cada mensaje
- Envía a 2 colas: `orders` y `orders_monitor`
- Se ejecuta una vez y termina

#### 📦 `producer/inventory.service.py`
Monitorea inventario y envía alertas cuando el stock es bajo.

**Mensajes que envía**:
```python
{
    "type": "inventory_alert",
    "item": "Leche",
    "stock_level": 2,
    "threshold": 5,
    "timestamp": "2025-10-14T13:16:06Z"
}
```

**Comportamiento**:
- Revisa 5 items aleatorios
- Genera alerta si stock < 5
- Pausa de 2 segundos entre revisiones
- Envía a 2 colas: `alerts` y `alerts_monitor`
- Se ejecuta una vez y termina

### 3. Consumidores JavaScript (`js-consumers`)

#### ☕ `consumer/kitchen.service.js`
Procesa pedidos de la cola `orders`.

**Función**:
```javascript
[Kitchen Service] Preparando Capuchino x1 para Laura
[Kitchen Service] Preparando Latte x2 para Yeison
```

**Características**:
- Consume mensajes de la cola `orders`
- Procesa un mensaje a la vez (`prefetch: 1`)
- Confirma mensajes después de procesarlos (`ack`)
- Reconexión automática en caso de error
- Ejecución continua

#### 🔔 `consumer/notification.service.js`
Procesa alertas de inventario de la cola `alerts`.

**Función**:
```javascript
[Notification] Leche bajo en stock (2 unidades restantes)
[Notification] Azúcar bajo en stock (0 unidades restantes)
```

**Características**:
- Consume mensajes de la cola `alerts`
- Procesa un mensaje a la vez (`prefetch: 1`)
- Confirma mensajes después de procesarlos (`ack`)
- Reconexión automática en caso de error
- Ejecución continua

### 4. API Service (`api-service`)

Servicio Node.js/Express que proporciona:

#### REST API
- `GET /api/messages` - Lista todos los mensajes capturados
- `GET /api/health` - Estado del servicio
- `POST /api/messages` - Envía nuevos mensajes

#### WebSocket
- Endpoint: `ws://localhost:3001/ws`
- Envía historial al conectarse
- Transmite mensajes en tiempo real

**Monitoreo de Colas**:
```javascript
// API consume SOLO de colas de monitoreo
orders_monitor → Captura copias de pedidos
alerts_monitor → Captura copias de alertas
```

**Ventaja**: No compite con los consumidores reales por los mensajes.

### 5. GUI Web (`rabbitmq-gui`)

Interfaz React con Nginx que muestra:

- 📊 Dashboard con lista de mensajes
- 🔴/🟢 Estado de conexión WebSocket
- 📝 Formulario para enviar nuevos mensajes
- ⚡ Actualización en tiempo real vía WebSocket

**Tecnologías**:
- React + TypeScript
- WebSocket para comunicación en tiempo real
- Nginx como servidor web y proxy reverso

## 🔄 Flujo de Mensajes

### Flujo de Pedidos (Orders)

```
1. order.service.py envía mensaje
   ↓
2. Mensaje duplicado va a:
   ├─► orders queue ──► kitchen.service.js procesa
   └─► orders_monitor ──► api-service captura ──► GUI muestra
```

### Flujo de Alertas (Alerts)

```
1. inventory.service.py envía alerta
   ↓
2. Alerta duplicada va a:
   ├─► alerts queue ──► notification.service.js procesa
   └─► alerts_monitor ──► api-service captura ──► GUI muestra
```

### ¿Por qué 2 colas por tipo?

**Problema sin colas duales**:
```
Producer → queue → Consumer A
                 → Consumer B  ❌ Compiten por mensajes
```
Resultado: Cada consumer obtiene solo algunos mensajes (round-robin).

**Solución con colas duales**:
```
Producer → main_queue → Consumer (procesamiento)
        → monitor_queue → API (observación)
```
Resultado: Consumer procesa todos, API observa todos. ✅

## 📁 Estructura del Proyecto

```
rabbitmq/
├── docker-compose.yml          # Orquestación de servicios
│
├── py/                         # Servicios Python (Productores)
│   ├── Dockerfile
│   ├── requirements.txt
│   └── producer/
│       ├── order.service.py    # Genera pedidos
│       └── inventory.service.py # Genera alertas de inventario
│
├── js/                         # Servicios JavaScript (Consumidores)
│   ├── Dockerfile
│   ├── package.json
│   └── consumer/
│       ├── kitchen.service.js      # Procesa pedidos
│       └── notification.service.js # Procesa alertas
│
├── api/                        # API REST y WebSocket
│   ├── Dockerfile
│   ├── package.json
│   └── server.js              # Express + WebSocket + RabbitMQ
│
└── rabbitmq-gui/              # Interfaz Web
    ├── Dockerfile
    ├── nginx.conf             # Configuración proxy
    ├── package.json
    ├── public/
    └── src/
        ├── components/
        │   ├── Dashboard.tsx       # Componente principal
        │   ├── MessageForm.tsx     # Formulario de envío
        │   └── MessageList.tsx     # Lista de mensajes
        ├── services/
        │   └── api.ts             # Cliente HTTP
        └── utils/
            └── websocket.ts       # Cliente WebSocket
```

## 🛠️ Tecnologías Utilizadas

### Backend
- **RabbitMQ**: Message broker AMQP
- **Python 3.9**: Productores
  - `pika`: Cliente RabbitMQ
- **Node.js 20**: Consumidores y API
  - `amqplib`: Cliente RabbitMQ
  - `express`: Framework web
  - `ws`: WebSocket server

### Frontend
- **React 18**: Framework UI
- **TypeScript**: Tipado estático
- **WebSocket API**: Comunicación en tiempo real

### Infraestructura
- **Docker & Docker Compose**: Contenedorización
- **Nginx**: Servidor web y proxy reverso

## 🚀 Instalación y Ejecución

### Prerequisitos

- Docker
- Docker Compose

### Pasos

1. **Clonar el repositorio**
```bash
cd rabbitmq
```

2. **Iniciar todos los servicios**
```bash
docker compose up --build -d
```

3. **Verificar estado de los servicios**
```bash
docker compose ps
```

Deberías ver:
```
NAME            STATUS
rabbitmq        Up (healthy)
py-producers    Exited (0)      # ✓ Correcto, ejecuta una vez
api-service     Up
js-consumers    Up
rabbitmq-gui    Up
```

4. **Ver logs**
```bash
# Ver logs de todos los servicios
docker compose logs -f

# Ver logs específicos
docker compose logs py-producers
docker compose logs js-consumers
docker compose logs api-service
```

5. **Acceder a las interfaces**

- **GUI Web**: http://localhost:3000
- **RabbitMQ Management**: http://localhost:15672
  - Usuario: `admin`
  - Contraseña: `admin123`
- **API REST**: http://localhost:3001

### Detener servicios

```bash
# Detener pero mantener datos
docker compose stop

# Detener y eliminar todo (incluyendo volúmenes)
docker compose down -v

# Limpiar contenedores huérfanos
docker compose down --remove-orphans
```

## 📊 Colas de RabbitMQ

### Colas Principales

| Cola | Propósito | Consumidor | Mensajes |
|------|-----------|------------|----------|
| `orders` | Pedidos para procesar | kitchen.service.js | Orders |
| `alerts` | Alertas para notificar | notification.service.js | Alerts |

### Colas de Monitoreo

| Cola | Propósito | Consumidor | Mensajes |
|------|-----------|------------|----------|
| `orders_monitor` | Copias para GUI | api-service | Orders |
| `alerts_monitor` | Copias para GUI | api-service | Alerts |

### Verificar colas

```bash
# Listar todas las colas con contadores
docker exec rabbitmq rabbitmqctl list_queues name messages consumers

# Ver consumidores conectados
docker exec rabbitmq rabbitmqctl list_consumers
```

Salida esperada:
```
queue_name        messages  consumers
orders           0         1
alerts           0         1
orders_monitor   0         1
alerts_monitor   0         1
```

## 🌐 Endpoints del API

### GET /api/messages
Obtiene todos los mensajes capturados.

**Response:**
```json
[
  {
    "id": 1760447775786.7139,
    "queue": "orders",
    "content": "{\"order_id\": \"ORD-101\", \"item\": \"Capuchino\", ...}",
    "timestamp": "2025-10-14T13:16:15.786Z",
    "type": "received"
  }
]
```

### GET /api/health
Verifica el estado del servicio.

**Response:**
```json
{
  "status": "ok",
  "messagesCount": 5
}
```

### POST /api/messages
Envía un nuevo mensaje a RabbitMQ.

**Request (Order):**
```json
{
  "queue": "orders",
  "message": {
    "order_id": "ORD-999",
    "item": "Café Americano",
    "quantity": 2,
    "user": "Juan"
  }
}
```

**Request (Alert):**
```json
{
  "queue": "alerts",
  "message": {
    "item": "Café molido",
    "stock_level": 3
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "order_id": "ORD-999",
    "item": "Café Americano",
    "quantity": 2,
    "user": "Juan",
    "timestamp": "2025-10-14T14:30:00.000Z"
  }
}
```

## 🐛 Solución de Problemas

### Los mensajes no aparecen en la GUI

1. Verificar WebSocket:
```bash
# En el navegador (Console)
// Debería ver: "WebSocket connected successfully"
```

2. Verificar que API está capturando mensajes:
```bash
docker compose logs api-service | grep "New message"
```

3. Verificar consumidores duplicados:
```bash
docker exec rabbitmq rabbitmqctl list_consumers
# Debería haber solo 1 consumer por cola (orders, alerts)
```

### Contenedores huérfanos

Si ves contenedores antiguos (`js-service`, `py-service`):
```bash
docker compose down --remove-orphans
docker compose up -d
```

### Los consumidores no procesan mensajes

1. Verificar orden de inicio:
```bash
docker compose ps
# py-producers debe mostrar "Exited (0)"
```

2. Ver logs de consumidores:
```bash
docker compose logs js-consumers
```

### RabbitMQ no inicia

Esperar a que pase el healthcheck:
```bash
docker compose logs rabbitmq
# Buscar: "Server startup complete"
```

## 📝 Notas Importantes

1. **Los productores Python ejecutan UNA VEZ**: Es por diseño. Generan mensajes de prueba y terminan.

2. **Los consumidores JavaScript son PERSISTENTES**: Permanecen ejecutándose y procesando mensajes continuamente.

3. **El API Service NO compite con consumidores**: Solo observa desde las colas `*_monitor`.

4. **Orden de inicio es CRÍTICO**:
   - Si los consumers inician antes que los producers, algunos mensajes pueden perderse
   - Docker Compose garantiza el orden correcto con `depends_on`

5. **Cada mensaje se procesa una vez**: RabbitMQ asegura que cada mensaje en una cola sea consumido por un solo consumer (no se duplican en el mismo consumer).

## 🎯 Casos de Uso

### Enviar pedido desde la GUI

1. Abrir http://localhost:3000
2. Seleccionar "orders" en el dropdown
3. Llenar el formulario:
   - Order ID: ORD-200
   - Item: Mocha
   - Quantity: 1
   - User: María
4. Click "Send Message"
5. Observar:
   - Mensaje aparece en la lista
   - `kitchen.service.js` lo procesa (ver logs)

### Enviar alerta desde la GUI

1. Seleccionar "alerts"
2. Llenar:
   - Item: Tazas
   - Stock Level: 2
3. Click "Send Message"
4. Observar:
   - Alerta aparece en la lista
   - `notification.service.js` la procesa (ver logs)

## 📚 Recursos Adicionales

- [RabbitMQ Documentation](https://www.rabbitmq.com/documentation.html)
- [AMQP Protocol](https://www.amqp.org/)
- [Docker Compose](https://docs.docker.com/compose/)

## 👥 Arquitectura de Microservicios

Este proyecto demuestra conceptos clave:

- ✅ **Desacoplamiento**: Productores y consumidores no se conocen
- ✅ **Escalabilidad**: Fácil agregar más consumers
- ✅ **Resiliencia**: Mensajes persisten si un consumer falla
- ✅ **Observabilidad**: Monitoreo sin interferir con el procesamiento
- ✅ **Event-Driven**: Comunicación asíncrona mediante eventos

---

**Creado con ❤️ usando RabbitMQ, Python, Node.js y React**
