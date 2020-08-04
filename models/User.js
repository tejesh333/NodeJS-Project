// creating User class
class User{
  constructor(userId,firstName,lastName,emailAddress,address_1,address_2,city,state,zipCode,country){
    this._userId = userId;
    this._firstName = firstName;
    this._lastName = lastName;
    this._emailAddress = emailAddress;
    this._address_1 = address_1;
    this._address_2 = address_2;
    this._city = city;
    this._state = state;
    this._country = country;
    this._zipCode = zipCode;
  }

  get userId() {
      return this._userId;
  }
  set userId(value) {
      this._userId = value;
  }

  get firstName() {
      return this._firstName;
  }
  set firstName(value) {
      this._firstName = value;
  }

  get lastName() {
      return this._lastName;
  }
  set lastName(value) {
      this._lastName = value;
  }

  get emailAddress() {
      return this._emailAddress;
  }
  set emailAddress(value) {
      this._emailAddress = value;
  }

  get address_1() {
      return this._address_1;
  }
  set address_1(value) {
      this._address_1 = value;
  }

  get address_2() {
      return this._address_2;
  }
  set address_2(value) {
      this._address_2 = value;
  }

  get city() {
      return this._city;
  }
  set city(value) {
      this._city = value;
  }

  get state() {
      return this._state;
  }
  set state(value) {
      this._state = value;
  }

  get zipCode() {
      return this._zipCode;
  }
  set zipCode(value) {
      this._zipCode = value;
  }

  get country() {
      return this._country;
  }
  set country(value) {
      this._country = value;
  }

}

module.exports = User;
