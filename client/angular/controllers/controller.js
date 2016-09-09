myApp.controller("loginController",function($scope, $location, mainFactory){
	$scope.login = function(){
		mainFactory.login($scope.user, function(data){
			if(data.status===1){
				// console.log("data: ", data.results.admin);
				if(data.results.admin == true)
					$location.path('/timera');
				else
					$location.path('/timeraods');
		
			} else {
				$scope.errors = [data.message];
			}
		})
	}
});

myApp.controller("pwatimerController", function($scope, $location, socket){
	console.log("PWA CONTROLLER")
	$scope.volume = 100;
	$scope.min = 60;
	$scope.socket = socket;
	$scope.clock;
	$scope.hints = "HINTS...";
	socket.emit("check_clock_time");
	var msg2 = document.getElementById("apwmsg2")
	msg2.onended = function(){
		console.log("ENDED");
		document.getElementById("apwba").play();
	}
	socket.on("checkClock", function(data) {
		console.log(data);
		// var clock = document.getElementById("apwclock");
		$scope.clock.setTime(data.time);
		if(data.clockon == true){
			var pwba = document.getElementById("apwba");
			pwba.currentTime = 3600-data.time;
			pwba.play();
			$scope.clock.start();
		}
		$scope.hints = data.hints;
		// clock.start();
		// document.getElementById("apwclock").FlipClock({countdown:true, autoStart:false, clockFace: 'MinuteCounter'});
		// document.getElementById("apwclock").setTime(data.time);
	})

	$scope.grabClock = function(clock){
		$scope.clock = clock;
		// console.log(clock);
		// $scope.clock.start();
	}
	$scope.test = function() {
		console.log("TESTING");
	}

	$scope.startClock = function() {
		console.log("CLICKING START");
		socket.emit("start_clock", {time: document.getElementById("cd_seconds").value*60});
	}

	$scope.stopClock = function() {

		socket.emit("stop_clock",{time: $scope.clock.getTime().time});
	}

	$scope.resetClock = function() {
		socket.emit('reset_clock');
	}

	$scope.changeVol = function() {
		console.log("VOLUME CHANGING")
		var vol = 100;
        if(document.getElementById("cd_volume").value < 100){
            vol = document.getElementById("cd_volume").value;
        }
        socket.emit('change_volume', {volume: vol});
	}

	$scope.changeMin = function(){
		socket.emit('change_time', {time: document.getElementById("cd_seconds").value});
	}

	$scope.updateHints = function(){
		console.log("KEY UP");
		socket.emit('new_hint', {hint: $scope.hints});
	}

	socket.on("startClock", function(data){
		var pwba = document.getElementById("apwba");
		var alarm = document.getElementById("apwalarm");
		var pwmsg2 = document.getElementById("apwmsg2");
		console.log(document.getElementById("cd_seconds"));
		if(document.getElementById("cd_seconds").value != 60){
			pwba.currentTime = 3600 - document.getElementById("cd_seconds").value*60;
		}
		if(pwmsg2.paused == true && pwmsg2.currentTime != 0){
			pwmsg2.play();
		}
		else {
			pwba.play();
		}
		$scope.clock.start(function(){
			socket.emit('updateTime', {time: $scope.clock.getTime().time})
			if($scope.clock.getTime().time == 0){
				pwba.pause();
				alarm.play();
			}
		})
	})

	socket.on("stopClock", function(data){
		$scope.clock.stop();
		if(document.getElementById("apwmsg2").paused == false){
			document.getElementById("apwmsg2").pause();
		}
		if(document.getElementById("apwba").paused == false){
			document.getElementById("apwba").pause();
		}
		
	})

	socket.on("resetClock", function(data){
		console.log("RESETTING")
		var pwba = document.getElementById("apwba");
		var msg1 = document.getElementById("apwmsg1");
		var msg2 = document.getElementById("apwmsg2");
		msg1.currentTime = 0;
		msg2.currentTime = 0;
		pwba.pause();
		pwba.currentTime = 0;
		$scope.clock.stop();
		$scope.clock.setTime(3600);
		document.getElementById("cd_seconds").value = 60;
		document.getElementById("hints").value = "HINTS...";
	})

	socket.on("changeTime", function(data){
		document.getElementById("cd_seconds").value = data;
		$scope.clock.setTime(document.getElementById("cd_seconds").value * 60);
	})

	socket.on('update_hints', function(data){
		console.log("-- NEW HINTS -- ");
		console.log(data);
		document.getElementById("hints").value = data;
	})

	socket.on('playPWmsg1', function(data){
		console.log("controller play msg1");
		document.getElementById("apwmsg1").play();
	})

	socket.on('playPWmsg2', function(data){
		// console.log("controller play msg1");
		document.getElementById("apwba").pause();
		document.getElementById("apwmsg2").play();
	})

	socket.on('playNotif', function(data){
		document.getElementById("apwnotif").play();
	})

	socket.on('volumeChange', function(data){
				console.log("VOLUME", data);
				$scope.volume = Math.floor(data * 100);
                document.getElementById("apwba").volume = data;
                console.log(document.getElementById("apwba").volume);
                // document.getElementById("cd_volume").value= data * 100;
                // console.log(pwba.volume);
            })
});

