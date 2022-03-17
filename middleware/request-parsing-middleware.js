const Product = require('../models/Product')

const RequestParsingMiddleware = async (req, res, next) => {
	const productList = req.body.products;

	class requestElement {
		constructor(name, id, qty, unitPrice, totalPrice) {
			this.name = name,
			this.id = id,
			this.qty = qty,
			this.unitPrice = unitPrice,
			this.totalPrice = totalPrice
		}
	}

	const requestArray = await Promise.all(productList.map(async item => {
		const requestProduct = await Product.findById(item.id);

		let unitPrice = 0

		if (item.qty < 10) {
			unitPrice = requestProduct.price;
		} else if (item.qty < 50) {
			unitPrice = requestProduct.price * 0.9;
		} else if (item.qty < 100) {
			unitPrice = requestProduct.price * 0.8;
		} else if (item.qty < 200) {
			unitPrice = requestProduct.price * 0.7;
		} else if (item.qty < 500) {
			unitPrice = requestProduct.price * 0.6;
		} else {
			unitPrice = requestProduct.price * 0.5;
		}

		let totalPrice = unitPrice * item.qty;
		return new requestElement(item.name, item.id, item.qty, unitPrice, totalPrice)
	}))
		
	req.body.requestArray = requestArray;
	next()
}

module.exports = RequestParsingMiddleware

// req structure:
// {
// 	{
// 		name:'product1',
// 		id: product1._id,
// 		qty: number,
// 	},
// 	{
// 		name:'product2',
// 		id: product2._id,
// 		qty: number,
// 	}
// }

// parsing ->
// {
// 	{
// 		name:'product1',
// 		id: product._id
// 		qty: number,
// 		unitPrice:number,
//		totalPrice:number
// 	},
//	{
// 		name:'product2'
// 		id: product._id
// 		qty: number,
// 		unitPrice:number,
//		totalPrice:number
// 	}
// }