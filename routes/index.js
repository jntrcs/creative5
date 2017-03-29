var request = require("request");
var express = require('express');
var router = express.Router();
var base64url=require('base64url');
var api="https://www.googleapis.com/gmail/v1/users";
//var id ="ya29.GlscBNL9TKQLR-UD7MEfSc_0hVb82LS_XretYkGRXDpVm_XWNPKFqTM2q45fviAOJ_18MsDCKspIpWuc5nFYX_yUg0jr5MDVKN020GZQEZKX8vGwA8AD4ZE1G7d7"  
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


var fs =require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/gmail-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'gmail-nodejs-quickstart.json';
var credentials;
//console.log(TOKEN_PATH);
// Load client secrets from a local file.

var minutes=.2, the_interval = minutes * 60 * 1000;
//setInterval(function() {
console.log("running regularly");
fs.readFile('client_secret.json', function processClientSecrets(err, content) {
  if (err) {
    console.log('Error loading client secret file: ' + err);
    return;
  }
  // Authorize a client with the loaded credentials, then call the
  // Gmail API.
credentials = JSON.parse(content);
  authorize(credentials, getAllEmails);
});
//}, the_interval);
/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client);
    }
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */

function getAllEmails(auth) {
  var gmail = google.gmail('v1');

  gmail.users.messages.list({
    auth: auth,
    userId: 'me',
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    if(response.resultSizeEstimate>0){
for (i in response.messages)
{
//console.log(response.messages[i].id);
var id = response.messages[i].id;

gmail.users.messages.get({
auth: auth,
userId: 'me',
id: this.id,}, function(err, response){
if(err){
console.log('The API returned 1 error: '+err);
return;
}
console.log(response.Ids);
var from;
var body;
var subject;
for (i in response.payload.headers)
{
if (response.payload.headers[i].name==="From")
{
from=response.payload.headers[i].value;
}
if (response.payload.headers[i].name==="Subject")
{
subject = response.payload.headers[i].value;
}
}
//console.log(base64url.decode(response.payload.body.data));
if (typeof response.payload.body.data!="undefined")
{
body = base64url.decode(response.payload.body.data)
}
else
{
body="This message either contained no content or contained invalid content. Version 0.1 of this software only supports plaintext messages";
}
console.log(body);
var e = new Email({SenderName:from, Subject: subject, EmailBody: body});
e.save(function(err,post){
if(err)return console.error(err);
console.log("saved message to db");
});
});
}.bind({id : id}));
    }
 };
});
}

module.exports = router;