myApp.controller("pwtimerController", function($scope, $location, socket){
	console.log("PW CONTROLLER")
	$scope.volume = 100
	$scope.min = 60;
	$scope.socket = socket;
	$scope.clock;
	$scope.hints = "HINTS...";
	socket.emit("check_clock_time");
	socket.on("checkClock", function(data) {
		console.log(data);
		// var clock = document.getElementById("apwclock");
		$scope.clock.setTime(data.time);
		if(data.clockon == true){
			$scope.clock.start();
			
		}
		$scope.hints = data.hints;
		// clock.start();
		// document.getElementById("apwclock").FlipClock({countdown:true, autoStart:false, clockFace: 'MinuteCounter'});
		// document.getElementById("apwclock").setTime(data.time);
	})

	$scope.grabClock = function(clock){
		$scope.clock = clock;
		// console.log(clock);
		// $scope.clock.start();
	}
	$scope.test = function() {
		console.log("TESTING");
	}

	$scope.startClock = function() {
		console.log("CLICKING START");
		socket.emit("start_clock", {time: document.getElementById("cd_seconds").value*60});
	}

	$scope.stopClock = function() {	
		socket.emit("stop_clock",{time: $scope.clock.getTime().time});
	}

	$scope.resetClock = function() {
		socket.emit('reset_clock');
	}

	$scope.changeVol = function() {
		console.log("VOLUME CHANGING");
		var vol = 100;
        if(document.getElementById("cd_volume").value < 100){
            vol = document.getElementById("cd_volume").value;
        }
        socket.emit('change_volume', {volume: vol});
	}

	$scope.changeMin = function(){
		socket.emit('change_time', {time: document.getElementById("cd_seconds").value});
	}


	$scope.updateHints = function(){
		console.log("KEY UP");
		socket.emit('new_hint', {hint: $scope.hints});
	}

	socket.on("startClock", function(data){
		$scope.clock.start(function(){
			socket.emit('updateTime', {time: $scope.clock.getTime().time})
		})
	})

	socket.on("stopClock", function(data){
		$scope.clock.stop();	
	})

	socket.on("resetClock", function(data){
		$scope.clock.stop();
		$scope.clock.setTime(3600);
		document.getElementById("cd_seconds").value = 60;
		document.getElementById("hints").value = "HINTS...";
	})

	socket.on("changeTime", function(data){
		document.getElementById("cd_seconds").value = data;
		$scope.clock.setTime(document.getElementById("cd_seconds").value * 60);
	})

	socket.on('update_hints', function(data){
		document.getElementById("hints").value = data;
	})

	socket.on('volumeChange', function(data){
		console.log(data);
                document.getElementById("cd_volume").value= Math.floor(data * 100);
                // console.log(pwba.volume);
            })
});


