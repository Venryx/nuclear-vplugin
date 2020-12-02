import React from "react";
import {BaseComponentPlus} from "react-vextensions";
import {Row, Button, DropDown, DropDownTrigger, DropDownContent, Text, Spinner, CheckBox, Column, TextInput, TextArea} from "react-vcomponents";
import {store} from "../Store";
import {StartDownload} from "../Utils/General/FromJSVE";
import {observable, runInAction} from "mobx";
import {observer} from "mobx-react";
import {AsyncTrunk} from "mobx-sync";
import {Observer} from "../Utils/General/FromVWAF";
import {ClearPlaylist, GeneratePlaylist} from "../Utils/Managers/Playlists";

//import {ShowMessageBox} from "react-vmessagebox";
/*let {ShowMessageBox}: typeof import("react-vmessagebox") = {} as any;
(async()=>{
	({ShowMessageBox} = await import("react-vmessagebox"));
	//({ShowMessageBox} = await eval(`import("react-vmessagebox")`));
	/*const importFunc = eval("import");
	({ShowMessageBox} = await importFunc("react-vmessagebox"));*#/
})();*/
/*import esmModules from "../ImportHelper";
const react_vMessageBox = esmModules.react_vMessageBox as typeof import("react-vmessagebox");*/
//import {react_vMessageBox} from "../ImportHelper";
/*const {ShowMessageBox} = react_vMessageBox;
console.log("ShowMessageBox:", ShowMessageBox);*/

/*const require_esm = require("esm")(module);
let {react_vMessageBox} = require_esm("../ImportHelper");*/

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
								<Text>Row height:</Text>
								<Spinner ml={5} value={store.rowHeight} onChange={val=>store.rowHeight = val}/>
							</Row>
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
								<Button ml={5} text="Import" onClick={async()=> {
									/*const json = prompt("Paste JSON from export/backup file below", "");
									if (json == null) return;
									ImportConfig(JSON.parse(json));*/

									let json = "";
									const Change = (..._)=>boxController.UpdateUI();
									
									/*import("fs");
									//import("react-vmessagebox");
									debugger;
									require("../ImportHelper");
									return;*/
									
									//let react_vMessageBox = await import("react-vmessagebox");
									//let {react_vMessageBox} = require("../ImportHelper");
									/*const require_esm = require("esm")(module);
									let {react_vMessageBox} = require_esm("react-vmessagebox");*/
									/*const require_esm = require("esm")(module);
									let react_vMessageBox = require_esm("../ImportHelper").react_vMessageBox as typeof import("react-vmessagebox");*/
									debugger;
									let react_vMessageBox = require("../ImportHelper").react_vMessageBox as typeof import("react-vmessagebox");

									setTimeout(()=>{
										console.log("ShowMessageBox", react_vMessageBox.ShowMessageBox);
									}, 1000);
									return;

									let boxController = react_vMessageBox.ShowMessageBox({
										title: "Import config JSON", cancelButton: true,
										message: ()=>{
											//boxController.options.okButtonProps = {enabled: error == null};
											return (
												<Column style={{padding: "10px 0", width: 600}}>
													<Row>
														<Text>JSON:</Text>
														<TextArea ml={5} style={{flex: 1}} value={json} onChange={val=>Change(json = val)}/>
													</Row>
												</Column>
											);
										},
										onOK: ()=>{
											ImportConfig(JSON.parse(json))
										},
									});

									function ImportConfig(data) {
										console.log("Importing config. @old:", JSON.parse(JSON.stringify(store)), "@new:", data);
										for (const [key, value] of Object.entries(data)) {
											store[key] = value;
										}
									}
								}}/>
							</Row>
						</DropDownContent>
					</DropDown>
				</Row>
			</>
		);
	}
}