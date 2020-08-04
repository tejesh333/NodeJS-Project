var express = require('express');
var router = express.Router();
var connectionDB = require('./../utility/connectionDB');
var userProfileDB = require('./../utility/userProfileDB');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended:true});
var alert = require('alert-node');
var { check, validationResult } = require('express-validator');

router.get('/connection',function(req,res){
  var headerFlag = 1;
  if(req.session.theuser) {
    headerFlag = 2;
  }
  if ((Object.keys(req.query)).length != 0 ) {
    var query_connectionDetails = connectionDB.getConnection(req.query.id);
    query_connectionDetails.exec().then((connectionDetails) => {

      if (!connectionDetails)
      {
        res.render('error',{connectionDetails: connectionDetails,headerFlag:headerFlag, user: req.session.theuser});
      }
      else{
        res.render('Connection',{connectionDetails: connectionDetails,headerFlag:headerFlag, user: req.session.theuser});
      }
    })
    .catch((err) => { console.log(err); });
  }
  else {
    return res.redirect('/connections');
  }
});

var date = new Date();
var todaysDate = date.toString();

router.post('/connections',urlencodedParser,
[check('details').isLength({ min: 10 }).withMessage('Details should be atleast 10 charecters long'),
check('date').isAfter(todaysDate).withMessage('Date should be future date')],
function(req,res){
  var errors = validationResult(req);
  if (!errors.isEmpty()) {
    var allErrors = errors.array();
    var errorMessage = allErrors[0].msg;
    return res.render('newConnection',{headerFlag:1,user: req.session.theuser, errorMessage:errorMessage });
  }
  var connectionName = req.body.connectionName;
  var category = req.body.category;
  var host = req.body.host;
  var details = req.body.details;
  var place = req.body.place;
  var dateTime = (req.body.date).toString() +" "+ (req.body.time).toString();
  var userId = (req.session.theuser).userId;
  userProfileDB.updateConnection(connectionName,category,details,place,dateTime,userId).exec().then((item) => {
    if (item.n == 0){
      connectionDB.getLastConnectionID().exec().then((value) => {
        var lastConnectionID = value[0].connectionID;
        userProfileDB.addConnection((lastConnectionID + 1),connectionName,category,host,details,place,dateTime,userId).exec().then((item) => {
          return res.redirect('/connections');
        }).catch((err) => { console.log(err); });
      }).catch((err) => { console.log(err); });
    }else{
      return res.redirect('/connections');
    }
  }).catch((err) => { console.log(err); });
});

router.get('/connections',function(req,res){
  var headerFlag = 1;
  if(req.session.theuser) {
    headerFlag = 2;
  }
  var query_allConnections = connectionDB.getConnections();
  var query_allCategories = connectionDB.getAllCategories();
  query_allConnections.exec().then((allConnections) => {
    query_allCategories.exec().then((allcategories) => {
      var distinctCategories = [];
      allcategories.forEach(function(item){
      if (!distinctCategories.includes(item.category)) {
          distinctCategories.push(item.category);
        }
      });
      res.render('Connections', {allConnections:allConnections, allCategories:distinctCategories,headerFlag:headerFlag,user: req.session.theuser});
    }).catch((err) => { console.log(err); });
  }).catch((err) => { console.log(err); });
});

module.exports = router;
