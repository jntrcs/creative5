var request = require("request");
var express = require('express');
var router = express.Router();
var api="https://www.googleapis.com/gmail/v1/users";
var id ="ya29.GlscBNL9TKQLR-UD7MEfSc_0hVb82LS_XretYkGRXDpVm_XWNPKFqTM2q45fviAOJ_18MsDCKspIpWuc5nFYX_yUg0jr5MDVKN020GZQEZKX8vGwA8AD4ZE1G7d7"  
var http=require("https");
//var $ = require('jquery');
/* Set up mongoose in order to connect to mongo database */
var mongoose = require('mongoose'); //Adds mongoose as a usable dependency

mongoose.connect('mongodb://localhost/emailDB'); //Connects to a mongo database called "commentDB"

var emailSchema = mongoose.Schema({ //Defines the Schema for this database
SenderName: String,
Subject: String,
EmailBody: String,
time : { type : Date, default: Date.now }
});

var Email = mongoose.model('Email', emailSchema); //Makes an object from that schema as a model

var db = mongoose.connection; //Saves the connection as a variable to use
db.on('error', console.error.bind(console, 'connection error:')); //Checks for connection errors
  db.once('open', function() { //Lets us know when we're connected
  console.log('Connected');
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//var minutes=.2, the_interval = minutes * 60 * 1000;
//setInterval(function() {
  console.log("Running regularly");
var getOptions={
    type: "GET",
    dataType: 'text',
    url: api+'/'+id+'/profile',
    crossDomain : true
} 
console.log(api+"/me/profile")
request(api+"/me/profile", function(err, resp, body) {
if(err){
//console.log(err);
}
console.log(body);
//console.log(resp);
resp.on('data', function(chunk){
console.log('Response: '+chunk);
});
});
//}, the_interval);
module.exports = router;
