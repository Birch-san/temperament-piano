import React from 'react';

var createjs = require('easeljs');

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      canvasID: `${props.note.label}-${props.note.frequency}-canvas`
    };
  }

  componentDidMount() {
    var stage = new createjs.Stage(this.state.canvasID);
    var shape = new createjs.Shape();
    shape.graphics.beginFill('red').drawRect(0, 0, 120, 120);
    stage.addChild(shape);
    stage.update();
  }

  render() {
    return (
      <div>
        <h3>{this.props.note.label} {this.props.note.frequency.toFixed(2)}
	        <br/>
	        ({(this.props.rootFrequency*this.props.note.frequency).toFixed(2)})</h3>
        <canvas id={this.state.canvasID}></canvas>
      </div>
    );
  }
}
