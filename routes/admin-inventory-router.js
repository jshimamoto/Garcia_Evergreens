const express = require('express');
const router = express.Router();
require('express-async-errors')

const Admin = require('../models/Admin')
const Product = require('../models/Product')
const InventoryAdmin = require('../models/InventoryAdmin')
//const InventoryEmployee = require('../models/InventoryEmployee')

const BadRequestError = require('../errors/bad-request')
const UnauthenticatedError = require('../errors/auth-error')
const StatusCodes = require('http-status-codes')

router.route('/')
	.get(async (req,res) => {
		const inventoryAdminPosts = await InventoryAdmin.find({})
		return res.status(StatusCodes.OK).json({inventoryAdminPosts})
	})
	.post( async (req, res) => {
		req.body.createdBy = req.admin.adminID
		// const breakdown = req.body.breakdown
		// const updateInventory = async (input) => {
		// 		let item = input[i];
		// 		let product = await Product.findById(input.product.id)
		// 		console.log(product.name)
		// 		product.inventory += item.qtyProcessed
		// 		await product.save()
		// }
		// const updateInventory = async (input) => {
		// 	for (let i = 0; i < input.length; i++) {
		// 		let item = input[i];
		// 		let product = await Product.findById(item.product.id)
		// 		console.log(product.name)
		// 		product.inventory += item.qtyProcessed
		// 		await product.save()
		// 	}
		// }

		// updateInventory(breakdown)
		const newInventoryAdmin = await InventoryAdmin.create(req.body)
		return res.status(StatusCodes.OK).json({data: newInventoryAdmin, msg: "Successfully submitted"})
	})

router.route('/:id')
	.get(async (req, res) => {
		return res.send('get admin inventory post')
	})
	.patch(async (req, res) => {
		return res.send('edit admin inventory post')
	})
	.delete(async (req, res) => {
		return res.send('delete admin inventory post')
	})



// create a new employee

module.exports = router