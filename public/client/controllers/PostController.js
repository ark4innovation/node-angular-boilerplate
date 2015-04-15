/**
 * Created by arifkhan on 3/22/15.
 */

(function() {

    var postController = function($scope, $stateParams, postFactory, authFactory) {

        $scope.post='';
        $scope.isLoggedIn = authFactory.isLoggedIn;

        var postId = $stateParams.id;

        $scope.incrementUpvotes = function(comment) {
            postFactory.upvoteComment($scope.post, comment)
                .success(function(retComment) {
                    comment.upvotes = retComment.upvotes;
                })
                .error(function(data, status, header, config) {
                    console.log("Error while upvoting comment");
                 });

        }

        $scope.addComment = function() {
            if($scope.commentBody  == '') {return;}

            postFactory.addComment(postId, $scope.commentBody)
                .success(function(comment) {
                    $scope.post.comments.push(comment);
                })
                .error(function(data, status, header, config) {
                    console.log("error while adding comment");
                });

            $scope.commentBody = '';
        }


        function init() {

            $scope.post = postFactory.getPost($stateParams.id)
                .success(function(post) {
                    $scope.post = post;
                    postId = $stateParams.id;
                })
                .error(function(data, status, header, config) {
                    console.log("error while getting post");
                });
        }

        init();


    };

    postController.$inject = ['$scope', '$stateParams', 'postFactory', 'authFactory'];

    angular.module('zakkit').controller('PostController', postController);



}());
