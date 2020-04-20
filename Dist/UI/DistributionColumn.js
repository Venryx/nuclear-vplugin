"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Store_1 = require("../Store");
const react_1 = __importDefault(require("react"));
const react_vcomponents_1 = require("react-vcomponents");
const react_vextensions_1 = require("react-vextensions");
function GetWeightValuesForPath(path) {
    const pathParts = path.split("/");
    const ancestorFolderPaths = pathParts.map((part, index) => {
        const partsForFolder = pathParts.slice(0, index + 1);
        const folderPath = partsForFolder.join("/");
        return folderPath;
    });
    return ancestorFolderPaths.map(path => {
        return Store_1.pathWeights[path] != null ? Store_1.pathWeights[path] : 1;
    });
}
exports.GetWeightValuesForPath = GetWeightValuesForPath;
exports.pathWeightCellUIs = {};
exports.distributionColumn = {
    name: "Distribution [V]",
    dataIndex: "distributionWeight",
    sortable: false,
    //className: "additional-class",
    id: `${Date.now()}_${Math.random().toString()}`,
    renderer: ({ column, value, row }) => {
        return (react_1.default.createElement(WeightCellUI, { row: row, ref: c => {
                if (c) {
                    exports.pathWeightCellUIs[row.path] = c;
                }
                else {
                    delete exports.pathWeightCellUIs[row.path];
                }
            } }));
    },
};
class RowData {
}
class WeightCellUI extends react_vextensions_1.BaseComponentPlus({}, {}) {
    render() {
        const { row } = this.props;
        const weight = Store_1.pathWeights[row.path] != null ? Store_1.pathWeights[row.path] : 1;
        const weightValues = GetWeightValuesForPath(row.path);
        const finalWeight = weightValues.reduce((acc, cur) => acc * cur, 1);
        return (react_1.default.createElement(react_vcomponents_1.Row, null,
            react_1.default.createElement(react_vcomponents_1.Spinner, { value: weight * 100, onChange: val => {
                    if (val != 1) {
                        Store_1.pathWeights[row.path] = val / 100;
                    }
                    else {
                        delete Store_1.pathWeights[row.path];
                    }
                    // update all weight-cell uis (since final % might have changed)
                    Object.values(exports.pathWeightCellUIs).forEach(cellUI => cellUI.forceUpdate());
                } }),
            react_1.default.createElement(react_vcomponents_1.Text, null,
                "% (final: ",
                finalWeight * 100,
                "%)")));
    }
}
