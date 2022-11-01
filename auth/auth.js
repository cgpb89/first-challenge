const passport = require('passport');
const localStrategy = require('passport-local');
const Strategy = localStrategy.Strategy;
const UserModel = require('../models/user');
const passporJWT = require('passport-jwt');
var url = require('url');
const jwt_decode =  require("jwt-decode");

const JWTstrategy = passporJWT.Strategy;
// We use this to extract the JWT sent by the user
const ExtractJWT = passporJWT.ExtractJwt;

passport.use('signup', new Strategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        // Save the information provided by the user to the the database
        const user = await UserModel.create({ email, password });
        // Send the user information to the next middleware
        return done(null, user);
    } catch (err) {
        let error = err.message;
        if (error.includes('duplicate') && error.includes('index: email_1 dup key')) {
            error = 'Email already registered!';
        }
        done(error);
    }
}));

// Create a passport middleware to handle User login
passport.use('login', new Strategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        // Find the user associated with the email provided by the user
        let user = await UserModel.findOne({ email });
        if (!user) {
            // If the user isn't found in the database, return a message
            user = new UserModel({
                email: req.body.email,
                password: req.body.password
            });

            await user.save(function (err, user) {
                if (err) return console.error(err);
                console.log(user.email + " saved to user collection.");
            })
        }
        // Validate password and make sure it matches with the corresponding hash stored in the database
        // If the passwords match, it returns a value of true.
        const validate = await user.isValidPassword(password);
        if (!validate) {
            return done(null, false, { message: 'Wrong Password' });
        }
        // Send the user information to the next middleware
        return done(null, user, { message: 'Logged in Successfully' });
    } catch (error) {
        return done(error);
    }
}));

// This verifies that the token sent by the user is valid
passport.use(new JWTstrategy({
    // secret we used to sign our JWT
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'secret_token',
}, async (jwtPayload, cb) => {
    try {
        return await UserModel.findOne({ id: jwtPayload._id })
            .then(user => {
                return cb(null, user);
            })
            .catch(err => {
                console.log('JWTSTretagy', err)
                return cb(err);
            });
    } catch (err) {
        console.log(err)
    }
}));

exports.generateNewJWT = (token) => {
    const decodeToken = jwt_decode(token)
    const user = new UserModel({
        email: decodeToken._id,
        _id: decodeToken.email
    });
    return user.generateJWT();
}