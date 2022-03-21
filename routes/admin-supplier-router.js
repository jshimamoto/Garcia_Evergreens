const express = require('express');
const router = express.Router();
require('express-async-errors')

const Admin = require('../models/Admin')
const Product = require('../models/Product')
const Supplier = require('../models/Supplier')

const BadRequestError = require('../errors/bad-request')
const UnauthenticatedError = require('../errors/auth-error')

const StatusCodes = require('http-status-codes')

router.route('/')
	.get(async (req, res) => {
        const suppliers = await Supplier.find({})
		return res.status(StatusCodes.OK).json({suppliers})
	})
    .post(async (req, res) => {
        req.body.createdBy = req.admin.adminID
        const newSupplier = await Supplier.create(req.body);
        return res.status(StatusCodes.OK).json({data: newSupplier, msg: "Successfully submitted"})
    })

module.exports = router;
