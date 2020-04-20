"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_vextensions_1 = require("react-vextensions");
const mobx_react_1 = require("mobx-react");
// MobX.ts
// ==========
// variant of @observer decorator, which also adds (and is compatible with) class-hooks
class Observer_Options {
    constructor() {
        this.classHooks = true;
    }
}
exports.Observer_Options = Observer_Options;
function Observer(...args) {
    let options = new Observer_Options();
    if (typeof args[0] == "function") {
        ApplyToClass(args[0]);
    }
    else {
        //options = E(options, args[0]);
        options = Object.assign({}, options, args[0]);
        return ApplyToClass;
    }
    function ApplyToClass(targetClass) {
        //if (options.classHooks) ClassHooks(targetClass);
        //if (targetClass instanceof (BaseComponent.prototype as any)) {
        if (targetClass.prototype.PreRender) {
            react_vextensions_1.EnsureClassProtoRenderFunctionIsWrapped(targetClass.prototype);
        }
        mobx_react_1.observer(targetClass);
    }
}
exports.Observer = Observer;
