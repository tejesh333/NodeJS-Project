// creating UserConnection class
class UserConnection{
  constructor(connection,rsvp){
    this._connection = connection;
    this._rsvp = rsvp;
  }

  get connection() {
      return this._connection;
  }
  set connection(value) {
      this._connection = value;
  }

  get rsvp() {
      return this._rsvp;
  }
  set rsvp(value) {
      this._rsvp = value;
  }

}

//exporting UserConnection class
module.exports = UserConnection;
