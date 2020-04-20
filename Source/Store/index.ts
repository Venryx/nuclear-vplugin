import {observable} from "mobx";

export class MainState {
	@observable playlistLength = 100;
	@observable pathWeights = {} as {[key: string]: number};
}

export const store = new MainState();