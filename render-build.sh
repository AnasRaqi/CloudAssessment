#!/usr/bin/env bash
# Exit on any error
set -e

echo "Starting AlphaCloud build process..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the application
echo "Building application for production..."
npm run build

echo "Build completed successfully!"
