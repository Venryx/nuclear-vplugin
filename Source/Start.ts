import React from "react";
import ReactDOM from "react-dom";
//import {Timer} from "js-vextensions";
import {RootUI} from "./UI/Root";
import {Timer} from "./Utils/General/FromJSVE";

export function Start(rootPath: string, require_app: (path: string)=>any) {
	mountNodeParentFinder.Start();
	
	//console.log("Test1:" + require("react-redux"));
	//console.log("Test2:", __webpack_require__);
	//console.log("Test3:", __webpack_require__("react-redux"));
	//console.log("Test4:", require_app("./node_modules/react-redux/es/index.js"));
	//debugger;
}

let mountNodeParent: HTMLDivElement;
const mountNodeParentFinder = new Timer(100, ()=> {
	mountNodeParent = document.querySelector(".search_box_container") as HTMLDivElement;
	if (mountNodeParent) {
		mountNodeParentFinder.Stop();
		CreateUI();
	}
});
function CreateUI() {
	let mountNode = document.getElementById("vplugin-root") as HTMLDivElement;
	if (mountNode == null) {
		mountNode = document.createElement("div");
		mountNode.id = "vplugin-root";
		mountNodeParent!.appendChild(mountNode);
	}

	//ReactDOM.render(<RootUI/>, mountNode);
	ReactDOM.render(React.createElement(RootUI), mountNode);
}