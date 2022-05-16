const express = require("express");
const router = express.Router();
require("express-async-errors");

const Product = require("../models/Product");
const Invoice = require("../models/Invoice")
const Box = require('../models/Box')

const BadRequestError = require("../errors/bad-request");
const UnauthenticatedError = require("../errors/auth-error");
const StatusCodes = require("http-status-codes");

//Get and Post -------------------------------------------------------------------------------------------------
router.route('/')
	.get( async (req,res) => {
		console.log("get route")
	})
	.post( async (req,res) => {
		console.log("post route")
	})

//Edit -------------------------------------------------------------------------------------------------


//Get and Post -------------------------------------------------------------------------------------------------

module.exports = router