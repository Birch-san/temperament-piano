import React from 'react';

var createjs = require('easeljs');

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      canvasID: `${props.index}-canvas`
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
        <h3>I'm the {this.props.label} key</h3>
        <canvas id={this.state.canvasID}></canvas>
      </div>
    );
  }
}
