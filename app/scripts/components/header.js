/**
 * Created by birch on 21/06/2015.
 */
 import React from 'react';
 import _ from 'lodash';
 import ConfigStore from '../stores/ConfigStore';
 import ConfigConstants from '../constants/ConfigConstants';

 const bootstrap = require('react-bootstrap');
 const Button = bootstrap.Button;
 const ButtonGroup = bootstrap.ButtonGroup;
 const Col = bootstrap.Col;

 const classNames = require('classnames');

 let store = new ConfigStore();

 function getState() {
 	// console.log(ConfigStore.prototype);
 	// console.log(ConfigStore);
 	// console.log(ConfigStore.getConfig);
 	let config = store.getConfig();
 	return {
		strategy: config.strategy
	};
 }

 export default class extends React.Component {
 	constructor(props) {
 		super(props);
 		this.state = getState();
 	}

 	componentDidMount() {
 		store.addChangeListener(this.onChange);
 	}

 	componentWillUnmount() {
 		store.removeChangeListener(this.onChange);
 	}

 	onChange() {
 		this.setState(getState());
 	}

 	render() {
 		let classes = classNames( {
 			'header': true,
 			'form-horizontal': true
 		});

 		return (
 			<form className={classes}>
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
 			<Button key={element}>
 			{element}
 			</Button>
 			);
 	}
 }