"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Fixes that failure to load a file in local-library, would cause an error in the renderer (when notified of the scanning error).
// This doesn't actually solve the source error, but makes the error-reporting a bit nicer.
function AddHook_Object_scanLocalFoldersFailed() {
    Object.defineProperty(Object.prototype, "scanLocalFoldersFailed", {
        enumerable: false,
        get() {
            return function (arg1) {
                console.log("scanLocalFoldersFailed @this:", this, "@arg1", arg1);
                debugger;
            };
        },
        set(val) {
            Object.defineProperty(this, "scanLocalFoldersFailed", { value: val, writable: true, configurable: true });
        },
    });
}
exports.AddHook_Object_scanLocalFoldersFailed = AddHook_Object_scanLocalFoldersFailed;
function RemoveHook_Object_scanLocalFoldersFailed() {
    delete Object.prototype["scanLocalFoldersFailed"];
}
exports.RemoveHook_Object_scanLocalFoldersFailed = RemoveHook_Object_scanLocalFoldersFailed;
