#!/bin/bash

echo "🚀 Starting PlantBot Development Environment..."

# Build and start development environment
docker-compose -f docker-compose.dev.yml up --build

echo "✅ Development environment started!"
echo "🌐 App available at: http://localhost:5173"
echo "🧪 Cypress tests can run against: http://localhost:5173"
