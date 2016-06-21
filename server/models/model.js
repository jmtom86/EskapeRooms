var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  admin: Boolean
}, {versionKey: false});

mongoose.model('User', UserSchema);


