var express = require('express');

var path = require('path');

var app = express();
var bodyParser = require('body-parser');
// var flipclock = require('angular-flipclock');
//this is for regular post requests
app.use(bodyParser.urlencoded());
//this is for post requests that want json back
app.use(bodyParser.json());

var hints = "HINTS...";
var hintsODS = "HINTS...";
var clockOnODS = false;
var timeODS = 3600;
var volumeODS = 1;
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

    io.emit('checkClockODS', {time: timeODS, clockon: clockOnODS, hints: hintsODS})

    socket.on("check_clock_time", function(data){
      io.emit("checkClock", {time: time, clockon: clockOn, hints: hints});
    })

  	socket.on('new_hint', function(data){
  		console.log("NEW HINT");

  		hints = data.hint;
  		io.emit('update_hints', hints);
  	})

  	socket.on('start_clock', function(data){
      console.log("SERVER CLOCK START")
      time = data.time;
  		clockOn = true;
  		io.emit('startClock');
  	})

  	socket.on('stop_clock', function(data){
      time = data.time;
  		clockOn = false;
  		io.emit('stopClock');
  	})

  	socket.on('reset_clock', function(data){
  		hints = "HINTS...";
      time = 3600;
  		io.emit('resetClock');

  	})

  	socket.on('change_volume', function(data){
      console.log("PW VOL CHANGE");
  		volume = data.volume/100;
      console.log(volume);
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
      console.log("PLAYING MSG1")
  		io.emit('playPWmsg1');
  	})

  	socket.on('play_pwmsg2', function(data){
  		io.emit('playPWmsg2')
  	})

    //Operation Dream State socket functions

    socket.on("check_clock_time_ods", function(data){
      io.emit("checkClockODS", {time: timeODS, clockon: clockOnODS, hints: hintsODS});
    })

    socket.on('new_hint_ods', function(data){
      console.log("NEW HINT");

      hintsODS = data.hint;
      io.emit('update_hints_ods', hints);
    })

    socket.on('start_clock_ods', function(data){
      clockOnODS = true;
      io.emit('startClock_ods');
    })

    socket.on('stop_clock_ods', function(data){
      timeODS = data.time;
      clockOnODS = false;
      io.emit('stopClock_ods');
    })

    socket.on('reset_clock_ods', function(data){
      timeODS = 3600;
      clockonODS = false
      hintsODS = "HINTS...";
      io.emit('resetClock_ods');

    })

    socket.on('change_volume_ods', function(data){
      volumeODS = data.volume/100;
      io.emit('volumeChange_ods', volumeODS);
    })

    socket.on('notif_sound_ods', function(data){
      io.emit('playNotif_ods');
    })

    socket.on('change_time_ods', function(data){
      io.emit('changeTime_ods', data.time);
    })

    socket.on('updateTime_ods', function(data){
      timeODS = data.time;
      // console.log(data.time);
    })

    socket.on('play_odsmsg1', function(data){
      io.emit('playODSmsg1');
    })

    socket.on('play_odsmsg2', function(data){
      io.emit('playODSmsg2')
    })
})