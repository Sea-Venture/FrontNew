#!/bin/sh
set -eu

cd /app || { echo "Failed to change directory to /app"; exit 1; }

if [ ! -f package.json ]; then
  echo "package.json not found in /app"
  exit 1
fi


if [ ! -d node_modules ] || [ -z "$(ls -A node_modules 2>/dev/null)" ]; then
  echo "Installing npm dependencies..."
  if [ -f package-lock.json ]; then
    npm ci --no-audit --no-fund
  else
    npm install --no-audit --no-fund
  fi
fi

: "${PORT:=3000}"
export PORT


: "${CHOKIDAR_USEPOLLING:=true}"
export CHOKIDAR_USEPOLLING


if [ "$#" -gt 0 ]; then
  exec "$@"
else
  exec npm run dev -- --host 0.0.0.0
fi