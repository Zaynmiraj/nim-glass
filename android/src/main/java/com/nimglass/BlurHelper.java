package com.nimglass;

import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.os.Build;
import android.renderscript.Allocation;
import android.renderscript.Element;
import android.renderscript.RenderScript;
import android.renderscript.ScriptIntrinsicBlur;
import android.view.View;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

/**
 * BlurHelper - Utility class for applying blur effects to bitmaps
 * 
 * Provides efficient blur implementations:
 * - RenderScript for hardware-accelerated blur (API 17+)
 * - Stack blur fallback for older devices
 */
public class BlurHelper {
    
    private static final float MAX_BLUR_RADIUS = 25f;
    
    /**
     * Apply blur to a bitmap using the best available method
     * 
     * Supports blur radius 1-100 with DEEP blur effect:
     * - Uses aggressive downsampling for intense blur
     * - Multiple passes with maximum radius for strong effect
     * - Higher values (80-100) produce very deep blur
     * 
     * @param context RenderScript context (can be null for fallback)
     * @param bitmap Source bitmap to blur
     * @param blurRadius Blur radius (1-100)
     * @param downsampleFactor Base scale down factor (1-8), will be increased for stronger blur
     * @return Blurred bitmap
     */
    public static Bitmap blur(
            @Nullable RenderScript context,
            @NonNull Bitmap bitmap,
            float blurRadius,
            int downsampleFactor
    ) {
        // Clamp input values
        blurRadius = Math.max(1f, Math.min(100f, blurRadius));
        downsampleFactor = Math.max(1, Math.min(16, downsampleFactor));
        
        // AGGRESSIVE downsampling for deeper blur
        // Higher blur = more downsampling = stronger effect
        int effectiveDownsample = downsampleFactor;
        if (blurRadius > 30) {
            effectiveDownsample = Math.max(effectiveDownsample, 4);
        }
        if (blurRadius > 50) {
            effectiveDownsample = Math.max(effectiveDownsample, 6);
        }
        if (blurRadius > 70) {
            effectiveDownsample = Math.max(effectiveDownsample, 8);
        }
        
        // Scale down for performance and blur intensity
        int width = Math.max(1, bitmap.getWidth() / effectiveDownsample);
        int height = Math.max(1, bitmap.getHeight() / effectiveDownsample);
        
        Bitmap inputBitmap = Bitmap.createScaledBitmap(bitmap, width, height, true);
        Bitmap outputBitmap = inputBitmap;
        
        // Calculate number of blur passes - MORE passes for deeper blur
        // Each pass adds blur, so 4+ passes = very deep blur
        int passes;
        float radiusPerPass;
        
        if (blurRadius <= 25) {
            passes = 1;
            radiusPerPass = blurRadius;
        } else if (blurRadius <= 50) {
            passes = 3;
            radiusPerPass = MAX_BLUR_RADIUS;
        } else if (blurRadius <= 75) {
            passes = 5;
            radiusPerPass = MAX_BLUR_RADIUS;
        } else {
            // Ultra deep blur: 6+ passes with max radius
            passes = 6;
            radiusPerPass = MAX_BLUR_RADIUS;
        }
        
        // Apply blur in multiple passes for DEEP blur effect
        for (int i = 0; i < passes; i++) {
            if (context != null && Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1) {
                try {
                    outputBitmap = renderScriptBlur(context, outputBitmap, radiusPerPass);
                } catch (Exception e) {
                    outputBitmap = stackBlur(outputBitmap, (int) radiusPerPass);
                }
            } else {
                outputBitmap = stackBlur(outputBitmap, (int) radiusPerPass);
            }
        }
        
        // Scale back up - this ALSO adds blur effect due to interpolation
        if (effectiveDownsample > 1) {
            outputBitmap = Bitmap.createScaledBitmap(
                    outputBitmap, 
                    bitmap.getWidth(), 
                    bitmap.getHeight(), 
                    true  // Bilinear filtering adds smoothness
            );
        }
        
        return outputBitmap;
    }
    
