# Imagen base ligera
FROM node:20-alpine

# Directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias dentro del contenedor
RUN npm install --production

# Copiar el resto del código
COPY . .

# Crear usuario no root
RUN addgroup -S nodejs && adduser -S nodejs -G nodejs
USER nodejs

# Iniciar ambos servicios en paralelo
CMD ["sh", "-c", "node producer/order.service.js & node consumer/notification.service.js"]
