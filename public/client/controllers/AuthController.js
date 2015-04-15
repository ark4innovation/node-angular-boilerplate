/**
 * Created by arifkhan on 4/4/15.
 */
(function() {
    var authController = function ($scope, $state, authFactory) {

        $scope.user = {};

        $scope.register = function(){
            authFactory.register($scope.user).error(function(error){
                $scope.error = error;
            }).then(function(){
                $state.go('home');
            });
        };

        $scope.logIn = function(){
            authFactory.logIn($scope.user).error(function(error){
                $scope.error = error;
            }).then(function(){
                $state.go('home');
            });
        };

    };

    authController.$inject = ['$scope', '$state', 'authFactory'];

    angular.module('zakkit').controller('AuthController', authController);

}());

