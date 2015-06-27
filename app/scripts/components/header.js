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
const Row = bootstrap.Row;
const Label = bootstrap.Label;
const Input = bootstrap.Input;

const classNames = require('classnames');
import InputNum from 'rc-input-number';

function initState() {
	let config = ConfigStore.getConfig();
	return config;
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

		let stateStrategyObj = ConfigConstants.strategies[this.state.strategy];

		return (
			<form className={classNames({
					'header': true,
					'form-horizontal': false
				})}>
			
				<Col xs={4}>
				<Label>Generator</Label>
				<div className={classNames({
					'input-group': true
				})}>
					<ButtonGroup>
					{Object.getOwnPropertySymbols(ConfigConstants.strategies).map(this.renderStrategy, this)}
					</ButtonGroup>
					</div>
				</Col>
				<Col xs={4} className={classNames({
					'form-group': true
				})}>
					<Label className={classNames({
						// 'input-group-addon': true
						})}>Octave</Label>
					<Col xs={3} className={classNames({
					'input-group': true
					})}>
						<InputNum
						min={1} max={10} step={1}
						className={classNames({
						'form-control': true,
						'input': true
						})}
						value={this.state.octaveStart}
						onChange={this.handleChange.bind(this, 'octaveStart')}
						/>
					</Col>
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

	handleChange(ref, value) {
		ConfigActions.changeInt(ref, value);
	}
}