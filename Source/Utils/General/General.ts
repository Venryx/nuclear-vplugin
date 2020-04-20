export function ObserveStore(store, onChange: (oldState, newState)=>void): ()=>void;
export function ObserveStore(store, pathSelector: (store)=>any, onChange: (oldState, newState)=>void): ()=>void;
export function ObserveStore(...args): ()=>void {
	let store, pathSelector: (store)=>any = rootState=>rootState, onChange: (oldState, newState)=>void;
	if (args.length == 2) [store, onChange] = args;
	else if (args.length == 3) [store, pathSelector, onChange] = args;

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

export function AddPropToImmutableJSMap(obj, propName: string, propValue: any) {
	// if BitmapIndexedNode
	if (obj._root.nodes) {
		const newProp = {entry: [propName, propValue], keyHash: Math.random(), ownerID: undefined};
		Object.setPrototypeOf(newProp, Object.getPrototypeOf(obj._root.nodes.find(b=>b.constructor.name == "ValueNode")));
		obj._root.nodes.push(newProp);
	} else {
		// if normal node
		obj._root.entries.push([propName, propValue]);
	}
}

export function FixTrackForQueue(track) {
	let result = JSON.parse(JSON.stringify(track));
	if (typeof result.artist == "object") {
		result.artist = result.artist.name;
	}
	return result;
}