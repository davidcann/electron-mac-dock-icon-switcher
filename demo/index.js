function setDockIcon(filename) {
	window.electronAPI.send("toMain", "setDockIcon", { filename });
}
