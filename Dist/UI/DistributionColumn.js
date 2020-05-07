"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Store_1 = require("../Store");
const react_1 = __importDefault(require("react"));
const react_vcomponents_1 = require("react-vcomponents");
const react_vextensions_1 = require("react-vextensions");
const FromJSVE_1 = require("../Utils/General/FromJSVE");
exports.pathWeightCellUIs = {};
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
exports.distributionColumn = {
    title: "Distribution Weight",
    key: "distributionWeight",
    dataKey: "distributionWeight",
    width: 0,
    flexGrow: 3,
    cellRenderer: ({ cellData, columns, column, columnIndex, rowData, rowIndex, container, isScrolling }) => {
        return (react_1.default.createElement(WeightCellUI, { row: rowData, ref: c => {
                if (c) {
                    exports.pathWeightCellUIs[rowData.path] = c;
                }
                else {
                    delete exports.pathWeightCellUIs[rowData.path];
                }
            } }));
    },
};
class RowData {
}
class WeightCellUI extends react_vextensions_1.BaseComponentPlus({}, {}) {
    render() {
        const { row } = this.props;
        const weight = Store_1.store.pathWeights[row.path] != null ? Store_1.store.pathWeights[row.path] : 1;
        const tempWeight = Store_1.store.pathWeights_temp[row.path] != null ? Store_1.store.pathWeights_temp[row.path] : 1;
        //const weightValues = GetWeightValuesForPath(row.path);
        const subfinalWeight = Store_1.GetFinalWeightForPath(row.path, false);
        const finalWeight = Store_1.GetFinalWeightForPath(row.path);
        return (react_1.default.createElement(react_vcomponents_1.Row, null,
            react_1.default.createElement(react_vcomponents_1.Text, null, "Base:"),
            react_1.default.createElement(react_vcomponents_1.Spinner, { ml: 5, value: FromJSVE_1.RoundTo(weight * 100, 1), onChange: val => {
                    if (val != 100) {
                        Store_1.store.pathWeights[row.path] = FromJSVE_1.RoundTo(val / 100, .01);
                    }
                    else {
                        delete Store_1.store.pathWeights[row.path];
                    }
                    // update all weight-cell uis (since final % might have changed)
                    Object.values(exports.pathWeightCellUIs).forEach(cellUI => cellUI.forceUpdate());
                } }),
            react_1.default.createElement(react_vcomponents_1.Text, { style: { width: 160 } },
                "% Subfinal: ",
                FromJSVE_1.RoundTo_Str(subfinalWeight * 100, .01, undefined, false),
                "%"),
            react_1.default.createElement(react_vcomponents_1.Text, null, "Boost:"),
            react_1.default.createElement(react_vcomponents_1.Spinner, { ml: 5, value: FromJSVE_1.RoundTo(tempWeight * 100, 1), onChange: val => {
                    if (val != 100) {
                        Store_1.store.pathWeights_temp[row.path] = FromJSVE_1.RoundTo(val / 100, .01);
                    }
                    else {
                        delete Store_1.store.pathWeights_temp[row.path];
                    }
                    // update all weight-cell uis (since final % might have changed)
                    Object.values(exports.pathWeightCellUIs).forEach(cellUI => cellUI.forceUpdate());
                } }),
            react_1.default.createElement(react_vcomponents_1.Text, null,
                "% Final: ",
                FromJSVE_1.RoundTo_Str(finalWeight * 100, .01, undefined, false),
                "%")));
    }
}
