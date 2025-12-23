package com.nimglass;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.LinearGradient;
import android.graphics.Paint;
import android.graphics.PorterDuff;
import android.graphics.PorterDuffXfermode;
import android.graphics.RectF;
import android.graphics.RenderEffect;
import android.graphics.Shader;
import android.graphics.drawable.BitmapDrawable;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.renderscript.RenderScript;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewTreeObserver;
import android.widget.FrameLayout;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;

/**
 * NimGlassBlurView - Native Android glass/blur effect view
 * 
 * Implements real glassmorphism by:
 * 1. Capturing the background content behind this view
 * 2. Applying Gaussian blur to the captured content
 * 3. Displaying blurred content with tint overlay
 * 4. Supporting inset shadows for depth
 */
public class NimGlassBlurView extends FrameLayout {
    
    // Blur settings
    private float mBlurRadius = 25f;
    private int mDownsampleFactor = 4;
    private int mTintColor = Color.argb(50, 255, 255, 255);
    private float mTintOpacity = 0.15f;
    
    // Inset shadow settings
    private boolean mShowInsetShadow = false;
    private int mInsetShadowColor = Color.argb(100, 0, 0, 0);
    private float mInsetShadowBlur = 12f;
    private float mInsetShadowTop = 4f;
    private float mInsetShadowLeft = 4f;
    
    // Corner radius
    private float mCornerRadius = 16f;
    
    // Rendering
    private Paint mTintPaint;
    private Paint mBitmapPaint;
    private Paint mBorderPaint;
    private Paint mInsetShadowPaint;
    private Bitmap mBlurredBitmap;
    private RenderScript mRenderScript;
    private boolean mIsRendering = false;
    private Handler mHandler;
    
    // State
    private boolean mNeedsRedraw = true;
    
    public NimGlassBlurView(@NonNull Context context) {
        super(context);
        init();
    }
    
