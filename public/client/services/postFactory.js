/**
 * Created by arifkhan on 3/21/15.
 */

(function() {
    var postFactory = function($http, authFactory) {

        var posts = [];

        var factory = {};

        factory.getPosts = function() {
            //Return a promise instead of the data set.
            return $http.get('/posts');
        }

        factory.getPost = function(postId) {
            return $http.get('/posts/' + postId);
        }

        factory.addPost = function(postTitle, postLink) {

            return $http.post('/posts', {
                title: postTitle,
                link: postLink,
                upvotes: 0,
                comments: []
            }, {
                headers: {Authorization: 'Bearer '+authFactory.getToken()}
            });

        }

        factory.upvotePost = function(post) {
            return $http.put('/posts/' + post._id + '/upvote', null, {
                headers: {Authorization: 'Bearer '+authFactory.getToken()}
            });
        }

        factory.addComment = function(postId, commentBody) {

            return $http.post('/posts/' + postId + '/comments', {
                body: commentBody,
                author: 'user',
                upvotes: 0
            }, {
                headers: {Authorization: 'Bearer '+authFactory.getToken()}
            });
        }

        factory.upvoteComment = function(post, comment) {
            return $http.put('/posts/' + post._id + '/comments/'+ comment._id + '/upvote', null, {
                headers: {Authorization: 'Bearer '+authFactory.getToken()}
            });
        }



        return factory;
    };

    angular.module('zakkit').factory('postFactory',['$http','authFactory', postFactory]);

}());