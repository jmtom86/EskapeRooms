myApp.factory("mainFactory", function($http){

	var factory = {};

  var currentUser;
	factory.login = function(data, callback){
		// console.log("DATA", data);
		$http.post('/login', data).success(function(output){
      // console.log('nf', output);
      if(output.status==1) {
        currentUser = output.results;

        callback(output);
         console.log("CURRENT USER", currentUser);
      } else {
        callback(output);
      }
		});
	};

	factory.getCurrentUserInfo = function(callback){
    callback(currentUser);
  }

	return factory;
});

myApp.factory("socket", function($rootScope) {
  var socket = io.connect();
  return {
    on : function (eventName, callback){
      socket.on(eventName, function(){
        var args = arguments;
        $rootScope.$apply(function(){
          callback.apply(socket, args);
        });
      });
    },
    emit : function(eventName, data, callback){
      // console.log("IN FACTORY EMIT")
      socket.emit(eventName, data, function(){
        console.log("NEXT STEP");
        var args = arguments;
        $rootScope.$apply(function(){
          if(callback) {
            callback.apply(socket, args);
          }
        });
      });
    }
  };
});