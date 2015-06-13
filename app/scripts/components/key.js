import React from 'react';

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div>
        <h3>I'm the {this.props.label} key</h3>
      </div>
    );
  }
}
