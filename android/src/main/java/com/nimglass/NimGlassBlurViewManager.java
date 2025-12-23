package com.nimglass;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

/**
 * NimGlassBlurViewManager - React Native View Manager
 * 
 * Manages the native blur view component and exposes props to React Native.
 */
public class NimGlassBlurViewManager extends SimpleViewManager<NimGlassBlurView> {
    
    public static final String REACT_CLASS = "NimGlassBlurView";
    
    @Override
    @NonNull
    public String getName() {
        return REACT_CLASS;
    }
    
    @Override
    @NonNull
    protected NimGlassBlurView createViewInstance(@NonNull ThemedReactContext context) {
        return new NimGlassBlurView(context);
    }
    
    /**
     * Set blur radius prop (1-100)
     */
    @ReactProp(name = "blurRadius", defaultFloat = 25f)
    public void setBlurRadius(NimGlassBlurView view, float blurRadius) {
        view.setBlurRadius(blurRadius);
    }
    
    /**
     * Set downsample factor for performance (1-8)
     * Higher = faster but lower quality
     */
    @ReactProp(name = "downsampleFactor", defaultInt = 4)
    public void setDownsampleFactor(NimGlassBlurView view, int factor) {
        view.setDownsampleFactor(factor);
    }
    
    /**
     * Set tint color prop
     */
    @ReactProp(name = "tintColor")
    public void setTintColor(NimGlassBlurView view, @Nullable String tintColor) {
        if (tintColor != null) {
            view.setTintColor(tintColor);
        }
    }
    
    /**
     * Set tint opacity (0-1)
     */
    @ReactProp(name = "tintOpacity", defaultFloat = 0.15f)
    public void setTintOpacity(NimGlassBlurView view, float opacity) {
        view.setTintOpacity(opacity);
    }
    
    /**
     * Set corner radius
     */
    @ReactProp(name = "cornerRadius", defaultFloat = 16f)
    public void setCornerRadius(NimGlassBlurView view, float radius) {
        view.setCornerRadius(radius);
    }
    
    /**
     * Enable/disable inset shadow
     */
    @ReactProp(name = "showInsetShadow", defaultBoolean = false)
    public void setShowInsetShadow(NimGlassBlurView view, boolean show) {
        view.setShowInsetShadow(show);
    }
    
    /**
     * Set inset shadow blur radius
     */
    @ReactProp(name = "insetShadowBlur", defaultFloat = 12f)
    public void setInsetShadowBlur(NimGlassBlurView view, float blur) {
        view.setInsetShadowBlur(blur);
    }
    
    @Override
    @Nullable
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
            .build();
    }
    
    /**
     * Native commands that can be called from JS
     */
    @Override
    public Map<String, Integer> getCommandsMap() {
        return MapBuilder.of(
            "refresh", 1
        );
    }
    
    /**
     * Receive commands from JS
     */
    @Override
    public void receiveCommand(
            @NonNull NimGlassBlurView view,
            String commandId,
            @Nullable com.facebook.react.bridge.ReadableArray args
    ) {
        if ("refresh".equals(commandId) || "1".equals(commandId)) {
            view.refresh();
        }
    }
}
