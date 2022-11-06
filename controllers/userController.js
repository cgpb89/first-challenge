const User = require('../models/user');
const passport = require('passport');
const { generateNewJWT } = require('../auth/auth');
const logger = require('../logger')

// When the user sends a post request to this route, passport authenticates the user based on the
// middleware created previously
exports.login = (req, res, next) => {
    passport.authenticate('login', async (err, user, info) => {
        try {
            if (err || !user) {
                if (info) {
                    logger.debug(info)
                    return res.json(info);
                }
                logger.debug("User not found")
                return res.json("User not found");
            }
            req.login(user, { session: false }, async (error) => {
                if (error) {
                    logger.error(error)
                    return next(error)
                }
                const jwtToken = user.generateJWT();
                return res.json({ jwtToken });
            });
        } catch (error) {
            logger.error(error)
            return next(error);
        }
    })(req, res, next);
};

exports.signup = (req, res, info) => {
    passport.authenticate('signup', async (err, user, info) => {
        try {
            if (info) {
                logger.debug(info)
                return res.json({
                    message: info,
                });
            }
            const user = {
                _id: req.body._id,
                email: req.body.email,
                firstName: req.body.firstName,
                lastName: req.body.lastName
            }
            logger.debug('Signup successfully')
            return res.json({
                message: 'Signup successfully',
                user
            });
        } catch (err) {
            logger.error(err)
        }
    })(req, res);
}

exports.listUser = async (req, res, next) => {
    try {
        const users = await User.find({}, { password: 0, __v: 0 });
        logger.debug('Lista de usuarios encontrada')
        res.status(201).json(
            {
                users: users,
                token: generateNewJWT(req.headers.authorization)
            }
        );
    } catch (error) {
        logger.error(error)
    }

}

exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id, { password: 0, __v: 0 });
        if (!user) {
            logger.debug('Usuario no encontrado con el ID: ' + req.params.id)
            res.status(404).send('Usuario no encontrado con el ID: ' + req.params.id);
        }
    
        logger.debug('Usuario encontrado')
        res.status(201).json({
            user: user,
            token: generateNewJWT(req.headers.authorization)
        });
    } catch(error) {
        logger.error(error)
    }
}

exports.editUser = async (req, res, next) => {
    try {
        const user = await User.findOne({ _id: req.user._id });

        if (!user) return res.status(400).send('The user does not exist');
    
        const result = await User.findByIdAndUpdate(req.user._id, {
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        }, { new: true });
    
        if (!result) {
            logger.error(`"A problem occur while creating a user. ${result}`)
            res.status(404).send("A problem occur while creating a user.");
        }
    
        const jwtToken = user.generateJWT();
    
        // Sign the JWT token and populate the payload with the user email and id
        const token = jwtToken;
        // Send back the token to the user
        logger.debug(`User with ID: ${req.user._id} was updated successfully`)
        return res.json({
            message: `User with ID: ${req.user._id} was updated successfully`,
            token: token
        });
    } catch(error) {
        logger.error(error)
    }
}

exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            logger.debug("User does not exist")
            return res.status(404).send("User does not exist");
        }
    
        logger.debug('User deleted')
        return res.status(200).send({
            message: 'User deleted',
            token: generateNewJWT(req.headers.authorization)
        });
    } catch (error) {
        logger.error(error)
    }
}