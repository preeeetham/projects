#!/bin/sh
set -e

# Wait for Postgres to be ready
until npx prisma db execute --stdin <<< "SELECT 1" 2>/dev/null; do
  echo "Waiting for PostgreSQL..."
  sleep 2
done

echo "Running migrations..."
npx prisma migrate deploy

echo "Starting server..."
exec node dist/index.js
