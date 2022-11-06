const express = require('express');
const passport = require('passport');
const { login, signup, listUser, deleteUser, editUser, getUser } = require('../controllers/userController');
const { actionLog } = require('../middleware');
const router = express.Router();

router.post('/signup', actionLog, signup);

router.post('/login', actionLog, login);

router.get("/list-users", actionLog, passport.authenticate('jwt', { session : false }), listUser);

router.get("/:id", actionLog, passport.authenticate('jwt', { session : false }), getUser);

router.put("/:id", actionLog, passport.authenticate('jwt', { session : false }), editUser);

router.delete("/:id", actionLog, passport.authenticate('jwt', { session : false }), deleteUser);

module.exports = router
