var exec = require('cordova/exec');

var ThermalPrinter = {
    /**
     * Discover available printers
     */
    discoverPrinters: function(successCallback, errorCallback) {
        exec(successCallback, errorCallback, 'ThermalPrinter', 'discoverPrinters', []);
    },

    /**
     * Connect to a printer via Bluetooth
     */
    connectBluetooth: function(deviceId, successCallback, errorCallback) {
        exec(successCallback, errorCallback, 'ThermalPrinter', 'connectBluetooth', [deviceId]);
    },

    /**
     * Connect to a printer via WiFi
     */
    connectWiFi: function(ipAddress, port, successCallback, errorCallback) {
        exec(successCallback, errorCallback, 'ThermalPrinter', 'connectWiFi', [ipAddress, port || 9100]);
    },

    /**
     * Print raw data to the connected printer
     */
    printRaw: function(data, successCallback, errorCallback) {
        exec(successCallback, errorCallback, 'ThermalPrinter', 'printRaw', [data]);
    },

    /**
     * Print formatted receipt
     */
    printReceipt: function(receiptData, successCallback, errorCallback) {
        exec(successCallback, errorCallback, 'ThermalPrinter', 'printReceipt', [receiptData]);
    },

    /**
     * Disconnect from the printer
     */
    disconnect: function(successCallback, errorCallback) {
        exec(successCallback, errorCallback, 'ThermalPrinter', 'disconnect', []);
    }
};

module.exports = ThermalPrinter;