const mongoose = require('mongoose')

const BoxPostSchema = new mongoose.Schema( {
	name: {
		type: String,
		required: [true, 'Please provide box type.'],
	},
    boxID: {
        type: String,
        required: [true, "Please provide box ID"]
    },
	qtyReceived: {
		type: Number,
		required: [true, 'Please provide amount to update'],
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

module.exports = mongoose.model('BoxPost', BoxPostSchema)