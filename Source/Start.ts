import React from "react";
import ReactDOM from "react-dom";
import {RootUI} from "./UI/Root";

export function Start(rootPath: string, require_app: (path: string)=>any) {
	let mountNode = document.getElementById("vplugin-root");
	if (mountNode == null) {
		mountNode = document.createElement("div");
		mountNode.id = "vplugin-root";
		document.querySelector(".search_box_container")!.appendChild(mountNode);
	}
	
	//ReactDOM.render(<RootUI/>, mountNode);
	ReactDOM.render(React.createElement(RootUI), mountNode);
	
	//console.log("Test1:" + require("react-redux"));
	//console.log("Test2:", __webpack_require__);
	//console.log("Test3:", __webpack_require__("react-redux"));
	console.log("Test4:", require_app("./node_modules/react-redux/es/index.js"));
	//debugger;
}