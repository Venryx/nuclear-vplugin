import {EnsureClassProtoRenderFunctionIsWrapped} from "react-vextensions";
import {observer} from "mobx-react";

// MobX.ts
// ==========

// variant of @observer decorator, which also adds (and is compatible with) class-hooks
export class Observer_Options {
	classHooks = true;
}
export function Observer(targetClass: Function);
export function Observer(options: Partial<Observer_Options>);
export function Observer(...args) {
	let options = new Observer_Options();
	if (typeof args[0] == "function") {
		ApplyToClass(args[0]);
	} else {
		//options = E(options, args[0]);
		options = Object.assign({}, options, args[0]);
		return ApplyToClass;
	}

	function ApplyToClass(targetClass: Function) {
		//if (options.classHooks) ClassHooks(targetClass);
		//if (targetClass instanceof (BaseComponent.prototype as any)) {
		if (targetClass.prototype.PreRender) {
			EnsureClassProtoRenderFunctionIsWrapped(targetClass.prototype);
		}
		observer(targetClass as any);
	}
}