const mongoose = require('mongoose')

const SupplierSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please enter a name for this supplier'],
	},
	products: {
		type: Array,
		required: [true, 'Please enter the supplier\'s products']
	}
	address: {
		type: String,
		required: [true, 'Please enter supplier address, you can update later if needed'],
		default: 'Edit address here'
	}
	contacts: {
		type: Array,
		required: [true, 'Please enter a contact for this supplier, you can update later if needed'],
		default: 'Edit contact here',
	},
	notes: {
		type: String,
		default:'',
		maxLength: 1000
	}
})

module.exports = mongoose.model('Supplier', SupplierSchema)

// products structure:

// products: [
// 	{
// 		name: "product1" (pulls from product schemas or creates a new if doesnt exist. Drop down when selecting)
// 		totalDelivered: number,
// 		totalUseable: number,
// 		totalLost: number,
// 		percentLost: number (totalUseable / totalDelivered)
// 	},
// 	{
// 		name: "product2" (pulls from product schemas or creates a new if doesnt exist. Drop down when selecting)
// 		totalDelivered: number,
// 		totalUseable: number,
// 		totalLost: number,
// 		percentLost: number (totalUseable / totalDelivered)
// 	}
// ]