    private void init() {
        setWillNotDraw(false);
        mHandler = new Handler(Looper.getMainLooper());
        
        // Initialize RenderScript
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1) {
                mRenderScript = RenderScript.create(getContext());
            }
        } catch (Exception e) {
            mRenderScript = null;
        }
        
        // Tint overlay paint
        mTintPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        mTintPaint.setStyle(Paint.Style.FILL);
        mTintPaint.setColor(mTintColor);
        
        // Bitmap paint for blurred background
        mBitmapPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        mBitmapPaint.setFilterBitmap(true);
        mBitmapPaint.setDither(true);
        
        // Border paint for glass edge highlight
        mBorderPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        mBorderPaint.setStyle(Paint.Style.STROKE);
        mBorderPaint.setStrokeWidth(1f);
        mBorderPaint.setColor(Color.argb(50, 255, 255, 255));
        
        // Inset shadow paint
        mInsetShadowPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        mInsetShadowPaint.setStyle(Paint.Style.FILL);
        
        // Listen for layout changes to update blur
        getViewTreeObserver().addOnPreDrawListener(new ViewTreeObserver.OnPreDrawListener() {
            @Override
            public boolean onPreDraw() {
                if (mNeedsRedraw && getWidth() > 0 && getHeight() > 0) {
                    updateBlurredBackground();
                }
                return true;
            }
        });
        
        // Listen for scroll changes
        getViewTreeObserver().addOnScrollChangedListener(new ViewTreeObserver.OnScrollChangedListener() {
            @Override
            public void onScrollChanged() {
                mNeedsRedraw = true;
            }
        });
    }
    
    /**
     * Set blur radius (1-100)
     */
    public void setBlurRadius(float radius) {
        mBlurRadius = Math.max(1f, Math.min(100f, radius));
        mNeedsRedraw = true;
        invalidate();
    }
    
    /**
     * Set downsample factor for performance (1-8)
     */
    public void setDownsampleFactor(int factor) {
        mDownsampleFactor = Math.max(1, Math.min(8, factor));
        mNeedsRedraw = true;
        invalidate();
    }
    
    /**
     * Set tint color overlay
     */
    public void setTintColor(int color) {
        mTintColor = color;
        mTintPaint.setColor(color);
        invalidate();
    }
    
    /**
     * Parse and set tint color from string
     */
    public void setTintColor(String colorString) {
        try {
            int color = parseColor(colorString);
            setTintColor(color);
        } catch (Exception e) {
            setTintColor(Color.argb(50, 255, 255, 255));
        }
    }
    
    /**
     * Set tint opacity (0-1)
     */
    public void setTintOpacity(float opacity) {
        mTintOpacity = Math.max(0f, Math.min(1f, opacity));
        mTintPaint.setAlpha((int)(mTintOpacity * 255));
        invalidate();
    }
    
    /**
     * Set corner radius
     */
    public void setCornerRadius(float radius) {
        mCornerRadius = Math.max(0f, radius);
        invalidate();
    }
    
    /**
     * Enable/disable inset shadow
     */
    public void setShowInsetShadow(boolean show) {
        mShowInsetShadow = show;
        invalidate();
    }
    
    /**
     * Set inset shadow color
     */
    public void setInsetShadowColor(int color) {
        mInsetShadowColor = color;
        invalidate();
    }
    
    /**
     * Set inset shadow blur radius
     */
    public void setInsetShadowBlur(float blur) {
        mInsetShadowBlur = Math.max(0f, blur);
        invalidate();
    }
    
    /**
     * Update the blurred background bitmap
     */
    private void updateBlurredBackground() {
        if (mIsRendering || getWidth() <= 0 || getHeight() <= 0) {
            return;
        }
        
        mIsRendering = true;
        mNeedsRedraw = false;
        
        // Get parent view to capture background
        View parent = (View) getParent();
        if (parent == null) {
            mIsRendering = false;
            return;
        }
        
        try {
            // Capture parent's drawing (excluding this view)
            setVisibility(View.INVISIBLE);
            Bitmap parentBitmap = captureParentView(parent);
            setVisibility(View.VISIBLE);
            
            if (parentBitmap != null) {
                // Get this view's position in parent
                int[] location = new int[2];
                getLocationInWindow(location);
                int[] parentLocation = new int[2];
                parent.getLocationInWindow(parentLocation);
                
                int x = location[0] - parentLocation[0];
                int y = location[1] - parentLocation[1];
                
                // Crop to this view's bounds
                int cropX = Math.max(0, Math.min(x, parentBitmap.getWidth() - 1));
                int cropY = Math.max(0, Math.min(y, parentBitmap.getHeight() - 1));
                int cropWidth = Math.min(getWidth(), parentBitmap.getWidth() - cropX);
                int cropHeight = Math.min(getHeight(), parentBitmap.getHeight() - cropY);
                
                if (cropWidth > 0 && cropHeight > 0) {
                    Bitmap croppedBitmap = Bitmap.createBitmap(
                            parentBitmap, cropX, cropY, cropWidth, cropHeight
                    );
                    
                    // Apply blur
                    mBlurredBitmap = BlurHelper.blur(
                            mRenderScript, 
                            croppedBitmap, 
                            mBlurRadius, 
                            mDownsampleFactor
                    );
                    
                    croppedBitmap.recycle();
                }
                
                parentBitmap.recycle();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        mIsRendering = false;
        invalidate();
    }
    
    /**
     * Capture parent view's drawing
     */
    private Bitmap captureParentView(View parent) {
        try {
            Bitmap bitmap = Bitmap.createBitmap(
                    parent.getWidth(),
                    parent.getHeight(),
                    Bitmap.Config.ARGB_8888
            );
            Canvas canvas = new Canvas(bitmap);
            parent.draw(canvas);
            return bitmap;
        } catch (Exception e) {
            return null;
        }
    }
    
    @Override
    protected void onDraw(@NonNull Canvas canvas) {
        super.onDraw(canvas);
        
        float width = getWidth();
        float height = getHeight();
        RectF rect = new RectF(0, 0, width, height);
        
        // Save for clipping
        canvas.save();
        
        // Clip to rounded rect
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            canvas.clipOutRect(0, 0, 0, 0); // Reset clip
        }
        
        // Draw blurred background
        if (mBlurredBitmap != null && !mBlurredBitmap.isRecycled()) {
            canvas.drawBitmap(mBlurredBitmap, null, rect, mBitmapPaint);
        } else {
            // Fallback: semi-transparent background
            Paint fallbackPaint = new Paint();
            fallbackPaint.setColor(Color.argb(180, 255, 255, 255));
            canvas.drawRoundRect(rect, mCornerRadius, mCornerRadius, fallbackPaint);
        }
        
        // Draw tint overlay
        canvas.drawRoundRect(rect, mCornerRadius, mCornerRadius, mTintPaint);
        
        // Draw inset shadows if enabled
        if (mShowInsetShadow) {
            drawInsetShadows(canvas, rect);
        }
        
        // Draw border highlight
        canvas.drawRoundRect(rect, mCornerRadius, mCornerRadius, mBorderPaint);
        
        canvas.restore();
    }
    
    /**
     * Draw inset shadows for depth effect
     */
    private void drawInsetShadows(Canvas canvas, RectF rect) {
        // Top inset shadow
        if (mInsetShadowTop > 0) {
            LinearGradient topGradient = new LinearGradient(
                    0, 0, 0, mInsetShadowBlur,
                    mInsetShadowColor,
                    Color.TRANSPARENT,
                    Shader.TileMode.CLAMP
            );
            mInsetShadowPaint.setShader(topGradient);
            canvas.drawRect(0, 0, rect.width(), mInsetShadowBlur, mInsetShadowPaint);
        }
        
        // Left inset shadow
        if (mInsetShadowLeft > 0) {
            LinearGradient leftGradient = new LinearGradient(
                    0, 0, mInsetShadowBlur, 0,
                    mInsetShadowColor,
                    Color.TRANSPARENT,
                    Shader.TileMode.CLAMP
            );
            mInsetShadowPaint.setShader(leftGradient);
            canvas.drawRect(0, 0, mInsetShadowBlur, rect.height(), mInsetShadowPaint);
        }
    }
    
    /**
     * Parse color string (supports rgba, rgb, hex)
     */
    private int parseColor(String colorString) {
        if (colorString == null || colorString.isEmpty()) {
            return Color.argb(50, 255, 255, 255);
        }
        
        // Handle rgba(r, g, b, a) format
        if (colorString.startsWith("rgba")) {
            String values = colorString.substring(5, colorString.length() - 1);
            String[] parts = values.split(",");
            if (parts.length >= 4) {
                int r = Integer.parseInt(parts[0].trim());
                int g = Integer.parseInt(parts[1].trim());
                int b = Integer.parseInt(parts[2].trim());
                float a = Float.parseFloat(parts[3].trim());
                return Color.argb((int)(a * 255), r, g, b);
            }
        }
        
        // Handle rgb(r, g, b) format
        if (colorString.startsWith("rgb")) {
            String values = colorString.substring(4, colorString.length() - 1);
            String[] parts = values.split(",");
            if (parts.length >= 3) {
                int r = Integer.parseInt(parts[0].trim());
                int g = Integer.parseInt(parts[1].trim());
                int b = Integer.parseInt(parts[2].trim());
                return Color.rgb(r, g, b);
            }
        }
        
        // Try hex
        return Color.parseColor(colorString);
    }
    
    /**
     * Force refresh the blur
     */
    public void refresh() {
        mNeedsRedraw = true;
        invalidate();
    }
    
    @Override
    protected void onDetachedFromWindow() {
        super.onDetachedFromWindow();
        
        // Clean up
        if (mBlurredBitmap != null && !mBlurredBitmap.isRecycled()) {
            mBlurredBitmap.recycle();
            mBlurredBitmap = null;
        }
        
        if (mRenderScript != null) {
            mRenderScript.destroy();
            mRenderScript = null;
        }
    }
    
    @Override
    protected void onSizeChanged(int w, int h, int oldw, int oldh) {
        super.onSizeChanged(w, h, oldw, oldh);
        mNeedsRedraw = true;
    }
}
