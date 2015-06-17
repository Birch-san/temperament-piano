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
			rootFrequency: 261.626,
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

	componentDidMount() {
		// create web audio api context
		var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

		var gainNode = audioCtx.createGain();

		// create Oscillator node
		var oscillator = audioCtx.createOscillator();

		oscillator.type = 'sine';
		oscillator.frequency.value = this.state.rootFrequency; // value in hertz
		oscillator.connect(gainNode);
		oscillator.start();

		//gainNode.connect(audioCtx.destination);
		//gainNode.disconnect(audioCtx.destination);
	}

	render() {
		function forgivingUnique(n) {
			return n.toFixed(5);
		}

		let naturalFrequencies = _.uniq(
			_.map(
				this.buildNeighbouringTetrachords(1, true, 1, 1),
				this.normalize
			),
			forgivingUnique
		).sort();
		let sharpFrequencies = _.uniq(
			_.without.apply(
				null,
				[
					_.map(
					this.buildNeighbouringTetrachords(1, true, this.state.accidentals, 0),
					this.normalize)
				].concat(naturalFrequencies)
			),
			forgivingUnique
		).sort();

		let flatFrequencies = _.uniq(
			_.without.apply(
				null,
				[
					_.map(
					this.buildNeighbouringTetrachords(1, true, 0, this.state.accidentals),
					this.normalize)
				].concat(naturalFrequencies)
			),
			forgivingUnique
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


		let naturalLabels = _.pluck(naturalKeySet, 'label');
		let scaleBaseIndex = _.indexOf(naturalLabels, this.state.scaleMode);
		let scaleModuloModeLabels = _.slice(naturalLabels, scaleBaseIndex).concat(_.slice(naturalLabels, 0, scaleBaseIndex));
		let scaleModuloMode = _.map(naturalKeySet, (obj, index) => {
			return _.extend(obj, {
				label: scaleModuloModeLabels[index]
			});
		});

		function absmod(n, m) {
			return ((n % m) + m) % m;
		}

		let sharpKeys = _.without.apply(
			null,
			[
				_.reduce(sharpFrequencies,
			(accumulator, frequency) => {
				// for example if I'm after A, my insertion point is A's index + 1
				let insertionPoint = _.sortedLastIndex(_.pluck(accumulator, 'frequency'), frequency);
				let indexKeyBelow = insertionPoint-1;

				let relatedKey = accumulator[absmod(indexKeyBelow,accumulator.length)];

				accumulator.splice(insertionPoint, 0, {
					frequency: frequency,
					label: `${relatedKey.label}♯`
				});
				return accumulator;
			},
			_.clone(scaleModuloMode)
		)
			].concat(scaleModuloMode)
		);

		let flatKeys = _.without.apply(
			null,
			[
				_.reduceRight(flatFrequencies,
			(accumulator, frequency) => {
				// for example if I'm after A, my insertion point is A's index + 1
				// and I am the flat of the guy currently at my insertion point
				let insertionPoint = _.sortedLastIndex(_.pluck(accumulator, 'frequency'), frequency);
				let indexKeyAbove = insertionPoint;

				let relatedKey = accumulator[absmod(indexKeyAbove, accumulator.length)];

				accumulator.splice(insertionPoint, 0, {
					frequency: frequency,
					label: `${relatedKey.label}♭`
				});
				return accumulator;
			},
			_.clone(scaleModuloMode)
		)
		].concat(scaleModuloMode)
		);

		return (
			<div>
				<ul>{scaleModuloMode.map(this.renderItem, this)}</ul>
				<ul>{sharpKeys.map(this.renderItem, this)}</ul>
				<ul>{flatKeys.map(this.renderItem, this)}</ul>
			</div>
		);
	}

	renderItem(item, index) {
		return <li key={index}><Key index={index} note={item} rootFrequency={this.state.rootFrequency}>{item.label}</Key></li>;
	}
}
