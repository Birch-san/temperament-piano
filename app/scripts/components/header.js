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
const Label = bootstrap.Label;

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
		ConfigStore.addChangeListener(this.onChange.bind(this));
	}

	componentWillUnmount() {
		ConfigStore.removeChangeListener(this.onChange.bind(this));
	}

	render() {
		let classes = classNames( {
			'header': true,
			'form-horizontal': false
		});

		let stateStrategyObj = ConfigConstants.strategies[this.state.strategy];

		return (
			<form className={classes}>
			<Col xs={6} >
			<Col xs={3} >
			<Label>{stateStrategyObj.name}</Label>
			</Col>
			<ButtonGroup>
			{Object.getOwnPropertySymbols(ConfigConstants.strategies).map(this.renderStrategy, this)}
			</ButtonGroup>
			</Col>
			</form>
			);
	}

	renderStrategy(strategy) {
		let stateStrategyObj = ConfigConstants.strategies[this.state.strategy];
		let strategyObj = ConfigConstants.strategies[strategy];
		return (
			<Button
			key={strategyObj.name}
			onClick={this.changeStrategy.bind(this, strategy)}
			active={stateStrategyObj.name === strategyObj.name}
			>
			{strategyObj.name}
			</Button>
			);
	}

	changeStrategy(strategy, event) {
		event.preventDefault();
		event.stopPropagation();

		ConfigActions.switchStrategy(strategy);
	}
}