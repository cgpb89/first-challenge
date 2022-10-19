const mongoose = require('mongoose');

const countersSchema = new mongoose.Schema({
    employee_id: {
        type: String
    },
	sequence_value: {
        type: Number
    }
});


const Counters = mongoose.model('counters', countersSchema);

module.exports = Counters;