// requiring the userProfile schema
var Connections = require('./../models/connections.model');
var UserProfile = require('./../models/userProfile.model');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/agroservices1', {useUnifiedTopology: true, useNewUrlParser: true});

var getUserProfile = function(userId){
   return UserProfile.findOne({userId:userId},{connections:1,_id:0})
}

var addRSVP = function(userId,connectionID,connectionName,category,rsvp){
 return  UserProfile.updateOne({ userId: userId,"connections.connectionID" : {$ne: connectionID}},
    { $push: { connections: {connectionID: connectionID,connectionName: connectionName,category: category,rsvp: rsvp }}});
};

var deleteRSVP = function(userId,connectionID){
  return UserProfile.updateOne({userId : userId},
      { $pull: {connections: {connectionID:connectionID}}});
};

var deleteConnFromProfiles = function(connectionID){
  return UserProfile.updateMany({},
      { $pull: {connections: {connectionID:connectionID}}});
};

var updateRSVP = function(userId, connectionID, rsvp){
return UserProfile.updateOne({userId : userId,"connections.connectionID": connectionID},
     {$set: {"connections.$.rsvp": rsvp}});
};

var addConnection = function(connectionID,connectionName,category,host,details,place,dateTime,userId){
  return Connections.findOneAndUpdate(
     {connectionName:connectionName,category:category},
     {connectionID:connectionID, connectionName:connectionName,category:category,host:host,details:details,place:place,dateTime:dateTime,userId:userId },
     {upsert: true, new: true, runValidators: true});
  };

  var updateConnection = function(connectionName,category,details,place,dateTime,userId){
    return Connections.updateOne(
       {connectionName:connectionName,category:category, userId:userId},
       {$set: {"details":details,"place":place,"dateTime":dateTime} });
    };

  var updateConnectionInAllProfiles = function(connectionID,connectionName,category){
    return UserProfile.updateMany({"connections.connectionID": connectionID},
         {$set: {"connections.$.connectionName": connectionName, "connections.$.category":category}});
  };

  // var addProfile = function(userId){
  //   return UserProfile.insertOne({userId:userId,connections:[]});
  // };

module.exports.getUserProfile = getUserProfile;
module.exports.addRSVP = addRSVP;
module.exports.updateRSVP = updateRSVP;
module.exports.addConnection = addConnection;
module.exports.deleteRSVP = deleteRSVP;
module.exports.updateConnection = updateConnection;
module.exports.deleteConnFromProfiles = deleteConnFromProfiles;
module.exports.updateConnectionInAllProfiles = updateConnectionInAllProfiles;
// module.exports.addProfile = addProfile;
