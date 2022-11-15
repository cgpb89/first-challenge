const express = require('express');
const passport = require('passport');
const { getLogs } = require('../controllers/downloadLogs');
const { actionLog } = require('../middleware');
const router = express.Router();

router.get('/:log', actionLog, passport.authenticate('jwt', { session : false }), getLogs);

module.exports = router