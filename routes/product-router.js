const express = require('express');
const router = express.Router();
require('express-async-errors')

const Product = require('../models/Product')
const Quote = require('../models/Quote')
const Order = require('../models/Order')

const RequestParsingMiddleware = require('../middleware/request-parsing-middleware')

const {BadRequestError, UnauthenticatedError} = require('../errors')
const StatusCodes = require('http-status-codes')

router.route('/')
	.get( async (req,res) => {
		const products = await Product.find({available: true})
		return res.status(StatusCodes.OK).json({products})
	})

router.route('/quote')
	.post(RequestParsingMiddleware, async (req,res) => {
		const requestArray = req.body.requestArray;
		let totalPrice = 0;
		requestArray.forEach((element) => {
			totalPrice += element.totalPrice
		})
		const quote = await Quote.create({
			products: requestArray,
			requestedEmail: req.body.email,
			requestedBy: req.body.name,
			price: totalPrice,
			notes: req.body.notes
			})
		return res.status(StatusCodes.OK).json({quote})
	})

router.route('/order')
	.post(RequestParsingMiddleware, async (req, res) => {
		const requestArray = req.body.requestArray;
		let totalPrice = 0;
		requestArray.forEach((element) => {
			totalPrice += element.totalPrice
		})
		const order = await Order.create({
			products: requestArray,
			requestedEmail: req.body.email,
			requestedBy: req.body.name,
			price: totalPrice,
			notes: req.body.notes
			})
		return res.status(StatusCodes.OK).json({order})
	})

module.exports = router


// products structure: 'product1._id & product1.price & qty;product2._id & product2.price & qty;'
// parsing ->
// {
// 	product1: {
// 		name:'product1',
// 		id: product._id
// 		price:number,
// 		qty: number
// 	},
// 	product2: {
// 		name:'product2'
// 		id: product._id,
// 		price: number,
// 		qty: number
// 	}
// }