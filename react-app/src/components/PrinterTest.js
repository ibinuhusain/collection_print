import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function PrinterTest({ currentUser }) {
  const [printerStatus, setPrinterStatus] = useState('Not connected');
  const [printerType, setPrinterType] = useState('bluetooth');
  const [bluetoothDevice, setBluetoothDevice] = useState('');
  const [printerIp, setPrinterIp] = useState('192.168.1.100');
  const [printerPort, setPrinterPort] = useState('9100');
  const [testContent, setTestContent] = useState('Test thermal print from Apparels Collection system. This is a test of the thermal printing functionality. If you can read this, the printer is working correctly!');
  const [storeName, setStoreName] = useState('TEST STORE NAME');
  const [agentName, setAgentName] = useState('TEST AGENT');
  const [amountCollected, setAmountCollected] = useState('Rs. 5,000.00');
  const [pendingAmount, setPendingAmount] = useState('Rs. 2,500.00');
  const [targetAmount, setTargetAmount] = useState('Rs. 10,000.00');
  const [printerList, setPrinterList] = useState([]);
  const [showPrinterList, setShowPrinterList] = useState(false);
  const [debugInfo, setDebugInfo] = useState([]);

  // Simulate printer service availability
  const printerServiceAvailable = true;

  useEffect(() => {
    if (printerServiceAvailable) {
      setPrinterStatus('Ready - Printer service available');
    } else {
      setPrinterStatus('Warning - Printer service not available');
    }
  }, []);

  const addDebugInfo = (message) => {
    const timestamp = new Date().toISOString();
    setDebugInfo(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 9)]);
  };

  const handleDiscoverPrinters = async () => {
    if (!printerServiceAvailable) {
      setPrinterStatus('Printer service not available');
      addDebugInfo('Printer service not available');
      return;
    }

    try {
      addDebugInfo('Discovering Bluetooth printers...');
      
      // Simulate discovering printers
      setTimeout(() => {
        const mockPrinters = [
          { id: '00:11:22:33:AA:BB', name: 'Example Printer 1', type: 'bluetooth' },
          { id: 'CC:DD:EE:FF:11:22', name: 'Example Printer 2', type: 'bluetooth' }
        ];
        
        setPrinterList(mockPrinters);
        setShowPrinterList(true);
        setPrinterStatus(`${mockPrinters.length} printer(s) found`);
        addDebugInfo(`${mockPrinters.length} printer(s) found`);
      }, 1000);
    } catch (error) {
      console.error("Discovery error:", error);
      setPrinterStatus(`Discovery failed: ${error.message}`);
      addDebugInfo(`Discovery failed: ${error.message}`);
    }
  };

  const handleConnect = async () => {
    if (!printerServiceAvailable) {
      setPrinterStatus('Printer service not available');
      addDebugInfo('Printer service not available');
      return;
    }

    try {
      addDebugInfo(`Attempting to connect to ${printerType} printer`);
      
      // Simulate connecting to printer
      setTimeout(() => {
        if (printerType === 'wifi') {
          if (!printerIp || !printerPort) {
            setPrinterStatus('Please enter valid IP address and port');
            addDebugInfo('Invalid IP or port');
            return;
          }
          
          setPrinterStatus(`Successfully connected to WiFi printer at ${printerIp}:${printerPort}`);
          addDebugInfo(`Connected to WiFi printer at ${printerIp}:${printerPort}`);
        } else {
          if (!bluetoothDevice) {
            setPrinterStatus('Please enter Bluetooth device ID/MAC address');
            addDebugInfo('Missing Bluetooth device ID');
            return;
          }
          
          setPrinterStatus(`Successfully connected to Bluetooth printer: ${bluetoothDevice}`);
          addDebugInfo(`Connected to Bluetooth printer: ${bluetoothDevice}`);
        }
      }, 1000);
    } catch (error) {
      console.error("Connection error:", error);
      setPrinterStatus(`Connection failed: ${error.message}`);
      addDebugInfo(`Connection failed: ${error.message}`);
    }
  };

  const handlePrintReceipt = async () => {
    if (!printerServiceAvailable) {
      setPrinterStatus('Printer service not available');
      addDebugInfo('Printer service not available');
      return;
    }

    try {
      const assignmentData = {
        store_name: storeName,
        agent_name: agentName,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        amount_collected: amountCollected,
        pending_amount: pendingAmount,
        target_amount: targetAmount
      };

      addDebugInfo("Attempting to print receipt");
      addDebugInfo(`Receipt data: ${JSON.stringify(assignmentData)}`);

      // Simulate printing
      setTimeout(() => {
        setPrinterStatus("Receipt printed successfully!");
        addDebugInfo("Receipt printed successfully!");
      }, 1000);
    } catch (error) {
      console.error("Print error:", error);
      setPrinterStatus(`Print failed: ${error.message}`);
      addDebugInfo(`Print failed: ${error.message}`);
    }
  };

  const handlePrintCustom = async () => {
    if (!printerServiceAvailable) {
      setPrinterStatus('Printer service not available');
      addDebugInfo('Printer service not available');
      return;
    }

    if (!testContent.trim()) {
      setPrinterStatus('Please enter some text to print');
      addDebugInfo('No text to print');
      return;
    }

    try {
      addDebugInfo("Attempting to print custom text");

      // Simulate printing
      setTimeout(() => {
        setPrinterStatus("Custom text printed successfully!");
        addDebugInfo("Custom text printed successfully!");
      }, 1000);
    } catch (error) {
      console.error("Custom print error:", error);
      setPrinterStatus(`Custom print failed: ${error.message}`);
      addDebugInfo(`Custom print failed: ${error.message}`);
    }
  };

  const handleDisconnect = async () => {
    if (!printerServiceAvailable) {
      setPrinterStatus('Printer service not available');
      addDebugInfo('Printer service not available');
      return;
    }

    try {
      addDebugInfo("Attempting to disconnect printer");

      // Simulate disconnecting
      setTimeout(() => {
        setPrinterStatus("Printer disconnected successfully");
        addDebugInfo("Printer disconnected successfully");
      }, 1000);
    } catch (error) {
      console.error("Disconnect error:", error);
      setPrinterStatus(`Disconnect failed: ${error.message}`);
      addDebugInfo(`Disconnect failed: ${error.message}`);
    }
  };

  const handlePrinterItemClick = (printer) => {
    setBluetoothDevice(printer.id);
    setPrinterStatus(`Selected printer: ${printer.name} (${printer.id})`);
    setShowPrinterList(false);
  };

  return (
    <div className="container">
      <div className="navbar">
        <h2>Printer Test</h2>
        <div>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/assignments">Assignments</Link>
          <Link to="/printer">Printer</Link>
        </div>
      </div>

      <h3 className="page-title">Thermal Printer Test Page</h3>

      <div className="printer-controls">
        <div className="status info">Printer Status: {printerStatus}</div>

        <div className="form-group">
          <label htmlFor="printerType">Printer Type:</label>
          <select 
            id="printerType" 
            value={printerType} 
            onChange={(e) => setPrinterType(e.target.value)}
          >
            <option value="bluetooth">Bluetooth</option>
            <option value="wifi">WiFi</option>
          </select>
        </div>

        {printerType === 'bluetooth' ? (
          <div id="bluetoothSection">
            <div className="form-group">
              <label htmlFor="bluetoothDevice">Bluetooth Device ID/MAC:</label>
              <input
                type="text"
                id="bluetoothDevice"
                value={bluetoothDevice}
                onChange={(e) => setBluetoothDevice(e.target.value)}
                placeholder="e.g., 00:11:22:33:AA:BB"
              />
            </div>
            <button onClick={handleDiscoverPrinters} className="btn-secondary">
              Discover Bluetooth Printers
            </button>
            
            {showPrinterList && printerList.length > 0 && (
              <div className="printer-list">
                <h4>Available Printers:</h4>
                {printerList.map((printer, index) => (
                  <div 
                    key={index} 
                    className="printer-item"
                    onClick={() => handlePrinterItemClick(printer)}
                  >
                    <strong>{printer.name}</strong> ({printer.id}) - {printer.type}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div id="wifiSection">
            <div className="form-group">
              <label htmlFor="printerIp">Printer IP Address:</label>
              <input
                type="text"
                id="printerIp"
                value={printerIp}
                onChange={(e) => setPrinterIp(e.target.value)}
                placeholder="e.g., 192.168.1.100"
              />
            </div>

            <div className="form-group">
              <label htmlFor="printerPort">Printer Port:</label>
              <input
                type="text"
                id="printerPort"
                value={printerPort}
                onChange={(e) => setPrinterPort(e.target.value)}
                placeholder="e.g., 9100"
              />
            </div>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="testContent">Test Content:</label>
          <textarea
            id="testContent"
            value={testContent}
            onChange={(e) => setTestContent(e.target.value)}
            rows="4"
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <button onClick={handleConnect}>Connect to Printer</button>
        <button onClick={handlePrintReceipt} className="btn-secondary">Print Test Receipt</button>
        <button onClick={handlePrintCustom} className="btn-secondary">Print Custom Text</button>
        <button onClick={handleDisconnect} className="btn-danger">Disconnect</button>
      </div>

      <h3>Test Data for Receipt</h3>
      <div className="form-group">
        <label htmlFor="storeName">Store Name:</label>
        <input
          type="text"
          id="storeName"
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="agentName">Agent Name:</label>
        <input
          type="text"
          id="agentName"
          value={agentName}
          onChange={(e) => setAgentName(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="amountCollected">Amount Collected:</label>
        <input
          type="text"
          id="amountCollected"
          value={amountCollected}
          onChange={(e) => setAmountCollected(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="pendingAmount">Pending Amount:</label>
        <input
          type="text"
          id="pendingAmount"
          value={pendingAmount}
          onChange={(e) => setPendingAmount(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="targetAmount">Target Amount:</label>
        <input
          type="text"
          id="targetAmount"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
        />
      </div>

      {debugInfo.length > 0 && (
        <div id="debugInfo" style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
          <h4>Debug Information:</h4>
          <pre>{debugInfo.join('\n')}</pre>
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        <Link to="/dashboard">
          <button>Back to Dashboard</button>
        </Link>
      </div>
    </div>
  );
}

export default PrinterTest;