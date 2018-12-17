import React, { Component } from 'react';
import styles from './autograph.module.scss';
import {
  getCoords,
  isPressureSensitiveDevice,
  pressureDetected
} from '../utils';


class Autograph extends Component {

  state = {
    isMouseDown: false,
    lineWidth: 0.1,
    points: [],
  };

  componentDidMount() {
    let canvas = this.refs.canvas;
    let context = this.refs.canvas.getContext('2d');
    canvas.width = 300;
    canvas.height = 400;
    context.strokeStyle = 'black';
    context.lineCap = 'round';
    context.lineJoin = 'round';
    canvas.addEventListener('touchstart',this.handlePointerDown, { passive: false });
    canvas.addEventListener('touchmove',this.handlePointerMove, { passive: false });
    canvas.addEventListener('touchend', this.handlePointerUp, { passive: false });
  }

  handlePointerDown = (ev) => {
    if (ev.target == this.refs.canvas) {
      ev.preventDefault();
    }
    let context = this.refs.canvas.getContext('2d');
    let canvas = this.refs.canvas;
    const { lineWidth } = this.state;
    const { x, y } = getCoords(ev, canvas);

    context.lineWidth = lineWidth;
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
    if (ev.target == this.refs.canvas) {
      ev.preventDefault();
    }
    let pressure = 0.1;
    let context = this.refs.canvas.getContext('2d');
    let canvas = this.refs.canvas;
    const { x, y } = getCoords(ev, canvas);
    const { isMouseDown, lineWidth } = this.state;
    if (!isMouseDown) {
      return;
    }

    // Set pressure values
    if (isPressureSensitiveDevice(ev)) {
      if (pressureDetected(ev)) {
          pressure = ev.touches[0]["force"]
      }
    }

    let newLineWidth = (Math.log(pressure + 1) * 30 * 0.4 + lineWidth * 0.6);
    console.log(newLineWidth);
    this.setState({
      points: [
        ...this.state.points,
        {x, y, lineWidth: newLineWidth}
      ],
      lineWidth: newLineWidth
    }, () => {
      if (this.state.points.length >= 3) {
        var l = this.state.points.length - 1
        var xc = (this.state.points[l].x + this.state.points[l - 1].x) / 2
        var yc = (this.state.points[l].y + this.state.points[l - 1].y) / 2
        context.lineWidth = this.state.points[l - 1].lineWidth
        context.quadraticCurveTo(this.state.points[l - 1].x, this.state.points[l - 1].y, xc, yc)
        context.stroke()
        context.beginPath()
        context.moveTo(xc, yc)
    }});
}

  handlePointerUp = ev => {
    if (ev.target == this.refs.canvas) {
      ev.preventDefault();
    }
    let context = this.refs.canvas.getContext('2d');
    let canvas = this.refs.canvas;

    if (isPressureSensitiveDevice(ev)) {
      if (pressureDetected(ev)) {
        this.setState({
          pressure: ev.touches[0]["force"]
        })
      }
    }

    const { x, y } = getCoords(ev, canvas);

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
          onMouseDown={ this.handlePointerDown }
          // onTouchStart={ this.handlePointerDown }
          onMouseMove={ this.handlePointerMove }
          // onTouchMove={ this.handlePointerMove }
          onMouseUp={ this.handlePointerUp }
          // onTouchEnd={ this.handlePointerUp }
        />
      </div>

    )
  }
}

export default Autograph;