import React from 'react';
import Octave from './octave';

//import Trine from 'trine';
import _ from 'lodash';
import Fraction from '../classes/Fraction';

var classNames = require( 'classnames' );

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
			rootFrequency: new Fraction(261626, 1000),
			accidentals: 5,
			octaveStart: 4,
			numOctaves: 3
		};
	}

	//Math.pow(Math.pow(2, 1/12), 7)
	// https://en.wikipedia.org/wiki/File:Harmonic_series_intervals.png
	applyInterval(tonic:Fraction, quality:string, times:int = 1) {
		let harmonic = ()=> {
			switch(quality) {
				case "M3rd":
					return new Fraction(5, 4);
				case "4th":
					return new Fraction(4, 3);
				case "5th":
					return new Fraction(3, 2);
				case "8ve":
					return new Fraction(2);
			}
		}(quality);
		return tonic.multiply(harmonic.raise(times));
	}

	/**
	 * From some identity coefficient returns a tetrachord by
	 * the specified quality — expressed as an array of
	 * coefficients relative to the base frequency.
	 * Not normalized to within an octave.
	 */
	buildTetrachord(tonic:Fraction, major:boolean) {
		return [
			tonic,
			this.applyInterval(tonic, `${major?'M':'m'}3rd`),
			this.applyInterval(tonic, "5th")
		];
	}

	buildNeighbouringTetrachords(tonic:Fraction, major:boolean, distanceDominant:int, distanceSubdominant:int) {
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

	normalizeFraction(frequency:Fraction) {
		let octaveDelta = -Math.floor(Math.log2(frequency.qualify()));
		return frequency.multiply(new Fraction(2).raise(octaveDelta));
	}

	getAudioContext() {
		if (!this.audioContext) {
			this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
		}
		return this.audioContext;
	}

	componentDidMount() {
		// create web audio api context
		//var audioCtx = this.getAudioContext();

		//var gainNode = audioCtx.createGain();

		// create Oscillator node
		/*var oscillator = audioCtx.createOscillator();

		oscillator.type = 'sine';
		oscillator.frequency.value = this.state.rootFrequency.qualify(); // value in hertz
		oscillator.connect(gainNode);
		oscillator.start();*/

		//gainNode.connect(audioCtx.destination);
		//gainNode.disconnect(audioCtx.destination);
	}

	render() {
		let forgivingUnique = (n:Fraction) => {
			return n.qualify();
		};

		let fractionSorter = (fraction:Fraction) => {
			return fraction.qualify();
		};

		let noteSorter = (note) => {
			return note.frequency.qualify();
		};

		let without = (nominal, exceptions, comparer, sorter) => {
			let sortedNominal = _.sortBy(_.clone(nominal), sorter);
			let sortedExceptions = _.sortBy(_.clone(exceptions), sorter);

			let nominalStartLength = sortedNominal.length-1;
			let exceptionsStartLength = sortedExceptions.length-1;
			let exceptionsInsertion = exceptionsStartLength;
			nominals:
			for (let i=nominalStartLength; i>=0; i--) {
				let nFrac = sortedNominal[i];
				exceptionals:
				for (let j=exceptionsInsertion; j>=0; j--) {
					let eFrac = sortedExceptions[j];
					if (comparer(nFrac, eFrac)) {
						sortedNominal.splice(i, 1);
						continue nominals;
					}
				}
			}
			return sortedNominal;
		};

		let fractionCompare = (fraction1, fraction2) => {
			return fraction1.equals(fraction2);
		};

		let withoutFractions = (nominal, exceptions) => {
			return without(nominal, exceptions, fractionCompare, fractionSorter);
		};

		let withoutNotes = (nominal, exceptions) => {
			return without(nominal, exceptions, (note1, note2) => {
				return fractionCompare(note1.frequency, note2.frequency);
			},
			noteSorter);
		};

		let tonic = new Fraction(1);

		let naturalFrequencies = _.sortBy(
			_.uniq(
				_.map(
					this.buildNeighbouringTetrachords(tonic, true, 1, 1),
					this.normalizeFraction
				),
				forgivingUnique
			),
			fractionSorter
		);
		let sharpFrequencies = _.sortBy(
			_.uniq(
				withoutFractions(
					_.map(
						this.buildNeighbouringTetrachords(tonic, true, this.state.accidentals, 0),
						this.normalizeFraction),
					naturalFrequencies
				),
				forgivingUnique
			),
			fractionSorter
		);

		let flatFrequencies = _.sortBy(
			_.uniq(
				withoutFractions(
					_.map(
						this.buildNeighbouringTetrachords(tonic, true, 0, this.state.accidentals),
						this.normalizeFraction),
					naturalFrequencies
				),
				forgivingUnique
			),
			fractionSorter
		);

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

		let sharpKeys = withoutNotes(
				_.reduce(sharpFrequencies,
			(accumulator, frequency) => {
				// for example if I'm after A, my insertion point is A's index + 1
				let insertionPoint = _.sortedLastIndex(
					_.pluck(accumulator, 'frequency'),
					frequency,
					fractionSorter
				);
				let indexKeyBelow = insertionPoint-1;

				let relatedKey = accumulator[absmod(indexKeyBelow,accumulator.length)];

				accumulator.splice(insertionPoint, 0, {
					frequency: frequency,
					label: `${relatedKey.label}♯`
				});
				return accumulator;
			},
			_.clone(scaleModuloMode)
				),
			scaleModuloMode);

		let flatKeys = withoutNotes(
				_.reduceRight(flatFrequencies,
			(accumulator, frequency) => {
				// for example if I'm after A, my insertion point is A's index + 1
				// and I am the flat of the guy currently at my insertion point
				let insertionPoint = _.sortedLastIndex(
					_.pluck(accumulator, 'frequency'),
					frequency,
					fractionSorter
				);
				let indexKeyAbove = insertionPoint;

				let relatedKey = accumulator[absmod(indexKeyAbove, accumulator.length)];

				accumulator.splice(insertionPoint, 0, {
					frequency: frequency,
					label: `${relatedKey.label}♭`
				});
				return accumulator;
			},
			_.clone(scaleModuloMode)
				),
			scaleModuloMode);

		let octaves = _.range(this.state.octaveStart, this.state.octaveStart+this.state.numOctaves);

		var classes = classNames( {
			'octaveList': true
		});

		return (
			<ol className={classes}>
				{octaves.map(this.renderOctave.bind(this, scaleModuloMode, sharpKeys, flatKeys), this)}
			</ol>
		);
	}

	clickCallback(key, absoluteFreq) {
		console.log(key);
		let audioCtx = this.getAudioContext();
		let gainNode = audioCtx.createGain();
		let oscillator = audioCtx.createOscillator();
		oscillator.connect(gainNode);

		oscillator.type = 'square';
		oscillator.frequency.value = absoluteFreq.qualify(); // value in hertz
		oscillator.start();
		console.log(absoluteFreq.qualify());

		gainNode.gain.value = 0.2;

		gainNode.connect(audioCtx.destination);
	}

	renderOctave(scaleModuloMode, sharpKeys, flatKeys, octave, index) {
		return <li key={index}><Octave
			index={index}
			octave={octave}
			octaveStart={this.state.octaveStart}
			rootFrequency={this.state.rootFrequency}
			scaleModuloMode={scaleModuloMode}
			sharpKeys={sharpKeys}
			flatKeys={flatKeys}
			clickCallback={this.clickCallback.bind(this)}
			>{octave}</Octave></li>;
	}
}
