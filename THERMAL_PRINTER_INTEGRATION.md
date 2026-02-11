# Thermal Printer Integration for Apparels Collection Mobile App

## Overview

This document describes the complete thermal printer integration for the Apparels Collection mobile application. The solution supports both Bluetooth and WiFi thermal printers using a Chinese generic 80mm thermal printer SDK.

## Components

### 1. Cordova Plugin: `cordova-plugin-pos-printer`

The core of the printing functionality is a custom Cordova plugin that bridges web-based JavaScript calls to native Android printer SDK functions.

#### Plugin Structure
```
pos-printer-plugin/
├── package.json
├── plugin.xml
├── www/
│   └── printer.js
└── src/
    └── android/
        ├── PosPrinter.java
        ├── PosPrinterSDKInterface.java
        └── libs/
            └── PosPrinterSDK.jar
```

#### Plugin Features
- Network (WiFi) printer support
- Bluetooth printer support
- Raw data printing capability
- POS command support for thermal printers

### 2. JavaScript API

The plugin exposes a JavaScript API accessible through `window.androidPrinter`:

```javascript
// Connect to network printer
window.androidPrinter.connectNet(ip, port, successCallback, errorCallback);

// Connect to Bluetooth printer
window.androidPrinter.connectBluetooth(deviceId, successCallback, errorCallback);

// Print raw data
window.androidPrinter.printData(data, successCallback, errorCallback);

// Disconnect printer
window.androidPrinter.disconnect(successCallback, errorCallback);
```

### 3. Printer Service Layer

The `PrinterService.js` provides a higher-level abstraction:

```javascript
// Example usage
const printerService = window.printerService;

// Connect to printer
await printerService.connect({
    type: 'bluetooth', // or 'network'
    deviceId: '00:11:22:33:AA:BB' // for bluetooth
    // ip: '192.168.1.100', port: 9100 // for network
});

// Print receipt
await printerService.printReceipt(assignmentData);

// Disconnect
await printerService.disconnect();
```

## Installation

### Adding the Plugin to Your Cordova Project

```bash
cordova plugin add /path/to/pos-printer-plugin
```

### Required Permissions

The plugin automatically adds all necessary permissions to your `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.BLUETOOTH" />
<uses-permission android:name="android.permission.BLUETOOTH_ADMIN" />
<uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
<uses-permission android:name="android.permission.BLUETOOTH_SCAN" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-feature android:required="true" android:name="android.hardware.usb.host" />
```

## Usage

### Testing Page

The `print-test.php` file provides a comprehensive testing interface for:

1. Connecting to different printer types (Bluetooth/WiFi)
2. Printing test receipts
3. Printing custom text
4. Disconnecting from printers
5. Real-time status updates
6. Debugging information

### Receipt Formatting

The system uses ESC/POS commands for proper thermal printer formatting:

- `\x1B\x40` - Initialize printer
- `\x1B\x61\x01` - Center align
- `\x1B\x21\x30` - Double height and width
- `\x1D\x56\x41\x10` - Cut paper

## Supported Printers

This solution is designed to work with generic Chinese 80mm thermal printers that support:
- ESC/POS command set
- Bluetooth connectivity
- WiFi/Ethernet connectivity
- Standard thermal paper (57-80mm)

## Troubleshooting

### Common Issues

1. **Permission Denied**: Ensure Bluetooth permissions are granted
2. **Connection Failed**: Verify printer is powered on and discoverable
3. **Print Quality**: Check thermal paper orientation
4. **No Response**: Verify printer compatibility

### Debugging

The test page includes comprehensive debugging features:
- Real-time status updates
- Connection logs
- Error messages
- Debug information panel

## Implementation Notes

### Security Considerations
- The plugin requires location permissions for Bluetooth scanning
- Network printers should be on secure networks
- Validate printer identifiers before connections

### Performance
- Connection establishment may take several seconds
- Large receipts may require batching
- Monitor battery usage during extended printing sessions

### Compatibility
- Designed for Android devices
- Requires Bluetooth 4.0+ for BLE support
- Compatible with most ESC/POS compliant thermal printers

## Testing Without Physical Printer

The `print-test.php` page includes a fallback mechanism for development:

1. Access the test page in the mobile app environment
2. Use the debug panel to verify plugin availability
3. Simulate printer connections without physical hardware
4. Validate receipt formatting before deployment

## Future Enhancements

Potential improvements include:
- USB printer support
- Image printing capabilities
- Barcode/QR code generation
- Printer status monitoring
- Multiple printer queue management