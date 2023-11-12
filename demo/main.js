const { app, BrowserWindow, systemPreferences } = require("electron");
const path = require("path");
const fs = require("fs");
const ini = require("ini");

const npmrc = ini.parse(fs.readFileSync(path.join(__dirname, ".npmrc"), "utf-8"));
const notificationKey = npmrc.dock_icon_notification_key;
let mainWindow;

function setDockIcon(name) {
	const iconPath = path.join(__dirname, "assets", name);
	systemPreferences.postNotification(notificationKey, { path: iconPath });
}

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 400,
		height: 160,
		backgroundColor: "#00000000",
		webPreferences: {
			preload: `${__dirname}/preload.js`,
		},
	});
	mainWindow.setTitle("electron-mac-dock-icon-switcher");
	mainWindow.loadFile("index.html");
	mainWindow.webContents.ipc.on("toMain", (event, command, data) => {
		if (command === "setDockIcon") {
			setDockIcon(data.filename);
		}
	});
}

app.whenReady().then(() => createWindow());
app.on("window-all-closed", () => app.quit());
