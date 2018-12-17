import React, { Component } from 'react';
import styles from './sign-here.module.scss';

import { isPressureSensitiveDevice, pressureDetected } from '../utils';


class SignHere extends Component {

  state = {
    isMouseDown: false,
    lineWidth: 0,
    points: [],
  };

  componentDidMount() {
    let canvas = this.refs.canvas;
    canvas.width = 1200;
    canvas.height = 800;
  }

  handlePointerDown = (ev) => {
    ev.preventDefault()
    const { lineWidth } = this.state;
    let pressure = 0.1;
    let x, y;
    let context = this.refs.canvas.getContext('2d');

    // Set pressure values
    if (isPressureSensitiveDevice(ev)) {
      if (pressureDetected(ev)) {
        pressure = ev.touches[0]["force"]
      }
      x = ev.touches[0].pageX * 2
      y = ev.touches[0].pageY * 2
    } else {
      // manually assign pressure
      pressure = 1.0
      x = ev.pageX * 2
      y = ev.pageY * 2
    }

    context.lineWidth = lineWidth;
    context.strokeStyle = 'black';
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.beginPath();
    context.moveTo(x, y);

    this.setState({
      isMouseDown: true,
      points: [
        ...this.state.points,
        {x, y, lineWidth}
      ]
    })
  }

  handlePointerMove = ev => {
    ev.preventDefault();
    let pressure = 0.1;
    let x, y;
    let context = this.refs.canvas.getContext('2d');

    if (!this.state.isMouseDown) {
      return;
    }

    // Set pressure values
    if (isPressureSensitiveDevice(ev)) {
      if (pressureDetected(ev)) {
        pressure = ev.touches[0]["force"]
      }
        x = ev.touches[0].pageX * 2
        y = ev.touches[0].pageY * 2
      } else {
          // manually assign pressure
          pressure = 1.0
          x = ev.pageX * 2
          y = ev.pageY * 2
      }

    let newLineWidth = (Math.log(pressure + 1) * 40 * 0.4 + this.state.lineWidth * 0.6);
    this.setState({
      points: [
        ...this.state.points,
        {x, y, newLineWidth}
      ]
    });
    context.strokeStyle = 'black'
    context.lineCap = 'round'
    context.lineJoin = 'round';

    if (this.state.points.length >= 3) {
      var l = this.state.points.length - 1
      var xc = (this.state.points[l].x + this.state.points[l - 1].x) / 2
      var yc = (this.state.points[l].y + this.state.points[l - 1].y) / 2
      context.lineWidth = this.state.points[l - 1].lw
      context.quadraticCurveTo(this.state.points[l - 1].x, this.state.points[l - 1].y, xc, yc)
      context.stroke()
      context.beginPath()
      context.moveTo(xc, yc)
    }

  }

  handlePointerUp = ev => {
    ev.preventDefault();
    let pressure = 0.1;
    let x, y;
    let context = this.refs.canvas.getContext('2d');

    if (isPressureSensitiveDevice(ev)) {
      if (pressureDetected(ev)) {
        pressure = ev.touches[0]["force"]
      }
      x = ev.touches[0].pageX * 2
      y = ev.touches[0].pageY * 2
    } else {
      // manually assign pressure
      pressure = 1.0
      x = ev.pageX * 2
      y = ev.pageY * 2
    }

    context.strokeStyle = 'black'
    context.lineCap = 'round'
    context.lineJoin = 'round'
    if (this.state.points.length >= 3) {
      var l = this.state.points.length - 1
      context.quadraticCurveTo(this.state.points[l].x, this.state.points[l].y, x, y)
      context.stroke()
    }
    this.setState({
      isMouseDown: false,
      lineWidth: 0,
      points: [],
    });
  }

  render() {
    return (
      <div>
        <canvas
          ref='canvas'
          className={ styles.container }
          onPointerDown={ this.handlePointerDown }
          onPointerMove={ this.handlePointerMove }
          onPointerUp={ this.handlePointerUp }
        />
        <p></p>
        <code>
          { JSON.stringify(this.state, null, 2) }
        </code>
        <code>
          Number of points: {this.state.points.length}
        </code>
      </div>

    )
  }
}

export default SignHere;