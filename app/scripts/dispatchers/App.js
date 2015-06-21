import Abstract from './Abstract';

export default class extends Abstract {
	handleViewAction(action) {
		this.dispatch({
			source: 'VIEW_ACTION',
      		action: action
		});
	}
}