const mongoose = require('mongoose')

const InventoryAdminSchema = new mongoose.Schema({
	supplier: {
		type: String,
		required: [true, 'Please provide the supplier for this inventory post']
	},
	product: {
		type: String,
		required: [true, 'Please provide the product for this inventory post']
	},
	qtyReceived: {
		type: Number,
		required: [true, 'Please provide the quantity received for this inventory post']
	},
	qtyProcessed: {
		type: Number,
		required: [true, 'Please provide the quantity processed for this inventory post']
	},
	lostProduct: {
		type: Number,
		required: [true, 'Please provide the lost product for this inventory post']
	},
	premiumBoxes: {
		type: Number,
		required: [true, 'Please provide the premium boxes used for this inventory post']
	},
	basicBoxes: {
		type: Number,
		required: [true, 'Please provide the basic boxes used for this inventory post']
	},
	totalBoxes: {
		type: Number,
		required: [true, 'Please provide the total boxes used for this inventory post']
	},
	verified: {
		type: Boolean,
		required: true,
		default: false
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

module.exports = mongoose.model('InventoryAdmin', InventoryAdminSchema)

// structure

// breakdown: [
// 	{
// 		supplier: "supplier1",
// 		product: "product1"
// 		qtyReceived: number,
// 		qtyProcessed: number,
// 		lostProduct: number (qtyReceived - qtyProcessed),
// 		premiumBoxes: number,
// 		basicBoxes: number,
// 		totalBoxes: number (premiumBoxes + basicBoxes)
// 	},
// 	{
// 		supplier: "supplier1",
// 		product: "product2"
// 		qtyReceived: number,
// 		qtyProcessed: number,
// 		lostProduct: number (qtyReceived - qtyProcessed),
// 		premiumBoxes: number,
// 		basicBoxes: number,
// 		totalBoxes: number (premiumBoxes + basicBoxes)
// 	},
// 	{
// 		supplier: "supplier2",
// 		product: "product1"
// 		qtyReceived: number,
// 		qtyProcessed: number,
// 		lostProduct: number (qtyReceived - qtyProcessed),
// 		premiumBoxes: number,
// 		basicBoxes: number,
// 		totalBoxes: number (premiumBoxes + basicBoxes)
// 	},
// ]