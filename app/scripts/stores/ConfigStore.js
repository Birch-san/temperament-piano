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

// console.log(EventEmitter.prototype);

export default class extends EventEmitter {
	// constructor(...args) {
	// 	super(args);
	// }

	getConfig() {
		return config;
	}

	emitChange() {
		super.emit(CHANGE_EVENT);
	}

	addChangeListener(callback) {
		super.on(CHANGE_EVENT, callback);
	}

	removeChangeListener(callback) {
		super.removeListener(CHANGE_EVENT, callback);
	}

	dispatcherIndex() {
		return AppDispatcher.register((payload) => {
			let action = payload.action;

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