const mongoose = require('mongoose')

const QuoteSchema = new mongoose.Schema( {
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
	requestedBy: {
		type: String,
		required: [true, 'Please provide a name to associate with this quote']
	},
	requestedEmail: {
		type: String,
		match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please provide valid email'],
		required: [true, 'Please provide an email to send this quote to']
	}
}, {timestamps:true});

module.exports = mongoose.model('Quote', QuoteSchema)