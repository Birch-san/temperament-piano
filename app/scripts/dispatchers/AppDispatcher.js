import AbstractDispatcher from './AbstractDispatcher';

export default class extends AbstractDispatcher {
	static handleViewAction(action) {
		AbstractDispatcher.dispatch({
			source: 'VIEW_ACTION',
      		action: action
		});
	}
}