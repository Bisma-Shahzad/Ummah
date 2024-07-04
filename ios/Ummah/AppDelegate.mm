#import "AppDelegate.h"
#import <Firebase.h>
#import <RNFBDynamicLinksAppDelegateInterceptor.h>  // add this line

#import <React/RCTBundleURLProvider.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [FIRApp configure];
    // Enable Firebase messaging auto initialization
  [RNFBDynamicLinksAppDelegateInterceptor sharedInstance]; // add this line

//  [FIRMessaging messaging].autoInitEnaÏbled = YES;

  self.moduleName = @"Ummah";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};


  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
