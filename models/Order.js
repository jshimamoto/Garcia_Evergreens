const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema( {
	products: {
		type: Array,
		required: [true, 'Please select products to include on the quote'],
	},
	price: {
		type: Number,
		default: 0
	},
	notes: {
		type: String,
		required: false,
		default: "",
		maxLength: 500
	},
	status: {
		type: String,
		enum: ['pending', 'denied', 'approved', 'fulfilled'],
		default: 'pending'
	},
	requestedBy: {
		type: String,
		required: [true, 'Please provide a name to associate with this order']
	},
	requestedEmail: {
		type: String,
		match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please provide valid email'],
		required: [true, 'Please provide an email to send a copy of this order to']
	}
}, {timestamps:true});

module.exports = mongoose.model('Order', OrderSchema)