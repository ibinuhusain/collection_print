#!/bin/bash

echo "Apparels Collection Mobile App - APK Build Script"

# Navigate to the Cordova project
cd /workspace/apparels-app

echo "Checking prerequisites..."

# Check if cordova is installed
if ! command -v cordova &> /dev/null; then
    echo "Error: Cordova is not installed. Please install it with: npm install -g cordova"
    exit 1
fi

# Check if Android platform is added
if [ ! -d "platforms/android" ]; then
    echo "Adding Android platform..."
    cordova platform add android
fi

# Check if required plugins are installed
PLUGINS=("cordova-plugin-whitelist" "cordova-plugin-inappbrowser" "cordova-plugin-network-information")
for plugin in "${PLUGINS[@]}"; do
    if [ ! -d "plugins/$plugin" ]; then
        echo "Installing missing plugin: $plugin"
        cordova plugin add "$plugin"
    fi
done

echo "Building Android APK..."

# Build debug APK
cordova build android

if [ $? -eq 0 ]; then
    echo ""
    echo "Build successful!"
    echo "APK file location: platforms/android/app/build/outputs/apk/debug/"
    echo "Find the file named app-debug.apk"
else
    echo ""
    echo "Build failed. Possible reasons:"
    echo "- Android SDK not installed"
    echo "- Java JDK not installed or not in PATH"
    echo "- Gradle not installed"
    echo ""
    echo "To build on your local machine:"
    echo "1. Install Android Studio with Android SDK"
    echo "2. Set ANDROID_HOME environment variable"
    echo "3. Install Java JDK 8 or higher"
    echo "4. Run this script again"
    echo ""
    echo "Alternatively, you can use an online build service like PhoneGap Build or Ionic Appflow."
fi