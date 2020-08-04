
// creating connection object
class connection{
  constructor(connectionID, connectionName, category,host, details, place, dateTime){
    this._connectionID = connectionID;
    this._connectionName = connectionName;
    this._category = category;
    this._host = host;
    this._details = details;
    this._place = place;
    this._dateTime = dateTime;
  }

  get connectionID() {
    return this._connectionID;
  }
  set connectionID(value) {
    this._connectionID = value;
  }

  get connectionName() {
    return this._connectionName;
  }
  set connectionName(value) {
    this._connectionName = value;
  }

  get category() {
    return this._category;
  }
  set category(value) {
    this._category = value;
  }

  get host() {
    return this._host;
  }
  set host(value) {
    this._host = value;
  }

  get details() {
    return this._details;
  }
  set details(value) {
    this._details = value;
  }

  get place() {
    return this._place;
  }
  set place(value) {
    this._place = value;
  }

  get dateTime() {
    return this._dateTime;
  }
  set dateTime(value) {
    this._dateTime = value;
  }
}

module.exports = connection;
