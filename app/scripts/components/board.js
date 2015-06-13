import React from 'react';
import Key from './key';

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keys: [
        "C",
        "G"
      ]
    };
  }

  render() {
    return (
      <div>
        <h2>Sup brah</h2>
        <ul>{this.state.keys.map(this.renderItem)}</ul>
      </div>
    );
  }

  renderItem(item, index) {
    return <li key={index}><Key label={item}>{item}</Key></li>;
  }
}
