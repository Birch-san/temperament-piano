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
			scaleMode: "C",
			accidentals: 5
		};
	}

	//Math.pow(Math.pow(2, 1/12), 7)
	// https://en.wikipedia.org/wiki/File:Harmonic_series_intervals.png
	applyInterval(tonic:number, quality:string, times:int = 1) {
		let harmonic = ()=> {
			switch(quality) {
				case "M3rd":
					return 5/4;
				case "4th":
					return 4/3;
				case "5th":
					return 3/2;
				case "8ve":
					return 2;
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

	buildNeighbouringTetrachords(tonic:number, major:boolean, distanceDominant:int, distanceSubdominant:int) {
		let neighbours = _.range(-distanceSubdominant, distanceDominant+1);
		let neighbourTetrachords = _.map(neighbours, (neighbourIndex) => {
			let neighbourTonic = this.applyInterval(tonic, "5th", neighbourIndex);
			return this.buildTetrachord(neighbourTonic, true, major);
		})
		return _.flatten(neighbourTetrachords);
	}

	/**
	 * Normalizes frequency coefficient to be within an octave (whose frequency ranges 1–2)
	 */
	normalize(frequency:number) {
		return frequency*Math.pow(2, -Math.floor(Math.log2(frequency)));
	}

	render() {
		let naturalFrequencies = _.uniq(
			_.map(
				this.buildNeighbouringTetrachords(1, true, 1, 1),
				this.normalize
			)
		).sort();
		let sharpFrequencies = _.uniq(
			_.without(
				_.map(
					this.buildNeighbouringTetrachords(1, true, this.state.accidentals, 0),
					this.normalize
				),
				naturalFrequencies
			)
		).sort();

		let flatFrequencies = _.uniq(
			_.without(
				_.map(
					this.buildNeighbouringTetrachords(1, true, 0, this.state.accidentals),
					this.normalize
				),
				naturalFrequencies
			)
		).sort();

		let scaleRoot = "A";
		let startCharCode = scaleRoot.charCodeAt(0);
		let naturalKeySet = _.map(naturalFrequencies,
			(frequency, index) => {
				return {
					frequency: frequency,
					label: String.fromCharCode(startCharCode + index)
				};
			}
		);

		let scaleBaseIndex = _.indexOf(_.pluck(naturalKeySet, 'label'), this.state.scaleMode);
		let scaleModuloMode = _.slice(naturalKeySet, scaleBaseIndex).concat(_.slice(naturalKeySet, 0, scaleBaseIndex));

		let sharpKeys = _.map(sharpFrequencies,
			(frequency) => {
				let insertionPoint = _.sortedIndex(_.pluck(scaleModuloMode, 'frequency'), frequency);

				let relatedNaturalKey = scaleModuloMode[insertionPoint%scaleModuloMode.length];

				return {
					frequency: frequency,
					label: `${relatedNaturalKey.label}${"#".repeat(Math.floor(insertionPoint/scaleModuloMode.length)+1)}`
				};
			}
		);

		let flatKeys = _.map(flatFrequencies,
			(frequency) => {
				function absmod(n, m) {
					return ((n % m) + m) % m;
				}

				let insertionPoint = _.sortedIndex(_.pluck(scaleModuloMode, 'frequency'), frequency)-1;

				let relatedNaturalKey = scaleModuloMode[absmod(insertionPoint,scaleModuloMode.length)];

				return {
					frequency: frequency,
					label: `${relatedNaturalKey.label}${"b".repeat(Math.floor(insertionPoint/scaleModuloMode.length)+1)}`
				};
			}
		);

		return (
			<div>
				<ul>{scaleModuloMode.map(this.renderItem)}</ul>
				<ul>{sharpKeys.map(this.renderItem)}</ul>
				<ul>{flatKeys.map(this.renderItem)}</ul>
			</div>
		);
	}

	renderItem(item, index) {
		return <li key={index}><Key index={index} note={item}>{item.label}</Key></li>;
	}
}
