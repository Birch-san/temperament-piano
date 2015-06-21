var EventEmitter = require('events').EventEmitter;

import ConfigConstants from '../constants/ConfigConstants';
import AppDispatcher from '../dispatchers/AppDispatcher';

var _ = require('lodash');

let CHANGE_EVENT = 'change';

let config = {
	strategy: ConfigConstants.strategyNames.harmonicStacks
};

function switchStrategy(newStrategy) {
	if (config.strategy === newStrategy) {
		return false;
	}
	config.strategy = newStrategy;
}

export default class extends EventEmitter {
	// constructor(...args) {
	// 	super(args);
	// }

	static getConfig() {
		return config;
	}

	static emitChange() {
		this.emit(CHANGE_EVENT);
	}

	static addChangeListener(callback) {
		this.on(CHANGE_EVENT, callback);
	}

	static removeChangeListener(callback) {
		this.removeListener(CHANGE_EVENT, callback);
	}

	static dispatcherIndex() {
		return AppDispatcher.register((payload) => {
			let action = payload.action;
			console.log(action);

			switch(action.actionType) {
				case ConfigConstants.switch:
					if (switchStrategy(action.strategy) !== false) {
						this.emitChange();
					}
					break;
			}

			return true; // No errors. Needed by promise in Dispatcher.
		});
	}
}