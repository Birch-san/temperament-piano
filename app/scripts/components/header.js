/**
 * Created by birch on 21/06/2015.
 */
import React from 'react';

import _ from 'lodash';
var Button = require('react-bootstrap').Button;
var ButtonGroup = require('react-bootstrap').ButtonGroup;
var Col = require('react-bootstrap').Col;

var classNames = require( 'classnames' );

export default class extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}

	render() {
		var classes = classNames( {
			'header': true,
			'form-horizontal': true
		});

		return (
			<form className={classes}>
				<Col md={3} >
					<ButtonGroup>
						{this.props.strategies.map(this.renderStrategy, this)}
					</ButtonGroup>
				</Col>
			</form>
		);
	}

	renderStrategy(element) {
		return (
			<Button key={element}>
				{element}
			</Button>
		);
	}
}