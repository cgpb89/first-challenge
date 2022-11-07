const { validationResult } = require('express-validator');
const logger = require('../logger')

exports.validation = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        logger.info(errors.array().map((item) => `Validation error ${item.msg}. Param: ${item.param}. Location: ${item.location}`))
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }

    return next()
}

exports.actionLog = (req, res, next) => {
    logger.debug(`API call from ${req.originalUrl}. Method: ${req.method}`)
    return next()
}