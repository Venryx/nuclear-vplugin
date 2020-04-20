import {observable} from "mobx";

export class MainState {
	@observable showAlbumColumn = true;
	@observable showArtistColumn = true;
	@observable playlistLength = 100;
	@observable clearBeforeGenerate = true;
	@observable pathWeights = {} as {[key: string]: number};
	@observable pathWeights_temp = {} as {[key: string]: number};
}

export const store = new MainState();
window["vplugin_store"] = store; // for console-based hacking and such

// accessors
// ==========

export function GetWeightValuesForPath(path: string, includeTemps = true) {
	const pathParts = path.split("/");
	const ancestorFolderPaths = pathParts.map((part, index)=> {
		const partsForFolder = pathParts.slice(0, index + 1);
		const folderPath = partsForFolder.join("/");
		return folderPath;
	});
	return ancestorFolderPaths.map(path=> {
		let result = store.pathWeights[path] != null ? store.pathWeights[path] : 1;
		if (includeTemps) result *= store.pathWeights_temp[path] != null ? store.pathWeights_temp[path] : 1;
		return result;
	});
}
export function GetFinalWeightForPath(path: string, includeTemps = true) {
	const weightValues = GetWeightValuesForPath(path, includeTemps);
	return weightValues.reduce((acc, cur)=>acc * cur, 1);
}