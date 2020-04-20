"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function ObserveStore(...args) {
    let store, pathSelector = rootState => rootState, onChange;
    if (args.length == 2)
        [store, onChange] = args;
    else if (args.length == 3)
        [store, pathSelector, onChange] = args;
    let currentState;
    function HandleChange() {
        let nextState = pathSelector(store.getState());
        if (nextState !== currentState) {
            onChange(currentState, nextState);
            currentState = nextState;
        }
    }
    let unsubscribe = store.subscribe(HandleChange);
    HandleChange();
    return unsubscribe;
}
exports.ObserveStore = ObserveStore;
function AddPropToImmutableJSMap(obj, propName, propValue) {
    // if BitmapIndexedNode
    if (obj._root.nodes) {
        const newProp = { entry: [propName, propValue], keyHash: Math.random(), ownerID: undefined };
        Object.setPrototypeOf(newProp, Object.getPrototypeOf(obj._root.nodes.find(b => b.constructor.name == "ValueNode")));
        obj._root.nodes.push(newProp);
    }
    else {
        // if normal node
        obj._root.entries.push([propName, propValue]);
    }
}
exports.AddPropToImmutableJSMap = AddPropToImmutableJSMap;
function FixTrackForQueue(track) {
    let result = JSON.parse(JSON.stringify(track));
    if (typeof result.artist == "object") {
        result.artist = result.artist.name;
    }
    return result;
}
exports.FixTrackForQueue = FixTrackForQueue;
