#!/bin/sh
set -e

echo "Running tests..."
deno test --allow-net --allow-env --allow-read

echo "Tests passed, starting server..."
exec deno run --allow-net --allow-env --allow-read main.ts