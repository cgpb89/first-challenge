const express = require('express');
const passport = require('passport');
const { login, signup, listUser } = require('../controllers/userController');
const router = express.Router();

router.post('/signup', passport.authenticate('signup', { session : false }), signup);

router.post('/login', login);

router.get("/list-user", passport.authenticate('jwt', { session : false }), listUser);

module.exports = router
