#import <React/RCTBridgeModule.h>
#import <React/RCTViewManager.h>

/**
 * NimGlass iOS Module
 *
 * Provides native blur effects using UIVisualEffectView.
 */
@interface NimGlass : NSObject <RCTBridgeModule>
@end

/**
 * NimGlass Blur View Manager
 *
 * Manages the native blur view component.
 */
@interface NimGlassBlurViewManager : RCTViewManager
@end
