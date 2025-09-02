# Base stage with common dependencies
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install

# Development stage
FROM base AS development
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]

# Builder stage for staging/production
FROM base AS builder
COPY . .
RUN npm run build

# Staging stage
FROM base AS staging
COPY --from=builder /app/dist ./dist
ENV PORT=80
EXPOSE 80
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "80"]

# Production stage
FROM base AS production
COPY --from=builder /app/dist ./dist
ENV PORT=80
EXPOSE 80
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "80"]