import React, { Component } from 'react';
import styles from './autograph.module.scss';
import {
  getCoords,
  isPressureSensitiveDevice,
  pressureDetected
} from '../utils';
import Debug from '../Debug';


const importSVG = (sourceSVG, targetCanvas) => {
  // https://developer.mozilla.org/en/XMLSerializer
  console.log(sourceSVG);
  // var svg_xml = (new XMLSerializer()).serializeToString(sourceSVG);
  var ctx = targetCanvas.getContext('2d');

  // this is just a JavaScript (HTML) image
  var img = new Image();
  // http://en.wikipedia.org/wiki/SVG#Native_support
  // https://developer.mozilla.org/en/DOM/window.btoa
  img.src = sourceSVG;

  img.onload = function() {
      // after this, Canvas’ origin-clean is DIRTY
      ctx.drawImage(img, targetCanvas.width / 2 - img.width / 2, targetCanvas.height / 2 - img.height / 2);
  }
}

class Autograph extends Component {

  state = {
    isMouseDown: false,
    lineWidth: 0.1,
    points: [],
  };

  componentDidMount() {
    let canvas = this.refs.canvas;
    let context = this.refs.canvas.getContext('2d');
    canvas.width = this.props.width;
    canvas.height = this.props.height;

    context.strokeStyle = 'black';
    context.lineCap = 'round';
    context.lineJoin = 'round';

    importSVG(this.props.backgroundImg, canvas);

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

    let newLineWidth = Math.min((Math.log(pressure + 1) * 10 * 0.4 + lineWidth * 0.6), 4);
    console.log(newLineWidth);
    this.setState({
      points: [
        ...this.state.points,
        {x, y, lineWidth: newLineWidth}
      ],
      pressure,
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
          onMouseMove={ this.handlePointerMove }
          onMouseUp={ this.handlePointerUp }
        />
        <Debug lineWidth={ this.state.lineWidth} pressure={ this.state.pressure } />
      </div>
    )
  }
}

export default Autograph;