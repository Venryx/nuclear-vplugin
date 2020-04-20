import {observable} from "mobx";

export class MainState {
	@observable showAlbumColumn = true;
	@observable showArtistColumn = true;
	@observable playlistLength = 100;
	@observable pathWeights = {} as {[key: string]: number};
}

export const store = new MainState();
window["vplugin_store"] = store; // for console-based hacking and such