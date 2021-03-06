import React from 'react';
import Octave from './octave';

//import Trine from 'trine';
import _ from 'lodash';
import Fraction from '../classes/Fraction';

import ConfigStore from '../stores/ConfigStore';
import ConfigConstants from '../constants/ConfigConstants';
import ConfigActions from '../actions/ConfigActions';

const classNames = require( 'classnames' );

// C2212221
// A2122122
// black keys are those which exist in the cycle of fifths,
// but not within the keyboard's scale.

// fifths can be (for example) 3:2 (i.e. perfect) or 5:4,
// depending on how large you want your chromatic scale to be

// natural notes are ones within scale

// the natural notes in the major scale are the major tetrachords
// of the tonic, dominant and subdominant!
//

// http://www.medieval.org/emfaq/harmony/pyth.html

export default class extends React.Component {
	static initState() {
		let config = ConfigStore.getConfig();
		return config;
	}

	constructor(props) {
		super(props);
		this.state = _.extend(this.constructor.initState(), {
		});
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

	applyIntervalHarmonic(tonic:Fraction, harmonicIx:int, times:int = 1) {
		let harmonic = new Fraction(harmonicIx, (harmonicIx-1)||1);
		return tonic.multiply(harmonic.raise(times));
	}

	applyHarmonic(tonic:Fraction, harmonicIx:int, times:int = 1) {
		let harmonic = new Fraction(harmonicIx);
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

	buildHarmonicIntervalStack(tonic:Fraction, range:int) {
		// btw need to consider the permutations of harmonics
		// we get within the stack: if there's a major third and a fifth,
		// then there is also a minor third for free.
		return _.map(_.range(1, range+1),
			(harmonicIx) => {
				return this.applyIntervalHarmonic(tonic, harmonicIx);
			});
	}

	buildHarmonicStack(tonic:Fraction, range:int) {
		// btw need to consider the permutations of harmonics
		// we get within the stack: if there's a major third and a fifth,
		// then there is also a minor third for free.
		return _.map(_.range(1, range+1),
			(harmonicIx) => {
				return this.applyHarmonic(tonic, harmonicIx);
			});
	}

	buildNeighbouringTetrachords(tonic:Fraction, major:boolean, distanceDominant:int, distanceSubdominant:int) {
		let neighbours = _.range(-distanceSubdominant, distanceDominant+1);
		let neighbourTetrachords = _.map(neighbours, (neighbourIndex) => {
			let neighbourTonic = this.applyInterval(tonic, "5th", neighbourIndex);
			return this.buildTetrachord(neighbourTonic, major);
		})
		return _.flatten(neighbourTetrachords);
	}

	buildNeighbouringHarmonics(tonic:Fraction, stackHeight:int, stackSeparation:int, distanceDominant:int, distanceSubdominant:int) {
		let neighbours = _.range(-distanceSubdominant, distanceDominant+1);
		let neighbourChords = _.map(neighbours, (neighbourIndex) => {
			let neighbourTonic = this.applyHarmonic(tonic, stackSeparation, neighbourIndex);
			return this.buildHarmonicStack(neighbourTonic, stackHeight);
		})
		return _.flatten(neighbourChords);
	}

	buildNeighbouringIntervalHarmonics(tonic:Fraction, stackHeight:int, stackSeparation:int, distanceDominant:int, distanceSubdominant:int) {
		let neighbours = _.range(-distanceSubdominant, distanceDominant+1);
		let neighbourChords = _.map(neighbours, (neighbourIndex) => {
			let neighbourTonic = this.applyIntervalHarmonic(tonic, stackSeparation, neighbourIndex);
			return this.buildHarmonicIntervalStack(neighbourTonic, stackHeight);
		})
		return _.flatten(neighbourChords);
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

	onChange() {
		this.setState(this.constructor.initState());
	}

	componentDidMount() {
		ConfigStore.addChangeListener(this.onChange.bind(this));
	}

	componentWillUnmount() {
		ConfigStore.removeChangeListener(this.onChange.bind(this));
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
		let strategy = this.state.strategy;

		let naturalFrequencies = _.sortBy(
			_.uniq(
				_.map(
					() => {
						switch(strategy) {
							case Symbol.for("harmonicIntervalStacks"):
								return this.buildNeighbouringIntervalHarmonics(tonic, this.state.stackHeight, this.state.stackNeighbourSeparation, this.state.stacksDominant, this.state.stacksSubdominant);
							case Symbol.for("harmonicStacks"):
								return this.buildNeighbouringHarmonics(tonic, this.state.stackHeight, this.state.stackNeighbourSeparation, this.state.stacksDominant, this.state.stacksSubdominant);
							case Symbol.for("tetrachords"):
							default:
								return this.buildNeighbouringTetrachords(tonic, true, this.state.stacksDominant, this.state.stacksSubdominant);
						}
					}(),
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
						() => {
							switch(strategy) {
								case Symbol.for("harmonicIntervalStacks"):
									return this.buildNeighbouringIntervalHarmonics(tonic, this.state.stackHeight, this.state.stackNeighbourSeparation, this.state.stacksNeighbouringNaturals, 0);
								case Symbol.for("harmonicStacks"):
									return this.buildNeighbouringHarmonics(tonic, this.state.stackHeight, this.state.stackNeighbourSeparation, this.state.stacksNeighbouringNaturals, 0);
								case Symbol.for("tetrachords"):
								default:
									return this.buildNeighbouringTetrachords(tonic, true, this.state.stacksNeighbouringNaturals, 0);
							}
						}(),
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
						() => {
							switch(strategy) {
								case Symbol.for("harmonicIntervalStacks"):
									return this.buildNeighbouringIntervalHarmonics(tonic, this.state.stackHeight, this.state.stackNeighbourSeparation, 0, this.state.stacksNeighbouringNaturals);
								case Symbol.for("harmonicStacks"):
									return this.buildNeighbouringHarmonics(tonic, this.state.stackHeight, this.state.stackNeighbourSeparation, 0, this.state.stacksNeighbouringNaturals);
								case Symbol.for("tetrachords"):
								default:
									return this.buildNeighbouringTetrachords(tonic, true, 0, this.state.stacksNeighbouringNaturals);
							}
						}(),
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
		// console.log(this.state.octaveStart, this.state.octaveStart+this.state.numOctaves);

		var classes = classNames( {
			'octaveList': true,
			'board': true
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

		oscillator.type = 'sine';
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
