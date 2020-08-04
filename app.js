var express = require('express');
var app = express();
var alert = require('alert-node');
app.set('view engine','ejs');
app.use('/assets',express.static('assets'));
var { check, validationResult } = require('express-validator');
var bodyParser=require('body-parser');
var userDB = require('./utility/userDB');
var UserProfile = require('./models/userProfile.model');
var urlencodedParser=bodyParser.urlencoded({extended:true});
var session=require('express-session');
app.use(session({ resave: false ,secret: 'MyFamily333' , saveUninitialized: true}));

'use strict';
var crypto = require('crypto');

var connectionRouter = require('./controller/connectionController');
var userRouter = require('./controller/profileController');

app.use('/',connectionRouter);
app.use('/savedConnections',userRouter);


app.get(['/index','/'],function(req,res){
  var headerFlag = 1;
  if(req.session.theuser) {
    headerFlag = 2;
  }
  res.render('Index',{headerFlag:headerFlag, user: req.session.theuser});
});

app.get('/about',function(req,res){
  var headerFlag = 1;
  if(req.session.theuser) {
    headerFlag = 2;
  }
  res.render('about',{headerFlag:headerFlag, user: req.session.theuser});
});

app.get('/logout',function(req,res){
  var headerFlag = 1;
  req.session.destroy(function(error){
    if (error) {
      console.log('Error deleting the session object');
    }else {
      res.render('Index',{headerFlag:headerFlag});
    }
  });
});

app.get('/signUp',function(req,res){
  var headerFlag = 1;
  res.render('signUp',{headerFlag:headerFlag,error:-1, errorMessage:""});
});

/* generates random string of characters i.e salt */
var genRandomString = function(length){
   return crypto.randomBytes(Math.ceil(length/2)).toString('hex').slice(0,length);
};

/* hash password with sha512 algortithm*/
var sha512 = function(password, salt){
   var hash = crypto.createHmac('sha512', salt);
   hash.update(password);
   var value = hash.digest('hex');
   return value;
};

app.post('/signUpSuccess',urlencodedParser,
[check('emailAddress').isEmail().withMessage('Invalid email address'),
check('zipCode').isNumeric().withMessage('zip code should contain only numbers')],
function(req,res){
  var errors = validationResult(req);
  if (!errors.isEmpty()) {
    var allErrors = errors.array();
    var errorMessage = allErrors[0].msg;
    return res.render('signUp',{headerFlag:1,error:-1,errorMessage:errorMessage });
  }
  var firstName= req.body.firstName;
  var lastName= req.body.lastName;
  var emailAddress= req.body.emailAddress;
  var address_1= req.body.address_1;
  var address_2= req.body.address_2;
  var city= req.body.city;
  var state= req.body.state;
  var country= req.body.country;
  var zipCode= req.body.zipCode;
  var userId= req.body.userId;
  var password= req.body.password;
  var salt = genRandomString(16);
  var hashedPassword = sha512(password, salt);

  userDB.checkUser(emailAddress).countDocuments(function(error,count){
    console.log(count);
    if(count == 0){
      userDB.addUser(firstName,lastName,emailAddress,address_1,address_2,city,state,country,zipCode,userId,hashedPassword,salt).exec().then((userDetails) => {
          var newProfile = new UserProfile({userId:userId,connections:[ ]});
          newProfile.save(function(err,profile){
            if (err) return console.error(err);
            console.log('new profile created');
          });
          alert('Signed up successfully, please login now.');
          return res.redirect('/login');
      }).catch((err) => { console.log(err);})
    }else{
      res.render('signUp',{headerFlag:1,error:1});
    }
  })
});

app.get('/login',function(req,res){
  var headerFlag = 1;
  res.render('login',{headerFlag:headerFlag,error:-1, errorMessage:""});
});

app.post('/loginsuccess',urlencodedParser,[
 check('userId').not().isEmpty().withMessage('userID should not be empty'),
 check('password').not().isEmpty().withMessage('password should not be empty')],
 function(req,res){
  var errors = validationResult(req);
  if (!errors.isEmpty()) {
    var allErrors = errors.array();
    var errorMessage = allErrors[0].msg;
    return res.render('login',{headerFlag:1,error:-1,errorMessage:errorMessage });
  }
  var userId= req.body.userId;
  var password = req.body.password;
  userDB.getUserSalt(userId).exec().then((salt) => {
    var hashedPassword = sha512(password, salt.salt);
    userDB.getUser(userId,hashedPassword).countDocuments(function(error,count){
      if(count != 0){
        userDB.getUser(userId,hashedPassword).exec().then((userDetails) => {
          req.session.theuser = userDetails;
          return res.redirect('/savedConnections');
        }).catch((err) => { console.log(err);})
      }else{
        res.render('login',{headerFlag:1,error:1, errorMessage:""});
      }
    }).catch((err) => { console.log(err);})
  })
});

app.get('/contact',function(req,res){
  var headerFlag = 1;
  if(req.session.theuser) {
    headerFlag = 2;
  }
  res.render('contact',{headerFlag:headerFlag, user: req.session.theuser});
});

app.get('/newConnection',function(req,res){
  if(req.session.theuser){
    var headerFlag = 2;
    res.render('newConnection',{headerFlag:headerFlag, user: req.session.theuser, errorMessage:""});
  }
  else{
    var headerFlag = 1;
    res.render('loginError',{headerFlag:headerFlag});
  }
});

app.get('/*',function(req,res){
  var headerFlag = 1;
  if(req.session.theuser) {
    headerFlag = 2;
  }
  res.render('error',{headerFlag:headerFlag,user: req.session.theuser});
});

app.listen(8080, function(){
  console.log('listening to port 8080');
});
