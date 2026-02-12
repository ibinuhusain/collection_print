# Apparels Collection React App

A React-based mobile application for managing apparel group collections with thermal printer support.

## Features

- User authentication and authorization
- Assignment management
- Payment collection
- Thermal printer integration (Bluetooth and WiFi)
- Responsive design for mobile devices
- API integration with backend services

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Android Studio (for Android builds) or Xcode (for iOS builds)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd react-app
```

2. Install dependencies:
```bash
npm install
```

## Development

To run the app in development mode:
```bash
npm start
```

The app will be available at http://localhost:3000

## Building for Production

To create a production build:
```bash
npm run build
```

## Mobile Deployment

### Android
1. Add the Android platform:
```bash
npx cap add android
```

2. Sync the project:
```bash
npx cap sync
```

3. Open in Android Studio:
```bash
npx cap open android
```

4. Build and run the app from Android Studio

### iOS
1. Add the iOS platform:
```bash
npx cap add ios
```

2. Sync the project:
```bash
npx cap sync
```

3. Open in Xcode:
```bash
npx cap open ios
```

4. Build and run the app from Xcode

## API Integration

The app integrates with the backend API at `https://aquamarine-mule-238491.hostingersite.com/api/`. The API service is located at `src/services/api.js`.

## Components

- Login: Handles user authentication
- Dashboard: Shows assignment overview
- Assignments: Lists all collection assignments
- Assignment Detail: Shows detailed information about an assignment
- Payment: Handles payment collection
- Printer Test: Manages thermal printer functionality

## Thermal Printer Support

The app supports both Bluetooth and WiFi thermal printers. The printer functionality is simulated in the web version but will connect to native printing APIs when built as a mobile app using Capacitor.

## License

This project is licensed under the MIT License.