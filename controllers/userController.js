const User = require('../models/user');
const passport = require('passport');
const { generateNewJWT } = require('../auth/auth');
// When the user sends a post request to this route, passport authenticates the user based on the
// middleware created previously
exports.login = (req, res, next) => {
    passport.authenticate('login', async (err, user, info) => {
        try {
            if (err || !user) {
                if(info) {
                    return res.json(info);
                }
                return res.json("User not found");
            }
            req.login(user, { session: false }, async (error) => {
                if (error) return next(error)
                const jwtToken = user.generateJWT();
                return res.json({ jwtToken });
            });
        } catch (error) {
            console.log("catch", error);
            return next(error);
        }
    })(req, res, next);
};

exports.signup = (req, res, next) => {
    const user = {
        _id: req.user._id,
        email: req.user.email
    }
    res.json({
        message: 'Signup successfully',
        user
    });
}

exports.listUser = async (req, res, next) => {
    const users = await User.find({}, { password: 0, __v: 0 });
    res.status(201).json([generateNewJWT(req.headers.authorization), ...users]);
}

exports.getUser = async(req, res, next) => {
    const user = await User.findById(req.params.id, { password: 0, __v: 0 });
    if (!user) {
        res.status(404).send('Usuario no encontrado con el ID: ' + req.params.id);
    }

    res.send(user);
}