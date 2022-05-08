const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please provide a name for the product.'],
	},
	bunchesPerBox: {
		type: Number,
		required: [true, 'Please provide the number of bunches per box']
	},
	premiumBoxes: {
		type: Number,
		required: [true, 'Please provide initial inventory'],
		default: 0
	},
	basicBoxes: {
		type: Number,
		required: [true, 'Please provide initial inventory'],
		default: 0
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

module.exports = mongoose.model('Product', ProductSchema)