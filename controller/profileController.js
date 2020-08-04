var express = require('express');
var router = express.Router();
router.use('/assets',express.static('assets'));
var connectionDB = require('./../utility/connectionDB');
var userProfileDB = require('./../utility/userProfileDB');
var userDB = require('./../utility/userDB');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended:true});
var alert = require('alert-node');
var { check, validationResult } = require('express-validator');

router.get('/editConnection',function(req,res){
  if(req.session.theuser){
    var connectionID = req.query.id;
    connectionDB.getConnection(req.query.id).exec().then((connectionDetails) => {
      var date = (connectionDetails.dateTime).substring(0, 10);
      var time = (connectionDetails.dateTime).substring(11, 16);
      res.render('editConnection',{headerFlag:2,connectionDetails:connectionDetails,user: req.session.theuser, date:date, time:time});
    }).catch((err) => { console.log(err); })
  }else{
    res.render('loginError',{headerFlag:1});
  }
});

router.post('/UpdatedConnection',urlencodedParser,
[check('details').isLength({ min: 10 }).withMessage('Details should be atleast 10 charecters long'),
check('date').isAfter((new Date()).toString()).withMessage('Date should be future date')],
function(req,res){
  if(req.session.theuser){
    var id = req.body.connectionID;
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      var allErrors = errors.array();
      var errorMessage = allErrors[0].msg;
      alert(errorMessage);
      return res.redirect('/savedConnections/editConnection?id='+id);
    }
    var connectionID = req.body.connectionID;
    var connectionName = req.body.connectionName;
    var category = req.body.category;
    var details = req.body.details;
    var place = req.body.place;
    var dateTime = (req.body.date).toString() +" "+ (req.body.time).toString();
    connectionDB.updateConnection(connectionID,connectionName,category,details,place,dateTime).exec().then((item) => {
      userProfileDB.updateConnectionInAllProfiles(connectionID,connectionName,category).exec().then((items) => {
        return res.redirect('/savedConnections');
      }).catch((err) => { console.log(err); })
    }).catch((err) => { console.log(err); })
  }else{
    res.render('loginError',{headerFlag:1});
  }
})

router.get('/deleteConnection',function(req,res){
  if(req.session.theuser){
    var connectionID = req.query.id;
    connectionDB.deleteConnection(req.query.id).exec().then((item) => {
      userProfileDB.deleteConnFromProfiles(req.query.id).exec().then((items) => {
        return res.redirect('/savedConnections');
      }).catch((err) => { console.log(err); })
    }).catch((err) => { console.log(err); })
  }else{
    res.render('loginError',{headerFlag:1});
  }
});

router.post('/',function(req,res){
  var headerFlag = 2;
  var rsvp = req.query.rsvp;
  var connectionID = req.query.id;
  if(req.session.theuser){
    var userId = (req.session.theuser).userId;
    connectionDB.getConnection(req.query.id).exec().then((connectionDetails) => {
      if(connectionDetails != undefined){
        userProfileDB.updateRSVP(userId,req.query.id,req.query.rsvp).exec().then((updatedYes) => {
          if (updatedYes.n == 0){
            userProfileDB.addRSVP(userId,req.query.id,connectionDetails.connectionName,connectionDetails.category,req.query.rsvp).exec().then((addditem) => {
              return res.redirect('/savedConnections');
            }).catch((err) => { console.log(err); })
          }else{
            return res.redirect('/savedConnections');
          }
        }).catch((err) => { console.log(err); });
      }else{
        res.render('error',{user: req.session.theuser,headerFlag:2});
      }
    }).catch((err) => { console.log(err); })
  } else{
        res.render('loginError',{headerFlag:1});
  }
});

router.get('/delete',function(req,res){
  var headerFlag = 2;
  userProfileDB.deleteRSVP((req.session.theuser).userId,req.query.id).exec().then((item) => {
    return res.redirect('/savedConnections');
  }).catch((err) => { console.log(err); })
});

router.get('/',function(req,res){
  if(req.session.theuser){
    var headerFlag = 2;
    if((Object.keys(req.query)).length == 0) {
      userProfileDB.getUserProfile((req.session.theuser).userId).exec().then((userProfile) => {
        connectionDB.getUserCreatedConnections((req.session.theuser).userId).exec().then((createdConns) => {
          res.render("savedConnections",{user: req.session.theuser, profile:userProfile.connections,createdConnections:createdConns,headerFlag:headerFlag});
        }).catch((err) => { console.log(err); });
      }).catch((err) => { console.log(err); });
    }else{
      res.render('error',{headerFlag:1});
    }
  }else{
    res.render('loginError',{headerFlag:1});
  }
});

module.exports = router;
