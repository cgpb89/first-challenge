const express = require('express'),
    Counters = require('../models/counters'),
    { employeeList, getEmployee, updateEmployee, deleteEmployee, createEmployee } = require('../controllers/employeeController')
router = express.Router();


async function getNextSequenceValue(sequenceName) {
    var update = {};
    update['$inc'] = {};
    update['$inc']['sequence_value'] = 1;

    var sequenceDocument = await Counters.findOneAndUpdate({ employee_id: sequenceName },
        update,
        {
            new: true
        }
    );
    return sequenceDocument.sequence_value;
}

router.get('/list', employeeList)

router.get('/:id', getEmployee)

router.post('/', createEmployee)

router.put('/:id', updateEmployee);

router.delete('/:id', deleteEmployee)

// const addEmployee = async (req) => {
//     console.log(req.body)
//     const idProvided = parseInt(req.body.id)
//     console.log('idProvided', idProvided, 'isNaN', !isNaN(idProvided))
//     const employee = new Employee({
//         id: !isNaN(idProvided) ? idProvided : await getNextSequenceValue("employeeId"),
//         name: req.body.name,
//         surname: req.body.surname,
//         level: req.body.level,
//         salary: req.body.salary,
//     });
//     await employee.save(function (err, employee) {
//         if (err) return {
//             error: err
//         }
//         console.log(employee.name + " saved to employee collection.");
//         return employee
//     })
//     if (employee.validateSync()) return { error: employee.validateSync() }

//     return employee
// }

// router.post('/', async (req, res) => {
//     if (req.body.id) {
//         const employee = await updateEmployeeById(req, parseInt(req.body.id))
//         if (!employee) {
//             const employee = await addEmployee(req)
//             res.status(201).send({
//                 _id: employee.id,
//                 name: employee.name,
//                 msg: "Employee create with custom ID"
//             });
//             return
//         }
//         res.status(201).send({
//             _id: employee.id,
//             name: employee.name,
//             msg: `Employee updated with ID:${employee.id}`
//         });
//         return
//     } else {
//         const employee = await addEmployee(req)
//         console.log('employee', employee)
//         if (employee.error) {
//             res.status(201).send({
//                 message: employee.error.message
//             });
//             return
//         }
//         res.status(201).send({
//             _id: employee.id,
//             name: employee.name,
//             msg: `New employee created`
//         });
//     }
// });

// const updateEmployeeById = async (req, providedID) => {
//     const employee = await Employee.findOneAndUpdate({ id: providedID }, {
//         name: req.body.name,
//         surname: req.body.surname,
//         level: req.body.level,
//         salary: req.body.salary,
//     }, {
//         new: true
//     });

//     if (!employee) {
//         return false
//     }

//     return employee
// }


module.exports = router;