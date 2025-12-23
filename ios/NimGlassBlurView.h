#import <UIKit/UIKit.h>

/**
 * NimGlassBlurView
 *
 * Native iOS blur view using UIVisualEffectView.
 * Supports dynamic blur radius and tint color.
 */
@interface NimGlassBlurView : UIView

@property(nonatomic, assign) CGFloat blurRadius;
@property(nonatomic, strong) UIColor *tintColor;

/**
 * Set tint color from string (rgba, rgb, or hex format)
 */
- (void)setTintColorString:(NSString *)colorString;

@end
