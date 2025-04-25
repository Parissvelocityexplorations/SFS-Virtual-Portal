#!/bin/bash

# Stop and remove all containers, networks, volumes, and images from this project
echo "Stopping any running Docker containers..."
docker compose down

# Prune Docker system (optional - be careful in a production environment)
echo "Cleaning Docker system..."
docker system prune -f

# Verify if any processes are using port 5173
echo "Checking if port 5173 is in use..."
PORT_PROCESS=$(lsof -i :5173 | grep LISTEN)
if [ ! -z "$PORT_PROCESS" ]; then
    echo "Port 5173 is in use by:"
    echo "$PORT_PROCESS"
    echo "Attempting to kill the process..."
    PORT_PID=$(echo "$PORT_PROCESS" | awk '{print $2}')
    kill -9 $PORT_PID
    echo "Process killed."
else
    echo "Port 5173 is available."
fi

# Start Docker services
echo "Starting Docker services..."
docker compose up --build

# This script won't reach here because docker-compose up runs in the foreground