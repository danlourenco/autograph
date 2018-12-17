
class SignaturePad {
  constructor(canvas) {
    console.log("initializing Signaturepad");
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d");
    this.lineWidth = 0;
    this.isMouseDown = false;
    this.points = [];
    this.setupEventListeners();
  }

  clear() {
    const ctx = this.ctx;
    const canvas = this.canvas;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  setupEventListeners = () => {
    const { canvas, pointerDownHandler, pointerMoveHandler, pointerUpHandler } = this;
    console.log("setup event listeners");
    ['touchstart', 'mousedown'].forEach(event => {
        canvas.addEventListener(event, pointerDownHandler)
    });

    ['touchmove', 'mousemove'].forEach(event => {
      canvas.addEventListener(event, pointerMoveHandler)
    });

    ['touchend', 'touchleave', 'mouseup'].forEach(event => {
      canvas.addEventListener(event, pointerUpHandler);
    })
  };

  pointerDownHandler = (ev) => {
    ev.preventDefault();
    var pressure = 0.1
      var x, y
      if (ev.touches && ev.touches[0] && typeof e.touches[0]["force"] !== "undefined") {
        if (ev.touches[0]["force"] > 0) {
          pressure = e.touches[0]["force"]
        }
        x = ev.touches[0].pageX * 2
        y = ev.touches[0].pageY * 2
      } else {
        pressure = 1.0
        x = ev.pageX * 2
        y = ev.pageY * 2
      }

    const {  ctx: context, points, lineWidth } = this;
      this.isMouseDown = true
      // lineWidth = (pressure * 50 * 0.8 + lineWidth * 0.2)
      context.lineWidth = lineWidth// pressure * 50;
      context.strokeStyle = 'black'
      context.lineCap = 'round'
      context.lineJoin = 'round'
      context.beginPath()
      context.moveTo(x, y)
      points.push({
        x, y, lineWidth
      })
  }

  pointerMoveHandler = e => {
    const { isMouseDown, ctx: context } = this;
    if (!isMouseDown) return
      var pressure = 0.1
      var x, y
      if (e.touches && e.touches[0] && typeof e.touches[0]["force"] !== "undefined") {
        if (e.touches[0]["force"] > 0) {
          pressure = e.touches[0]["force"]
        }
        x = e.touches[0].pageX * 2
        y = e.touches[0].pageY * 2
      } else {
        pressure = 1.0
        x = e.pageX * 2
        y = e.pageY * 2
      }
      var lw = (Math.log(pressure + 1) * 40 * 0.4 + this.lineWidth * 0.6)
      this.points.push({
        x, y, lw
      })
      context.strokeStyle = 'black'
      context.lineCap = 'round'
      context.lineJoin = 'round'
      // context.lineWidth   = lineWidth// pressure * 50;
      // context.lineTo(x, y);
      // context.moveTo(x, y);
      if (this.points.length >= 3) {
        var l = this.points.length - 1
        var xc = (this.points[l].x + this.points[l - 1].x) / 2
        var yc = (this.points[l].y + this.points[l - 1].y) / 2
        context.lineWidth = this.points[l - 1].lw
        context.quadraticCurveTo(this.points[l - 1].x, this.points[l - 1].y, xc, yc)
        context.stroke()
        context.beginPath()
        context.moveTo(xc, yc)
      }
  }

  pointerUpHandler = e => {
        const { ctx: context } = this;

    var pressure = 0.1
      var x, y
      if (e.touches && e.touches[0] && typeof e.touches[0]["force"] !== "undefined") {
        if (e.touches[0]["force"] > 0) {
          pressure = e.touches[0]["force"]
        }
        x = e.touches[0].pageX * 2
        y = e.touches[0].pageY * 2
      } else {
        pressure = 1.0
        x = e.pageX * 2
        y = e.pageY * 2
      }
      this.isMouseDown = false
      context.strokeStyle = 'black'
      context.lineCap = 'round'
      context.lineJoin = 'round'
      if (this.points.length >= 3) {
        var l = this.points.length - 1
        context.quadraticCurveTo(this.points[l].x, this.points[l].y, x, y)
        context.stroke()
      }
      this.points = []
      lineWidth = 0
  }
}

let canvasEl = document.querySelector("canvas");
const signaturePad = new SignaturePad(canvasEl);

/**
 * The main idea and some parts of the code (e.g. drawing variable width Bézier curve) are taken from:
 * http://corner.squareup.com/2012/07/smoother-signatures.html
 *
 * Implementation of interpolation using cubic Bézier curves is taken from:
 * http://www.benknowscode.com/2012/09/path-interpolation-using-cubic-bezier_9742.html
 *
 * Algorithm for approximated length of a Bézier curve is taken from:
 * http://www.lemoda.net/maths/bezier-length/index.html
 */
// const canvas = document.querySelector('canvas');
// const ctx = canvas.getContext('2d');

// ctx.fillStyle = 'red';
// ctx.fillRect(0, 0, 25, 25);
// let start = { x: 50,    y: 20  };
// let cp1 =   { x: 230,   y: 30  };
// let cp2 =   { x: 150,   y: 80  };
// let end =   { x: 250,   y: 100 };

// ctx.beginPath();
// ctx.moveTo(start.x, start.y);
// ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y);
// ctx.stroke();
