import {pathWeights} from "../Store";
import React from "react";
import {Spinner, Text, Row} from "react-vcomponents";
import {BaseComponentPlus} from "react-vextensions";

export function GetWeightValuesForPath(path: string) {
	const pathParts = path.split("/");
	const ancestorFolderPaths = pathParts.map((part, index)=> {
		const partsForFolder = pathParts.slice(0, index + 1);
		const folderPath = partsForFolder.join("/");
		return folderPath;
	});
	return ancestorFolderPaths.map(path=> {
		return pathWeights[path] != null ? pathWeights[path] : 1;
	});
}

export const pathWeightCellUIs = {} as {[key: string]: WeightCellUI};

export const distributionColumn = {
	name: "Distribution [V]",
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
};

class RowData {
	path: string;
}
class WeightCellUI extends BaseComponentPlus({} as {row: RowData}, {}) {
	render() {
		const {row} = this.props;
		const weight = pathWeights[row.path] != null ? pathWeights[row.path] : 1;
		const weightValues = GetWeightValuesForPath(row.path);
		const finalWeight = weightValues.reduce((acc, cur)=>acc * cur, 1);
		return (
			<Row>
				<Spinner value={weight * 100} onChange={val=> {
					if (val != 1) {
						pathWeights[row.path] = val / 100;
					} else {
						delete pathWeights[row.path];
					}
					// update all weight-cell uis (since final % might have changed)
					Object.values(pathWeightCellUIs).forEach(cellUI=>cellUI.forceUpdate());
				}}/>
				<Text>% (final: {finalWeight * 100}%)</Text>
			</Row>
		);
	}
}