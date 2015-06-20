import React from 'react';

var createjs = require('easeljs');

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      canvasID: `${props.label}-${props.absoluteFreq.qualify()}-canvas`
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
      <div
	      onClick={this.props.onClick}>
        <h3>{this.props.label} {this.props.normalizedFreq.qualify().toFixed(2)}
	        <br/>
	        {this.props.normalizedFreq.numerator}/{this.props.normalizedFreq.denominator}
	        <br/>
	        ({this.props.absoluteFreq.qualify().toFixed(2)})</h3>
        <canvas
	        id={this.state.canvasID}

	        ></canvas>
      </div>
    );
  }
}
