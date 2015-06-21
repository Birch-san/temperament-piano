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
	getConfig() {
		return config;
	}

	emitChange() {
		this.emit(CHANGE_EVENT);
	}

	addChangeListener(callback) {
		this.on(CHANGE_EVENT, callback);
	}

	removeChangeListener(callback) {
		this.removeListener(CHANGE_EVENT, callback);
	}

	dispatcherIndex(payload) {
		AppDispatcher.register((payload) => {
			var action = payload.action;
			var text;

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