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
exports.distributionColumn = {
    name: "Distribution",
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
        const weight = Store_1.store.pathWeights[row.path] != null ? Store_1.store.pathWeights[row.path] : 1;
        //const weightValues = GetWeightValuesForPath(row.path);
        const finalWeight = Store_1.GetFinalWeightForPath(row.path);
        return (react_1.default.createElement(react_vcomponents_1.Row, null,
            react_1.default.createElement(react_vcomponents_1.Spinner, { value: FromJSVE_1.RoundTo(weight * 100, 1), onChange: val => {
                    if (val != 100) {
                        Store_1.store.pathWeights[row.path] = FromJSVE_1.RoundTo(val / 100, .01);
                    }
                    else {
                        delete Store_1.store.pathWeights[row.path];
                    }
                    // update all weight-cell uis (since final % might have changed)
                    Object.values(exports.pathWeightCellUIs).forEach(cellUI => cellUI.forceUpdate());
                } }),
            react_1.default.createElement(react_vcomponents_1.Text, null,
                "% (final: ",
                FromJSVE_1.RoundTo_Str(finalWeight * 100, .01, undefined, false),
                "%)")));
    }
}
