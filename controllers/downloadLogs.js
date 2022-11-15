const passport = require('passport');
const { generateNewJWT } = require('../auth/auth');
const logger = require('../logger')
var path = require('path');
var mime = require('mime');
var fs = require('fs');

exports.getLogs = (req, res, next) => {
    const requestedLog = req.params.log
    const filenamePath = path.resolve(__dirname, '..')
    let fileName = '';
    try {
        switch (requestedLog) {
            case 'error':
                fileName = filenamePath + '/logger/logs/error.txt';
                break
            case 'info':
                fileName = filenamePath + '/logger/logs/debug.txt';
                break
            case 'warning':
                fileName = filenamePath + '/logger/logs/warning.txt';
                break
            default:
                return res.status(201).json({ success: false, message: "There is not such file with that specific name" });
        }

        res.sendFile(fileName, function (err) {
            if (err) {
                logger.error(err)
                return res.status(500).json({ success: false, message: "Internal server error. Please try again later" });

            } else {
                logger.debug("Sent:", fileName, "at", new Date().toString())
            }
        });

        }  catch(error) {
            logger.error(error)
            return res.status(500).json({
                message: 'Error while retrieving file. ' + error.message
            })
        }

    }
