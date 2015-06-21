var strategyNames = {
  tetrachords:"tetrachords",
  harmonicStacks: "harmonic stacks",
  harmonicIntervalStacks: "harmonic interval stacks"
};

export default class {
	static get switchStrategy() {
		return 'switch';
	}

	static get strategies() {
		return [
		  strategyNames.tetrachords,
		  strategyNames.harmonicStacks,
		  strategyNames.harmonicIntervalStacks
		];
	}

	static get strategyNames() {
		return strategyNames;
	}
}