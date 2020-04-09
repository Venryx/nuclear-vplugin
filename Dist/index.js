import { remote } from "electron";
function Require_App(path) {
    return __webpack_require__(path);
}
//console.log("Test1:" + require("react-redux"));
//console.log("Test2:", __webpack_require__);
//console.log("Test3:", __webpack_require__("react-redux"));
console.log("Test4:", Require_App("./node_modules/react-redux/es/index.js"));
debugger;
const webContents = remote.BrowserWindow.getFocusedWindow().webContents;
//export default {
module.exports = {
    name: "VPlugin",
    description: "Some enhancements for Nuclear, eg. weights to boost a folder's distribution/representation within a playlist.",
    image: null,
    onLoad: api => {
        console.log("VPlugin started.");
        /*const listener = (event, webContents2)=> {
            if (!webContents.isDevToolsOpened()) {
                webContents.openDevTools({mode: "bottom"});
            }
            api.app.removeListener("browser-window-blur", listener);
            api.app.removeListener("browser-window-focus", listener);
        };
        api.app.on("browser-window-blur", listener);
        api.app.on("browser-window-focus", listener);
        api.app.focus();*/
        if (!webContents.isDevToolsOpened()) {
            webContents.openDevTools({ mode: "bottom" });
        }
    }
};
