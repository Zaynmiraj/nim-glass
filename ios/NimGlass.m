#import "NimGlass.h"
#import <React/RCTLog.h>

@implementation NimGlass

RCT_EXPORT_MODULE();

/**
 * Check if device supports blur effects
 */
RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(supportsBlur)
{
    return @YES; // iOS always supports UIBlurEffect
}

/**
 * Get iOS version
 */
RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD(getIOSVersion)
{
    return [[UIDevice currentDevice] systemVersion];
}

@end
