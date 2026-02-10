# Apparels Collection Mobile App

A mobile application wrapper for the Apparels Collection web application using WebView technology.

## Overview

This mobile app wraps the existing Apparels Collection web application in a WebView container, allowing users to access the web application as if it were a native mobile app. The app maintains all the features of the original web application, including offline capabilities through the PWA service worker.

## Features

- WebView wrapper for the Apparels Collection web application
- Splash screen with loading indicator
- Error handling and retry mechanism
- Configurable server URL
- Maintains all PWA features including offline support

## Prerequisites

- Node.js (for development and testing)
- Cordova or Capacitor (for building native apps)
- Access to the Apparels Collection web server

## Setup Instructions

### 1. Configure Server URL

Edit the `index.html` file and update the `WEB_SERVER_URL` constant with your actual server address:

```javascript
const CONFIG = {
    WEB_SERVER_URL: 'http://your-server-ip:port/' // Replace with your actual server URL
};
```

For local development with an Android emulator, you might use:
```javascript
const CONFIG = {
    WEB_SERVER_URL: 'http://10.0.2.2:8000/' // For Android emulator to access host machine
};
```

### 2. Testing Locally

To test the mobile interface locally:

```bash
npm install
npm start
```

### 3. Building for Android

To build the APK file, you'll need to install Cordova:

```bash
npm install -g cordova
cordova create apparels-app com.apparels.collection ApparelsCollection
cd apparels-app
cordova platform add android
cordova plugin add cordova-plugin-whitelist
cordova plugin add cordova-plugin-inappbrowser
cordova plugin add cordova-plugin-network-information
```

Then copy the files from this directory to the Cordova project and build:

```bash
# Copy files to Cordova project
cp -r ../index.html www/
cp -r ../config.xml .
cordova build android
```

The APK file will be generated in `platforms/android/app/build/outputs/apk/debug/`

### 4. Building for iOS

For iOS, you'll need Xcode installed:

```bash
cordova platform add ios
cordova build ios
```

## Important Notes

1. The web server hosting the Apparels Collection application must be accessible from the mobile device (either via public IP or on the same network).

2. For production use, ensure proper SSL certificates are in place if using HTTPS.

3. The original web application already has PWA capabilities, so many mobile features are preserved in the WebView implementation.

4. The offline functionality depends on the service worker implemented in the original web application.

## Troubleshooting

- If the app fails to load, check that the server URL is accessible from the mobile device
- For Android, ensure network security settings allow HTTP connections if not using HTTPS
- Make sure the original web application is properly configured with CORS settings if needed

## Security Considerations

- The mobile app inherits the security model of the original web application
- Ensure the server hosting the web application implements proper authentication and authorization
- Consider implementing certificate pinning for production apps