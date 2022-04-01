const express = require('express');
const router = express.Router();
require('express-async-errors')

const Box = require('../models/Box')
const BoxPost = require('../models/BoxPost')

const BadRequestError = require('../errors/bad-request')
const UnauthenticatedError = require('../errors/auth-error')

const StatusCodes = require('http-status-codes')

// Create and View Boxes----------------------------------------------------------------------------------------------------------
router.route('/')
	.get( async (req, res) => {
		const boxes = await Box.find({});
		return res.status(StatusCodes.OK).json({boxes, count: boxes.length})
	})
	.post( async (req, res) => {
		req.body.createdBy = req.user.username
		const box = await Box.create(req.body);
		return res.status(StatusCodes.CREATED).json({box})
	})

// Box Inventory Posts----------------------------------------------------------------------------------------------------------
router.route('/inventory')
	.get( async (req, res) => {
		const boxPosts = await BoxPost.find({});
		return res.status(StatusCodes.OK).json({boxPosts})
    })

router.route('/inventory/new')
	.post( async (req, res) => {
		req.body.createdBy = req.user.username
        const {
            body: {
                boxID,
                qtyReceived
            }
        } = req
        const updateBox = async (boxID, qtyReceived) => {
            const box = await Box.findById(boxID)
            box.inventory += qtyReceived;
            await box.save()
        }
        updateBox(boxID, qtyReceived)
        const boxPost = await BoxPost.create(req.body);        
		return res.status(StatusCodes.CREATED).json({boxPost})
	})

// Get and Modify Box----------------------------------------------------------------------------------------------------------
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
			admin: {adminID},
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
		const {admin: {adminID}, params: {id: productID}} = req;
		const product = await Product.findByIdAndDelete({_id: productID})
		if (!product) {
			throw new BadRequestError(`No product with ID ${productID}`)
		}
		return res.status(StatusCodes.OK).send('Product successfully removed')
	})

module.exports = router