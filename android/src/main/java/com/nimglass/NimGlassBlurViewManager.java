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
     * Set blur radius prop
     */
    @ReactProp(name = "blurRadius", defaultFloat = 25f)
    public void setBlurRadius(NimGlassBlurView view, float blurRadius) {
        view.setBlurRadius(blurRadius);
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

    @Override
    @Nullable
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
                .build();
    }
}
