package com.nimglass;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;

/**
 * NimGlass Native Module
 * 
 * Provides utility methods for blur effects.
 */
@ReactModule(name = NimGlassModule.NAME)
public class NimGlassModule extends ReactContextBaseJavaModule {
    public static final String NAME = "NimGlass";

    public NimGlassModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }

    /**
     * Check if device supports hardware blur (Android 12+)
     */
    @ReactMethod(isBlockingSynchronousMethod = true)
    public boolean supportsHardwareBlur() {
        return android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.S;
    }

    /**
     * Get the Android API level
     */
    @ReactMethod(isBlockingSynchronousMethod = true)
    public int getApiLevel() {
        return android.os.Build.VERSION.SDK_INT;
    }
}
