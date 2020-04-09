"use strict";
// before anything else, open the dev-tools
const webContents = require("electron").remote.BrowserWindow.getFocusedWindow().webContents;
if (!webContents.isDevToolsOpened()) {
    webContents.openDevTools({ mode: "bottom" });
}
function Require_App(path) {
    return __webpack_require__(path);
}
//console.log("Test1:" + require("react-redux"));
//console.log("Test2:", __webpack_require__);
//console.log("Test3:", __webpack_require__("react-redux"));
console.log("Test4:", Require_App("./node_modules/react-redux/es/index.js"));
// runs once the plugin has found its root-path, and thus can complete startup
function Start(rootPath) {
    console.log(`VPlugin started from: ${rootPath}`);
    //const rootPath = `C:/Root/Apps/@V/Nuclear/@Plugins/nuclear-vplugin/Main`;
    const nmPath = `${rootPath}/node_modules`;
    const React = require(`${nmPath}/react`);
    const ReactDOM = require(`${nmPath}/react-dom`);
    const { RootUI } = require(`${rootPath}/Dist/UI/Root`);
    let mountNode = document.getElementById("vplugin-root");
    if (mountNode == null) {
        mountNode = document.createElement("div");
        mountNode.id = "vplugin-root";
        document.querySelector(".search_box_container").appendChild(mountNode);
    }
    //ReactDOM.render(<RootUI/>, mountNode);
    ReactDOM.render(React.createElement(RootUI), mountNode);
}
module.exports = {
    name: "VPlugin",
    description: "Some enhancements for Nuclear, eg. weights to boost a folder's distribution/representation within a playlist.",
    image: null,
    onLoad: api => {
        console.log("VPlugin starting...");
        // before anything else, open the dev-tools
        const { remote } = require("electron");
        const webContents = remote.BrowserWindow.getFocusedWindow().webContents;
        if (!webContents.isDevToolsOpened()) {
            webContents.openDevTools({ mode: "bottom" });
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
        const unsubscribe = api.store.subscribe(() => {
            let ownPluginEntry = Object.values(api.store.getState().plugin.userPlugins).find((a) => a.name == "VPlugin");
            if (ownPluginEntry) {
                unsubscribe();
                const rootPath = ownPluginEntry.path.slice(0, ownPluginEntry.path.lastIndexOf("Dist") - 1);
                Start(rootPath);
            }
        });
    }
};
// runs when user uninstalls the plugin
/*function Stop() {
    //unsubscribe();
}*/ 
