#!/usr/bin/env bash
# Exit on any error
set -e

echo "Starting AlphaCloud build process..."

# Install production dependencies only (omit dev dependencies like husky)
echo "Installing production dependencies..."
pnpm install --prod --prefer-offline

# Build the application
echo "Building application for production..."
pnpm run build

echo "Build completed successfully!"
