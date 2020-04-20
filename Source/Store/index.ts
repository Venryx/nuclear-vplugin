import {observable} from "mobx";

export class MainState {
	@observable showAlbumColumn = true;
	@observable showArtistColumn = true;
	@observable playlistLength = 100;
	@observable clearBeforeGenerate = true;
	@observable pathWeights = {} as {[key: string]: number};
}

export const store = new MainState();
window["vplugin_store"] = store; // for console-based hacking and such

// accessors
// ==========

export function GetWeightValuesForPath(path: string) {
	const pathParts = path.split("/");
	const ancestorFolderPaths = pathParts.map((part, index)=> {
		const partsForFolder = pathParts.slice(0, index + 1);
		const folderPath = partsForFolder.join("/");
		return folderPath;
	});
	return ancestorFolderPaths.map(path=> {
		return store.pathWeights[path] != null ? store.pathWeights[path] : 1;
	});
}
export function GetFinalWeightForPath(path: string) {
	const weightValues = GetWeightValuesForPath(path);
	return weightValues.reduce((acc, cur)=>acc * cur, 1);
}