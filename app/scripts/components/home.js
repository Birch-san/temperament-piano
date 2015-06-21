import React from 'react';
import Board from './board';
import Header from './header';

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };

	  this.strategyNames = {
		  tetrachords:"tetrachords",
		  harmonicStacks: "harmonic stacks",
		  harmonicIntervalStacks: "harmonic interval stacks"
	  };
	  this.strategies = [
		  this.strategyNames.tetrachords,
		  this.strategyNames.harmonicStacks,
		  this.strategyNames.harmonicIntervalStacks
	  ];
  }

  render() {
    return (
	    <div>
		    <Header
			    strategies={this.strategies}
			    strategyNames={this.strategyNames}
			    />
	        <Board/>
	    </div>
    );
  }
}
