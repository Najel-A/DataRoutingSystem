#!/bin/bash

echo "### Starting User Data Routing System..."
echo "========================================"

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "### Port $1 is already in use"
        return 1
    else
        echo "### Port $1 is available"
        return 0
    fi
}

# Check if required ports are available
echo "### Checking port availability..."
check_port 3001 || exit 1
check_port 8000 || exit 1
check_port 3000 || exit 1

echo ""
echo "### Installing dependencies..."

# Install backend dependencies
echo "### Installing Node.js backend dependencies..."
cd backend
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "### Backend dependencies already installed"
fi
cd ..

# Install Python microservice dependencies
echo "### Installing Python microservice dependencies..."
cd microservice
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi
source venv/bin/activate
pip install -r requirements.txt
cd ..

# Install frontend dependencies
echo "### Installing React frontend dependencies..."
cd frontend
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "### Frontend dependencies already installed"
fi
cd ..

echo ""
echo "### Starting services..."

# Start Python microservice in background
echo "### Starting Python FastAPI microservice on port 8000..."
cd microservice
source venv/bin/activate
python server.py &
MICROSERVICE_PID=$!
cd ..

# Wait a moment for microservice to start
sleep 3

# Start Node.js backend in background
echo "### Starting Node.js backend on port 3001..."
cd backend
npm start &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start React frontend in background
echo "### Starting React frontend on port 3000..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "### All services started successfully!"
echo ""
echo "### Services running on:"
echo "   Frontend:    http://localhost:3000"
echo "   Backend:     http://localhost:3001"
echo "   Microservice: http://localhost:8000"
echo ""
echo "### Dashboard: http://localhost:3000"
echo "### API Docs:  http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all services"

# Function to cleanup background processes
cleanup() {
    echo ""
    echo "### Stopping all services..."
    kill $MICROSERVICE_PID 2>/dev/null
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "### All services stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for all background processes
wait
