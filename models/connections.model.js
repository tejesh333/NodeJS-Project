var mongoose = require('mongoose');

var connectionsSchema = new mongoose.Schema({
connectionID: {type:Number, required:true},
connectionName: {type:String, required:true},
category: {type:String, required:true},
host: {type:String, required:true},
details: {type:String, required:true},
place: {type:String, required:true},
dateTime: {type:String, required:true},
userId: {type:String, required:true}
});

module.exports = mongoose.model('connection', connectionsSchema);
