const express = require('express'),
    { employeeList, getEmployee, updateEmployee, deleteEmployee, createEmployee, customEmployee } = require('../controllers/employeeController'),
    { body, param } = require('express-validator');
const { validation } = require('../middleware');

router = express.Router();

router.get('/list', employeeList);

router.get('/:id',
    param('id', 'id must be number').isNumeric(),
    validation,
    getEmployee);

router.post('/',
    body('level', 'level must be number').isNumeric(),
    body('salary', 'salary must be number').isNumeric(),
    validation,
    createEmployee);

router.put('/:id',
    param('id', 'id must be number').isNumeric(),
    body('level', 'level must be number').isNumeric(),
    body('salary', 'salary must be number').isNumeric(),
    validation,
    updateEmployee);

router.delete('/:id',
    param('id', 'id must be number').isNumeric(),
    validation,
    deleteEmployee);

router.post('/employee-custom', 
    body('level', 'level must be number').isNumeric(),
    body('salary', 'salary must be number').isNumeric(),
    validation,
    customEmployee);


module.exports = router;