"use strict";
const fs = require("fs");
const path = require("path");
function require_app(path) {
    return __webpack_require__(path);
}
window["require_app"] = require_app;
function CopyFolderSync(from, to) {
    fs.mkdirSync(to);
    fs.readdirSync(from).forEach(element => {
        if (fs.lstatSync(path.join(from, element)).isFile()) {
            fs.copyFileSync(path.join(from, element), path.join(to, element));
        }
        else {
            CopyFolderSync(path.join(from, element), path.join(to, element));
        }
    });
}
function DeleteFolderRecursive(folderPath) {
    if (fs.existsSync(folderPath)) {
        fs.readdirSync(folderPath).forEach((file, index) => {
            const curPath = path.join(folderPath, file);
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                DeleteFolderRecursive(curPath);
            }
            else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(folderPath);
    }
}
;
function FindPluginEntry(store) {
    return Object.values(store.getState().plugin.userPlugins).find((a) => a.name == "VPlugin");
}
// runs the first time the plugin is starting, after being installed
function FirstRun() {
}
module.exports = {
    name: "VPlugin",
    description: "Some enhancements for Nuclear, eg. weights to boost a folder's distribution/representation within a playlist.",
    image: null,
    onLoad: api => {
        console.log("VPlugin preparing to start...");
        // before anything else, open the dev-tools
        const { remote } = require("electron");
        //const webContents = remote.BrowserWindow.getFocusedWindow()!.webContents;
        const webContents = remote.BrowserWindow.getAllWindows()[0].webContents;
        if (!webContents.isDevToolsOpened()) {
            webContents.openDevTools({ mode: "bottom" });
        }
        let ownPluginEntry_beforeLoadCompleted = FindPluginEntry(api.store);
        const unsubscribe = api.store.subscribe(() => {
            let ownPluginEntry = FindPluginEntry(api.store);
            if (ownPluginEntry) {
                unsubscribe();
                const rootPath = ownPluginEntry.path.slice(0, ownPluginEntry.path.lastIndexOf("Dist") - 1);
                const justInstalled = ownPluginEntry_beforeLoadCompleted == null;
                if (justInstalled) {
                    FirstRun();
                }
                console.log(`VPlugin root folder found: ${rootPath}`);
                /*const startScriptPath = `${rootPath}/Dist/Start.js`;
                console.log("Clearing cached-module for: " + startScriptPath);
                console.log("Test1:", require_app("@electron/internal/modules/cjs/loader.js"));
                const {Module} = require_app("@electron/internal/modules/cjs/loader.js");
                const success = delete Module._cache["startScriptPath"]; // clear cached module for path, since we might be reloading the plugin
                console.log(`Clearing cached-module ${success ? "succeeded." : "failed! (thus must restart nuclear to see plugin changes)"}`);
                const {Start} = require(startScriptPath);
                Start(rootPath, require_app);*/
                const distPath = `${rootPath}/Dist`;
                const distProxiesPath = `${rootPath}/Dist_Proxies`;
                // todo: try using this cache-clearing call instead, rather than using the proxy-folder approach: delete require.cache[require.resolve(moduleName)]
                // if plugin just (re)installed, load the plugin through a proxy/sym-link, so that the "require" function doesn't use cached versions of the plugin scripts
                if (justInstalled) {
                    const proxyPath = `${distProxiesPath}/Proxy_${Date.now()}`;
                    // remove any previous junctions
                    /*const isJunction = source => lstatSync(source).isSymbolicLink()
                    const getJunctions = source => {
                        let paths = readdirSync(source).map(name => join(source, name));
                        return paths.filter(a=>isJunction(a));
                    };
                    for (const junctionPath of getJunctions(`${rootPath}/Dist`)) {
                        unlinkSync(junctionPath);
                    }
                    // create new junction (use junction rather than sym-link, since junctions don't require admin rights)
                    console.log(`Creating proxy at: ${proxyPath} (to bypass caching)`);
                    symlinkSync(distPath, proxyPath, "junction");*/
                    // remove any previous proxy folders
                    if (!fs.existsSync(distProxiesPath)) {
                        fs.mkdirSync(distProxiesPath);
                    }
                    for (const childName of fs.readdirSync(distProxiesPath)) {
                        const childPath = path.join(distProxiesPath, childName);
                        if (childName.startsWith("Proxy_") && fs.lstatSync(childPath).isDirectory()) {
                            // just to be safe (it's a recursive delete, after all!), ensure the folder contains a Start.js file
                            if (!fs.existsSync(path.join(childPath, "Start.js"))) {
                                console.error(`Canceled deletion of proxy-folder "${childPath}", since it didn't contain the expected Start.js file!`);
                                continue;
                            }
                            DeleteFolderRecursive(childPath);
                        }
                    }
                    // create new proxy (ie. duplicate) folder for "./Dist"
                    console.log(`VPlugin starting through proxy/clone (to bypass caching) at: ${proxyPath}`);
                    CopyFolderSync(distPath, proxyPath);
                    // require the Start.js file within the proxy folder, rather than the root "./Dist" folder (thus avoiding the module-caching)
                    const startScriptPath_proxy = `${proxyPath}/Start.js`;
                    const { Start } = require(startScriptPath_proxy);
                    Start(api, rootPath, require_app);
                }
                else {
                    const startScriptPath = `${distPath}/Start.js`;
                    const { Start } = require(startScriptPath);
                    Start(api, rootPath, require_app);
                }
            }
        });
    }
};
// runs when user uninstalls the plugin
/*function PostUninstall() {
    //unsubscribe();
}*/ 
