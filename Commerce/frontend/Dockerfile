FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY index.html tsconfig*.json vite.config.ts ./
COPY src ./src
RUN npm run build

CMD ["cp", "-r", "/app/dist/.", "/dist/"]
