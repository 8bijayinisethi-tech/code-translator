# Stage 1 — Build React app
FROM node:22-slim AS builder

WORKDIR /app

# Copy package files first (caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

COPY .env .env

# Copy source code
COPY . .

# Build for production
RUN npm run build

# Stage 2 — Serve with nginx
FROM nginx:alpine

# Copy built files to nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]