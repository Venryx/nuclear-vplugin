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
const General_1 = require("./Utils/General/General");
const DistributionColumn_1 = require("./UI/DistributionColumn");
let unsubscribe;
function Start(api, rootPath, require_app) {
    // if there was a previous launch of this plugin, unload that launch before this one starts 
    if (window["vplugin_unloadLastLaunch"]) {
        console.log("VPlugin unloading previous launch...");
        window["vplugin_unloadLastLaunch"]();
    }
    // set up unloader function for the current launch
    window["vplugin_unloadLastLaunch"] = Unload;
    mountNodeParentFinder.Start();
    //console.log("Test1:" + require("react-redux"));
    //console.log("Test2:", __webpack_require__);
    //console.log("Test3:", __webpack_require__("react-redux"));
    //console.log("Test4:", require_app("./node_modules/react-redux/es/index.js"));
    //debugger;
    //unsubscribe = api.store.subscribe(()=> {});
    unsubscribe = General_1.ObserveStore(api.store, a => a.reactReduxGrid, (oldState, newState) => {
        const tableLayout = newState.grid.get("local-library-folder-tree");
        const tableData = newState.dataSource.get("local-library-folder-tree");
        if (tableLayout) {
            const oldColumnEntryIndex = tableLayout.columns.findIndex(a => a.name == DistributionColumn_1.distributionColumn.name);
            if (oldColumnEntryIndex != -1) {
                tableLayout.columns.splice(oldColumnEntryIndex, 1);
            }
            tableLayout.columns.push(DistributionColumn_1.distributionColumn);
        }
        if (tableData) {
            //const entries = tableData.treeData;
            //const entries = tableData.proxy;
            //const entries = tableData.currentRecords;
            //const entries = tableData.data.toObject() as Map<string, any>[];
            //const entries = Array.from(tableData.data) as Map<string, any>[];
            /*const entries = Array.from(tableData.currentRecords) as Map<string, any>[];
            for (const entry of entries) {
                //entry.set("distributionWeight", Math.random());
                AddPropToImmutableJSMap(entry, "distributionWeight", Math.random());
            }*/
            /*const entries = GetAllRowsInTreeData(tableData.treeData.toObject().root);
            for (const entry of entries) {
                //if (entry.name == "Root") continue;
                AddPropToImmutableJSMap(entry, "distributionWeight", Math.random());
            }*/
        }
    });
}
exports.Start = Start;
function GetAllRowsInTreeData(treeData) {
    const treeData_js = treeData.toObject();
    const result = [treeData];
    if (treeData_js.children) {
        const childrenMaps = Object.values(treeData_js.children.toObject());
        for (const child of childrenMaps) {
            result.push(...GetAllRowsInTreeData(child));
        }
    }
    return result;
}
function Unload() {
    unsubscribe();
}
exports.Unload = Unload;
let mountNodeParent;
const mountNodeParentFinder = new FromJSVE_1.Timer(100, () => {
    mountNodeParent = document.querySelector(".search_box_container");
    if (mountNodeParent) {
        mountNodeParentFinder.Stop();
        CreateUI();
    }
});
function CreateUI() {
    let mountNode = document.getElementById("vplugin-root");
    if (mountNode == null) {
        mountNode = document.createElement("div");
        mountNode.id = "vplugin-root";
        mountNodeParent.appendChild(mountNode);
    }
    //ReactDOM.render(<RootUI/>, mountNode);
    react_dom_1.default.render(react_1.default.createElement(Root_1.RootUI), mountNode);
}