myApp.controller("odsatimerController", function($scope, $location, socket){
	console.log("ODS CONTROLLER");
	$scope.volume = 100
	$scope.min = 60;
	$scope.socket = socket;
	$scope.clock;
	$scope.hints = "HINTS...";
	socket.emit("check_clock_time_ods");
	document.getElementById("aodsba").volume = .5;
	var msg2 = document.getElementById("aodsmsg2");
	msg2.onended = function(){
		console.log("ENDED");
		document.getElementById("aodsba").play();
	}
	socket.on("checkClockODS", function(data) {
		console.log(document.getElementById("aodsba").volume);
		// var clock = document.getElementById("apwclock");
		$scope.clock.setTime(data.time);
		if(data.clockon == true){
			var odsba = document.getElementById("aodsba");
			// odsba.volume = .5;
			odsba.currentTime = 3600-data.time;
			odsba.play();
			
			$scope.clock.start();
			
		}
		// console.log(document.getElementById("aodsba").volume);
		$scope.hints = data.hints;
		// clock.start();
		// document.getElementById("apwclock").FlipClock({countdown:true, autoStart:false, clockFace: 'MinuteCounter'});
		// document.getElementById("apwclock").setTime(data.time);
	})

	$scope.grabClock = function(clock){
		$scope.clock = clock;
		// console.log(clock);
		// $scope.clock.start();
	}
	$scope.test = function() {
		console.log("TESTING");
	}

	$scope.startClock = function() {
		console.log("CLICKING START");
		socket.emit("start_clock_ods", {time: document.getElementById("cd_seconds").value*60});
	}

	$scope.stopClock = function() {

		socket.emit("stop_clock_ods",{time: $scope.clock.getTime().time});
	}

	$scope.resetClock = function() {
		socket.emit('reset_clock_ods');
	}

	$scope.changeVol = function() {
		console.log("VOLUME CHANGING")
		var vol = 100;
        if(document.getElementById("cd_volume").value < 100){
            vol = document.getElementById("cd_volume").value;
        }
        socket.emit('change_volume_ods', {volume: vol});
	}

	$scope.changeMin = function(){
		socket.emit('change_time_ods', {time: document.getElementById("cd_seconds").value});
	}

	$scope.updateHints = function(){
		console.log("KEY UP");
		socket.emit('new_hint_ods', {hint: $scope.hints});
	}

	socket.on("startClock_ods", function(data){
		var odsba = document.getElementById("aodsba");
		var alarm = document.getElementById("aodsalarm");
		var odsmsg2 = document.getElementById("aodsmsg2");
		console.log(document.getElementById("cd_seconds"));
		if(document.getElementById("cd_seconds").value != 60){
			odsba.currentTime = 3600 - document.getElementById("cd_seconds").value*60;
		}
		if(odsmsg2.paused == true && odsmsg2.currentTime != 0){
			odsmsg2.play();
		}
		else {
			odsba.play();
		}
		$scope.clock.start(function(){
			socket.emit('updateTime_ods', {time: $scope.clock.getTime().time})
			if($scope.clock.getTime().time == 0){
				odsba.pause();
				alarm.play();
			}
		})
	})

	socket.on("stopClock_ods", function(data){
		$scope.clock.stop();
		if(document.getElementById("aodsmsg2").paused == false){
			document.getElementById("aodsmsg2").pause();
		}
		if(document.getElementById("aodsba").paused == false){
			document.getElementById("aodsba").pause();
		}
		
	})

	socket.on("resetClock_ods", function(data){
		console.log("RESETTING")
		var odsba = document.getElementById("aodsba");
		var msg1 = document.getElementById("aodsmsg1");
		var msg2 = document.getElementById("aodsmsg2");
		msg1.currentTime = 0;
		msg2.currentTime = 0;
		odsba.pause();
		odsba.currentTime = 0;
		$scope.clock.stop();
		$scope.clock.setTime(3600);
		document.getElementById("cd_seconds").value = 60;
		document.getElementById("hints").value = "HINTS...";
	})

	socket.on("changeTime_ods", function(data){
		document.getElementById("cd_seconds").value = data;
		$scope.clock.setTime(document.getElementById("cd_seconds").value * 60);
	})

	socket.on('playODSmsg1', function(data){
		console.log("controller play msg1");
		document.getElementById("aodsmsg1").play();
	})

	socket.on('playODSmsg2', function(data){
		// console.log("controller play msg1");
		document.getElementById("aodsba").pause();
		document.getElementById("aodsmsg2").play();
	})

	socket.on('playNotif_ods', function(data){
		document.getElementById("aodsnotif").play();
	})

	socket.on('volumeChange_ods', function(data){
				
				$scope.volume = Math.floor(data * 100);
                document.getElementById("aodsba").volume = data/2;
                console.log("VOLUME", document.getElementById("aodsba").volume);
                // document.getElementById("cd_volume").value= data * 100;
                // console.log(pwba.volume);
            })
});

