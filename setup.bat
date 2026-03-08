@echo off
REM Quick Start Script for Messaging App (Windows)
REM This script helps you set up and run the application quickly

echo Starting Messaging App Setup...
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Node.js is not installed. Please install it from https://nodejs.org
    exit /b 1
)

echo Node.js is installed
echo.

REM Backend Setup
echo Setting up Backend...
cd backend

REM Check if .env exists
if not exist .env (
    echo Creating .env from .env.example...
    copy .env.example .env
    echo Please edit backend\.env and update MONGODB_URI
    exit /b 1
)

REM Install dependencies
if not exist node_modules (
    echo Installing backend dependencies...
    call npm install
) else (
    echo Backend dependencies already installed
)

echo.

REM Frontend Setup
echo Setting up Frontend...
cd ..\frontend

REM Install dependencies
if not exist node_modules (
    echo Installing frontend dependencies...
    call npm install
) else (
    echo Frontend dependencies already installed
)

echo.
echo Setup complete!
echo.
echo To start the application:
echo.
echo Terminal 1 (Backend):
echo   cd backend && npm run dev
echo.
echo Terminal 2 (Frontend):
echo   cd frontend && npm run dev
echo.
echo Then open your browser to: http://localhost:3000
echo.
echo Requirements:
echo   - MongoDB connection string in backend\.env
echo   - Both backend and frontend running
echo.
pause
