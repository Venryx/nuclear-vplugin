"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Start_1 = require("../../Start");
const Store_1 = require("../../Store");
const General_1 = require("../General/General");
function ClearPlaylist() {
    //mpris.clearTrackList();
    Start_1.nuclearAPI.store.dispatch({
        type: "CLEAR_QUEUE",
        payload: null
    });
}
exports.ClearPlaylist = ClearPlaylist;
function GeneratePlaylist() {
    const tracks = Object.values(Start_1.nuclearAPI.store.getState().local.tracks);
    const trackWeights = tracks.map(track => Store_1.GetFinalWeightForPath(track.path));
    const totalWeight = trackWeights.reduce((acc, val) => acc + val, 0);
    for (let i = 0; i < Store_1.store.playlistLength; i++) {
        let targetWeightToPassOver = (totalWeight - trackWeights.slice(-1)[0]) * Math.random();
        let weightPassedOver = 0;
        for (var trackIndex = 0; weightPassedOver < targetWeightToPassOver && trackIndex < tracks.length; trackIndex++) {
            weightPassedOver += trackWeights[trackIndex];
        }
        // trackIndex - 1, since trackIndex (raw) will always be the first track *after* the one in which the target landed
        const track = tracks[trackIndex - 1];
        const track_fixed = General_1.FixTrackForQueue(track);
        Start_1.nuclearAPI.store.dispatch({
            type: "ADD_QUEUE_ITEM",
            payload: {
                item: track_fixed,
            },
        });
    }
}
exports.GeneratePlaylist = GeneratePlaylist;
