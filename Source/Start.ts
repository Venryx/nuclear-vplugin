import React from "react";
import ReactDOM from "react-dom";
//import {Timer} from "js-vextensions";
import {RootUIWrapper} from "./UI/Root";
import {Timer} from "./Utils/General/FromJSVE";
import {AddHook_React_CreateElement, RemoveHook_React_CreateElement} from "./Hooks/React_CreateElement";

export let nuclearAPI: {
	store;
	React;
	Redux;
};

export function Start(api, rootPath: string, require_app: (path: string)=>any) {
	// if there was a previous launch of this plugin, unload that launch before this one starts 
	if (window["vplugin_unloadLastLaunch"]) {
		console.log("VPlugin unloading previous launch...");
		window["vplugin_unloadLastLaunch"]();
	}
	// set up unloader function for the current launch
	window["vplugin_unloadLastLaunch"] = Unload;

	nuclearAPI = api;
	//AddHook_Store_ReactReduxGrid(api);
	//AddHook_React_CreateElement(require_app);
	AddHook_React_CreateElement(api.React);
	mountNodeParentFinder.Start();
	
	//console.log("Test1:" + require("react-redux"));
	//console.log("Test2:", __webpack_require__);
	//console.log("Test3:", __webpack_require__("react-redux"));
	//console.log("Test4:", require_app("./node_modules/react-redux/es/index.js"));
	//debugger;
}

export function Unload() {
	//RemoveHook_Store_ReactReduxGrid();
	RemoveHook_React_CreateElement();
	mountNode.remove();
}

let mountNodeParent: HTMLDivElement;
let mountNode: HTMLDivElement;
const mountNodeParentFinder = new Timer(100, ()=> {
	mountNodeParent = document.querySelector(".search_box_container") as HTMLDivElement;
	//mountNodeParent = document.querySelector(".navbar_spacer") as HTMLDivElement;
	if (mountNodeParent) {
		mountNodeParentFinder.Stop();
		CreateUI();
	}
});
function CreateUI() {
	mountNode = document.getElementById("vplugin-root") as HTMLDivElement;
	if (mountNode == null) {
		mountNode = document.createElement("div");
		mountNode.id = "vplugin-root";
		//mountNodeParent!.appendChild(mountNode);
		//mountNodeParent!.insertBefore(mountNode, spacer); // insert after search-box, before spacer
		mountNodeParent!.insertAdjacentElement("afterend", mountNode); // insert after search-box
	}

	// trigger window load event, so AddGlobalStyle commands from react-vextensions execute
	var load_event = document.createEvent("Events");
	load_event.initEvent("load", false, false);
	window.document.dispatchEvent(load_event);

	//ReactDOM.render(<RootUI/>, mountNode);
	//ReactDOM.render(React.createElement(RootUI), mountNode);
	ReactDOM.render(React.createElement(RootUIWrapper), mountNode);
}