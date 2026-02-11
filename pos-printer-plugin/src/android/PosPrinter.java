package com.pos.printer;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;
import org.json.JSONArray;
import org.json.JSONException;

import android.util.Log;
import android.content.Context;
import android.content.Intent;
import android.os.IBinder;
import android.content.ServiceConnection;
import android.app.Activity;

import java.lang.reflect.Method;
import java.util.concurrent.CountDownLatch;

public class PosPrinter extends CordovaPlugin {
    private static final String TAG = "PosPrinter";
    private Object binder;
    private ServiceConnection conn;
    private Activity activity;
    
    @Override
    protected void pluginInitialize() {
        super.pluginInitialize();
        activity = cordova.getActivity();
        
        // Bind to the printer service
        bindToPrinterService();
    }
    
    private void bindToPrinterService() {
        try {
            Class<?> serviceClass = Class.forName("net.posprinter.service.PosprinterService");
            Intent intent = new Intent(activity, serviceClass);
            
            conn = new ServiceConnection() {
                @Override
                public void onServiceConnected(android.content.ComponentName name, IBinder service) {
                    try {
                        // Get the binder object
                        Class<?> iMyBinderClass = Class.forName("net.posprinter.service.IMyBinder");
                        binder = iMyBinderClass.cast(service);
                        Log.d(TAG, "Service connected successfully");
                    } catch (Exception e) {
                        Log.e(TAG, "Error getting binder: " + e.getMessage());
                    }
                }

                @Override
                public void onServiceDisconnected(android.content.ComponentName name) {
                    binder = null;
                    Log.d(TAG, "Service disconnected");
                }
            };
            
            activity.bindService(intent, conn, Context.BIND_AUTO_CREATE);
        } catch (Exception e) {
            Log.e(TAG, "Error binding to printer service: " + e.getMessage());
        }
    }

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if ("connectNet".equals(action)) {
            String ip = args.getString(0);
            int port = args.getInt(1);
            return connectNet(ip, port, callbackContext);
        } else if ("connectBluetooth".equals(action)) {
            String deviceId = args.getString(0);
            return connectBluetooth(deviceId, callbackContext);
        } else if ("printData".equals(action)) {
            String data = args.getString(0);
            return printData(data, callbackContext);
        } else if ("disconnect".equals(action)) {
            return disconnect(callbackContext);
        }
        return false;
    }

    private boolean connectNet(String ip, int port, CallbackContext callbackContext) {
        try {
            Log.d(TAG, "Connecting to network printer at " + ip + ":" + port);
            
            if (binder == null) {
                callbackContext.error("Printer service not connected");
                return false;
            }
            
            // Use reflection to call ConnectNetPort method
            Class<?> iMyBinderClass = binder.getClass();
            Method connectMethod = iMyBinderClass.getMethod("ConnectNetPort", String.class, int.class, Class.forName("net.posprinter.task.TaskCallback"));
            
            // Create a TaskCallback implementation
            Object taskCallback = createTaskCallback(callbackContext);
            
            connectMethod.invoke(binder, ip, port, taskCallback);
            return true;
        } catch (Exception e) {
            Log.e(TAG, "Network connection error: " + e.getMessage());
            callbackContext.error("Network connection failed: " + e.getMessage());
            return false;
        }
    }

    private boolean connectBluetooth(String deviceId, CallbackContext callbackContext) {
        try {
            Log.d(TAG, "Connecting to Bluetooth printer: " + deviceId);
            
            if (binder == null) {
                callbackContext.error("Printer service not connected");
                return false;
            }
            
            // Use reflection to call ConnectBtPort method
            Class<?> iMyBinderClass = binder.getClass();
            Method connectMethod = iMyBinderClass.getMethod("ConnectBtPort", String.class, Class.forName("net.posprinter.task.TaskCallback"));
            
            // Create a TaskCallback implementation
            Object taskCallback = createTaskCallback(callbackContext);
            
            connectMethod.invoke(binder, deviceId, taskCallback);
            return true;
        } catch (Exception e) {
            Log.e(TAG, "Bluetooth connection error: " + e.getMessage());
            callbackContext.error("Bluetooth connection failed: " + e.getMessage());
            return false;
        }
    }

    private boolean printData(String data, CallbackContext callbackContext) {
        try {
            Log.d(TAG, "Printing data: " + data);
            
            if (binder == null) {
                callbackContext.error("Printer service not connected");
                return false;
            }
            
            // Convert string data to byte array
            byte[] bytes = data.getBytes("UTF-8");
            
            // Use reflection to call WriteSendData method
            Class<?> iMyBinderClass = binder.getClass();
            Method writeMethod = iMyBinderClass.getMethod("WriteSendData", Class.forName("net.posprinter.task.TaskCallback"), Class.forName("net.posprinter.process.ProcessData"));
            
            // Create a ProcessData implementation that returns our byte array
            Object processData = createProcessData(bytes);
            
            // Create a TaskCallback implementation
            Object taskCallback = createTaskCallback(callbackContext);
            
            writeMethod.invoke(binder, taskCallback, processData);
            return true;
        } catch (Exception e) {
            Log.e(TAG, "Print error: " + e.getMessage());
            callbackContext.error("Print failed: " + e.getMessage());
            return false;
        }
    }

    private boolean disconnect(CallbackContext callbackContext) {
        try {
            Log.d(TAG, "Disconnecting printer");
            
            if (binder == null) {
                callbackContext.error("Printer service not connected");
                return false;
            }
            
            // Use reflection to call disconnect method (assuming there's a method for this)
            // Since we don't know the exact method name, we'll try common names
            Class<?> iMyBinderClass = binder.getClass();
            Method disconnectMethod = null;
            
            // Try to find a disconnect method - this might vary depending on the actual SDK
            try {
                disconnectMethod = iMyBinderClass.getMethod("DisConnectCurrentPort", Class.forName("net.posprinter.task.TaskCallback"));
            } catch (NoSuchMethodException e) {
                // If DisConnectCurrentPort doesn't exist, try another common name
                try {
                    disconnectMethod = iMyBinderClass.getMethod("disconnect", Class.forName("net.posprinter.task.TaskCallback"));
                } catch (NoSuchMethodException ex) {
                    // If neither exists, just return success
                    callbackContext.success("Printer disconnected");
                    return true;
                }
            }
            
            // Create a TaskCallback implementation
            Object taskCallback = createTaskCallback(callbackContext);
            
            disconnectMethod.invoke(binder, taskCallback);
            return true;
        } catch (Exception e) {
            Log.e(TAG, "Disconnect error: " + e.getMessage());
            callbackContext.error("Disconnect failed: " + e.getMessage());
            return false;
        }
    }
    
    private Object createTaskCallback(CallbackContext callbackContext) {
        try {
            // Create a dynamic proxy for TaskCallback
            ClassLoader loader = getClass().getClassLoader();
            Class<?>[] interfaces = {Class.forName("net.posprinter.task.TaskCallback")};
            
            return java.lang.reflect.Proxy.newProxyInstance(
                loader,
                interfaces,
                new java.lang.reflect.InvocationHandler() {
                    @Override
                    public Object invoke(Object proxy, java.lang.reflect.Method method, Object[] args) throws Throwable {
                        String methodName = method.getName();
                        
                        if ("onSucceed".equals(methodName)) {
                            // Operation succeeded
                            callbackContext.success("Operation completed successfully");
                            return null;
                        } else if ("onFailed".equals(methodName)) {
                            // Operation failed - args[0] should be an exception
                            Exception error = (Exception) args[0];
                            callbackContext.error("Operation failed: " + error.getMessage());
                            return null;
                        }
                        
                        return null;
                    }
                }
            );
        } catch (Exception e) {
            Log.e(TAG, "Error creating TaskCallback: " + e.getMessage());
            return null;
        }
    }
    
    private Object createProcessData(byte[] data) {
        try {
            // Create a dynamic proxy for ProcessData
            ClassLoader loader = getClass().getClassLoader();
            Class<?> processDataClass = Class.forName("net.posprinter.process.ProcessData");
            Class<?>[] interfaces = {processDataClass};
            
            return java.lang.reflect.Proxy.newProxyInstance(
                loader,
                interfaces,
                new java.lang.reflect.InvocationHandler() {
                    @Override
                    public Object invoke(Object proxy, java.lang.reflect.Method method, Object[] args) throws Throwable {
                        String methodName = method.getName();
                        
                        if ("process".equals(methodName)) {
                            // Return the byte array when process() is called
                            return data;
                        }
                        
                        return null;
                    }
                }
            );
        } catch (Exception e) {
            Log.e(TAG, "Error creating ProcessData: " + e.getMessage());
            return null;
        }
    }
}