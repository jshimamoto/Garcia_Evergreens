const express = require('express');
const router = express.Router();
require('express-async-errors')

const Admin = require('../models/Admin')
const Product = require('../models/Product')
const Supplier = require('../models/Supplier')

const BadRequestError = require('../errors/bad-request')
const UnauthenticatedError = require('../errors/auth-error')

const StatusCodes = require('http-status-codes')

//Get/Post -------------------------------------------------------------------------------------------------------------------------------
router.route('/')
	.get(async (req, res) => {
        const suppliers = await Supplier.find({})
		return res.status(StatusCodes.OK).json({suppliers})
	})
    .post(async (req, res) => {
        req.body.createdBy = req.user.username
        const newSupplier = await Supplier.create(req.body);
        return res.status(StatusCodes.OK).json({data: newSupplier, msg: "Successfully submitted"})
    })

//Get Supplier-------------------------------------------------------------------------------------------------------------------------------
router.route('/:id')
    .get(async (req, res) => {
        const { supplierID: id } = req.query
        const supplier = await Supplier.findById(id)
        return res.status(StatusCodes.OK).json({supplier})
    })

module.exports = router;
