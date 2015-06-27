export default class {
	static get switchStrategy() {
		return Symbol.for('switchStrategy');
	}

	static get changeInt() {
		return Symbol.for('changeInt');
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