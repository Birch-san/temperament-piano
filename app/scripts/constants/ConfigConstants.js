export default class {
	static get switchStrategy() {
		return 'switch';
	}

	static get strategies() {
		return {
		  [Symbol.for("tetrachords")]: {
		  	name: "tetrachords"
		  },
		  [Symbol.for("harmonicStacks")]: {
		  	name: "harmonic stacks"
		  },
		  [Symbol.for("harmonicIntervalStacks")]: {
		  	name: "harmonic interval stacks"
		  }
		};
	}
}