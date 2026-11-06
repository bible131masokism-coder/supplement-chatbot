# Chatbot backend image (for Render / Docker)
FROM node:20-slim
WORKDIR /app

# ติดตั้ง dependencies ก่อนคัดลอกโค้ด (ใช้ cache ช่วย)
COPY package*.json ./
RUN npm install --omit=dev

# คัดลอกโค้ด source
COPY . .

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "server.js"]
