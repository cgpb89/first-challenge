const express = require('express'),
    { employeeList, getEmployee, updateEmployee, deleteEmployee, createEmployee, customEmployee } = require('../controllers/employeeController'),
    { body, param } = require('express-validator')
    passport = require('passport');
;
const { validation } = require('../middleware');

router = express.Router();

router.get('/list', passport.authenticate('jwt', { session : false }), employeeList);

router.get('/:id',
    passport.authenticate('jwt', { session : false }),
    param('id', 'id must be number').isNumeric(),
    validation,
    getEmployee);

router.post('/',
    passport.authenticate('jwt', { session : false }),
    body('level', 'level must be number').isNumeric(),
    body('salary', 'salary must be number').isNumeric(),
    validation,
    createEmployee);

router.put('/:id',
    passport.authenticate('jwt', { session : false }),
    param('id', 'id must be number').isNumeric(),
    body('level', 'level must be number').isNumeric(),
    body('salary', 'salary must be number').isNumeric(),
    validation,
    updateEmployee);

router.delete('/:id',
    passport.authenticate('jwt', { session : false }),
    param('id', 'id must be number').isNumeric(),
    validation,
    deleteEmployee);

router.post('/employee-custom', 
    passport.authenticate('jwt', { session : false }),
    body('level', 'level must be number').isNumeric(),
    body('salary', 'salary must be number').isNumeric(),
    validation,
    customEmployee);


module.exports = router;