#!/bin/bash

# Stop and remove all containers
docker compose down

# Remove the volume to start fresh
docker volume rm sfs-virtual-portal_postgres-data || true

# Start Docker Compose with Postgres only
docker compose up -d postgres

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to start..."
sleep 10

# Start all services
echo "Starting all services..."
docker compose up