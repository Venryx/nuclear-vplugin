"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_vextensions_1 = require("react-vextensions");
const react_vcomponents_1 = require("react-vcomponents");
class RootUI extends react_vextensions_1.BaseComponentPlus({}, {}) {
    render() {
        let {} = this.props;
        return (react_1.default.createElement(react_vcomponents_1.Row, null,
            react_1.default.createElement(react_vcomponents_1.Button, { text: "VPlugin" })));
    }
}
exports.RootUI = RootUI;
