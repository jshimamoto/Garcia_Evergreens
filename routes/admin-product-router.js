const express = require('express');
const router = express.Router();
require('express-async-errors')

//const Admin = require('../models/Admin')
const Product = require('../models/Product')

const BadRequestError = require('../errors/bad-request')
const UnauthenticatedError = require('../errors/auth-error')

const StatusCodes = require('http-status-codes')

// Create and View Products----------------------------------------------------------------------------------------------------------
router.route('/')
	.get( async (req, res) => {
		const products = await Product.find({});
		return res.status(StatusCodes.OK).json({products, count: products.length})
	})
	.post( async (req, res) => {
		req.body.createdBy = req.user.username
		const product = await Product.create(req.body);
		return res.status(StatusCodes.CREATED).json({product})
	})

// Get and Modify Product----------------------------------------------------------------------------------------------------------
router.route('/:id')
	.get(async (req, res) => {
		const {id: productID} = req.params
		const product = await Product.findOne({_id: productID})
		if (!product) {
			throw new BadRequestError('Product does not exist')
		}
		return res.status(StatusCodes.OK).json({product})
	})
	.patch(async (req, res) => {
		const {
			body: {name, notes},
			user: {username},
			params: {id: productID}
		} = req;
		if (name === '') {
			throw new BadRequestError('Please fill out all required fields')
		}
		const product = await Product.findByIdAndUpdate(
			{_id: productID},
			req.body,
			{new: true, runValidators: true}
			)
		if (!product) {
			throw new BadRequestError(`No product with ID ${productID}`)
		}
		return res.status(StatusCodes.OK).json({product})
	})
	.delete(async (req,res) => {
		const {user: {username}, params: {id: productID}} = req;
		const product = await Product.findByIdAndDelete({_id: productID})
		if (!product) {
			throw new BadRequestError(`No product with ID ${productID}`)
		}
		return res.status(StatusCodes.OK).send('Product successfully removed')
	})

module.exports = router