#!/bin/bash

# Build the Docker image
echo "Building the Docker image..."
docker-compose up --build -d

# Check if the Docker container is running
if [ $? -eq 0 ]; then
  echo "Docker container is running!"
else
  echo "Failed to start the Docker container."
fi
