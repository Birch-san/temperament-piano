export default class {
	static get switchStrategy() {
		return 'switch';
	}

	static get strategies() {
		return [
		  this.strategyNames.tetrachords,
		  this.strategyNames.harmonicStacks,
		  this.strategyNames.harmonicIntervalStacks
		];
	}

	static get strategyNames() {
		return {
		  tetrachords:"tetrachords",
		  harmonicStacks: "harmonic stacks",
		  harmonicIntervalStacks: "harmonic interval stacks"
	  };
	}
}