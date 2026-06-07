#!/bin/sh
set -e

echo "▶ Running migrations + seed..."
npm run setup

echo "▶ Starting server..."
exec npm run dev
