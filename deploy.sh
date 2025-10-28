#!/bin/bash

# Build the Docker image
docker build -t ecommerce-store .

# Run the container
docker run -d -p 3000:3000 --name ecommerce-container ecommerce-store

echo "Ecommerce store deployed and running on http://localhost:3000"
