var myApp = window.angular.module("myApp",[]);

myApp.factory('emailFetcher', emailFetcher)
myApp.controller('blogController', blogController);

function emailFetcher ($http) {
  console.log("In email fetcher");
  var API_ROOT = 'emails';
  return {
    get: function () {
      return $http
        .get(API_ROOT)
        .then(function (resp) {
          return resp.data
        })
    }
  }
}

function blogController($scope, emailFetcher) {
  console.log("in blogController"); 
  $scope.emails = [{SenderName: "Bob", Subject: "A post", EmailBody: "I love blogging", Time:"5 pm"}]; // This array will hold all the emails on the blog
  console.log("email fetcher");
  emailFetcher.get()
    .then(function (data) {
      console.log("Tried to get emails");
      $scope.emails = data;
      console.log("Got the Emails");
      console.log(data);
    })
}

