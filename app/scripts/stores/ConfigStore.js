var EventEmitter = require('events').EventEmitter;

import Fraction from '../classes/Fraction';
import ConfigConstants from '../constants/ConfigConstants';
import AppDispatcher from '../dispatchers/AppDispatcher';

const _ = require('lodash');

let CHANGE_EVENT = 'change';

let config = {
	strategy: Symbol.for("harmonicStacks"),
	stackHeight: 5,
	stackNeighbourSeparation: 3,
	stacksDominant: 1,
	octaveStart: 4,
	numOctaves: 3,
	stacksNeighbouringNaturals: 5,
	scaleMode: "C",
	rootFrequency: new Fraction(261626, 1000*1)
};
_.extend(config, {
	stacksSubdominant: config.stacksDominant
});

function switchStrategy(newStrategy) {
	if (config.strategy === newStrategy) {
		return false;
	}
	config.strategy = newStrategy;
}

let emitter = new EventEmitter();

class ConfigStore {
	// constructor(...args) {
	// 	super(args);
	// }

	static getConfig() {
		return config;
	}

	static emitChange() {
		emitter.emit(CHANGE_EVENT);
	}

	static addChangeListener(callback) {
		emitter.on(CHANGE_EVENT, callback);
	}

	static removeChangeListener(callback) {
		emitter.removeListener(CHANGE_EVENT, callback);
	}
}
ConfigStore.dispatcherIndex = AppDispatcher.register((payload) => {
	let action = payload.action;

	switch(action.actionType) {
		case ConfigConstants.switchStrategy:
			if (switchStrategy(action.to) !== false) {
				ConfigStore.emitChange();
			}
			break;
	}

	return true; // No errors. Needed by promise in Dispatcher.
});

export default ConfigStore;