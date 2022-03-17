const express = require('express');
const router = express.Router();
require('express-async-errors')

const Admin = require('../models/Admin')
const Product = require('../models/Product')

const BadRequestError = require('../errors/bad-request')
const UnauthenticatedError = require('../errors/auth-error')

const StatusCodes = require('http-status-codes')

router.route('/')
	.get(async (req, res) => {
		return res.send('supplier router')
	})

module.exports = router
