<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Collection Receipt - Thermal Printer Test</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .container { max-width: 600px; margin: 0 auto; }
    .form-group { margin-bottom: 15px; }
    label { display: block; margin-bottom: 5px; font-weight: bold; }
    input, select { width: 100%; padding: 8px; box-sizing: border-box; }
    button { background-color: #4CAF50; color: white; padding: 10px 20px; border: none; cursor: pointer; margin-right: 10px; }
    button:hover { background-color: #45a049; }
    .btn-secondary { background-color: #008CBA; }
    .btn-secondary:hover { background-color: #007B9A; }
    .status { padding: 10px; margin: 10px 0; border-radius: 4px; }
    .success { background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
    .error { background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
    .info { background-color: #d1ecf1; color: #0c5460; border: 1px solid #bee5eb; }
  </style>
</head>

<body>
<div class="container">
  <h2>Thermal Printer Test Page</h2>
  
  <div id="printerStatus" class="status info">Printer Status: Not connected</div>
  
  <div class="form-group">
    <label for="printerType">Printer Type:</label>
    <select id="printerType">
      <option value="bluetooth">Bluetooth</option>
      <option value="network">Network (WiFi)</option>
    </select>
  </div>
  
  <div id="bluetoothSection">
    <div class="form-group">
      <label for="bluetoothDevice">Bluetooth Device ID/MAC:</label>
      <input type="text" id="bluetoothDevice" placeholder="e.g., 00:11:22:33:AA:BB" value="">
    </div>
  </div>
  
  <div id="networkSection" style="display:none;">
    <div class="form-group">
      <label for="printerIp">Printer IP Address:</label>
      <input type="text" id="printerIp" placeholder="e.g., 192.168.1.100" value="192.168.1.100">
    </div>
    
    <div class="form-group">
      <label for="printerPort">Printer Port:</label>
      <input type="text" id="printerPort" placeholder="e.g., 9100" value="9100">
    </div>
  </div>

  <div class="form-group">
    <label for="testContent">Test Content:</label>
    <textarea id="testContent" rows="4" style="width:100%;padding:8px;">Test thermal print from Apparels Collection system. This is a test of the thermal printing functionality. If you can read this, the printer is working correctly!</textarea>
  </div>

  <button id="connectBtn">Connect to Printer</button>
  <button id="printBtn">Print Test Receipt</button>
  <button id="printCustomBtn">Print Custom Text</button>
  <button id="disconnectBtn" class="btn-secondary">Disconnect</button>

  <h3>Test Data for Receipt</h3>
  <div class="form-group">
    <label for="storeName">Store Name:</label>
    <input type="text" id="storeName" value="TEST STORE NAME">
  </div>
  
  <div class="form-group">
    <label for="agentName">Agent Name:</label>
    <input type="text" id="agentName" value="TEST AGENT">
  </div>
  
  <div class="form-group">
    <label for="amountCollected">Amount Collected:</label>
    <input type="text" id="amountCollected" value="Rs. 5,000.00">
  </div>
  
  <div class="form-group">
    <label for="pendingAmount">Pending Amount:</label>
    <input type="text" id="pendingAmount" value="Rs. 2,500.00">
  </div>
  
  <div class="form-group">
    <label for="targetAmount">Target Amount:</label>
    <input type="text" id="targetAmount" value="Rs. 10,000.00">
  </div>

  <div id="debugInfo" style="margin-top: 20px; padding: 10px; background-color: #f0f0f0; border-radius: 4px; display:none;">
    <h4>Debug Information:</h4>
    <pre id="debugOutput"></pre>
  </div>
</div>

<script>
document.addEventListener("DOMContentLoaded", function () {
    // DOM elements
    const printerTypeSelect = document.getElementById("printerType");
    const bluetoothSection = document.getElementById("bluetoothSection");
    const networkSection = document.getElementById("networkSection");
    const connectBtn = document.getElementById("connectBtn");
    const printBtn = document.getElementById("printBtn");
    const printCustomBtn = document.getElementById("printCustomBtn");
    const disconnectBtn = document.getElementById("disconnectBtn");
    const printerStatus = document.getElementById("printerStatus");
    const debugInfo = document.getElementById("debugInfo");
    const debugOutput = document.getElementById("debugOutput");

    // Form fields
    const bluetoothDevice = document.getElementById("bluetoothDevice");
    const printerIp = document.getElementById("printerIp");
    const printerPort = document.getElementById("printerPort");
    const testContent = document.getElementById("testContent");
    const storeName = document.getElementById("storeName");
    const agentName = document.getElementById("agentName");
    const amountCollected = document.getElementById("amountCollected");
    const pendingAmount = document.getElementById("pendingAmount");
    const targetAmount = document.getElementById("targetAmount");

    // Event listeners for printer type selection
    printerTypeSelect.addEventListener("change", function() {
        if (printerTypeSelect.value === 'bluetooth') {
            bluetoothSection.style.display = 'block';
            networkSection.style.display = 'none';
        } else {
            bluetoothSection.style.display = 'none';
            networkSection.style.display = 'block';
        }
    });

    // Update status display
    function updateStatus(message, isError = false) {
        printerStatus.textContent = message;
        printerStatus.className = isError ? 'status error' : 'status success';
        logDebug(message);
    }

    // Log debug information
    function logDebug(message) {
        const timestamp = new Date().toISOString();
        const currentLog = debugOutput.textContent;
        debugOutput.textContent = `[${timestamp}] ${message}\n${currentLog}`;
        debugInfo.style.display = 'block';
    }

    // Connect to printer
    connectBtn.addEventListener("click", async function () {
        try {
            if (!window.androidPrinter || !window.printerService) {
                updateStatus("Printer service not available. Make sure the app is running in Cordova environment.", true);
                return;
            }

            const type = printerTypeSelect.value;
            let connectResult;

            if (type === 'network') {
                const ip = printerIp.value.trim();
                const port = parseInt(printerPort.value);
                
                if (!ip || isNaN(port)) {
                    updateStatus("Please enter valid IP address and port", true);
                    return;
                }
                
                logDebug(`Attempting to connect to network printer at ${ip}:${port}`);
                connectResult = await window.printerService.connect({
                    type: 'network',
                    ip: ip,
                    port: port
                });
            } else if (type === 'bluetooth') {
                const deviceId = bluetoothDevice.value.trim();
                
                if (!deviceId) {
                    updateStatus("Please enter Bluetooth device ID/MAC address", true);
                    return;
                }
                
                logDebug(`Attempting to connect to Bluetooth printer: ${deviceId}`);
                connectResult = await window.printerService.connect({
                    type: 'bluetooth',
                    deviceId: deviceId
                });
            }

            if (connectResult) {
                updateStatus(`Successfully connected to ${type} printer`);
            } else {
                updateStatus(`Failed to connect to ${type} printer`, true);
            }
        } catch (error) {
            console.error("Connection error:", error);
            updateStatus(`Connection failed: ${error.message}`, true);
        }
    });

    // Print test receipt
    printBtn.addEventListener("click", async function () {
        try {
            if (!window.printerService) {
                updateStatus("Printer service not available", true);
                return;
            }

            // Get form values
            const assignmentData = {
                store_name: storeName.value || "Default Store",
                agent_name: agentName.value || "Default Agent",
                date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                amount_collected: amountCollected.value || "Rs. 0.00",
                pending_amount: pendingAmount.value || "Rs. 0.00",
                target_amount: targetAmount.value || "Rs. 0.00"
            };

            logDebug("Attempting to print receipt with data:", JSON.stringify(assignmentData));
            
            await window.printerService.printReceipt(assignmentData);
            updateStatus("Receipt printed successfully!");
        } catch (error) {
            console.error("Print error:", error);
            updateStatus(`Print failed: ${error.message}`, true);
        }
    });

    // Print custom text
    printCustomBtn.addEventListener("click", async function () {
        try {
            if (!window.printerService) {
                updateStatus("Printer service not available", true);
                return;
            }

            const customText = testContent.value;
            if (!customText.trim()) {
                updateStatus("Please enter some text to print", true);
                return;
            }

            // Format custom text with POS commands
            let formattedText = '\x1B\x40'; // Initialize
            formattedText += '\x1B\x61\x01'; // Center align
            formattedText += '\x1B\x21\x00'; // Normal text
            formattedText += customText + '\n\n';
            formattedText += '\x1D\x56\x41\x10'; // Cut paper

            logDebug("Attempting to print custom text");
            
            // Since printData expects raw data, we'll call the androidPrinter directly
            await new Promise((resolve, reject) => {
                window.androidPrinter.printData(formattedText,
                    (success) => {
                        updateStatus("Custom text printed successfully!");
                        resolve(success);
                    },
                    (error) => {
                        updateStatus(`Print failed: ${error.message}`, true);
                        reject(error);
                    }
                );
            });
        } catch (error) {
            console.error("Custom print error:", error);
            updateStatus(`Custom print failed: ${error.message}`, true);
        }
    });

    // Disconnect from printer
    disconnectBtn.addEventListener("click", async function () {
        try {
            if (!window.printerService) {
                updateStatus("Printer service not available", true);
                return;
            }

            logDebug("Attempting to disconnect printer");
            await window.printerService.disconnect();
            updateStatus("Printer disconnected successfully");
        } catch (error) {
            console.error("Disconnect error:", error);
            updateStatus(`Disconnect failed: ${error.message}`, true);
        }
    });

    // Check if printer service is available
    setTimeout(() => {
        if (window.androidPrinter && window.printerService) {
            updateStatus("Printer service ready. You can now connect to a printer.");
        } else {
            updateStatus("Warning: Printer service not detected. This page works best in the mobile app environment.", true);
        }
    }, 1000);

    // Debug helper for development
    window.testPrinterCommands = function() {
        // Function to test various printer commands
        console.log("Testing printer commands...");
        
        // Test basic connectivity
        if (window.androidPrinter) {
            logDebug("✓ Android printer interface is available");
        } else {
            logDebug("✗ Android printer interface is NOT available");
        }
        
        if (window.printerService) {
            logDebug("✓ Printer service is available");
            logDebug("Current connection status: " + (window.printerService.isConnected ? "Connected" : "Not Connected"));
        } else {
            logDebug("✗ Printer service is NOT available");
        }
    };
});

// Fallback test function for debugging
function testPrinterFallback() {
    alert("This is a fallback test. In the actual mobile app, this would connect to a thermal printer.");
    console.log("Printer fallback test executed. In the real app, this would trigger actual printing.");
}
</script>

</body>
</html>
