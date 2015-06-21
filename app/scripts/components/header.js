/**
 * Created by birch on 21/06/2015.
 */
import React from 'react';

import _ from 'lodash';
var classNames = require( 'classnames' );

export default class extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}

	render() {
		var classes = classNames( {
			'header': true
		});

		return (
			<div className={classes}>
			Yo
			</div>
		);
	}
}