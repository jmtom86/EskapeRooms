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

myApp.controller("timerController", function($scope, $location, mainFactory){
	$scope.currentUser;
	mainFactory.getCurrentUserInfo(function(data){
		$scope.currentUser = data;
	})

})