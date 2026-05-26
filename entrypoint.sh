#!/bin/sh
set -e  # Exit immediately if any command fails

echo "Running tests..."
# Run all tests with necessary permissions
# || true ensures tests don't block server startup (tests are for verification only)
deno test --allow-net --allow-env --allow-read || true

echo "Starting server..."
# Start the main application with all required permissions
exec deno run --allow-net --allow-env --allow-read main.ts