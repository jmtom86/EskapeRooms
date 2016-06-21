var express = require('express');

var path = require('path');

var app = express();
var bodyParser = require('body-parser');
//this is for regular post requests
app.use(bodyParser.urlencoded());
//this is for post requests that want json back
app.use(bodyParser.json());

var hints = "HINTS...";
var clockOn = false;
var time = 3600;
var volume = 1;

app.use(express.static(path.join(__dirname, './client')));
require('./config/mongoose.js');

// this line requires and runs the code from our routes.js file and passes it app so that we can attach our routing rules to our express application!
require('./config/routes.js')(app);
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
  		hints = "HINTS...";
  		io.emit('resetClock');

  	})

  	socket.on('change_volume', function(data){
  		volume = data.volume/100;
  		io.emit('volumeChange', volume);
  	})

  	socket.on('notif_sound', function(data){
  		io.emit('playNotif');
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

  	socket.on('play_pwmsg2', function(data){
  		io.emit('playPWmsg2')
  	})
})