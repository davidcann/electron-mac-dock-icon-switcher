#import "DockTilePlugIn.h"

@implementation kDOCK_ICON_CLASS_NAME

- (void)updateDockTile:(NSDockTile *)dockTile path:(NSString *)iconPath {
	if (!iconPath) return;
	NSImage *icon = [[NSImage alloc] initWithContentsOfFile:iconPath];
	if (icon.isValid) {
		NSView *view = [NSView.alloc initWithFrame:NSMakeRect(0, 0, dockTile.size.width, dockTile.size.height)];
		NSImageView *iconView = [NSImageView.alloc initWithFrame:view.frame];
		iconView.image = icon;
		iconView.imageScaling = NSImageScaleProportionallyDown;
		[iconView setFrameSize:dockTile.size];
		[view addSubview:iconView];
		[dockTile setContentView:view];
		[dockTile display];
	}
}

- (void)setDockTile:(NSDockTile *)dockTile {
	if (dockTile) {
		NSString *notificationKey = kDOCK_ICON_NOTIFICATION_KEY; // environment variable
		if (self.updateObserver == nil) {
			self.updateObserver = [NSDistributedNotificationCenter.defaultCenter addObserverForName:notificationKey object:nil queue:nil usingBlock:^(NSNotification *notification) {
				[self updateDockTile:dockTile path:[notification.userInfo objectForKey:@"path"]];
				[[NSUserDefaults standardUserDefaults] setObject:[notification.userInfo objectForKey:@"path"] forKey:notificationKey];
			}];
		}
		NSString *path = [[NSUserDefaults standardUserDefaults] objectForKey:notificationKey];
		[self updateDockTile:dockTile path:path];
	} else if (self.updateObserver) {
		[[NSDistributedNotificationCenter defaultCenter] removeObserver:self.updateObserver];
		self.updateObserver = nil;
	}
}

- (void)dealloc {
	if (self.updateObserver) {
		[[NSDistributedNotificationCenter defaultCenter] removeObserver:self.updateObserver];
		self.updateObserver = nil;
	}
}

@end
