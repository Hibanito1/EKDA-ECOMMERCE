#!/bin/bash
# EKDA Marketplace - APK Build Script
# Run this to generate a fresh APK

set -e

echo "🔨 Building EKDA Marketplace APK..."

# Environment setup
export ANDROID_HOME=$HOME/android-sdk
export ANDROID_SDK_ROOT=$HOME/android-sdk
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
export PATH=$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$PATH
export NODE_ENV=production
export EXPO_ROUTER_APP_ROOT=app

# Go to mobile directory
cd "$(dirname "$0")/apps/mobile"

# Install dependencies if needed
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps --silent

# Run prebuild if android directory doesn't exist
if [ ! -d "android" ]; then
  echo "🔧 Generating Android project..."
  npx expo prebuild --platform android --clean
fi

# Build APK
echo "🏗️  Building APK (this takes ~5 minutes)..."
cd android
./gradlew assembleRelease --no-daemon

# Copy to root
APK_PATH="app/build/outputs/apk/release/app-release.apk"
ROOT_APK="$(dirname "$0")/ekda-marketplace.apk"

if [ -f "$APK_PATH" ]; then
  cp "$APK_PATH" "$ROOT_APK"
  echo ""
  echo "✅ APK built successfully!"
  echo "📱 Location: ekda-marketplace.apk"
  echo "📏 Size: $(du -sh "$ROOT_APK" | cut -f1)"
  echo ""
  echo "Install on Android:"
  echo "  adb install ekda-marketplace.apk"
  echo "  OR: Transfer to device and install from Settings > Security > Unknown Sources"
else
  echo "❌ Build failed. Check /tmp/gradle-build*.log for details"
  exit 1
fi
