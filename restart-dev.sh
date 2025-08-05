#!/bin/bash
echo "🔄 Clearing Vite cache..."
rm -rf node_modules/.vite

echo "🛑 Stopping any existing dev servers..."
pkill -f "vite.*dev" 2>/dev/null || true

echo "🚀 Starting fresh dev server..."
npm run dev
