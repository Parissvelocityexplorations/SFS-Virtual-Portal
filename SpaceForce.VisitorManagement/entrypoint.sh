#!/bin/bash

# Wait for Postgres
echo "Waiting for PostgreSQL..."
sleep 10

# Start the application
echo "Starting application..."
dotnet SpaceForce.VisitorManagement.Api.dll