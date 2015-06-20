import React from 'react';

var createjs = require('easeljs');

export default class extends React.Component {
  constructor(props) {
    super(props);
	  let normalizedFreq = this.props.note.frequency;
	  let absoluteFreq = this.props.note.frequency.multiply(this.props.rootFrequency);
    this.state = {
      canvasID: `${props.note.label}-${absoluteFreq.qualify()}-canvas`
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
	  let normalizedFreq = this.props.note.frequency;
	  let absoluteFreq = this.props.note.frequency.multiply(this.props.rootFrequency);
    return (
      <div>
        <h3>{this.props.note.label} {normalizedFreq.qualify().toFixed(2)}
	        <br/>
	        {normalizedFreq.numerator}/{normalizedFreq.denominator}
	        <br/>
	        ({absoluteFreq.qualify().toFixed(2)})</h3>
        <canvas id={this.state.canvasID}></canvas>
      </div>
    );
  }
}
