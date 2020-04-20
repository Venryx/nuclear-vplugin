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
class RootUI extends react_vextensions_1.BaseComponentPlus({}, {}) {
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
                    react_1.default.createElement(react_vcomponents_1.DropDownContent, { style: { position: "absolute" } },
                        react_1.default.createElement(react_vcomponents_1.Row, null,
                            react_1.default.createElement(react_vcomponents_1.Text, null, "Playlist length:"),
                            react_1.default.createElement(react_vcomponents_1.Spinner, { ml: 5, value: Store_1.store.playlistLength, onChange: val => {
                                    Store_1.store.playlistLength = val;
                                    this.Update();
                                } })),
                        react_1.default.createElement(react_vcomponents_1.Row, { mt: 5 },
                            react_1.default.createElement(react_vcomponents_1.Button, { text: "Generate playlist", onClick: () => {
                                } })),
                        react_1.default.createElement(react_vcomponents_1.Row, { mt: 5 },
                            react_1.default.createElement(react_vcomponents_1.Button, { text: "Export", onClick: () => {
                                    const date = new Date();
                                    const offset = date.getTimezoneOffset();
                                    const date_local = new Date(date.getTime() + (offset * 60 * 1000));
                                    const dateStr = date_local.toISOString().slice(0, "2020-01-01T01:01:01".length).replace("T", " ").replace(/:/g, "-");
                                    FromJSVE_1.StartDownload(JSON.stringify(Store_1.store), `NuclearVPluginStoreBackup_${dateStr}.json`);
                                } }),
                            react_1.default.createElement(react_vcomponents_1.Button, { ml: 5, text: "Import", enabled: false, onClick: () => {
                                    // todo
                                } })))))));
    }
}
exports.RootUI = RootUI;
