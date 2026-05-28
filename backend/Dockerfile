# 1. Node.js environment setup
FROM node:20-alpine

# 2. Server directory setup
WORKDIR /app

# 3. Dependencies copy aur install
COPY package*.json ./
RUN npm install --production

# 4. Baaki ka code copy karna
COPY . .

# 5. Port expose karna (jisport par server.js chal raha hai, e.g., 5000)
EXPOSE 5000

# 6. App start command
CMD ["node", "server.js"]