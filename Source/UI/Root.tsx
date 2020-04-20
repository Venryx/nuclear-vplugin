import React from "react";
import {BaseComponentPlus} from "react-vextensions";
import {Row, Button, DropDown, DropDownTrigger, DropDownContent, Text, Spinner, CheckBox} from "react-vcomponents";
import {store} from "../Store";
import {StartDownload} from "../Utils/General/FromJSVE";
import {observable, runInAction} from "mobx";
import {observer} from "mobx-react";
import {AsyncTrunk} from "mobx-sync";
import {Observer} from "../Utils/General/FromVWAF";
import {ClearPlaylist, GeneratePlaylist} from "../Utils/Managers/Playlists";

@observer
export class RootUIWrapper extends BaseComponentPlus({}, {}) {
	async ComponentWillMount() {
		const trunk = new AsyncTrunk(store, {storage: localStorage, storageKey: "vplugin_mainStore_1"});

		await trunk.init();
		console.log("VPlugin loaded state:", JSON.parse(JSON.stringify(store)));

		runInAction("RootUIWrapper.ComponentWillMount.notifyStoreReady", ()=>this.storeReady = true);
	}
	// use observable field for this rather than react state, since setState synchronously triggers rendering -- which breaks loading process above, when rendering fails
	@observable storeReady = false;

	render() {
		const {storeReady} = this;
		if (!storeReady) return null;

		return (
			<RootUI/>
		);
	}
}

@Observer
export class RootUI extends BaseComponentPlus({}, {}) {
	render() {
		let {} = this.props;
		return (
			<>
				<style>{`
				#VPlugin_Root input {
					background: white;
					padding: 0;
				}
				`}</style>
				<Row ml={5} id="VPlugin_Root">
					<DropDown>
						<DropDownTrigger>
							<Button text="VPlugin"/>
						</DropDownTrigger>
						<DropDownContent style={{position: "absolute", width: 500}}>
							<Row>
								<Text>Show columns:</Text>
								<CheckBox ml={5} text="Album" value={store.showAlbumColumn} onChange={val=>store.showAlbumColumn = val}/>
								<CheckBox ml={5} text="Artist" value={store.showArtistColumn} onChange={val=>store.showArtistColumn = val}/>
							</Row>
							<Row>
								<Text>Playlist length:</Text>
								<Spinner ml={5} value={store.playlistLength} onChange={val=>store.playlistLength = val}/>
							</Row>
							<Row mt={5}>
								<Button text="Generate playlist" onClick={()=> {
									if (store.clearBeforeGenerate) {
										ClearPlaylist();
									}
									GeneratePlaylist();
								}}/>
								<CheckBox ml={5} text="Clear previous" value={store.clearBeforeGenerate} onChange={val=>store.clearBeforeGenerate = val}/>
							</Row>
							<Row mt={5}>
								<Button text="Export" onClick={()=> {
									const date = new Date();
									const offset = date.getTimezoneOffset();
									const date_local = new Date(date.getTime() + (offset*60*1000));
									const dateStr = date_local.toISOString().slice(0, "2020-01-01T01:01:01".length).replace("T", " ").replace(/:/g, "-");
									StartDownload(JSON.stringify(store), `NuclearVPluginStoreBackup_${dateStr}.json`);
								}}/>
								<Button ml={5} text="Import" enabled={false} onClick={()=> {
									// todo
								}}/>
							</Row>
						</DropDownContent>
					</DropDown>
				</Row>
			</>
		);
	}
}