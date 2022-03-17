const express = require('express');
const router = express.Router();
require('express-async-errors')

const Admin = require('../models/Admin')
const Product = require('../models/Product')
const Order = require('../models/Order')
const Quote = require('../models/Quote')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const {BadRequestError, UnauthenticatedError} = require('../errors')
const StatusCodes = require('http-status-codes')

// Login/Create Admin----------------------------------------------------------------------------------------------------------
router.route('/')
	.post( async (req, res, next) => {
		const {email, password} = req.body;
		if (!email || !password) {
			throw new BadRequestError('Please provide email and password');
		}
		const admin = await Admin.findOne({email})
		if (!admin) {
			throw new UnauthenticatedError('Invalid credentials')
		}
		const isPasswordCorrect = await admin.comparePassword(password)
		if (!isPasswordCorrect) {
			throw new UnauthenticatedError('Invalid credentials')
		}
		const token = admin.createJWT();
		return res.status(StatusCodes.OK).json({admin: {username: admin.username, id: admin._id}, token})
	})

router.route('/register')
	.post( async (req, res, next) => {
		const admin = await Admin.create({...req.body});
		const token = admin.createJWT();
		return res.status(StatusCodes.CREATED).json({admin: admin.username, id: admin._id, token})
	})

router.route('/createAdmin')
	.post(async (req,res) => {
		res.send('create new admin')
	})

// Admin Dashboard----------------------------------------------------------------------------------------------------------
router.route('/dashboard/requests')
	.get(async (req, res) => {
		const quotes = await Quote.find({})
		const orders = await Order.find({})
		return res.status(StatusCodes.OK).json({quotes, orders})
	})

// Inventory----------------------------------------------------------------------------------------------------------


module.exports = router