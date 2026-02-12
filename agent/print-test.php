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
    input, select, textarea { width: 100%; padding: 8px; box-sizing: border-box; }
    button { background-color: #4CAF50; color: white; padding: 10px 20px; border: none; cursor: pointer; margin-right: 10px; margin-bottom: 5px; }
    button:hover { background-color: #45a049; }
    .btn-secondary { background-color: #008CBA; }
    .btn-secondary:hover { background-color: #007B9A; }
    .btn-discover { background-color: #FF9800; }
    .btn-discover:hover { background-color: #e68900; }
    .status { padding: 10px; margin: 10px 0; border-radius: 4px; }
    .success { background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
    .error { background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
    .info { background-color: #d1ecf1; color: #0c5460; border: 1px solid #bee5eb; }
    .printer-list { margin-top: 10px; padding: 10px; background-color: #f9f9f9; border-radius: 4px; }
    .printer-item { padding: 5px 0; cursor: pointer; }
    .printer-item:hover { background-color: #e9e9e9; }
  </style>
  <!-- Include the printer bridge -->
  <script src="printer-bridge.js"></script>
  <!-- Include the communication bridge -->
  <script src="../www/communication-bridge.js"></script>
</head>

<body>
<div class="container">
  <h2>Thermal Printer Test Page</h2>

  <div id="printerStatus" class="status info">Printer Status: Not connected</div>

  <div class="form-group">
    <label for="printerType">Printer Type:</label>
    <select id="printerType">
      <option value="bluetooth">Bluetooth</option>
      <option value="wifi">WiFi</option>
    </select>
  </div>

  <div id="bluetoothSection">
    <div class="form-group">
      <label for="bluetoothDevice">Bluetooth Device ID/MAC:</label>
      <input type="text" id="bluetoothDevice" placeholder="e.g., 00:11:22:33:AA:BB" value="">
    </div>
    <button id="discoverBtn" class="btn-discover">Discover Bluetooth Printers</button>
    <div id="printerList" class="printer-list" style="display:none;"></div>
  </div>

  <div id="wifiSection" style="display:none;">
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
    const wifiSection = document.getElementById("wifiSection");
    const connectBtn = document.getElementById("connectBtn");
    const printBtn = document.getElementById("printBtn");
    const printCustomBtn = document.getElementById("printCustomBtn");
    const disconnectBtn = document.getElementById("disconnectBtn");
    const discoverBtn = document.getElementById("discoverBtn");
    const printerList = document.getElementById("printerList");
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
            wifiSection.style.display = 'none';
        } else {
            bluetoothSection.style.display = 'none';
            wifiSection.style.display = 'block';
        }
    });

    // Update status display
    function updateStatus(message, isError = false) {
        printerStatus.textContent = message;
        printerStatus.className = isError ? 'status error' : 'status success';
        logDebug(message);
    }
    
    // Enhanced function to handle printer operations through the communication bridge
    async function executePrinterOperation(operation, params = {}) {
        try {
            // Check if we're running inside the hybrid app
            if (window.pluginBridge && window.pluginBridge.inIframe) {
                // Use the communication bridge to execute the operation
                switch(operation) {
                    case 'discover':
                        // For discover, we'll just return a message indicating to use the hybrid app's printer panel
                        updateStatus("Please use the printer controls in the main app to discover printers.", true);
                        return [];
                        
                    case 'connect':
                        await window.pluginBridge.requestConnect(params);
                        updateStatus(`Successfully connected to ${params.type} printer`);
                        return true;
                        
                    case 'printReceipt':
                        await window.pluginBridge.requestPrint('receipt', params);
                        updateStatus("Receipt printed successfully!");
                        return true;
                        
                    case 'printRaw':
                        await window.pluginBridge.requestPrint('raw', params);
                        updateStatus("Custom text printed successfully!");
                        return true;
                        
                    case 'disconnect':
                        await window.pluginBridge.requestDisconnect();
                        updateStatus("Printer disconnected successfully");
                        return true;
                        
                    default:
                        throw new Error(`Unknown operation: ${operation}`);
                }
            } else {
                // Fallback to direct plugin access if not in hybrid app (for standalone testing)
                if (!window.thermalPrinter || !window.printerService) {
                    throw new Error("Thermal printer service not available");
                }
                
                switch(operation) {
                    case 'discover':
                        return await window.printerService.discoverPrinters();
                        
                    case 'connect':
                        return await window.printerService.connect(params);
                        
                    case 'printReceipt':
                        return await window.printerService.printReceipt(params);
                        
                    case 'printRaw':
                        return await window.printerService.printRaw(params);
                        
                    case 'disconnect':
                        return await window.printerService.disconnect();
                        
                    default:
                        throw new Error(`Unknown operation: ${operation}`);
                }
            }
        } catch (error) {
            console.error(`${operation} error:`, error);
            updateStatus(`${operation} failed: ${error.message}`, true);
            throw error;
        }
    }

    // Log debug information
    function logDebug(message) {
        const timestamp = new Date().toISOString();
        const currentLog = debugOutput.textContent;
        debugOutput.textContent = `[${timestamp}] ${message}\n${currentLog}`;
        debugInfo.style.display = 'block';
    }

    // Discover Bluetooth printers
    discoverBtn.addEventListener("click", async function () {
        try {
            logDebug("Discovering Bluetooth printers...");
            const printers = await executePrinterOperation('discover');
            
            if (printers && printers.length > 0) {
                printerList.innerHTML = '<h4>Available Printers:</h4>';
                
                printers.forEach(function(printer, index) {
                    const printerItem = document.createElement('div');
                    printerItem.className = 'printer-item';
                    printerItem.innerHTML = `<strong>${printer.name}</strong> (${printer.id}) - ${printer.type}`;
                    
                    // Add click event to select this printer
                    printerItem.addEventListener('click', function() {
                        bluetoothDevice.value = printer.id;
                        updateStatus(`Selected printer: ${printer.name} (${printer.id})`);
                    });
                    
                    printerList.appendChild(printerItem);
                });
                
                printerList.style.display = 'block';
                updateStatus(`${printers.length} printer(s) found. Click on a printer to select it.`);
            } else {
                printerList.style.display = 'none';
                updateStatus("No Bluetooth printers found.", true);
            }
        } catch (error) {
            console.error("Discovery error:", error);
            updateStatus(`Discovery failed: ${error.message}`, true);
            printerList.style.display = 'none';
        }
    });

    // Connect to printer
    connectBtn.addEventListener("click", async function () {
        try {
            const type = printerTypeSelect.value;

            if (type === 'wifi') {
                const ip = printerIp.value.trim();
                const port = parseInt(printerPort.value);

                if (!ip || isNaN(port)) {
                    updateStatus("Please enter valid IP address and port", true);
                    return;
                }

                logDebug(`Attempting to connect to WiFi printer at ${ip}:${port}`);
                await executePrinterOperation('connect', {
                    type: 'wifi',
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
                await executePrinterOperation('connect', {
                    type: 'bluetooth',
                    deviceId: deviceId
                });
            }
        } catch (error) {
            console.error("Connection error:", error);
            updateStatus(`Connection failed: ${error.message}`, true);
        }
    });

    // Print test receipt
    printBtn.addEventListener("click", async function () {
        try {
            // Get form values
            const assignmentData = {
                store_name: storeName.value || "Default Store",
                agent_name: agentName.value || "Default Agent",
                date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                amount_collected: amountCollected.value || "Rs. 0.00",
                pending_amount: pendingAmount.value || "Rs. 0.00",
                target_amount: targetAmount.value || "Rs. 0.00"
            };

            logDebug("Attempting to print receipt with ", JSON.stringify(assignmentData));

            await executePrinterOperation('printReceipt', assignmentData);
        } catch (error) {
            console.error("Print error:", error);
            updateStatus(`Print failed: ${error.message}`, true);
        }
    });

    // Print custom text
    printCustomBtn.addEventListener("click", async function () {
        try {
            const customText = testContent.value;
            if (!customText.trim()) {
                updateStatus("Please enter some text to print", true);
                return;
            }

            logDebug("Attempting to print custom text");

            await executePrinterOperation('printRaw', customText + '\n\n');
        } catch (error) {
            console.error("Custom print error:", error);
            updateStatus(`Custom print failed: ${error.message}`, true);
        }
    });

    // Disconnect from printer
    disconnectBtn.addEventListener("click", async function () {
        try {
            logDebug("Attempting to disconnect printer");
            await executePrinterOperation('disconnect');
        } catch (error) {
            console.error("Disconnect error:", error);
            updateStatus(`Disconnect failed: ${error.message}`, true);
        }
    });

    // Check if printer service is available
    setTimeout(() => {
        if (window.thermalPrinter && window.printerService) {
            updateStatus("Thermal printer service ready. You can now connect to a printer.");
        } else if (window.pluginBridge && window.pluginBridge.inIframe) {
            updateStatus("Running inside hybrid app. Printer controls are available in the main app.");
        } else {
            updateStatus("Warning: Thermal printer service not detected. This page works best in the mobile app environment.", true);
        }
    }, 1000);

    // Debug helper for development
    window.testPrinterCommands = function() {
        // Function to test various printer commands
        console.log("Testing printer commands...");

        // Test basic connectivity
        if (window.thermalPrinter) {
            logDebug("\u2713 Thermal printer interface is available");
        } else {
            logDebug("\u2717 Thermal printer interface is NOT available");
        }

        if (window.printerService) {
            logDebug("\u2713 Printer service is available");
            logDebug("Current connection status: " + (window.printerService.isConnected ? "Connected" : "Not Connected"));
        } else {
            logDebug("\u2717 Printer service is NOT available");
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