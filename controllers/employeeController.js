const Employee = require('../models/employee');
const { validationResult } = require('express-validator');

// Other way to set the next available ID. Store it in another collection
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

async function getLastEmployee() {
    const lastEmployee = await Employee.findOne({}, {}, {
        sort: {
            _id: -1
        }
    }).then(function (res) {
        return res
    })
    return lastEmployee ? lastEmployee.id + 1 : 1
}

async function updateEmployeeById (req, providedID) {
    const employee = await Employee.findOneAndUpdate({ id: providedID }, {
        name: req.body.name,
        surname: req.body.surname,
        level: req.body.level,
        salary: req.body.salary,
    }, {
        new: true
    });

    if (!employee) {
        return false
    }

    return employee
}

async function addEmployee (req) {
    const idProvided = parseInt(req.body.id)
    const employee = new Employee({
        id: !isNaN(idProvided) ? idProvided : await getLastEmployee(),
        name: req.body.name,
        surname: req.body.surname,
        level: req.body.level,
        salary: req.body.salary,
    });
    await employee.save(function (err, employee) {
        if (err) return console.error(err);
        console.log(employee.name + " saved to employee collection.");
    })
    if (employee.validateSync()) {
        return { error: {
            message: employee.validateSync().message
        }
        };
    } else {
        return {
            _id: employee.id,
            name: employee.name
        };
    }
}

exports.employeeList = async (req, res) => {
    const employees = await Employee.find();
    return res.status(201).json(employees);
};

exports.getEmployee = async (req, res) => {
    const employee = await Employee.findOne({ id: req.params.id });
    if (!employee) {
        return res.status(404).send('Employee not found with ID: ' + req.params.id);
    }
    return res.status(201).json(employee);
}

exports.createEmployee = async (req, res) => {
    const employee = new Employee({
        id: await getLastEmployee(),
        name: req.body.name,
        surname: req.body.surname,
        level: req.body.level,
        salary: req.body.salary,
    });

    await employee.save(function (err, employee) {
        if (err) return console.error(err);
        console.log(employee.name + " saved to employee collection.");
    })

    if (employee.validateSync()) {
        console.log('entra sync')
        return res.status(201).json({
            message: employee.validateSync().message
        });
    } else {
        console.log('entra else')

        return res.status(201).json({
            _id: employee.id,
            name: employee.name
        });
    }
};

exports.updateEmployee = async (req, res) => {
    const employee = await updateEmployeeById(req, req.params.id);
    if (!employee) {
        return res.status(404).send("Employee does not exist");
    }

    return res.status(201).json({
        message: `Employee with ID: ${employee.id} was update successfully`
    });
}

exports.deleteEmployee = async (req, res) => {
    const employee = await Employee.findOneAndDelete({ id: req.params.id });

    if (!employee) {
        return res.status(404).send("Employee does not exist");
    }

    return res.status(200).send("Employee deleted");
};

// This approach is not recommended. Such validation must be avoid in the FE and use simple post to insert or put to update
exports.customEmployee = async (req, res) => {
    if (req.body.id) {
        const employee = await updateEmployeeById(req, parseInt(req.body.id))
        if (!employee) {
            const employee = await addEmployee(req)
            return res.status(201).json({
                _id: employee.id,
                name: employee.name,
                msg: "Employee create with custom ID"
            });
        }
        return res.status(201).json({
            _id: employee.id,
            name: employee.name,
            msg: `Employee updated with ID:${employee.id}`
        });
    } else {
        const employee = await addEmployee(req)
        if (employee.error) {
            return res.status(201).send({
                message: employee.error.message
            });
            
        }
        return res.status(201).json({
            _id: employee.id,
            name: employee.name,
            msg: `New employee created`
        });
    }
};

