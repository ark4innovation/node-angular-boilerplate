/**
 * Created by arifkhan on 3/20/15.
 */

(function() {

    var mainController = function ($scope, postFactory, authFactory) {

        $scope.posts = [];

        $scope.isLoggedIn = authFactory.isLoggedIn;

        $scope.addPost = function() {
            if(!$scope.postTitle || $scope.postTitle == '') {
                return;
            }
            postFactory.addPost($scope.postTitle, $scope.postLink)
                .success(function(post) {
                   $scope.posts.push(post);
                })
                .error(function(data, status, header, config) {
                    console.log("error creating post");
                });
            $scope.postTitle = "";
            $scope.postLink = "";
        }

        $scope.incrementUpvotes = function(post) {
            postFactory.upvotePost(post)
                .success(function(data) {
                    post.upvotes = data.upvotes;
                })
                .error(function(data, status, header, config) {
                    console.log("error upvoting post");
                })
        }

        function init() {
            postFactory.getPosts()
                .success(function(posts) {
                    $scope.posts = posts;
                })
                .error(function(data, status, header, config) {
                    console.log("Error");
                })
        }

        init();
    };

    mainController.$inject = ['$scope', 'postFactory', 'authFactory'];

    angular.module('zakkit').controller('MainController', mainController);

}());