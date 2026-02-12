FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

# Copy source and build
COPY frontend/ .

# Nginx proxies /api and /uploads to backend, so use relative paths
ARG VITE_API_BASE_URL=/api/v1
ARG VITE_UPLOADS_URL=/uploads
ARG VITE_API_TIMEOUT=30000
ARG VITE_APP_NAME="Harish Kumar Portfolio"
ARG VITE_APP_TITLE="Game Developer & 3D Artist"

RUN npm run build

# Production stage - serve with Nginx
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
