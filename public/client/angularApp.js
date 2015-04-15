/**
 * Created by arifkhan on 3/20/15.
 */

(function() {

    /**
     * Use ui-router instead of ngRoute
     */
    var app = angular.module('zakkit', ['ui.router', 'ui.bootstrap']);

    app.config([
        '$stateProvider',
        '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {

            $stateProvider
                .state('home', {
                    url: '/',
                    templateUrl: '/client/views/home.html',
                    controller: 'MainController'
                })
                .state('post', {
                    url: '/posts/{id}',
                    templateUrl: '/client/views/posts.html',
                    controller: 'PostController'
                })
                .state('login', {
                    url: '/login',
                    templateUrl: '/client/views/login.html',
                    controller: 'AuthController',
                    onEnter: ['$state', 'authFactory', function($state, authFactory){
                        if(authFactory.isLoggedIn()){
                            $state.go('home');
                        }
                    }]
                })
                .state('register', {
                    url: '/register',
                    templateUrl: '/client/views/register.html',
                    controller: 'AuthController',
                    onEnter: ['$state', 'authFactory', function($state, authFactory){
                        if(authFactory.isLoggedIn()){
                            $state.go('home');
                        }
                    }]
                });

            $urlRouterProvider.otherwise('/');

        }]);

}());


