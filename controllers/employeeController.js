const Employee = require('../models/employee');
const { generateNewJWT } = require('../auth/auth');
const logger = require('../logger')

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
    logger.debug('Employee list found')
    return res.status(201).json({token: generateNewJWT(req.headers.authorization), employees: employees});
};

exports.getEmployee = async (req, res) => {
    const employee = await Employee.findOne({ id: req.params.id });
    if (!employee) {
        logger.debug('Employee not found with ID: ' + req.params.id)
        return res.status(404).send('Employee not found with ID: ' + req.params.id);
    }
    logger.debug('Employee found')
    return res.status(201).json({token: generateNewJWT(req.headers.authorization), employee: employee});
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
        if (err) {
            logger.error(err)
            return res.send(err)
        }
        logger.debug(employee.name + " saved to employee collection.")
    })

    if (employee.validateSync()) {
        logger.debug(employee.validateSync().message)
        return res.status(201).json({
            message: employee.validateSync().message
        });
    } else {
        logger.debug(`Employee retrieved to user`)
        return res.status(201).json({
            token: generateNewJWT(req.headers.authorization),
            _id: employee.id,
            name: employee.name
        });
    }
};

exports.updateEmployee = async (req, res) => {
    const employee = await updateEmployeeById(req, req.params.id);
    if (!employee) {
        logger.debug("Employee does not exist")
        return res.status(404).send("Employee does not exist");
    }

    logger.debug(`Employee with ID: ${employee.id} was update successfully`)

    return res.status(201).json({
        message: `Employee with ID: ${employee.id} was update successfully`,
        token: generateNewJWT(req.headers.authorization)
    });
}

exports.deleteEmployee = async (req, res) => {
    const employee = await Employee.findOneAndDelete({ id: req.params.id });

    if (!employee) {
        logger.info('Employee does not exist')
        return res.status(404).send("Employee does not exist");
    }
    logger.info('Employee deleted')
    return res.status(200).json({ token: generateNewJWT(req.headers.authorization), message: "Employee deleted" });
};

// This approach is not recommended. Such validation must be avoid in the FE and use simple post to insert or put to update
exports.customEmployee = async (req, res) => {
    if (req.body.id) {
        const employee = await updateEmployeeById(req, parseInt(req.body.id))
        if (!employee) {
            const employee = await addEmployee(req)
            logger.info(`Employee create with custom ID: ${employee.id}`)
            return res.status(201).json({
                _id: employee.id,
                name: employee.name,
                msg: "Employee create with custom ID",
                token: generateNewJWT(req.headers.authorization)
            });
        }
        logger.info(`Employee updated with custom ID: ${employee.id}`)
        return res.status(201).json({
            _id: employee.id,
            name: employee.name,
            msg: `Employee updated with ID:${employee.id}`,
            token: generateNewJWT(req.headers.authorization)
        });
    } else {
        const employee = await addEmployee(req)
        if (employee.error) {
            logger.error(employee.error.message)
            return res.status(201).send({
                message: employee.error.message
            });
            
        }
        logger.info(`New employee created with ID: ${employee.id}`)
        return res.status(201).json({
            _id: employee.id,
            name: employee.name,
            msg: `New employee created`,
            token: generateNewJWT(req.headers.authorization)
        });
    }
};

