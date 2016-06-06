var express = require('express');

var path = require('path');

var app = express();

app.use(express.static(path.join(__dirname, './client')));
app.listen(process.env.PORT || 8000, function(){
	console.log('Website on: 8000');
})