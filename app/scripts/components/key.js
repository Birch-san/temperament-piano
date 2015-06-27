import React from 'react';

var createjs = require('easeljs');

export default class extends React.Component {
  static makeID(props) {
    return `${props.label}-${props.absoluteFreq.qualify()}-canvas`;
  }

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    let canvasID = this.constructor.makeID(this.props);
    var stage = new createjs.Stage(canvasID);
    var shape = new createjs.Shape();
	  let accidentalness = (this.props.label
		  .match(new RegExp("[♭|♯]", "g")) || []).length;
    shape.graphics
	    .setStrokeStyle(3)
	    .beginStroke("#000000")
	    .beginFill(
	        accidentalness
		    ? `#${Math.floor(0xFF*(1-Math.pow(2, -(accidentalness-1)))).toString(16).repeat(3)}`
		        : "white"
        )
	    .drawRect(0, 0, 120, 120);
	  //console.log(`#${Math.floor(0xFF*(1-Math.pow(2, -accidentalness))).toString(16).repeat(3)}`);
    stage.addChild(shape);
    stage.update();
  }

  render() {
    let canvasID = this.constructor.makeID(this.props);
    return (
      <div
	      onClick={this.props.onClick}>
        <h3>{this.props.label}
	        </h3>
	      <p>{this.props.normalizedFreq.qualify().toFixed(2)}
	        <br/>
	        {this.props.normalizedFreq.numerator}÷{this.props.normalizedFreq.denominator}
	        <br/>
	        {this.props.absoluteFreq.qualify().toFixed(2)}Hz</p>
        <canvas
	        id={canvasID}

	        ></canvas>
      </div>
    );
  }
}
