// requiring the connectons schema
var Connections = require('./../models/connections.model');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/agroservices1', {useUnifiedTopology: true, useNewUrlParser: true});

var getConnections=function(){
  return Connections.find({});
}

var getUserCreatedConnections=function(userId){
  return Connections.find({userId:userId});
}

var getConnection = function(connectionID){
  return Connections.findOne({connectionID:connectionID});
}

var getAllCategories = function(){
  return Connections.find({},{category:1,_id:0});
}

var getLastConnectionID = function(){
  return Connections.find({},{connectionID:1,_id:0}).sort({connectionID: -1}).limit(1);
}

var deleteConnection = function(connectionId){
  return Connections.deleteOne({connectionID:connectionId});
}

var updateConnection = function(connectionId,connectionName,category,details,place,dateTime){
  return Connections.updateOne({connectionID:connectionId},
    {$set:{connectionName:connectionName,category:category,details:details,place:place,dateTime:dateTime}});
}

module.exports.getConnections = getConnections;
module.exports.getConnection = getConnection;
module.exports.deleteConnection = deleteConnection;
module.exports.getAllCategories = getAllCategories;
module.exports.getLastConnectionID = getLastConnectionID;
module.exports.getUserCreatedConnections = getUserCreatedConnections;
module.exports.updateConnection = updateConnection;
