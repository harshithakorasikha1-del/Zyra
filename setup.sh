#!/bin/bash

# Quick Start Script for Messaging App
# This script helps you set up and run the application quickly

echo "🚀 Starting Messaging App Setup..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install it from https://nodejs.org"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Backend Setup
echo "📦 Setting up Backend..."
cd backend

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  Creating .env from .env.example..."
    cp .env.example .env
    echo "⚠️  Please edit backend/.env and update MONGODB_URI"
    exit 1
fi

# Install dependencies
if [ ! -d "node_modules" ]; then
    echo "📥 Installing backend dependencies..."
    npm install
else
    echo "✅ Backend dependencies already installed"
fi

echo ""

# Frontend Setup
echo "📦 Setting up Frontend..."
cd ../frontend

# Install dependencies
if [ ! -d "node_modules" ]; then
    echo "📥 Installing frontend dependencies..."
    npm install
else
    echo "✅ Frontend dependencies already installed"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the application:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd backend && npm run dev"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd frontend && npm run dev"
echo ""
echo "Then open your browser to: http://localhost:3000"
echo ""
echo "Requirements:"
echo "  - MongoDB connection string in backend/.env"
echo "  - Both backend and frontend running"
echo ""
