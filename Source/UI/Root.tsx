import React from "react";
import {BaseComponentPlus} from "react-vextensions";
import {Row, Button} from "react-vcomponents";

export class RootUI extends BaseComponentPlus({}, {}) {
	render() {
		let {} = this.props;
		return (
			<Row ml={5}>
				<Button text="VPlugin"/>
			</Row>
		);
	}
}