/**
 * Created by birch on 21/06/2015.
 */
import React from 'react';
import _ from 'lodash';
import ConfigStore from '../stores/ConfigStore';
import ConfigConstants from '../constants/ConfigConstants';
import ConfigActions from '../actions/ConfigActions';

const bootstrap = require('react-bootstrap');
const Button = bootstrap.Button;
const ButtonGroup = bootstrap.ButtonGroup;
const Col = bootstrap.Col;

const classNames = require('classnames');

function initState() {
	let config = ConfigStore.getConfig();
	return {
		strategy: config.strategy
	};
}

export default class extends React.Component {
	constructor(props) {
		super(props);
		this.state = initState();
	}

	onChange() {
		this.setState(initState());
	}

	componentDidMount() {
		ConfigStore.addChangeListener(this.onChange);
	}

	componentWillUnmount() {
		ConfigStore.removeChangeListener(this.onChange);
	}

	render() {
		let classes = classNames( {
			'header': true,
			'form-horizontal': true
		});

		return (
			<form className={classes}>
			{this.state.strategy}
			<Col md={3} >
			<ButtonGroup>
			{ConfigConstants.strategies.map(this.renderStrategy, this)}
			</ButtonGroup>
			</Col>
			</form>
			);
	}

	renderStrategy(element) {
		return (
			<Button key={element} onClick={this.changeStrategy.bind(this, element)}>
			{element}
			</Button>
			);
	}

	changeStrategy(element, event) {
		event.preventDefault();
		event.stopPropagation();

		ConfigActions.switchStrategy(element);
	}
}