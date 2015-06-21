var Promise = require('bluebird');

export default class {
	constructor() {
		this.callbacks = [];
		this.promises = [];
	}

	register(callback) {
		this.callbacks.push(callback);
		return this.callbacks.length-1;
	}

	dispatch(payload) {
		let resolves = [];
		let rejects = [];

		this.promises = this.callbacks.map((iterand, index) => {
			return new Promise((resolve, reject) => {
				resolves[i] = resolve;
				rejects[i] = reject;
			});
		});

		this.callbacks.forEach((callback, index) => {
			Promise.resolve(callback(payload))
			.then(()=> {
				resolves[index](payload);
			})
			.caught(() => {
				rejects[index](new Error('Dispatcher callback unsuccessful!'));
			});
		});

		this.promises = [];
	}
}