var express = require('express');

var path = require('path');

var app = express();

var hints = "HINTS...";
var clockOn = false;
var time = 3600;

app.use(express.static(path.join(__dirname, './client')));
var server = app.listen(process.env.PORT || 8000, function(){
	console.log('Website on: 8000');
});

var io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket){
	console.log("WE ARE USING SOCKETS!");
  	console.log(socket.id);
  	io.emit('checkClock', {time: time, clockon: clockOn, hints: hints});
  	socket.on('new_hint', function(data){
  		console.log("NEW HINT");

  		hints = data.hint;
  		io.emit('update_hints', hints);
  	})

  	socket.on('start_clock', function(data){
  		clockOn = true;
  		io.emit('startClock');
  	})

  	socket.on('stop_clock', function(data){
  		clockOn = false;
  		io.emit('stopClock');
  	})

  	socket.on('reset_clock', function(data){
  		io.emit('resetClock');
  	})

  	socket.on('change_time', function(data){
  		io.emit('changeTime', data.time);
  	})

  	socket.on('updateTime', function(data){
  		time = data.time;
  		console.log(data.time);
  	})

  	socket.on('play_pwmsg1', function(data){
  		io.emit('playPWmsg1');
  	})
})