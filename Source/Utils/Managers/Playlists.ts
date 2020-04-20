import {nuclearAPI} from "../../Start";
import {GetFinalWeightForPath, store} from "../../Store";
import {FixTrackForQueue} from "../General/General";

export function ClearPlaylist() {
	//mpris.clearTrackList();
	nuclearAPI.store.dispatch({
		type: "CLEAR_QUEUE",
		payload: null
	});
}

export function GeneratePlaylist() {
	const tracks = Object.values(nuclearAPI.store.getState().local.tracks) as any[];
	const trackWeights = tracks.map(track=>GetFinalWeightForPath(track.path));
	const totalWeight = trackWeights.reduce((acc, val)=>acc + val, 0);

	for (let i = 0; i < store.playlistLength; i++) {
		let targetWeightToPassOver = (totalWeight - trackWeights.slice(-1)[0]) * Math.random();
		let weightPassedOver = 0;
		for (var trackIndex = 0; weightPassedOver < targetWeightToPassOver && trackIndex < tracks.length; trackIndex++) {
			weightPassedOver += trackWeights[trackIndex];
		}
		
		// trackIndex - 1, since trackIndex (raw) will always be the first track *after* the one in which the target landed
		const track = tracks[trackIndex - 1];
		const track_fixed = FixTrackForQueue(track);
		nuclearAPI.store.dispatch({
			type: "ADD_QUEUE_ITEM",
			payload: {
				item: track_fixed,
			},
		});
	}
}