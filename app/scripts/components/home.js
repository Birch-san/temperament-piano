import React from 'react';
import Board from './board';
import Header from './header';

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
	    <div>
		    <Header/>
	        <Board/>
	    </div>
    );
  }
}
