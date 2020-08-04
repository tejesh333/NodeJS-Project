var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
userId: {type:String, required:true},
firstName: {type:String, required:true},
lastName: {type:String, required:true},
emailAddress: {type:String},
address_1: {type:String, required:true},
address_2: {type:String},
city: {type:String, required:true},
state: {type:String, required:true},
country: {type:String, required:true},
zipCode: {type:String, required:true},
password: {type:String, required:true},
salt: {type:String, required:true}
});

module.exports = mongoose.model('user', userSchema);
