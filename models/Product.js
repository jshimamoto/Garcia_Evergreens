const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema( {
	name: {
		type: String,
		required: [true, 'Please provide a name for the product.'],
	},
	// price: {
	// 	type: Number,
	// 	required: [true, 'Please provide a price.'],
	// },
	inventory: {
		type: Number,
		required: [true, 'Please input an initial inventory'],
		default: 0
	},
	pendingInventory: {
		type: Number,
		required: [true, 'Please input initial pending inventory'],
		default: 0
	},
	available: {
		type: Boolean,
		required: true,
		default: true
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

module.exports = mongoose.model('Product', ProductSchema)