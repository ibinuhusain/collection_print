// printer-service.js
class PrinterService {
    constructor() {
        this.isConnected = false;
        this.printerType = 'bluetooth'; // or 'network', 'usb'
    }
    
    // Connect to printer
    async connect(options) {
        if (this.printerType === 'network') {
            return await this.connectNetwork(options.ip, options.port);
        } else if (this.printerType === 'bluetooth') {
            return await this.connectBluetooth(options.deviceId);
        } else if (this.printerType === 'usb') {
            return await this.connectUSB(options.devicePath);
        }
    }
    
    // Network printer connection
    async connectNetwork(ip, port) {
        if (window.androidPrinter) {
            return new Promise((resolve, reject) => {
                window.androidPrinter.connectNet(ip, port, 
                    (success) => {
                        this.isConnected = true;
                        resolve(success);
                    },
                    (error) => reject(error)
                );
            });
        }
    }
    
    // Print receipt
    async printReceipt(assignmentData) {
        if (!this.isConnected) {
            throw new Error('Printer not connected');
        }
        
        // Format receipt using POS58 commands
        const receiptText = this.formatReceipt(assignmentData);
        
        return new Promise((resolve, reject) => {
            window.androidPrinter.printData(receiptText,
                (success) => resolve(success),
                (error) => reject(error)
            );
        });
    }
    
    // Format receipt with POS commands
    formatReceipt(assignment) {
        let receipt = '';
        
        // Initialize printer
        receipt += '\x1B\x40'; // Initialize command
        
        // Center align
        receipt += '\x1B\x61\x01'; // Center alignment
        
        // Store name (bold, double height)
        receipt += '\x1B\x21\x30'; // Double height and width
        receipt += 'APPARELS COLLECTION\n';
        receipt += '\x1B\x21\x00'; // Normal text
        
        receipt += '========================\n';
        receipt += '\x1B\x61\x00'; // Left align
        
        // Store details
        receipt += `Store: ${assignment.store_name}\n`;
        receipt += `Agent: ${assignment.agent_name}\n`;
        receipt += `Date: ${assignment.date}\n\n`;
        
        // Collection details
        receipt += `Amount Collected: ${assignment.amount_collected}\n`;
        receipt += `Pending Amount: ${assignment.pending_amount}\n`;
        receipt += `Target Amount: ${assignment.target_amount}\n\n`;
        
        receipt += '========================\n';
        receipt += 'Thank you for your business!\n\n\n\n';
        
        // Cut paper
        receipt += '\x1D\x56\x41\x10'; // Cut command
        
        return receipt;
    }
}

// Global instance
window.printerService = new PrinterService();