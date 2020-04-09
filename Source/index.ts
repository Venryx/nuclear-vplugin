/*
There are two "require contexts" available to plugins:
1) Simple import/require: Only exposes files relative to the plugin script (ie. standalone files), and internals (fs, path, electron, etc.); it cannot return modules within the Nuclear app's bundle.
2) __webpack_require__: Exposes the modules within the Nuclear app's bundle; however, exported field names are mangled to save space, so you'll have to explore to find the export you want. (use dev-tools)
*/

declare const __webpack_require__;
function require_app(path: string) {
	return __webpack_require__(path);
}

//export default {
//module.exports = {
export = {
	name: "VPlugin",
	description: "Some enhancements for Nuclear, eg. weights to boost a folder's distribution/representation within a playlist.",
	image: null,
	onLoad: api=>{
		console.log("VPlugin starting...");

		// before anything else, open the dev-tools
		const {remote} = require("electron");
		const webContents = remote.BrowserWindow.getFocusedWindow()!.webContents;
		if (!webContents.isDevToolsOpened()) {
			webContents.openDevTools({mode: "bottom"});
		}

		let ownPluginEntry_beforeLoadCompleted = FindPluginEntry(api.store);
		const unsubscribe = api.store.subscribe(()=> {
			let ownPluginEntry = FindPluginEntry(api.store);
			if (ownPluginEntry) {
				unsubscribe();
				const rootPath = ownPluginEntry.path.slice(0, ownPluginEntry.path.lastIndexOf("Dist") - 1);
				if (ownPluginEntry_beforeLoadCompleted == null) {
					FirstRun();
				}
				
				console.log(`VPlugin started from: ${rootPath}`);
				const {Start} = require(`${rootPath}/Dist/Start`);
				Start(rootPath, require_app);
			}
		});
	}
};

function FindPluginEntry(store) {
	return Object.values(store.getState().plugin.userPlugins).find((a: any)=>a.name == "VPlugin") as any;
}

// runs the first time the plugin is starting, after being installed
function FirstRun() {
}

// runs when user uninstalls the plugin
/*function PostUninstall() {
	//unsubscribe();
}*/