// Thermal Printer Service Bridge
// This service provides access to native Android Bluetooth functions for thermal printer connectivity

document.addEventListener('deviceready', function() {
    console.log('Device ready - Initializing thermal printer service');
    
    // Check if thermal printer plugin is available
    if (typeof thermalPrinter !== 'undefined') {
        console.log('Thermal printer plugin is available');
        
        // Attach the thermal printer service to the global window object
        window.thermalPrinter = window.thermalPrinter || thermalPrinter;
        
        // Initialize printer service instance
        if (window.printerService) {
            console.log('Printer service already initialized');
        }
        
        // Create the printer service API
        window.printerService = {
            discoverPrinters: function() {
                return new Promise((resolve, reject) => {
                    window.thermalPrinter.discoverPrinters(
                        (result) => resolve(result),
                        (error) => reject(new Error(error))
                    );
                });
            },
            
            connectBluetooth: function(deviceId) {
                return new Promise((resolve, reject) => {
                    window.thermalPrinter.connectBluetooth(
                        deviceId,
                        () => resolve(),
                        (error) => reject(new Error(error))
                    );
                });
            },
            
            connectWiFi: function(ipAddress, port) {
                return new Promise((resolve, reject) => {
                    window.thermalPrinter.connectWiFi(
                        ipAddress, port,
                        () => resolve(),
                        (error) => reject(new Error(error))
                    );
                });
            },
            
            printRaw: function(data) {
                return new Promise((resolve, reject) => {
                    window.thermalPrinter.printRaw(
                        data,
                        () => resolve(),
                        (error) => reject(new Error(error))
                    );
                });
            },
            
            printReceipt: function(receiptData) {
                return new Promise((resolve, reject) => {
                    window.thermalPrinter.printReceipt(
                        receiptData,
                        () => resolve(),
                        (error) => reject(new Error(error))
                    );
                });
            },
            
            disconnect: function() {
                return new Promise((resolve, reject) => {
                    window.thermalPrinter.disconnect(
                        () => resolve(),
                        (error) => reject(new Error(error))
                    );
                });
            }
        };
    } else {
        console.warn('Thermal printer plugin not available. Make sure it\'s properly installed.');
        
        // Create a mock implementation for testing purposes
        window.thermalPrinter = {
            discoverPrinters: function(successCallback, errorCallback) {
                console.warn('Mock: Discovering printers...');
                setTimeout(() => {
                    errorCallback('Thermal printer plugin not installed');
                }, 100);
            },
            connectBluetooth: function(deviceId, successCallback, errorCallback) {
                setTimeout(() => {
                    errorCallback('Thermal printer plugin not installed');
                }, 100);
            },
            connectWiFi: function(ipAddress, port, successCallback, errorCallback) {
                setTimeout(() => {
                    errorCallback('Thermal printer plugin not installed');
                }, 100);
            },
            printRaw: function(data, successCallback, errorCallback) {
                setTimeout(() => {
                    errorCallback('Thermal printer plugin not installed');
                }, 100);
            },
            printReceipt: function(receiptData, successCallback, errorCallback) {
                setTimeout(() => {
                    errorCallback('Thermal printer plugin not installed');
                }, 100);
            },
            disconnect: function(successCallback, errorCallback) {
                setTimeout(() => {
                    errorCallback('Thermal printer plugin not installed');
                }, 100);
            }
        };
    }
}, false);

// Additional event listener to handle cases where deviceready fires before this script loads
if (window.device && window.device.platform) {
    // Device is already ready
    if (typeof thermalPrinter !== 'undefined') {
        window.thermalPrinter = window.thermalPrinter || thermalPrinter;
    }
}

// Utility function to check if printer service is available
window.isPrinterServiceAvailable = function() {
    return typeof thermalPrinter !== 'undefined' && thermalPrinter !== null;
};