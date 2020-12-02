"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_vextensions_1 = require("react-vextensions");
const react_vcomponents_1 = require("react-vcomponents");
const Store_1 = require("../Store");
const FromJSVE_1 = require("../Utils/General/FromJSVE");
const mobx_1 = require("mobx");
const mobx_react_1 = require("mobx-react");
const mobx_sync_1 = require("mobx-sync");
const FromVWAF_1 = require("../Utils/General/FromVWAF");
const Playlists_1 = require("../Utils/Managers/Playlists");
//import {ShowMessageBox} from "react-vmessagebox";
/*let {ShowMessageBox}: typeof import("react-vmessagebox") = {} as any;
(async()=>{
    ({ShowMessageBox} = await import("react-vmessagebox"));
    //({ShowMessageBox} = await eval(`import("react-vmessagebox")`));
    /*const importFunc = eval("import");
    ({ShowMessageBox} = await importFunc("react-vmessagebox"));*#/
})();*/
/*import esmModules from "../ImportHelper";
const react_vMessageBox = esmModules.react_vMessageBox as typeof import("react-vmessagebox");*/
//import {react_vMessageBox} from "../ImportHelper";
/*const {ShowMessageBox} = react_vMessageBox;
console.log("ShowMessageBox:", ShowMessageBox);*/
/*const require_esm = require("esm")(module);
let {react_vMessageBox} = require_esm("../ImportHelper");*/
let RootUIWrapper = class RootUIWrapper extends react_vextensions_1.BaseComponentPlus({}, {}) {
    constructor() {
        super(...arguments);
        // use observable field for this rather than react state, since setState synchronously triggers rendering -- which breaks loading process above, when rendering fails
        this.storeReady = false;
    }
    ComponentWillMount() {
        return __awaiter(this, void 0, void 0, function* () {
            const trunk = new mobx_sync_1.AsyncTrunk(Store_1.store, { storage: localStorage, storageKey: "vplugin_mainStore_1" });
            yield trunk.init();
            console.log("VPlugin loaded state:", JSON.parse(JSON.stringify(Store_1.store)));
            mobx_1.runInAction("RootUIWrapper.ComponentWillMount.notifyStoreReady", () => this.storeReady = true);
        });
    }
    render() {
        const { storeReady } = this;
        if (!storeReady)
            return null;
        return (react_1.default.createElement(RootUI, null));
    }
};
__decorate([
    mobx_1.observable
], RootUIWrapper.prototype, "storeReady", void 0);
RootUIWrapper = __decorate([
    mobx_react_1.observer
], RootUIWrapper);
exports.RootUIWrapper = RootUIWrapper;
let RootUI = class RootUI extends react_vextensions_1.BaseComponentPlus({}, {}) {
    render() {
        let {} = this.props;
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement("style", null, `
				#VPlugin_Root input {
					background: white;
					padding: 0;
				}
				`),
            react_1.default.createElement(react_vcomponents_1.Row, { ml: 5, id: "VPlugin_Root" },
                react_1.default.createElement(react_vcomponents_1.DropDown, null,
                    react_1.default.createElement(react_vcomponents_1.DropDownTrigger, null,
                        react_1.default.createElement(react_vcomponents_1.Button, { text: "VPlugin" })),
                    react_1.default.createElement(react_vcomponents_1.DropDownContent, { style: { position: "absolute", width: 500 } },
                        react_1.default.createElement(react_vcomponents_1.Row, null,
                            react_1.default.createElement(react_vcomponents_1.Text, null, "Row height:"),
                            react_1.default.createElement(react_vcomponents_1.Spinner, { ml: 5, value: Store_1.store.rowHeight, onChange: val => Store_1.store.rowHeight = val })),
                        react_1.default.createElement(react_vcomponents_1.Row, null,
                            react_1.default.createElement(react_vcomponents_1.Text, null, "Show columns:"),
                            react_1.default.createElement(react_vcomponents_1.CheckBox, { ml: 5, text: "Album", value: Store_1.store.showAlbumColumn, onChange: val => Store_1.store.showAlbumColumn = val }),
                            react_1.default.createElement(react_vcomponents_1.CheckBox, { ml: 5, text: "Artist", value: Store_1.store.showArtistColumn, onChange: val => Store_1.store.showArtistColumn = val })),
                        react_1.default.createElement(react_vcomponents_1.Row, null,
                            react_1.default.createElement(react_vcomponents_1.Text, null, "Playlist length:"),
                            react_1.default.createElement(react_vcomponents_1.Spinner, { ml: 5, value: Store_1.store.playlistLength, onChange: val => Store_1.store.playlistLength = val })),
                        react_1.default.createElement(react_vcomponents_1.Row, { mt: 5 },
                            react_1.default.createElement(react_vcomponents_1.Button, { text: "Generate playlist", onClick: () => {
                                    if (Store_1.store.clearBeforeGenerate) {
                                        Playlists_1.ClearPlaylist();
                                    }
                                    Playlists_1.GeneratePlaylist();
                                } }),
                            react_1.default.createElement(react_vcomponents_1.CheckBox, { ml: 5, text: "Clear previous", value: Store_1.store.clearBeforeGenerate, onChange: val => Store_1.store.clearBeforeGenerate = val })),
                        react_1.default.createElement(react_vcomponents_1.Row, { mt: 5 },
                            react_1.default.createElement(react_vcomponents_1.Button, { text: "Export", onClick: () => {
                                    const date = new Date();
                                    const offset = date.getTimezoneOffset();
                                    const date_local = new Date(date.getTime() + (offset * 60 * 1000));
                                    const dateStr = date_local.toISOString().slice(0, "2020-01-01T01:01:01".length).replace("T", " ").replace(/:/g, "-");
                                    FromJSVE_1.StartDownload(JSON.stringify(Store_1.store), `NuclearVPluginStoreBackup_${dateStr}.json`);
                                } }),
                            react_1.default.createElement(react_vcomponents_1.Button, { ml: 5, text: "Import", onClick: () => __awaiter(this, void 0, void 0, function* () {
                                    /*const json = prompt("Paste JSON from export/backup file below", "");
                                    if (json == null) return;
                                    ImportConfig(JSON.parse(json));*/
                                    let json = "";
                                    const Change = (..._) => boxController.UpdateUI();
                                    /*import("fs");
                                    //import("react-vmessagebox");
                                    debugger;
                                    require("../ImportHelper");
                                    return;*/
                                    //let react_vMessageBox = await import("react-vmessagebox");
                                    //let {react_vMessageBox} = require("../ImportHelper");
                                    /*const require_esm = require("esm")(module);
                                    let {react_vMessageBox} = require_esm("react-vmessagebox");*/
                                    /*const require_esm = require("esm")(module);
                                    let react_vMessageBox = require_esm("../ImportHelper").react_vMessageBox as typeof import("react-vmessagebox");*/
                                    debugger;
                                    let react_vMessageBox = require("../ImportHelper").react_vMessageBox;
                                    setTimeout(() => {
                                        console.log("ShowMessageBox", react_vMessageBox.ShowMessageBox);
                                    }, 1000);
                                    return;
                                    let boxController = react_vMessageBox.ShowMessageBox({
                                        title: "Import config JSON", cancelButton: true,
                                        message: () => {
                                            //boxController.options.okButtonProps = {enabled: error == null};
                                            return (react_1.default.createElement(react_vcomponents_1.Column, { style: { padding: "10px 0", width: 600 } },
                                                react_1.default.createElement(react_vcomponents_1.Row, null,
                                                    react_1.default.createElement(react_vcomponents_1.Text, null, "JSON:"),
                                                    react_1.default.createElement(react_vcomponents_1.TextArea, { ml: 5, style: { flex: 1 }, value: json, onChange: val => Change(json = val) }))));
                                        },
                                        onOK: () => {
                                            ImportConfig(JSON.parse(json));
                                        },
                                    });
                                    function ImportConfig(data) {
                                        console.log("Importing config. @old:", JSON.parse(JSON.stringify(Store_1.store)), "@new:", data);
                                        for (const [key, value] of Object.entries(data)) {
                                            Store_1.store[key] = value;
                                        }
                                    }
                                }) })))))));
    }
};
RootUI = __decorate([
    FromVWAF_1.Observer
], RootUI);
exports.RootUI = RootUI;
