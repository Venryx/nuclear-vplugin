// before anything else, open the dev-tools
const webContents = require("electron").remote.BrowserWindow.getFocusedWindow()!.webContents;
if (!webContents.isDevToolsOpened()) {
	webContents.openDevTools({mode: "bottom"});
}
//import "./Utils/General/ForceOpenDevTools";
//require("./Utils/General/ForceOpenDevTools");

/*import {remote} from "electron";
import React from "react";
import ReactDOM from "react-dom";
import {RootUI} from "./UI/Root";*/

/*const {remote} = require("electron");
const React = require("react");
const ReactDOM = require("react-dom");
const {RootUI} = require("./UI/Root");*/

/*const root = `C:/Root/Apps/@V/Nuclear/@Plugins/nuclear-vplugin/Main`;
//const root = `${__dirname}/..`;
const nm = `${root}/node_modules`;
/*const root = `../`;
const nm = `../node_modules`;*#/

const {remote} = require("electron");
//import React from "../node_modules/react";
const React = require(`${nm}/react`);
//const ReactRedux = Require_App("./node_modules/react-redux/es/index.js");
const ReactDOM = require(`${nm}/react-dom`);
const {RootUI} = require(`${root}/Dist/UI/Root.js`);*/

/*
There are two "require contexts" available to plugins:
1) Simple "require": Only exposes files relative to the plugin script (ie. standalone files), and internals (fs, path, electron, etc.); it cannot return modules within the Nuclear app's bundle.
2) __webpack_require__: Exposes the modules within the Nuclear app's bundle; however, exported field names are mangled to save space, so you'll have to explore to find the export you want. (use dev-tools)
*/

declare const __webpack_require__;
function Require_App(path: string) {
	return __webpack_require__(path);
}

//console.log("Test1:" + require("react-redux"));
//console.log("Test2:", __webpack_require__);
//console.log("Test3:", __webpack_require__("react-redux"));
console.log("Test4:", Require_App("./node_modules/react-redux/es/index.js"));
//debugger;

//const webContents = remote.BrowserWindow.getFocusedWindow()!.webContents;

//export default {
//module.exports = {
//let unsubscribe: ()=>void;
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

		// set up listener, so that we can find out where this plugin is running from, so its require statements work!
		/*const oldDispatch = api.store.dispatch;
		api.store.dispatch = function(action) {
			if (action.type == "LOAD_USER_PLUGIN_OK") {
				const rootPath = action.payload.path;
				Start(rootPath);
			}
			oldDispatch.apply(this, arguments);
		};*/
		const unsubscribe = api.store.subscribe(()=> {
			let ownPluginEntry = Object.values(api.store.getState().plugin.userPlugins).find((a: any)=>a.name == "VPlugin") as any;
			if (ownPluginEntry) {
				unsubscribe();
				const rootPath = ownPluginEntry.path.slice(0, ownPluginEntry.path.lastIndexOf("Dist") - 1);
				Start(rootPath);
			}
		});
	}
};

// runs once the plugin has found its root-path, and thus can complete startup
function Start(rootPath: string) {
	console.log(`VPlugin started from: ${rootPath}`);
	//const rootPath = `C:/Root/Apps/@V/Nuclear/@Plugins/nuclear-vplugin/Main`;
	const nmPath = `${rootPath}/node_modules`;

	const React = require(`${nmPath}/react`);
	const ReactDOM = require(`${nmPath}/react-dom`);
	const {RootUI} = require(`${rootPath}/Dist/UI/Root`);

	let mountNode = document.getElementById("vplugin-root");
	if (mountNode == null) {
		mountNode = document.createElement("div");
		mountNode.id = "vplugin-root";
		document.querySelector(".search_box_container")!.appendChild(mountNode);
	}

	//ReactDOM.render(<RootUI/>, mountNode);
	ReactDOM.render(React.createElement(RootUI), mountNode);
}

// runs when user uninstalls the plugin
/*function Stop() {
	//unsubscribe();
}*/