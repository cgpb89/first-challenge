const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true
    },
    name: {
        type: String,
        required: [true, 'Employee must have a name']

    },
    surname:  {
        type: String,
        required: [true, 'Employee must have a surname']
    },
    level: {
        type: Number,
        required: [true, 'Employee must have a level. Level must be number']
    },
    salary: {
        type: Number,
        required: [true, 'Employee must have a surname. Surname must be number']
    },
    date: { type: Date, default: Date.now }
});


const Employee = mongoose.model('employees', employeeSchema);

module.exports = Employee;