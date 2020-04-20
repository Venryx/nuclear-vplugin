"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mobx_1 = require("mobx");
class MainState {
    constructor() {
        this.showAlbumColumn = true;
        this.showArtistColumn = true;
        this.playlistLength = 100;
        this.clearBeforeGenerate = true;
        this.pathWeights = {};
    }
}
__decorate([
    mobx_1.observable
], MainState.prototype, "showAlbumColumn", void 0);
__decorate([
    mobx_1.observable
], MainState.prototype, "showArtistColumn", void 0);
__decorate([
    mobx_1.observable
], MainState.prototype, "playlistLength", void 0);
__decorate([
    mobx_1.observable
], MainState.prototype, "clearBeforeGenerate", void 0);
__decorate([
    mobx_1.observable
], MainState.prototype, "pathWeights", void 0);
exports.MainState = MainState;
exports.store = new MainState();
window["vplugin_store"] = exports.store; // for console-based hacking and such
// accessors
// ==========
function GetWeightValuesForPath(path) {
    const pathParts = path.split("/");
    const ancestorFolderPaths = pathParts.map((part, index) => {
        const partsForFolder = pathParts.slice(0, index + 1);
        const folderPath = partsForFolder.join("/");
        return folderPath;
    });
    return ancestorFolderPaths.map(path => {
        return exports.store.pathWeights[path] != null ? exports.store.pathWeights[path] : 1;
    });
}
exports.GetWeightValuesForPath = GetWeightValuesForPath;
function GetFinalWeightForPath(path) {
    const weightValues = GetWeightValuesForPath(path);
    return weightValues.reduce((acc, cur) => acc * cur, 1);
}
exports.GetFinalWeightForPath = GetFinalWeightForPath;
