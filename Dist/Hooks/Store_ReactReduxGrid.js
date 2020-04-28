"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DistributionColumn_1 = require("../UI/DistributionColumn");
const General_1 = require("../Utils/General/General");
const Store_1 = require("../Store");
let unsubscribe;
function AddHook_Store_ReactReduxGrid(api) {
    //unsubscribe = api.store.subscribe(()=> {});
    unsubscribe = General_1.ObserveStore(api.store, a => a.reactReduxGrid, (oldState, newState) => {
        const tableLayout = newState.grid.get("local-library-folder-tree");
        const tableData = newState.dataSource.get("local-library-folder-tree");
        if (tableLayout) {
            // toggle album column
            const albumColumnEntryIndex = tableLayout.columns.findIndex(a => a.dataIndex == "album");
            if (Store_1.store.showAlbumColumn) {
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
            }
            else {
                if (albumColumnEntryIndex != -1) {
                    tableLayout.columns.splice(albumColumnEntryIndex, 1);
                }
            }
            // toggle artist column
            const artistColumnEntryIndex = tableLayout.columns.findIndex(a => a.dataIndex == "artist");
            if (Store_1.store.showArtistColumn) {
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
            }
            else {
                if (artistColumnEntryIndex != -1) {
                    tableLayout.columns.splice(artistColumnEntryIndex, 1);
                }
            }
            // apply own column
            const oldColumnEntryIndex = tableLayout.columns.findIndex(a => a.name == DistributionColumn_1.distributionColumn.title);
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
exports.AddHook_Store_ReactReduxGrid = AddHook_Store_ReactReduxGrid;
function RemoveHook_Store_ReactReduxGrid() {
    unsubscribe();
}
exports.RemoveHook_Store_ReactReduxGrid = RemoveHook_Store_ReactReduxGrid;
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
