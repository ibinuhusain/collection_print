/**
 * Communication Bridge for Remote Pages
 * This script should be included in your remote pages to communicate with the hybrid app
 */

class PluginCommunicationBridge {
    constructor() {
        this.isReady = false;
        this.callbacks = {};
        this.callbackId = 0;
        
        // Listen for responses from the parent app
        window.addEventListener('message', this.handleMessage.bind(this));
        
        // Check if we're in an iframe (inside the hybrid app)
        this.inIframe = window.self !== window.top;
        
        if (this.inIframe) {
            console.log('PluginCommunicationBridge: Detected running inside hybrid app iframe');
            this.initialize();
        } else {
            console.log('PluginCommunicationBridge: Running outside hybrid app (standalone)');
        }
    }
    
    initialize() {
        // Send a readiness check to the parent app
        this.sendMessage({
            type: 'checkPluginAvailability'
        });
    }
    
    sendMessage(message) {
        if (window.parent) {
            window.parent.postMessage(message, '*');
        }
    }
    
    handleMessage(event) {
        // Only process messages from parent window
        if (event.source !== window.parent) {
            return;
        }
        
        const { type, success, error, payload, callbackId } = event.data;
        
        switch(type) {
            case 'pluginAvailabilityResponse':
                this.isReady = success;
                console.log('PluginCommunicationBridge: Plugin availability:', success);
                break;
                
            case 'printResponse':
                if (callbackId && this.callbacks[callbackId]) {
                    this.callbacks[callbackId](success, error);
                    delete this.callbacks[callbackId];
                }
                break;
                
            case 'printerStatusResponse':
                if (callbackId && this.callbacks[callbackId]) {
                    this.callbacks[callbackId](payload.isConnected);
                    delete this.callbacks[callbackId];
                }
                break;
                
            case 'connectResponse':
                if (callbackId && this.callbacks[callbackId]) {
                    this.callbacks[callbackId](success, error);
                    delete this.callbacks[callbackId];
                }
                break;
                
            case 'disconnectResponse':
                if (callbackId && this.callbacks[callbackId]) {
                    this.callbacks[callbackId](success, error);
                    delete this.callbacks[callbackId];
                }
                break;
        }
    }
    
    generateCallbackId() {
        return ++this.callbackId;
    }
    
    // Public methods to interact with plugins
    async requestPrint(type, data) {
        if (!this.inIframe) {
            throw new Error('Not running inside hybrid app');
        }
        
        return new Promise((resolve, reject) => {
            const callbackId = this.generateCallbackId();
            this.callbacks[callbackId] = (success, error) => {
                if (success) {
                    resolve();
                } else {
                    reject(new Error(error));
                }
            };
            
            this.sendMessage({
                type: 'requestPrint',
                payload: { type, data },
                callbackId
            });
        });
    }
    
    async requestPrinterStatus() {
        if (!this.inIframe) {
            return { isConnected: false };
        }
        
        return new Promise((resolve) => {
            const callbackId = this.generateCallbackId();
            this.callbacks[callbackId] = (isConnected) => {
                resolve({ isConnected });
                delete this.callbacks[callbackId];
            };
            
            this.sendMessage({
                type: 'requestPrinterStatus',
                callbackId
            });
        });
    }
    
    async requestConnect(config) {
        if (!this.inIframe) {
            throw new Error('Not running inside hybrid app');
        }
        
        return new Promise((resolve, reject) => {
            const callbackId = this.generateCallbackId();
            this.callbacks[callbackId] = (success, error) => {
                if (success) {
                    resolve();
                } else {
                    reject(new Error(error));
                }
            };
            
            this.sendMessage({
                type: 'requestConnect',
                payload: config,
                callbackId
            });
        });
    }
    
    async requestDisconnect() {
        if (!this.inIframe) {
            throw new Error('Not running inside hybrid app');
        }
        
        return new Promise((resolve, reject) => {
            const callbackId = this.generateCallbackId();
            this.callbacks[callbackId] = (success, error) => {
                if (success) {
                    resolve();
                } else {
                    reject(new Error(error));
                }
            };
            
            this.sendMessage({
                type: 'requestDisconnect',
                callbackId
            });
        });
    }
}

// Create a global instance
const pluginBridge = new PluginCommunicationBridge();

// Export for use in modules (if using module system)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PluginCommunicationBridge;
}