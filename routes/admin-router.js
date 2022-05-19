const express = require('express');
const router = express.Router();
require('express-async-errors')

const Admin = require('../models/Admin')
const Employee = require('../models/Employee')
const Order = require('../models/Order')
const Quote = require('../models/Quote')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const {BadRequestError, UnauthenticatedError} = require('../errors')
const StatusCodes = require('http-status-codes')

// Login/Create Admin----------------------------------------------------------------------------------------------------------
router.route('/')
	//Login
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
	//Retrieve admins
	.get(async (req, res) => {
		const admins = await Admin.find({})
		return res.status(StatusCodes.OK).json({admins})
	})

router.route('/employee')
    .post( async (req, res, next) => {
		const {username, password} = req.body;
		if (!username || !password) {
			throw new BadRequestError('Please provide username and password');
		}
		const employee = await Employee.findOne({username})
		if (!employee) {
			throw new UnauthenticatedError('Employee not found')
		}
		const isPasswordCorrect = await employee.comparePassword(password)
		if (!isPasswordCorrect) {
			console.log("incorrect")
			throw new UnauthenticatedError('Invalid Credentials')
		}
		const token = employee.createJWT();
		return res.status(StatusCodes.OK).json({employee: {username: employee.username, id: employee._id}, token})
	})

router.route('/register')
	.post( async (req, res, next) => {
		const admin = await Admin.create({...req.body});
		return res.status(StatusCodes.CREATED).send("success")
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