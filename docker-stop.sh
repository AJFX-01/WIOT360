#!/bin/bash

# Stop the Docker container
echo "Stopping the Docker container..."
docker-compose down

# Check if the container was stopped successfully
if [ $? -eq 0 ]; then
  echo "Docker container stopped."
else
  echo "Failed to stop the Docker container."
fi
