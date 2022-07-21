const mongoose = require('mongoose')

const BoxSchema = new mongoose.Schema( {
	name: {
		type: String,
		required: [true, 'Please provide box type.'],
		unique: true
	},
	inventory: {
		type: Number,
		required: [true, 'Please input an initial inventory'],
		default: 0
	},
	// pendingInventory: {
	// 	type: Number,
	// 	required: [true, 'Please input initial pending inventory'],
	// 	default: 0
	// },
	notes: {
		type: String,
		required: false,
		default: "",
		maxLength: 1000
	},
	createdBy: {
		type: String,
		required: [true, 'Please provide user']
	}
}, {timestamps:true});

module.exports = mongoose.model('Box', BoxSchema)