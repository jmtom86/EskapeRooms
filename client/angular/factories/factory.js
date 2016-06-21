myApp.factory("mainFactory", function($http){

	var factory = {};
  	var currentUser;
	factory.login = function(data, callback){
		// console.log("DATA", data);
		$http.post('/login', data).success(function(output){
      console.log('nf', output);
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
    // console.log('grabbing current user', currentUser);
    callback(currentUser);
  }

	return factory;
});