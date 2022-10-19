const Employee = require('../models/employee'),
    Counters = require('../models/counters');

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

exports.employeeList = async (req, res) => {
    const employees = await Employee.find();
    res.send(employees);
};

exports.getEmployee = async (req, res) => {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
        res.status(404).send('Employee not found with ID: ' + req.params.id);
    }
    res.send(employee);
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
        res.status(201).send({
            message: employee.validateSync().message
        });
    } else {
        res.status(201).send({
            _id: employee.id,
            name: employee.name
        });
    }
};

exports.updateEmployee = async (req, res) => {

    const employee = await Employee.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        surname: req.body.surname,
        level: req.body.level,
        salary: req.body.salary,
    });

    if (!employee) {
        res.status(404).send("Employee does not exist");
    }

    res.status(201).send({
        message: `Employee with ID: ${employee.id} was update successfully`
    });
}

exports.deleteEmployee = async (req, res) => {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
        res.status(404).send("Employee does not exist");
    }

    res.status(200).send("Employee deleted");
};
