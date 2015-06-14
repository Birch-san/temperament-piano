import React from 'react';
import Key from './key';

//import Trine from 'trine';
import _ from 'lodash';
// C2212221
// A2122122
// black keys are those which exist in the cycle of fifths,
// but not within the keyboard's scale.

// fifths can be (for example) 3:2 (i.e. perfect) or 5:4,
// depending on how large you want your chromatic scale to be

// natural notes are ones within scale

// the natural notes in the major scale are the major tetrachords
// of the tonic, dominant and subdominant!
// http://arxiv.org/html/1202.4212v1/#sec_3_2_3

export default class extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			scaleRoot: "A",
			scale: [2,1,2,2,1,2,2],
			scaleMode: "C"
		};
	}

	render() {
		let startCharCode = this.state.scaleRoot.charCodeAt(0);
		let keys=_(_.range(this.state.scale.length))
			.map(delta => {
				return String.fromCharCode(startCharCode+delta)
			})
			.value();

		let scaleBaseIndex = _.indexOf(keys, this.state.scaleMode);
		let scaleModulusMode = _.slice(keys, scaleBaseIndex).concat(_.slice(keys, 0, scaleBaseIndex));

		return (
			<ul>{scaleModulusMode.map(this.renderItem)}</ul>
		);
	}

	renderItem(item, index) {
		return <li key={index}><Key label={item}>{item}</Key></li>;
	}
}
