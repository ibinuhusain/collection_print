var exec = require('cordova/exec');

var PosPrinter = {
    connectNet: function(ip, port, successCallback, errorCallback) {
        exec(successCallback, errorCallback, 'PosPrinter', 'connectNet', [ip, port]);
    },
    
    connectBluetooth: function(deviceId, successCallback, errorCallback) {
        exec(successCallback, errorCallback, 'PosPrinter', 'connectBluetooth', [deviceId]);
    },
    
    printData: function(data, successCallback, errorCallback) {
        exec(successCallback, errorCallback, 'PosPrinter', 'printData', [data]);
    },
    
    disconnect: function(successCallback, errorCallback) {
        exec(successCallback, errorCallback, 'PosPrinter', 'disconnect', []);
    }
};

module.exports = PosPrinter;