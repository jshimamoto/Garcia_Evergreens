const express = require("express");
const router = express.Router();
require("express-async-errors");

const Product = require("../models/Product");
const SalesReceipt = require("../models/SalesReceipt")
const Box = require('../models/Box')

const BadRequestError = require("../errors/bad-request");
const UnauthenticatedError = require("../errors/auth-error");
const StatusCodes = require("http-status-codes");

//Get and Post -------------------------------------------------------------------------------------------------
router.route('/')
	.get( async (req,res) => {
		const salesReceipts = await SalesReceipt.find({})
		res.status(StatusCodes.OK).json({salesReceipts})
	})
	.post( async (req,res) => {
		req.body.createdBy = req.user.username;
		const {products} = req.body
		const newSalesReceipt = await SalesReceipt.create(req.body);

		const updateInventory = async (products) => {
			for await (const item of products) {
				let temp = await Product.find({name: item.name});
				let product = temp[0];
				product.premiumBoxes -= item.premiumBoxes;
				product.basicBoxes -= item.basicBoxes;
				product.save()
			}
		}

		await updateInventory(products)

		return res.status(StatusCodes.OK).send("created")
	})

//Edit -------------------------------------------------------------------------------------------------


//Get and Post -------------------------------------------------------------------------------------------------

module.exports = router