myApp.controller("odstimerController", function($scope, $location, socket){
	console.log("ODS CONTROLLER")
	$scope.volume = 100
	$scope.min = 60;
	$scope.socket = socket;
	$scope.clock;
	$scope.hints = "HINTS..."
	socket.emit("check_clock_time_ods");
	socket.on("checkClockODS", function(data) {
		console.log(data);
		// var clock = document.getElementById("apwclock");
		$scope.clock.setTime(data.time);
		if(data.clockon == true){
			$scope.clock.start();
		}
		$scope.hints = data.hints
		// clock.start();
		// document.getElementById("apwclock").FlipClock({countdown:true, autoStart:false, clockFace: 'MinuteCounter'});
		// document.getElementById("apwclock").setTime(data.time);
	})

	$scope.grabClock = function(clock){
		$scope.clock = clock;
		// console.log(clock);
		// $scope.clock.start();
	}
	$scope.test = function() {
		console.log("TESTING");
	}

	$scope.startClock = function() {
		console.log("CLICKING START");
		socket.emit("start_clock_ods", {time: document.getElementById("cd_seconds").value*60});
	}

	$scope.stopClock = function() {	
		socket.emit("stop_clock_ods",{time: $scope.clock.getTime().time});
	}

	$scope.resetClock = function() {
		socket.emit('reset_clock_ods');
	}

	$scope.changeVol = function() {
		console.log("VOLUME CHANGING");
		var vol = 100;
        if(document.getElementById("cd_volume").value < 100){
            vol = document.getElementById("cd_volume").value;
        }
        socket.emit('change_volume_ods', {volume: vol});
	}

	$scope.changeMin = function(){
		socket.emit('change_time_ods', {time: document.getElementById("cd_seconds").value});
	}

	socket.on("startClock", function(data){
		$scope.clock.start(function(){
			socket.emit('updateTime_ods', {time: $scope.clock.getTime().time})
		})
	})

	socket.on("stopClock_ods", function(data){
		$scope.clock.stop();	
	})

	socket.on("resetClock_ods", function(data){
		$scope.clock.stop();
		$scope.clock.setTime(3600);
		document.getElementById("cd_seconds").value = 60;
		document.getElementById("hints").value = "HINTS...";
	})

	socket.on("changeTime_ods", function(data){
		document.getElementById("cd_seconds").value = data;
		$scope.clock.setTime(document.getElementById("cd_seconds").value * 60);
	})

	socket.on('volumeChange_ods', function(data){
		console.log(data);
                document.getElementById("cd_volume").value= Math.floor(data * 100);
                // console.log(pwba.volume);
            })
});
