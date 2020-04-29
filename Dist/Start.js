"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
//import {Timer} from "js-vextensions";
const Root_1 = require("./UI/Root");
const FromJSVE_1 = require("./Utils/General/FromJSVE");
const React_CreateElement_1 = require("./Hooks/React_CreateElement");
function Start(api, rootPath, require_app) {
    // if there was a previous launch of this plugin, unload that launch before this one starts 
    if (window["vplugin_unloadLastLaunch"]) {
        console.log("VPlugin unloading previous launch...");
        window["vplugin_unloadLastLaunch"]();
    }
    // set up unloader function for the current launch
    window["vplugin_unloadLastLaunch"] = Unload;
    exports.nuclearAPI = api;
    //AddHook_Store_ReactReduxGrid(api);
    //AddHook_React_CreateElement(require_app);
    React_CreateElement_1.AddHook_React_CreateElement(api.React);
    mountNodeParentFinder.Start();
    //console.log("Test1:" + require("react-redux"));
    //console.log("Test2:", __webpack_require__);
    //console.log("Test3:", __webpack_require__("react-redux"));
    //console.log("Test4:", require_app("./node_modules/react-redux/es/index.js"));
    //debugger;
}
exports.Start = Start;
function Unload() {
    //RemoveHook_Store_ReactReduxGrid();
    React_CreateElement_1.RemoveHook_React_CreateElement();
    mountNode.remove();
}
exports.Unload = Unload;
let mountNodeParent;
let mountNode;
const mountNodeParentFinder = new FromJSVE_1.Timer(100, () => {
    mountNodeParent = document.querySelector(".search_box_container");
    //mountNodeParent = document.querySelector(".navbar_spacer") as HTMLDivElement;
    if (mountNodeParent) {
        mountNodeParentFinder.Stop();
        CreateUI();
    }
});
function CreateUI() {
    mountNode = document.getElementById("vplugin-root");
    if (mountNode == null) {
        mountNode = document.createElement("div");
        mountNode.id = "vplugin-root";
        //mountNodeParent!.appendChild(mountNode);
        //mountNodeParent!.insertBefore(mountNode, spacer); // insert after search-box, before spacer
        mountNodeParent.insertAdjacentElement("afterend", mountNode); // insert after search-box
    }
    // trigger window load event, so AddGlobalStyle commands from react-vextensions execute
    var load_event = document.createEvent("Events");
    load_event.initEvent("load", false, false);
    window.document.dispatchEvent(load_event);
    //ReactDOM.render(<RootUI/>, mountNode);
    //ReactDOM.render(React.createElement(RootUI), mountNode);
    react_dom_1.default.render(react_1.default.createElement(Root_1.RootUIWrapper), mountNode);
}
