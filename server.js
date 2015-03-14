var http = require('http');
var express = require('express');
var io = require('socket.io');

var five = require('johnny-five');
var board = new five.Board();

var PORT = 3005;

var app = express();

app.use(express.static(__dirname + '/public'));

board.on('ready', function() {
  var servo = new five.Servo(9);
  var sensor = new five.Sensor('A0');

  board.repl.inject({
    servo: servo,
    sensor: sensor
  });

  var server = http.createServer(app).listen(PORT, function(req, res) {
    console.log('Listening on port ' + PORT);
  });

  io = io.listen(server);

  io.on('connection', function(socket) {
    console.log('Got connection!');

    socket.on('disconnect', function() {
      console.log('Disconnected');
    });

    sensor.scale([0, 20]).on('data', function() {
      var value = this.value;
      socket.emit('slide', value);
    });
  });

});
