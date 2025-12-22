#import "NimGlassBlurView.h"

@interface NimGlassBlurView ()

@property(nonatomic, strong) UIVisualEffectView *blurEffectView;
@property(nonatomic, strong) UIView *tintOverlay;
@property(nonatomic, strong) UIBlurEffect *blurEffect;

@end

@implementation NimGlassBlurView

- (instancetype)initWithFrame:(CGRect)frame {
  self = [super initWithFrame:frame];
  if (self) {
    [self setupViews];
  }
  return self;
}

- (void)setupViews {
  // Default blur radius maps to blur style
  _blurRadius = 25.0;

  // Create blur effect view
  _blurEffect = [UIBlurEffect effectWithStyle:UIBlurEffectStyleLight];
  _blurEffectView = [[UIVisualEffectView alloc] initWithEffect:_blurEffect];
  _blurEffectView.frame = self.bounds;
  _blurEffectView.autoresizingMask =
      UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
  [self addSubview:_blurEffectView];

  // Create tint overlay
  _tintOverlay = [[UIView alloc] initWithFrame:self.bounds];
  _tintOverlay.autoresizingMask =
      UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
  _tintOverlay.backgroundColor = [UIColor colorWithWhite:1.0 alpha:0.1];
  [self addSubview:_tintOverlay];

  // Make sure clips to bounds
  self.clipsToBounds = YES;
}

- (void)layoutSubviews {
  [super layoutSubviews];
  _blurEffectView.frame = self.bounds;
  _tintOverlay.frame = self.bounds;
}

/**
 * Set blur radius - maps to different blur styles
 */
- (void)setBlurRadius:(CGFloat)blurRadius {
  _blurRadius = blurRadius;

  UIBlurEffectStyle style;

  // Map blur radius to iOS blur effect styles
  if (blurRadius < 15) {
    // Light blur
    if (@available(iOS 13.0, *)) {
      style = UIBlurEffectStyleSystemUltraThinMaterialLight;
    } else {
      style = UIBlurEffectStyleExtraLight;
    }
  } else if (blurRadius < 35) {
    // Medium blur
    if (@available(iOS 13.0, *)) {
      style = UIBlurEffectStyleSystemThinMaterialLight;
    } else {
      style = UIBlurEffectStyleLight;
    }
  } else if (blurRadius < 60) {
    // Heavy blur
    if (@available(iOS 13.0, *)) {
      style = UIBlurEffectStyleSystemMaterialLight;
    } else {
      style = UIBlurEffectStyleLight;
    }
  } else {
    // Ultra blur
    if (@available(iOS 13.0, *)) {
      style = UIBlurEffectStyleSystemThickMaterialLight;
    } else {
      style = UIBlurEffectStyleRegular;
    }
  }

  // Apply new blur effect
  _blurEffect = [UIBlurEffect effectWithStyle:style];
  _blurEffectView.effect = _blurEffect;
}

/**
 * Set tint color overlay
 */
- (void)setTintColor:(UIColor *)tintColor {
  [super setTintColor:tintColor];
  _tintOverlay.backgroundColor = tintColor;
}

/**
 * Parse color string and set tint
 */
- (void)setTintColorString:(NSString *)colorString {
  if (!colorString || colorString.length == 0) {
    _tintOverlay.backgroundColor = [UIColor colorWithWhite:1.0 alpha:0.1];
    return;
  }

  // Parse rgba(r, g, b, a) format
  if ([colorString hasPrefix:@"rgba("]) {
    NSString *values =
        [colorString substringWithRange:NSMakeRange(5, colorString.length - 6)];
    NSArray *parts = [values componentsSeparatedByString:@","];

    if (parts.count >= 4) {
      CGFloat r =
          [[parts[0]
              stringByTrimmingCharactersInSet:[NSCharacterSet
                                                  whitespaceCharacterSet]]
              floatValue] /
          255.0;
      CGFloat g =
          [[parts[1]
              stringByTrimmingCharactersInSet:[NSCharacterSet
                                                  whitespaceCharacterSet]]
              floatValue] /
          255.0;
      CGFloat b =
          [[parts[2]
              stringByTrimmingCharactersInSet:[NSCharacterSet
                                                  whitespaceCharacterSet]]
              floatValue] /
          255.0;
      CGFloat a = [[parts[3]
          stringByTrimmingCharactersInSet:[NSCharacterSet
                                              whitespaceCharacterSet]]
          floatValue];

      _tintOverlay.backgroundColor = [UIColor colorWithRed:r
                                                     green:g
                                                      blue:b
                                                     alpha:a];
      return;
    }
  }

  // Parse rgb(r, g, b) format
  if ([colorString hasPrefix:@"rgb("]) {
    NSString *values =
        [colorString substringWithRange:NSMakeRange(4, colorString.length - 5)];
    NSArray *parts = [values componentsSeparatedByString:@","];

    if (parts.count >= 3) {
      CGFloat r =
          [[parts[0]
              stringByTrimmingCharactersInSet:[NSCharacterSet
                                                  whitespaceCharacterSet]]
              floatValue] /
          255.0;
      CGFloat g =
          [[parts[1]
              stringByTrimmingCharactersInSet:[NSCharacterSet
                                                  whitespaceCharacterSet]]
              floatValue] /
          255.0;
      CGFloat b =
          [[parts[2]
              stringByTrimmingCharactersInSet:[NSCharacterSet
                                                  whitespaceCharacterSet]]
              floatValue] /
          255.0;

      _tintOverlay.backgroundColor = [UIColor colorWithRed:r
                                                     green:g
                                                      blue:b
                                                     alpha:1.0];
      return;
    }
  }

  // Try hex color parsing
  if ([colorString hasPrefix:@"#"]) {
    NSString *hex = [colorString substringFromIndex:1];
    unsigned int hexValue = 0;
    [[NSScanner scannerWithString:hex] scanHexInt:&hexValue];

    if (hex.length == 6) {
      CGFloat r = ((hexValue >> 16) & 0xFF) / 255.0;
      CGFloat g = ((hexValue >> 8) & 0xFF) / 255.0;
      CGFloat b = (hexValue & 0xFF) / 255.0;
      _tintOverlay.backgroundColor = [UIColor colorWithRed:r
                                                     green:g
                                                      blue:b
                                                     alpha:1.0];
      return;
    }
  }

  // Default fallback
  _tintOverlay.backgroundColor = [UIColor colorWithWhite:1.0 alpha:0.1];
}

@end
