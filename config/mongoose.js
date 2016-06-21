var mongoose = require('mongoose');
var fs = require('fs');
//connect to the database
//remember to change the database name
// mongoose.connect('mongodb://localhost/health');
// mongoose.connect('mongodb://ds055842.mongolab.com:55842/healthamp');
mongoose.connect('mongodb://jordan:password123@ds019491.mlab.com:19491/eskaperoomspw');

//loads all of the model files
var models_path = __dirname + '/../server/models';
//for each file in the path
fs.readdirSync(models_path).forEach(function(file){
	//check if it is a js file, if so load it
	if(file.indexOf('.js')> 0 && file.indexOf('.js~')<=0){
		//load each model file
		require(models_path + '/'+ file);
	}
});