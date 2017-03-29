var request = require("request");
var express = require('express');
var router = express.Router();
var api="https://www.googleapis.com/gmail/v1/users";
var id ="ya29.GlscBNL9TKQLR-UD7MEfSc_0hVb82LS_XretYkGRXDpVm_XWNPKFqTM2q45fviAOJ_18MsDCKspIpWuc5nFYX_yUg0jr5MDVKN020GZQEZKX8vGwA8AD4ZE1G7d7"  
var http=require("https");
//var $ = require('jquery');

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
