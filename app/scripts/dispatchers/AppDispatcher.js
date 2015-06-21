import Dispatcher from './Dispatcher';

export default class extends Dispatcher {
	handleViewAction(action) {
		this.dispatch({
			source: 'VIEW_ACTION',
      		action: action
		});
	}
}