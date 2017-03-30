var myApp = window.angular.module("myApp",[]);

myApp.factory('emailFetcher', emailFetcher)
myApp.controller('blogController', blogController);
myApp.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});

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
  $scope.emails = []; // This array will hold all the emails on the blog

  console.log("email fetcher");
  emailFetcher.get()
    .then(function (data) {
      console.log(data);
      console.log(data.length);
      for(var i=0; i < data.length; i++){
        console.log(data[i].time);
        var date = new Date(data[i].time);
        var year = date.getFullYear();
        var month = date.getMonth()+1;
        if(month < 10){
                month = '0' + month;
        }
        var day = date.getDate();
        var minutes = date.getMinutes();
        var hours = date.getHours();
        var formattedDate = month + '-' + day + '-' + year + '\n';
        data[i].time = formattedDate;
      }
      $scope.emails = data;
    })
}

