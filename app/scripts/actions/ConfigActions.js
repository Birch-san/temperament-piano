import AppDispatcher from '../dispatchers/AppDispatcher';
import ConfigConstants from '../constants/ConfigConstants';

export default class {
	static switchStrategy(strategy) {
		AppDispatcher.handleViewAction({
			actionType: ConfigConstants.switchStrategy,
			to: strategy
		})
	}
}