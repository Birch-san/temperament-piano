import React from 'react';
import Key from './key';

//import Trine from 'trine';
import _ from 'lodash';

export default class extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			seedLabel: "A",
			nominalRange: 7,
			scaleBase: "C"
		};
	}

	render() {
		let startCharCode = this.state.seedLabel.charCodeAt(0);
		let keys=_(_.range(this.state.nominalRange))
			.map(delta => {
				return String.fromCharCode(startCharCode+delta)
			})
			.value();

		let scaleBaseIndex = _.indexOf(keys, this.state.scaleBase);
		let cycled = _.slice(keys, scaleBaseIndex).concat(_.slice(keys, 0, scaleBaseIndex));

		return (
			<ul>{cycled.map(this.renderItem)}</ul>
		);
	}

	renderItem(item, index) {
		return <li key={index}><Key label={item}>{item}</Key></li>;
	}
}
