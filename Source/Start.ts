import React from "react";
import ReactDOM from "react-dom";
//import {Timer} from "js-vextensions";
import {RootUI, RootUIWrapper} from "./UI/Root";
import {Timer} from "./Utils/General/FromJSVE";
import {ObserveStore, AddPropToImmutableJSMap} from "./Utils/General/General";
import {Spinner} from "react-vcomponents";
import {distributionColumn} from "./UI/DistributionColumn";
import {store} from "./Store";

let unsubscribe;
export function Start(api, rootPath: string, require_app: (path: string)=>any) {
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
	unsubscribe = ObserveStore(api.store, a=>a.reactReduxGrid, (oldState, newState)=> {
		const tableLayout = newState.grid.get("local-library-folder-tree") as {columns: any[]};
		const tableData = newState.dataSource.get("local-library-folder-tree");

		if (tableLayout) {
			// toggle album column
			const albumColumnEntryIndex = tableLayout.columns.findIndex(a=>a.dataIndex == "album");
			if (store.showAlbumColumn) {
				if (albumColumnEntryIndex == -1) {
					tableLayout.columns.splice(1, 0, {
						name: "Album",
						dataIndex: "album",
						sortable: false,
						className: "additional-class",
						defaultSortDirection: "descend",
						//id: "QWxidW1ncmlkLWNvbHVtbg==",
						id: Math.random(),
					});
				}
			} else {
				if (albumColumnEntryIndex != -1) {
					tableLayout.columns.splice(albumColumnEntryIndex, 1);
				}
			}

			// toggle artist column
			const artistColumnEntryIndex = tableLayout.columns.findIndex(a=>a.dataIndex == "artist");
			if (store.showArtistColumn) {
				if (artistColumnEntryIndex == -1) {
					tableLayout.columns.splice(2, 0, {
						name: "Artist",
						dataIndex: "artist",
						sortable: false,
						className: "additional-class",
						defaultSortDirection: "descend",
						//id: "QXJ0aXN0Z3JpZC1jb2x1bW4=",
						id: Math.random(),
					});
				}
			} else {
				if (artistColumnEntryIndex != -1) {
					tableLayout.columns.splice(artistColumnEntryIndex, 1);
				}
			}

			// apply own column
			const oldColumnEntryIndex = tableLayout.columns.findIndex(a=>a.name == distributionColumn.name);
			if (oldColumnEntryIndex != -1) {
				tableLayout.columns.splice(oldColumnEntryIndex, 1);
			}
			tableLayout.columns.push(distributionColumn);
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

export function Unload() {
	unsubscribe();
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

	// trigger window load event, so AddGlobalStyle commands from react-vextensions execute
	var load_event = document.createEvent("Events");
	load_event.initEvent("load", false, false);
	window.document.dispatchEvent(load_event);

	//ReactDOM.render(<RootUI/>, mountNode);
	//ReactDOM.render(React.createElement(RootUI), mountNode);
	ReactDOM.render(React.createElement(RootUIWrapper), mountNode);
}