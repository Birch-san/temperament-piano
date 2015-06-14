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

	applyInterval(tonic:number, quality:string, times:int = 1) {
		if (times === 0) return tonic;
		let harmonic = ()=> {
			switch(quality) {
				case "8ve":
					return 2;
				case "5th":
					return 3;
				case "M3rd":
					return 4;
				case "m3rd":
					return 5;
			}
		}(quality);
		return tonic*Math.pow(harmonic, times);
	}

	/**
	 * From some identity coefficient returns a tetrachord by
	 * the specified quality — expressed as an array of
	 * coefficients relative to the base frequency.
	 * Not normalized to within an octave.
	 */
	buildTetrachord(tonic:number, major:boolean) {
		return [
			tonic,
			this.applyInterval(tonic, `${major?'M':'m'}3rd`),
			this.applyInterval(tonic, "5th")
		];
	}

	buildNeighbouringTetrachords(tonic:number, major:boolean, distance:int = 1) {
		let neighbours = _.range(-distance, distance+1);
		let neighbourTetrachords = _.map(neighbours, (neighbourIndex) => {
			let neighbourTonic = this.applyInterval(tonic, "5th", neighbourIndex);
			return this.buildTetrachord(neighbourTonic, true, major);
		})
		return _.uniq(_.flatten(neighbourTetrachords));
	}

	render() {

		console.log(this.buildNeighbouringTetrachords(1));
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
