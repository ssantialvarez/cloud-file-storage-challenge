# Usa una imagen base de Node.js
FROM node:20-alpine

# Instalar dependencias necesarias para compilar
RUN apk add --no-cache make gcc g++ python3

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia el archivo package.json y package-lock.json (si existe) al contenedor
COPY package*.json ./

# Instala las dependencias de Node.js
RUN npm install

# Copia todo el código fuente de tu aplicación al contenedor
COPY . .

# Compila el código TypeScript a JavaScript
RUN npm run build

# Expone el puerto en el que tu aplicación escuchará
EXPOSE 3000

# Define el comando que se ejecutará cuando se inicie el contenedor
CMD ["npm", "start"]