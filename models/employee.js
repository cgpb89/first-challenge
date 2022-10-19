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
        type: String,
        required: [true, 'Employee must have a level']
    },
    salary: {
        type: Number,
        required: [true, 'Employee must have a surname']
    },
    date: { type: Date, default: Date.now }
});


const Employee = mongoose.model('employees', employeeSchema);

module.exports = Employee;