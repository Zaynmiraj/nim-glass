#import "NimGlass.h"
#import "NimGlassBlurView.h"
#import <React/RCTViewManager.h>

@implementation NimGlassBlurViewManager

RCT_EXPORT_MODULE(NimGlassBlurView)

- (UIView *)view {
  return [[NimGlassBlurView alloc] init];
}

/**
 * Blur radius prop (1-100)
 */
RCT_EXPORT_VIEW_PROPERTY(blurRadius, CGFloat)

/**
 * Tint color prop (string format: rgba, rgb, hex)
 */
RCT_CUSTOM_VIEW_PROPERTY(tintColor, NSString, NimGlassBlurView) {
  NSString *colorString = [RCTConvert NSString:json];
  [view setTintColorString:colorString];
}

@end
