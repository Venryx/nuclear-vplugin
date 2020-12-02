"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Store_1 = require("../Store");
const DistributionColumn_1 = require("../UI/DistributionColumn");
//const require_app = window.require;
// class-checks, for use in React.createElement hook (can't use class-name, since minified in prod builds)
// ==========
function ArgsMatchForClass_BaseTable(args) {
    return args[1] && args[1].columns && args[1].data && args[1].rowHeight;
}
// hook
// ==========
let appReact;
let oldCreateElement;
//export function AddHook_React_CreateElement(require_app) {
function AddHook_React_CreateElement(appReact_new) {
    //appReact = require_app("./node_modules/react/index.js")
    appReact = appReact_new;
    oldCreateElement = appReact.createElement;
    appReact.createElement = function (...args) {
        //if (args[0].name == "BaseTable") {
        if (ArgsMatchForClass_BaseTable(args)) {
            const props = args[1];
            let { columns, data, rowHeight } = props;
            if (columns.orig == null)
                columns.orig = columns.slice();
            props.rowHeight = Store_1.store.rowHeight;
            // toggle album column
            const albumColumnEntry = columns.orig.find(a => a.dataKey == "album");
            const albumColumnEntryIndex = columns.findIndex(a => a.dataKey == "album");
            if (Store_1.store.showAlbumColumn) {
                if (albumColumnEntryIndex == -1) {
                    columns.splice(1, 0, albumColumnEntry);
                }
            }
            else {
                if (albumColumnEntryIndex != -1) {
                    columns.splice(albumColumnEntryIndex, 1);
                }
            }
            // toggle artist column
            const artistColumnEntry = columns.orig.find(a => a.dataKey == "artist");
            const artistColumnEntryIndex = columns.findIndex(a => a.dataKey == "artist");
            if (Store_1.store.showArtistColumn) {
                if (artistColumnEntryIndex == -1) {
                    columns.splice(2, 0, artistColumnEntry);
                }
            }
            else {
                if (artistColumnEntryIndex != -1) {
                    columns.splice(artistColumnEntryIndex, 1);
                }
            }
            // apply own column
            const oldColumnEntryIndex = columns.findIndex(a => a.title == DistributionColumn_1.distributionColumn.title);
            if (oldColumnEntryIndex != -1) {
                columns.splice(oldColumnEntryIndex, 1);
            }
            columns.push(DistributionColumn_1.distributionColumn);
        }
        return oldCreateElement.apply(this, args);
    };
}
exports.AddHook_React_CreateElement = AddHook_React_CreateElement;
function RemoveHook_React_CreateElement() {
    appReact.createElement = oldCreateElement;
}
exports.RemoveHook_React_CreateElement = RemoveHook_React_CreateElement;
