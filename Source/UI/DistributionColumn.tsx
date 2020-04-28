import {store, GetFinalWeightForPath} from "../Store";
import React from "react";
import {Spinner, Text, Row} from "react-vcomponents";
import {BaseComponentPlus} from "react-vextensions";
import {RoundTo_Str, RoundTo} from "../Utils/General/FromJSVE";

export const pathWeightCellUIs = {} as {[key: string]: WeightCellUI};

/*export const distributionColumn_rrg = {
	name: "Distribution Weight",
	dataIndex: "distributionWeight",
	sortable: false,
	//className: "additional-class",
	id: `${Date.now()}_${Math.random().toString()}`,
	renderer: ({ column, value, row }) => {
		return (
			<WeightCellUI row={row} ref={c=> {
				if (c) {
					pathWeightCellUIs[row.path] = c;
				} else {
					delete pathWeightCellUIs[row.path];
				}
			}}/>
		);
	},
};*/
export const distributionColumn = {
	title: "Distribution Weight",
	dataKey: "distributionWeight",
	width: 0, // required, but flex-grow actually drives the sizing
	flexGrow: 3,
	cellRenderer: ({ cellData, columns, column, columnIndex, rowData, rowIndex, container, isScrolling }) => {
		return (
			<WeightCellUI row={rowData} ref={c=> {
				if (c) {
					pathWeightCellUIs[rowData.path] = c;
				} else {
					delete pathWeightCellUIs[rowData.path];
				}
			}}/>
		);
	},
};

class RowData {
	path: string;
}
class WeightCellUI extends BaseComponentPlus({} as {row: RowData}, {}) {
	render() {
		const {row} = this.props;
		const weight = store.pathWeights[row.path] != null ? store.pathWeights[row.path] : 1;
		const tempWeight = store.pathWeights_temp[row.path] != null ? store.pathWeights_temp[row.path] : 1;
		//const weightValues = GetWeightValuesForPath(row.path);
		const subfinalWeight = GetFinalWeightForPath(row.path, false);
		const finalWeight = GetFinalWeightForPath(row.path);
		return (
			<Row>
				<Text>Base:</Text>
				<Spinner ml={5} value={RoundTo(weight * 100, 1)} onChange={val=> {
					if (val != 100) {
						store.pathWeights[row.path] = RoundTo(val / 100, .01);
					} else {
						delete store.pathWeights[row.path];
					}
					// update all weight-cell uis (since final % might have changed)
					Object.values(pathWeightCellUIs).forEach(cellUI=>cellUI.forceUpdate());
				}}/>
				<Text style={{width: 160}}>% Subfinal: {RoundTo_Str(subfinalWeight * 100, .01, undefined, false)}%</Text>
				<Text>Boost:</Text>
				<Spinner ml={5} value={RoundTo(tempWeight * 100, 1)} onChange={val=> {
					if (val != 100) {
						store.pathWeights_temp[row.path] = RoundTo(val / 100, .01);
					} else {
						delete store.pathWeights_temp[row.path];
					}
					// update all weight-cell uis (since final % might have changed)
					Object.values(pathWeightCellUIs).forEach(cellUI=>cellUI.forceUpdate());
				}}/>
				<Text>% Final: {RoundTo_Str(finalWeight * 100, .01, undefined, false)}%</Text>
			</Row>
		);
	}
}