    /**
     * Apply blur using RenderScript (API 17+)
     */
    private static Bitmap renderScriptBlur(
            @NonNull RenderScript rs,
            @NonNull Bitmap bitmap,
            float radius
    ) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.JELLY_BEAN_MR1) {
            return bitmap;
        }
        
        Bitmap output = Bitmap.createBitmap(
                bitmap.getWidth(), 
                bitmap.getHeight(), 
                Bitmap.Config.ARGB_8888
        );
        
        Allocation input = Allocation.createFromBitmap(rs, bitmap);
        Allocation outputAlloc = Allocation.createFromBitmap(rs, output);
        
        ScriptIntrinsicBlur script = ScriptIntrinsicBlur.create(rs, Element.U8_4(rs));
        script.setRadius(radius);
        script.setInput(input);
        script.forEach(outputAlloc);
        
        outputAlloc.copyTo(output);
        
        input.destroy();
        outputAlloc.destroy();
        script.destroy();
        
        return output;
    }
    
    /**
     * Stack blur algorithm - pure Java fallback
     * Based on Mario Klingemann's stack blur algorithm
     */
    public static Bitmap stackBlur(Bitmap bitmap, int radius) {
        if (radius < 1) return bitmap;
        
        Bitmap result = bitmap.copy(Bitmap.Config.ARGB_8888, true);
        int w = result.getWidth();
        int h = result.getHeight();
        
        int[] pixels = new int[w * h];
        result.getPixels(pixels, 0, w, 0, 0, w, h);
        
        int wm = w - 1;
        int hm = h - 1;
        int wh = w * h;
        int div = radius + radius + 1;
        
        int[] r = new int[wh];
        int[] g = new int[wh];
        int[] b = new int[wh];
        int[] a = new int[wh];
        int rsum, gsum, bsum, asum, x, y, i, p, yp, yi, yw;
        int[] vmin = new int[Math.max(w, h)];
        
        int divsum = (div + 1) >> 1;
        divsum *= divsum;
        int[] dv = new int[256 * divsum];
        for (i = 0; i < 256 * divsum; i++) {
            dv[i] = (i / divsum);
        }
        
        yw = yi = 0;
        
        int[][] stack = new int[div][4];
        int stackpointer;
        int stackstart;
        int[] sir;
        int rbs;
        int r1 = radius + 1;
        int routsum, goutsum, boutsum, aoutsum;
        int rinsum, ginsum, binsum, ainsum;
        
        for (y = 0; y < h; y++) {
            rinsum = ginsum = binsum = ainsum = routsum = goutsum = boutsum = aoutsum = rsum = gsum = bsum = asum = 0;
            for (i = -radius; i <= radius; i++) {
                p = pixels[yi + Math.min(wm, Math.max(i, 0))];
                sir = stack[i + radius];
                sir[0] = (p & 0x00ff0000) >> 16;
                sir[1] = (p & 0x0000ff00) >> 8;
                sir[2] = (p & 0x000000ff);
                sir[3] = (p & 0xff000000) >>> 24;
                rbs = r1 - Math.abs(i);
                rsum += sir[0] * rbs;
                gsum += sir[1] * rbs;
                bsum += sir[2] * rbs;
                asum += sir[3] * rbs;
                if (i > 0) {
                    rinsum += sir[0];
                    ginsum += sir[1];
                    binsum += sir[2];
                    ainsum += sir[3];
                } else {
                    routsum += sir[0];
                    goutsum += sir[1];
                    boutsum += sir[2];
                    aoutsum += sir[3];
                }
            }
            stackpointer = radius;
            
            for (x = 0; x < w; x++) {
                r[yi] = dv[rsum];
                g[yi] = dv[gsum];
                b[yi] = dv[bsum];
                a[yi] = dv[asum];
                
                rsum -= routsum;
                gsum -= goutsum;
                bsum -= boutsum;
                asum -= aoutsum;
                
                stackstart = stackpointer - radius + div;
                sir = stack[stackstart % div];
                
                routsum -= sir[0];
                goutsum -= sir[1];
                boutsum -= sir[2];
                aoutsum -= sir[3];
                
                if (y == 0) {
                    vmin[x] = Math.min(x + radius + 1, wm);
                }
                p = pixels[yw + vmin[x]];
                
                sir[0] = (p & 0x00ff0000) >> 16;
                sir[1] = (p & 0x0000ff00) >> 8;
                sir[2] = (p & 0x000000ff);
                sir[3] = (p & 0xff000000) >>> 24;
                
                rinsum += sir[0];
                ginsum += sir[1];
                binsum += sir[2];
                ainsum += sir[3];
                
                rsum += rinsum;
                gsum += ginsum;
                bsum += binsum;
                asum += ainsum;
                
                stackpointer = (stackpointer + 1) % div;
                sir = stack[(stackpointer) % div];
                
                routsum += sir[0];
                goutsum += sir[1];
                boutsum += sir[2];
                aoutsum += sir[3];
                
                rinsum -= sir[0];
                ginsum -= sir[1];
                binsum -= sir[2];
                ainsum -= sir[3];
                
                yi++;
            }
            yw += w;
        }
        
        for (x = 0; x < w; x++) {
            rinsum = ginsum = binsum = ainsum = routsum = goutsum = boutsum = aoutsum = rsum = gsum = bsum = asum = 0;
            yp = -radius * w;
            for (i = -radius; i <= radius; i++) {
                yi = Math.max(0, yp) + x;
                
                sir = stack[i + radius];
                
                sir[0] = r[yi];
                sir[1] = g[yi];
                sir[2] = b[yi];
                sir[3] = a[yi];
                
                rbs = r1 - Math.abs(i);
                
                rsum += r[yi] * rbs;
                gsum += g[yi] * rbs;
                bsum += b[yi] * rbs;
                asum += a[yi] * rbs;
                
                if (i > 0) {
                    rinsum += sir[0];
                    ginsum += sir[1];
                    binsum += sir[2];
                    ainsum += sir[3];
                } else {
                    routsum += sir[0];
                    goutsum += sir[1];
                    boutsum += sir[2];
                    aoutsum += sir[3];
                }
                
                if (i < hm) {
                    yp += w;
                }
            }
            yi = x;
            stackpointer = radius;
            for (y = 0; y < h; y++) {
                pixels[yi] = (dv[asum] << 24) | (dv[rsum] << 16) | (dv[gsum] << 8) | dv[bsum];
                
                rsum -= routsum;
                gsum -= goutsum;
                bsum -= boutsum;
                asum -= aoutsum;
                
                stackstart = stackpointer - radius + div;
                sir = stack[stackstart % div];
                
                routsum -= sir[0];
                goutsum -= sir[1];
                boutsum -= sir[2];
                aoutsum -= sir[3];
                
                if (x == 0) {
                    vmin[y] = Math.min(y + r1, hm) * w;
                }
                p = x + vmin[y];
                
                sir[0] = r[p];
                sir[1] = g[p];
                sir[2] = b[p];
                sir[3] = a[p];
                
                rinsum += sir[0];
                ginsum += sir[1];
                binsum += sir[2];
                ainsum += sir[3];
                
                rsum += rinsum;
                gsum += ginsum;
                bsum += binsum;
                asum += ainsum;
                
                stackpointer = (stackpointer + 1) % div;
                sir = stack[stackpointer];
                
                routsum += sir[0];
                goutsum += sir[1];
                boutsum += sir[2];
                aoutsum += sir[3];
                
                rinsum -= sir[0];
                ginsum -= sir[1];
                binsum -= sir[2];
                ainsum -= sir[3];
                
                yi += w;
            }
        }
        
        result.setPixels(pixels, 0, w, 0, 0, w, h);
        return result;
    }
    
    /**
     * Capture a view's drawing as a bitmap
     */
    public static Bitmap captureView(@NonNull View view) {
        Bitmap bitmap = Bitmap.createBitmap(
                view.getWidth(),
                view.getHeight(),
                Bitmap.Config.ARGB_8888
        );
        Canvas canvas = new Canvas(bitmap);
        view.draw(canvas);
        return bitmap;
    }
}
