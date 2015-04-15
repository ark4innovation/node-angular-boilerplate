/**
 * Created by arifkhan on 4/4/15.
 */
(function() {
    var authFactory = function($http, $window) {

        var factory = {};

        factory.saveToken = function (token){
            $window.localStorage['zakkit-token'] = token;
        };

        factory.getToken = function (){
            return $window.localStorage['zakkit-token'];
        }

        factory.isLoggedIn = function(){
            var token = factory.getToken();

            if(token){
                var payload = JSON.parse($window.atob(token.split('.')[1]));

                return payload.exp > Date.now() / 1000;
            } else {
                return false;
            }
        };

        factory.currentUser = function(){
            if(factory.isLoggedIn()){
                var token = factory.getToken();
                var payload = JSON.parse($window.atob(token.split('.')[1]));

                return payload.username;
            }
        };

        factory.register = function(user){
            return $http.post('/register', user).success(function(data){
                factory.saveToken(data.token);
            });
        };

        factory.logIn = function(user){
            return $http.post('/login', user).success(function(data){
                factory.saveToken(data.token);
            });
        };

        factory.logOut = function(){
            $window.localStorage.removeItem('zakkit-token');
        };


        return factory;
    };

    angular.module('zakkit').factory('authFactory',['$http', '$window', authFactory]);

}());