/**
 * Created by arifkhan on 4/4/15.
 */
(function() {

    var navController = function ($scope, authFactory) {

        $scope.isLoggedIn = authFactory.isLoggedIn;
        $scope.currentUser = authFactory.currentUser;
        $scope.logOut = authFactory.logOut;

    };

    navController.$inject = ['$scope', 'authFactory'];

    angular.module('zakkit').controller('NavController', navController);


}());
