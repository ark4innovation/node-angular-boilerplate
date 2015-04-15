/**
 * Created by arifkhan on 4/4/15.
 */
var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    username: {type: String, lowercase: true, unique: true},
    hash: String,
    salt: String
});

/**
 * Our users will be logging in with a username and password. Since we don't want to store our passwords in plain text,
 * we'll need a field for storing the hash of the password. We'll also be generating and saving a salt whenever we set the password.
 * Now let's implement setting and validating passwords. We'll be using the pbkdf2() function which ships with node's
 * native crypto module to hash our passwords.
 */

var crypto = require('crypto');

/**
 * The pbkdf2Sync() function takes four parameters: password, salt, iterations, and key length. We'll need to make sure
 * the iterations and key length in our setPassword() method match the ones in our validPassword() method
 */
UserSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
}

UserSchema.methods.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');

    return this.hash === hash;
}

/**
 * Now let's create a method to generate a JWT token for the user.
 */
var jwt = require('jsonwebtoken');

UserSchema.methods.generateJWT = function() {

    // set expiration to 60 days
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    /**
     * The first argument of the jwt.sign() method is the payload that gets signed. Both the server and client will
     * have access to the payload. The exp value in the payload is a Unix timestamp in seconds that will specify when
     * the token expires. For this example we set it to 60 days in the future. The second argument of jwt.sign() is the
     * secret used to sign our tokens. We're hard-coding it in this example, but it is strongly recommended that you
     * use an environment variable for referencing the secret and keep it out of your codebase.
     */
    return jwt.sign({
        _id: this._id,
        username: this.username,
        exp: parseInt(exp.getTime() / 1000)
    }, 'SECRET');
};

mongoose.model('User', UserSchema);
