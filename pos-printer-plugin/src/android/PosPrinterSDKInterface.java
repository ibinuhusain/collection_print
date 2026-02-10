package com.pos.printer;

/**
 * Interface representing the expected functionality of the PosPrinterSDK
 * This is a placeholder for the actual SDK that should be included as a .jar file
 */
public interface PosPrinterSDKInterface {
    /**
     * Connect to a network printer
     * @param ip IP address of the printer
     * @param port Port number of the printer
     * @return true if connection successful, false otherwise
     */
    boolean connectNet(String ip, int port);

    /**
     * Connect to a Bluetooth printer
     * @param deviceAddress MAC address of the Bluetooth device
     * @return true if connection successful, false otherwise
     */
    boolean connectBluetooth(String deviceAddress);

    /**
     * Print raw data to the connected printer
     * @param data Raw data to print (with POS commands)
     * @return true if print successful, false otherwise
     */
    boolean printData(String data);

    /**
     * Disconnect from the current printer
     * @return true if disconnection successful, false otherwise
     */
    boolean disconnect();

    /**
     * Check if printer is currently connected
     * @return true if connected, false otherwise
     */
    boolean isConnected();

    /**
     * Print text with formatting options
     * @param text Text to print
     * @param fontSize Font size
     * @param isBold Whether text should be bold
     * @param alignment Alignment (left, center, right)
     * @return true if print successful, false otherwise
     */
    boolean printFormattedText(String text, int fontSize, boolean isBold, int alignment);
}