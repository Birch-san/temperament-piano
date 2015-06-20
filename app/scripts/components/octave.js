import React from 'react';
import Key from './key';
import Fraction from '../classes/Fraction';
var classNames = require( 'classnames' );

export default class extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		var keyListListClasses = classNames( {
			'keyListList': true
		});

		var keyListClasses = classNames( {
			'keyList': true
		});

		return (
			<div>
				<ul className={keyListListClasses}>
					<li><ol className={keyListClasses}>{this.props.scaleModuloMode.map(this.renderItem, this)}</ol></li>
					<li><ol className={keyListClasses}>{this.props.sharpKeys.map(this.renderItem, this)}</ol></li>
					<li><ol className={keyListClasses}>{this.props.flatKeys.map(this.renderItem, this)}</ol></li>
				</ul>
			</div>
		);
	}

	renderItem(item, index) {
		let octavedFrequency = item.frequency
			.multiply((new Fraction(2)).raise(this.props.octave-this.props.octaveStart));
		let absoluteFreq = octavedFrequency
			.multiply(this.props.rootFrequency);
		let boundClick = () => {
			return this.props.clickCallback(item, absoluteFreq);
		};
		return <li key={index}><Key
			index={index}
			label={item.label+this.props.octave}
			normalizedFreq={octavedFrequency}
			absoluteFreq={absoluteFreq}
			onClick={boundClick}
			>{item.label}</Key></li>;
	}
}