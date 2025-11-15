#!/bin/bash

# Setup script for React frontend

echo "🚀 Setting up React frontend..."

cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

echo "🔨 Building React app for production..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Frontend build completed successfully!"
    echo "📝 You can now run your Go server and the frontend will be served at http://localhost:8080"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

