var myApp = window.angular.module("myApp",[]);

myApp.factory('emailFetcher', emailFetcher)
myApp.controller('blogController', blogController);

function emailFetcher ($http) {

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
    
  $scope.emails = []; // This array will hold all the emails on the blog

  emailFetcher.get()
    .then(function (data) {
      $scope.emails = data;
      console.log("Got the Emails");
      console.log(data);
    })
}

