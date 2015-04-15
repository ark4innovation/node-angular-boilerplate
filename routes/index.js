var express = require('express');
var passport = require('passport');
var jwt = require('express-jwt');

/**
 * The userPropery option specifies which property on req to put our payload from our tokens. By default it's set on
 * user but we're using payload instead to avoid any conflicts with passport (it shouldn't be an issue since we aren't
 * using both methods of authentication in the same request). This also avoids confusion since the payload isn't
 * an instance of our User model.
 *
 * Make sure to use the same secret as the one in models/User.js for generating tokens. Again, we're hard-coding the
 * token in this example but it is strongly recommended that you use an environment variable for referencing your secret.
 */

var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

/**
 * Now we can use the auth middleware we just defined to require authentication on specific routes. In our case, we'd want
 * to authenticate users whenever they try to write to our application, such as when they're posting or commenting.
 */


var router = express.Router();
module.exports = router;

var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
var User = mongoose.model('User');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/posts', function(req, res, next) {
   Post.find(function(err, posts) {
       if(err) {return next(err);}

       res.json(posts);
   })
});

router.post('/posts', auth, function(req, res, next) {
    var post = new Post(req.body);
    post.author = req.payload.username;

    post.save(function(err, post) {
        if(err) {return next(err);}

        res.json(post);
    });
});

router.param('post', function(req, res, next, id) {
    var query = Post.findById(id);

    query.exec(function (err, post){
        if (err) { return next(err); }
        if (!post) { return next(new Error('can\'t find post')); }

        req.post = post;
        return next();
    });
});

/* router.get('/posts/:post', function(req, res) {
    res.json(req.post);
}); */

router.put('/posts/:post/upvote', auth, function(req, res, next) {
    req.post.upvote(function(err, post){
        if (err) { return next(err); }

        res.json(post);
    });
});


router.post('/posts/:post/comments', auth, function(req, res, next) {
    var comment = new Comment(req.body);
    comment.post = req.post;
    comment.author = req.payload.username;

    comment.save(function(err, comment){
        if(err){ return next(err); }

        req.post.comments.push(comment);
        req.post.save(function(err, post) {
            if(err){ return next(err); }

            res.json(comment);
        });
    });
});

router.param('comment', function(req, res, next, id) {
    var query = Comment.findById(id);

    query.exec(function (err, comment){
        if (err) { return next(err); }
        if (!comment) { return next(new Error('can\'t find comment')); }

        req.comment = comment;
        return next();
    });
});


router.put('/posts/:post/comments/:comment/upvote', auth, function(req, res, next) {
    req.comment.upvote(function(err, comment){
        if (err) { return next(err); }

        res.json(comment);
    });
});



router.get('/posts/:post', function(req, res, next) {
    req.post.populate('comments', function(err, post) {
        if (err) { return next(err); }

        res.json(post);
    });
});

router.post('/register', function(req, res, next){
    if(!req.body.username || !req.body.password){
        return res.status(400).json({message: 'Please fill out all fields'});
    }

    var user = new User();

    user.username = req.body.username;

    user.setPassword(req.body.password)

    user.save(function (err){
        if(err){ return next(err); }

        return res.json({token: user.generateJWT()})
    });
});

router.post('/login', function(req, res, next){
    if(!req.body.username || !req.body.password){
        return res.status(400).json({message: 'Please fill out all fields'});
    }

    /**
     * The passport.authenticate('local') middleware uses the LocalStrategy we created in config/passport.js. We're using a custom
     * callback for the authenticate middleware so we can return error messages to the client. If authentication is
     * successful we want to return a JWT token to the client just like our register route does.
     */
    passport.authenticate('local', function(err, user, info){
        if(err){ return next(err); }

        if(user){
            return res.json({token: user.generateJWT()});
        } else {
            return res.status(401).json(info);
        }
    })(req, res, next);
});
