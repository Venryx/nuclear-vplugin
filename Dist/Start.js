"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
const Root_1 = require("./UI/Root");
function Start(rootPath, require_app) {
    let mountNode = document.getElementById("vplugin-root");
    if (mountNode == null) {
        mountNode = document.createElement("div");
        mountNode.id = "vplugin-root";
        document.querySelector(".search_box_container").appendChild(mountNode);
    }
    //ReactDOM.render(<RootUI/>, mountNode);
    react_dom_1.default.render(react_1.default.createElement(Root_1.RootUI), mountNode);
    //console.log("Test1:" + require("react-redux"));
    //console.log("Test2:", __webpack_require__);
    //console.log("Test3:", __webpack_require__("react-redux"));
    //console.log("Test4:", require_app("./node_modules/react-redux/es/index.js"));
    //debugger;
}
exports.Start = Start;
