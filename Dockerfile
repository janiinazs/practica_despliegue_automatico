# Dockerfile
FROM node:lts

# Crear directorio de la aplicación
WORKDIR /usr/src/app

# Copiar archivos al contenedor
COPY package*.json ./
RUN npm config set strict-ssl false
COPY index.js .

# Instalar dependencias
RUN rm -f package-lock.json
RUN npm install

# Copiar el resto de los archivos
COPY cakes.json .
COPY index.html .       

# Exponer el puerto de la aplicación
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["node", "index.js"]

#PRUEBA DE COMMIT
