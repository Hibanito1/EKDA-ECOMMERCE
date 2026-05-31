#!/bin/bash
# EKDA Ecommerce — Complete Deployment Script
# Run this script to deploy the web app to Vercel and generate an APK

set -e

echo "🌍 EKDA Ecommerce — Deployment Script"
echo "======================================="
echo ""

# ─── Colors ────────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_step() { echo -e "${BLUE}▶ $1${NC}"; }
print_success() { echo -e "${GREEN}✓ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠ $1${NC}"; }
print_error() { echo -e "${RED}✗ $1${NC}"; }

# ─── Prerequisites Check ────────────────────────────────────────────────────────
print_step "Checking prerequisites..."

if ! command -v node &> /dev/null; then
    print_error "Node.js is required. Install from https://nodejs.org"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    print_error "npm is required."
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    print_error "Node.js 20+ required. Current: $(node --version)"
    exit 1
fi

print_success "Node.js $(node --version) — OK"

# ─── Install Dependencies ───────────────────────────────────────────────────────
print_step "Installing dependencies..."
cd "$(dirname "$0")"
npm install --legacy-peer-deps --silent
print_success "Dependencies installed"

# ─── Build Web App ─────────────────────────────────────────────────────────────
print_step "Building Next.js web app..."
cd apps/web

# Set demo mode for testing build
export NEXT_PUBLIC_DEMO_MODE=true
export NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
export NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder_key

npm run build
print_success "Web app built successfully"
cd ../..

# ─── Deploy to Vercel ──────────────────────────────────────────────────────────
print_step "Deploying to Vercel..."

export PATH="$HOME/.npm-global/bin:$PATH"

if ! command -v vercel &> /dev/null; then
    print_step "Installing Vercel CLI..."
    npm install -g vercel --prefix "$HOME/.npm-global"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 VERCEL DEPLOYMENT INSTRUCTIONS:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Run these commands to deploy:"
echo ""
echo "  cd apps/web"
echo "  vercel login          # Login with GitHub/email"
echo "  vercel --prod         # Deploy to production"
echo ""
echo "When prompted:"
echo "  - Root directory: ./"
echo "  - Framework: Next.js"
echo "  - Build command: npm run build"
echo "  - Output directory: .next"
echo ""
echo "Add these environment variables in Vercel dashboard:"
echo "  NEXT_PUBLIC_DEMO_MODE = true"
echo "  NEXT_PUBLIC_SUPABASE_URL = (your Supabase URL)"
echo "  NEXT_PUBLIC_SUPABASE_ANON_KEY = (your Supabase key)"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# ─── EAS APK Build ─────────────────────────────────────────────────────────────
echo ""
print_step "Setting up Expo EAS for APK build..."

if ! command -v eas &> /dev/null; then
    print_step "Installing EAS CLI..."
    npm install -g eas-cli --prefix "$HOME/.npm-global"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📱 APK BUILD INSTRUCTIONS:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Create free account at: https://expo.dev"
echo ""
echo "2. Run these commands:"
echo "   cd apps/mobile"
echo "   eas login                              # Login with Expo account"
echo "   eas build:configure                   # Configure project (run once)"
echo "   eas build --platform android --profile preview"
echo ""
echo "3. Monitor build at: https://expo.dev/accounts/[username]/projects"
echo ""
echo "4. Download APK from the build page and install:"
echo "   adb install ekda-marketplace.apk"
echo ""
echo "   OR on device:"
echo "   Settings → Security → Unknown Sources → ON"
echo "   Transfer and tap APK file to install"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# ─── Local Preview ─────────────────────────────────────────────────────────────
echo ""
print_step "Starting local preview server..."
echo ""
echo "🌐 Web App Preview:"
echo "   URL: http://localhost:3000"
echo ""
echo "   To start: cd apps/web && npm start"
echo "   (Or: npm run dev for development)"
echo ""
echo "📱 Mobile App Preview:"
echo "   1. Install Expo Go on your device"
echo "   2. Run: cd apps/mobile && npm start"
echo "   3. Scan the QR code with Expo Go"
echo ""

print_success "Deployment setup complete!"
echo ""
echo "📖 See TESTING.md for login credentials and test flows"
echo "📖 See DEVELOPER_HANDOVER.md for production setup guide"
