var UserConnection = require('./../models/UserConnection');

// creating UserProfile class
class UserProfile{
  constructor(user,userconnections){
  this._user = user;
  this._userconnections = userconnections;
  }

  get user() {
    return this._user;
  }
  set user(value) {
    this._user = value;
  }

  get userconnections() {
    return this._userconnections;
  }
  set userconnections(value) {
    this._userconnections = value;
  }


// Adds connection to user profile
  addConnection(connection,rsvp){
    var exists = 0;
    for(var i=0;i<this._userconnections.length;i++){
      if(this._userconnections[i]._connection._connectionID == connection._connectionID){
          exists=1;
          this._userconnections[i]._rsvp = rsvp;
          break;
      }
    }
    if(exists == 0){
          this._userconnections.push(new UserConnection(connection,rsvp));
    }
  }

// removes connection from user profile
  removeConnection(Connection){
    for(var j=0;j<this._userconnections.length;j++){
      if(this._userconnections[j]._connection._connectionID == Connection._connectionID){
        var index = this._userconnections.indexOf(this._userconnections[j]);
        this._userconnections.splice(index,1);
      }
    }
  }

// Updates connection in user profile
  updateConnection(UserConnection){
    this._userconnections.forEach(function(item){
        if(item._connection._connectionID == UserConnection._connection._connectionID){
            item._rsvp = UserConnection._rsvp;
        }
    });
  }

//Returns all connections in User Profile
  getConnections(){
    return this._userconnections;
  }

//Removes all connections from user profile
  emptyProfile(){
       this._userconnections.splice(0,this.userconnections.length);
  }
}

//exporting UserProfile class
module.exports = UserProfile;
