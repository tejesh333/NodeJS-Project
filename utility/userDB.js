// requiring the Users schema
var Users = require('./../models/users.model');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/agroservices1', {useUnifiedTopology: true, useNewUrlParser: true});

var getAllUsers = function(){
  return Users.find({});
}

var getUser = function(userId,password){
  return Users.findOne({userId:userId, password:password});
}

var getUserSalt = function(userId){
  return Users.findOne({userId:userId},{_id:0, salt:1});
}

var checkUser = function(emailAddress){
  return Users.findOne({emailAddress:emailAddress});
}

var addUser = function(firstName,lastName,emailAddress,address_1,address_2,city,state,country,zipCode,userId,password,salt){
  return Users.findOneAndUpdate(
     {emailAddress:emailAddress},
     {userId:userId,firstName:firstName, lastName:lastName, emailAddress:emailAddress, address_1:address_1, address_2:address_2, city:city, state:state, country:country, zipCode:zipCode, password:password,salt:salt},
     {upsert: true, new: true, runValidators: true});
  };

module.exports.getAllUsers = getAllUsers;
module.exports.getUser = getUser;
module.exports.checkUser = checkUser;
module.exports.addUser = addUser;
module.exports.getUserSalt = getUserSalt;
