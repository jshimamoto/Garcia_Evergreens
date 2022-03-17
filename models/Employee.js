const mongoose = require('mongoose')

const EmployeeSchema = new mongoose.Schema( {
	name: {
		type: String,
		required: [true, 'Please provide a name for the Employee.'],
	},
	boxesProcessed: {
		type: Number,
		required: [true, 'Please set an initial value'],
		default: 0
	},
	boxesRejected: {
		type: Number,
		required: [true, 'Please set an initial value'],
		default: 0
	},
	status: {
		type: String,
		required: true,
		enum: ['pending', 'active', 'nonactive']
		default: 'active'
	},
	notes: {
		type: String,
		required: false,
		default: "",
		maxLength: 1000
	},
	createdBy: {
		type: mongoose.Types.ObjectId,
		ref: 'Admin',
		required: [true, 'Please provide admin']
	}
}, {timestamps:true});

module.exports = mongoose.model('Employee', EmployeeSchema)