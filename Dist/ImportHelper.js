//export const react_vMessageBox = await import("react-vmessagebox");

module.exports.react_vMessageBox = {};

(async()=>{
	Object.assign(module.exports.react_vMessageBox, await import("react-vmessagebox"));
	//Object.assign(module.exports.react_vMessageBox, await import("./Proxy1.mjs"));
})();