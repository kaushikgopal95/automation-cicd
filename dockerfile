# ----------------------------------- Base Stage ----------------------------------
FROM node:18-alpine as base

# Set working directory
WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./

# Set default PORT for Azure App Service
ENV PORT=8080

# ----------------------------------- Dependencies Stage ----------------------------------
FROM base as dependencies

# Install all dependencies (including dev dependencies for building)
RUN npm install --only=production && npm cache clean --force

# ----------------------------------- Development Stage ----------------------------------
FROM base as development

# Install all dependencies (including dev dependencies for development)
RUN npm install && npm cache clean --force

# Copy source code
COPY . .

# Expose port for Azure App Service
EXPOSE 8080

# Start development server with hot reload
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "8080"]

# ----------------------------------- Build Stage ----------------------------------
FROM base as builder

# Install all dependencies (including dev dependencies for building)
RUN npm install && npm cache clean --force

# Copy source code
COPY . .

# Build the app
RUN npm run build

# ----------------------------------- Staging Stage ----------------------------------
FROM base as staging

# Install all dependencies (including vite for preview)
RUN npm install && npm cache clean --force

# Copy built app from builder stage
COPY --from=builder /app/dist ./dist

# Copy package.json for npm commands
COPY package*.json ./

# Expose port for Azure App Service
EXPOSE 8080

# Serve the built files
CMD ["npm", "run", "preview", "--host", "0.0.0.0", "--port", "8080"]

# ----------------------------------- Production Stage ----------------------------------
FROM base as production

# Install all dependencies (including vite for preview)
RUN npm install && npm cache clean --force

# Copy built app from builder stage
COPY --from=builder /app/dist ./dist

# Copy package.json for npm commands
COPY package*.json ./

# Expose port for Azure App Service
EXPOSE 8080

# Serve the built files
CMD ["npm", "run", "preview", "--host", "0.0.0.0", "--port", "8080"]