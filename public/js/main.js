/**
 * Converts numeric degrees to radians
 */
if (typeof(Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function() { return this * Math.PI / 180; };
}

var socket = io();
var canvas = oCanvas.create({ canvas: 'canvas', background: '#222' });

var RADIUS = 30;
var RADIUS_BASE = RADIUS;
var DIRECTION = 1;
var ROTATION_SPEED = 15;
var EXPAND_LIMIT = 20;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var center = canvas.display.ellipse({
  x: canvas.width / 2, y: canvas.height / 2,
  radius: canvas.width / RADIUS,
  stroke: '1px #333'
}).add();

var pathProto = canvas.display.ellipse({ stroke: '1px #999' });

var circles = [];

function makeCircle(proto, opts) {
  var c = proto.clone({
    parent: opts.parent,
    radius: canvas.width / RADIUS,

    x: (canvas.width / RADIUS) * Math.cos((opts.angle).toRad()),
    y: (canvas.width / RADIUS) * Math.sin((opts.angle).toRad()),

    origin: {
      x: opts.xorigin,
      y: opts.yorigin
    }
  });

  circles.push(c);
  return c;
}

var right = makeCircle(pathProto, {
  parent: center,
  xorigin: 'left',
  yorigin: 'center',
  angle: 1
});
makeCircle(pathProto, {
  parent: center,
  xorigin: 'left',
  yorigin: 'center',
  angle: 45
});

var down = makeCircle(pathProto, {
  parent: center,
  xorigin: 'center',
  yorigin: 'top',
  angle: 90
});
makeCircle(pathProto, {
  parent: center,
  xorigin: 'center',
  yorigin: 'top',
  angle: 135
});

var left = makeCircle(pathProto, {
  parent: center,
  xorigin: 'right',
  yorigin: 'center',
  angle: 180
});
makeCircle(pathProto, {
  parent: center,
  xorigin: 'right',
  yorigin: 'center',
  angle: -135
});

var up = makeCircle(pathProto, {
  parent: center,
  xorigin: 'center',
  yorigin: 'bottom',
  angle: -90
});
makeCircle(pathProto, {
  parent: center,
  xorigin: 'center',
  yorigin: 'bottom',
  angle: -45
});

circles.forEach(function(circle) {
  canvas.addChild(circle);
});

circles.push(center);

canvas.setLoop(function() {
  if (RADIUS >= RADIUS_BASE || RADIUS <= EXPAND_LIMIT) DIRECTION = -DIRECTION;
  RADIUS += 1 * DIRECTION;

  circles.forEach(function(circle) {
    circle.radius = canvas.width / RADIUS;

    if (circle.x === 0 && circle.y > 0) circle.y = canvas.width / RADIUS;
    if (circle.x === 0 && circle.y < 0) circle.y = -(canvas.width / RADIUS);

    if (circle.y === 0 && circle.x > 0) circle.x = canvas.width / RADIUS;
    if (circle.y === 0 && circle.x < 0) circle.x = -(canvas.width / RADIUS);

    circle.rotation += ROTATION_SPEED;
  });

}).start();

socket.on('slide', function(val) {
  ROTATION_SPEED = val * 2;
});
