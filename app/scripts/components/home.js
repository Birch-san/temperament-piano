import React from 'react';
import Board from './board';

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [
        'Browserify',
        'Babel',
        'Bootstrap',
        'Modernizr',
        'Jest'
      ]
    };
  }

  render() {
    return (
        <Board/>
    );
  }

  renderItem(item, index) {
    return <li key={index}>{item}</li>;
  }
}
