package com.thermal.printer;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothSocket;
import android.util.Log;

import java.io.OutputStream;
import java.io.IOException;
import java.util.Set;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class ThermalPrinter extends CordovaPlugin {
    private static final String TAG = "ThermalPrinter";
    private BluetoothAdapter bluetoothAdapter;
    private BluetoothSocket bluetoothSocket;
    private OutputStream outputStream;
    private String connectedDeviceId;

    @Override
    protected void pluginInitialize() {
        super.pluginInitialize();
        bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
    }

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if ("discoverPrinters".equals(action)) {
            return discoverPrinters(callbackContext);
        } else if ("connectBluetooth".equals(action)) {
            String deviceId = args.getString(0);
            return connectBluetooth(deviceId, callbackContext);
        } else if ("connectWiFi".equals(action)) {
            String ipAddress = args.getString(0);
            int port = args.optInt(1, 9100);
            return connectWiFi(ipAddress, port, callbackContext);
        } else if ("printRaw".equals(action)) {
            String data = args.getString(0);
            return printRaw(data, callbackContext);
        } else if ("printReceipt".equals(action)) {
            JSONObject receiptData = args.getJSONObject(0);
            return printReceipt(receiptData, callbackContext);
        } else if ("disconnect".equals(action)) {
            return disconnect(callbackContext);
        }
        return false;
    }

    private boolean discoverPrinters(CallbackContext callbackContext) {
        if (bluetoothAdapter == null) {
            callbackContext.error("Bluetooth is not supported on this device");
            return false;
        }

        if (!bluetoothAdapter.isEnabled()) {
            callbackContext.error("Bluetooth is not enabled");
            return false;
        }

        try {
            Set<BluetoothDevice> pairedDevices = bluetoothAdapter.getBondedDevices();
            JSONArray printers = new JSONArray();

            for (BluetoothDevice device : pairedDevices) {
                JSONObject printer = new JSONObject();
                printer.put("id", device.getAddress());
                printer.put("name", device.getName());
                printer.put("type", "bluetooth");
                printers.put(printer);
            }

            callbackContext.success(printers);
            return true;
        } catch (JSONException e) {
            callbackContext.error("Error discovering printers: " + e.getMessage());
            return false;
        }
    }

    private boolean connectBluetooth(String deviceId, CallbackContext callbackContext) {
        if (bluetoothAdapter == null) {
            callbackContext.error("Bluetooth is not supported on this device");
            return false;
        }

        if (!bluetoothAdapter.isEnabled()) {
            callbackContext.error("Bluetooth is not enabled");
            return false;
        }

        try {
            BluetoothDevice device = bluetoothAdapter.getRemoteDevice(deviceId);
            
            // Close existing connection if any
            if (bluetoothSocket != null && bluetoothSocket.isConnected()) {
                try {
                    outputStream.close();
                    bluetoothSocket.close();
                } catch (IOException e) {
                    Log.d(TAG, "Error closing existing connection: " + e.getMessage());
                }
            }

            // Use the default SPP UUID for Bluetooth serial communication
            UUID uuid = UUID.fromString("00001101-0000-1000-8000-00805F9B34FB");
            bluetoothSocket = device.createRfcommSocketToServiceRecord(uuid);

            // Connect to the printer
            bluetoothSocket.connect();
            outputStream = bluetoothSocket.getOutputStream();
            
            connectedDeviceId = deviceId;
            
            callbackContext.success("Connected to Bluetooth printer: " + deviceId);
            return true;
        } catch (IOException e) {
            Log.e(TAG, "Error connecting to Bluetooth printer: " + e.getMessage());
            callbackContext.error("Error connecting to Bluetooth printer: " + e.getMessage());
            return false;
        } catch (Exception e) {
            Log.e(TAG, "Unexpected error: " + e.getMessage());
            callbackContext.error("Unexpected error: " + e.getMessage());
            return false;
        }
    }

    private boolean connectWiFi(String ipAddress, int port, CallbackContext callbackContext) {
        // For WiFi connections, we would implement TCP socket connection
        // This is a simplified implementation - in practice, you'd use Socket for WiFi
        callbackContext.error("WiFi connection not fully implemented in this example. Requires network socket implementation.");
        return false;
    }

    private boolean printRaw(String data, CallbackContext callbackContext) {
        if (outputStream == null) {
            callbackContext.error("Not connected to a printer");
            return false;
        }

        try {
            byte[] bytes = data.getBytes("UTF-8");
            outputStream.write(bytes);
            outputStream.flush();
            
            callbackContext.success("Data sent to printer successfully");
            return true;
        } catch (IOException e) {
            Log.e(TAG, "Error sending data to printer: " + e.getMessage());
            callbackContext.error("Error sending data to printer: " + e.getMessage());
            return false;
        }
    }

    private boolean printReceipt(JSONObject receiptData, CallbackContext callbackContext) {
        if (outputStream == null) {
            callbackContext.error("Not connected to a printer");
            return false;
        }

        try {
            // Initialize printer
            outputStream.write(0x1B); // ESC
            outputStream.write(0x40); // @ - Initialize
            
            // Center align
            outputStream.write(0x1B); // ESC
            outputStream.write(0x61); // a
            outputStream.write(0x01); // 1 - Center align
            
            // Print store name (larger text)
            outputStream.write(0x1B); // ESC
            outputStream.write(0x21); // !
            outputStream.write(0x30); // 0x30 - Bold + double height + double width
            
            String storeName = receiptData.optString("store_name", "APPARELS COLLECTION");
            byte[] storeBytes = storeName.getBytes("UTF-8");
            outputStream.write(storeBytes);
            outputStream.write('\n');
            
            // Reset to normal text
            outputStream.write(0x1B); // ESC
            outputStream.write(0x21); // !
            outputStream.write(0x00); // 0x00 - Normal
            
            // Separator
            String separator = "========================\n";
            byte[] sepBytes = separator.getBytes("UTF-8");
            outputStream.write(sepBytes);
            
            // Left align for details
            outputStream.write(0x1B); // ESC
            outputStream.write(0x61); // a
            outputStream.write(0x00); // 0 - Left align
            
            // Print details
            String agentName = receiptData.optString("agent_name", "Unknown Agent");
            String date = receiptData.optString("date", "Unknown Date");
            String amountCollected = receiptData.optString("amount_collected", "Rs. 0.00");
            String pendingAmount = receiptData.optString("pending_amount", "Rs. 0.00");
            String targetAmount = receiptData.optString("target_amount", "Rs. 0.00");
            
            outputStream.write(("Store: " + storeName + "\n").getBytes("UTF-8"));
            outputStream.write(("Agent: " + agentName + "\n").getBytes("UTF-8"));
            outputStream.write(("Date: " + date + "\n\n").getBytes("UTF-8"));
            
            outputStream.write(("Amount Collected: " + amountCollected + "\n").getBytes("UTF-8"));
            outputStream.write(("Pending Amount: " + pendingAmount + "\n").getBytes("UTF-8"));
            outputStream.write(("Target Amount: " + targetAmount + "\n\n").getBytes("UTF-8"));
            
            // Final separator and message
            outputStream.write(sepBytes);
            outputStream.write("Thank you for your business!\n\n\n\n".getBytes("UTF-8"));
            
            // Cut paper
            outputStream.write(0x1D); // GS
            outputStream.write(0x56); // V
            outputStream.write(0x41); // A
            outputStream.write(0x10); // 16 - Full cut
            
            outputStream.flush();
            
            callbackContext.success("Receipt printed successfully");
            return true;
        } catch (IOException e) {
            Log.e(TAG, "Error printing receipt: " + e.getMessage());
            callbackContext.error("Error printing receipt: " + e.getMessage());
            return false;
        }
    }

    private boolean disconnect(CallbackContext callbackContext) {
        try {
            if (outputStream != null) {
                outputStream.close();
                outputStream = null;
            }
            
            if (bluetoothSocket != null) {
                bluetoothSocket.close();
                bluetoothSocket = null;
            }
            
            connectedDeviceId = null;
            
            callbackContext.success("Printer disconnected successfully");
            return true;
        } catch (IOException e) {
            Log.e(TAG, "Error disconnecting: " + e.getMessage());
            callbackContext.error("Error disconnecting: " + e.getMessage());
            return false;
        }
    }
}