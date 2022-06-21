const mongoose = require('mongoose')

const SalesReceiptSchema = new mongoose.Schema({
	customer: {
		type: String,
		required: [true, 'Please provide a customer for this invoice']
	},
	products: {
		type: Array,
		required: [true, 'Please provide a products for this invoice.'],
	},
	notes: {
		type: String,
		required: false,
		default: "",
		maxLength: 1000
	},
	createdBy: {
		type: String,
        required: [true, 'Please supply user']
	}
}, {timestamps:true});

module.exports = mongoose.model('SalesReceipt', SalesReceiptSchema)