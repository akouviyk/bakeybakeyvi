#!/bin/bash

echo "🍰 Bakey Bakey VI - Setup Script"
echo "================================"
echo ""

# Check if node is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js first:"
    echo "   https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo "✅ npm found: $(npm --version)"
echo ""

# Navigate to project directory
cd "$(dirname "$0")"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
else
    echo "✅ Dependencies already installed"
    echo ""
fi

# Check if Firebase is configured
if grep -q "YOUR_API_KEY" src/firebase.js; then
    echo "⚠️  Firebase not configured yet!"
    echo ""
    echo "Please follow these steps:"
    echo "1. Read FIREBASE_SETUP.md for detailed instructions"
    echo "2. Update src/firebase.js with your Firebase credentials"
    echo "3. Run this script again"
    echo ""
    echo "Quick start:"
    echo "  1. Go to https://console.firebase.google.com/"
    echo "  2. Create a new project"
    echo "  3. Enable Firestore Database"
    echo "  4. Copy your config to src/firebase.js"
    echo ""
    exit 0
fi

echo "✅ Firebase configured!"
echo ""
echo "🚀 Starting development server..."
echo "   Open http://localhost:5173 in your browser"
echo ""
npm run dev
