var mongoose = require('mongoose');

var userProfileSchema = new mongoose.Schema({
userId: {type:String, required: true},
connections: [{connectionID:Number, connectionName:String, category:String, rsvp:String }]
});

module.exports = mongoose.model('userprofile', userProfileSchema);
