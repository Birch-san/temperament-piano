var Promise = require('bluebird');

let callbacks = [];
let promises = [];

export default class {
	static register(callback) {
		callbacks.push(callback);
		return callbacks.length-1;
	}

	static dispatch(payload) {
		let resolves = [];
		let rejects = [];

		promises = callbacks.map((iterand, index) => {
			return new Promise((resolve, reject) => {
				resolves[index] = resolve;
				rejects[index] = reject;
			});
		});

		callbacks.forEach((callback, index) => {
			Promise.resolve(callback(payload))
			.then(()=> {
				resolves[index](payload);
			})
			.caught(() => {
				rejects[index](new Error('Dispatcher callback unsuccessful!'));
			});
		});

		promises = [];
	}
}