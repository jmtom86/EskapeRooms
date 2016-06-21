var mongoose = require('mongoose');
var genericController = {};
var User = mongoose.model('User');

genericController.login = function(req,res){
  // console.log('sc:login', req.body);
	User.findOne({email: req.body.email}, function(err, results){
		// console.log("RESULTS---",results);
		if(results){
			if(results.password==req.body.password){
				res.json({status: 1, results: results});
			}else{
				// console.log("COMBO WRONG");
				res.json({status: 0, message: "Email/Password combination does not exist"});
			}
		}
		else{
			// console.log("COMBO WRONG 2");
			res.json({status: 0, message: "Email does not exist"});
		}
	})
}

module.exports = genericController;