module.exports = {
	packagerConfig: {
		extendInfo: {
			NSDockTilePlugIn: "DockTile.docktileplugin",
		},
		afterComplete: [
			(buildPath, electronVersion, platform, arch, callback) => {
				if (platform == "darwin") {
					// Copy the DockTile plugin to the app bundle
					const fs = require("fs");
					const path = require("path");
					const pluginPath = path.join(
						__dirname,
						"node_modules",
						"electron-mac-dock-icon-switcher",
						"build",
						"Release",
						"DockTile.docktileplugin",
					);
					const pluginDest = path.join(buildPath, "demo.app", "Contents", "PlugIns", "DockTile.docktileplugin");
					fs.mkdirSync(pluginDest, { recursive: true });
					fs.cpSync(pluginPath, pluginDest, { recursive: true, overwrite: true });
				}
				callback();
			},
		],
	},
	makers: [
		{
			name: "@electron-forge/maker-zip",
			config: {
				overwrite: true,
			},
		},
	],
};
