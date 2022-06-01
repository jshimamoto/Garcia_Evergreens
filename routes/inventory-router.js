const express = require("express");
const router = express.Router();
require("express-async-errors");

const Admin = require("../models/Admin");
const Product = require("../models/Product");
const InventoryPost = require("../models/InventoryPost");
const Box = require('../models/Box')

const BadRequestError = require("../errors/bad-request");
const UnauthenticatedError = require("../errors/auth-error");
const StatusCodes = require("http-status-codes");
const { findById } = require("../models/Admin");

// Get/Post-----------------------------------------------------------------------------------------------------------
//Get all and post
router.route("/")
    .get(async (req, res) => {
        const inventoryPosts = await InventoryPost.find({});
        return res.status(StatusCodes.OK).json({inventoryPosts});
    })
    .post(async (req, res) => {
        req.body.createdBy = req.user.username;        
        const newInventoryPost = await InventoryPost.create(req.body);
        return res.status(StatusCodes.OK).json({ data: newInventoryPost, msg: "Successfully submitted" });
    });

//Get all based off of who is logged in
router.route("/user")
    .get(async (req, res) => {
        const username = req.user.username
        const inventoryPosts = await InventoryPost.find({createdBy: username});
        return res.status(StatusCodes.OK).json({inventoryPosts});
    })

router.route("/export")
    .post(async (req, res) => {
        const exports = req.body.data;
        const updateStatus = async (array) => {
            for (let i = 0; i < array.length; i++) {
                let post = await InventoryPost.findById(array[i])
                post.status = "completed"
                await post.save()
            }
        }

        updateStatus(exports)
        res.status(StatusCodes.OK).send("success")
    })

// Update/Delete-----------------------------------------------------------------------------------------------------------------------------
router.route("/:id")
    // Get------------------------------------------------------------------------------------------
    .get(async (req, res) => {
        const { id: inventoryID } = req.params;
        const inventory = await InventoryPost.findOne({ _id: inventoryID });
        if (!inventory) {
            throw new BadRequestError("Inventory Post does not exist");
        }
        return res.status(StatusCodes.OK).json({ inventory });
    })
    // Patch-----------------------------------------------------------------------------------------
    .patch(async (req, res) => {
        const {
            body: {
                supplier,
                product,
                productID,
                qtyReceived,
                qtyProcessed,
                lostProduct,
                premiumBoxes,
                basicBoxes,
                totalBoxes,
                notes,
                deltas
            },
            user: { userID },
            params: { id: inventoryID },
        } = req;
        
        if (supplier === "" || product === "" || productID === "" || qtyReceived === "" || qtyProcessed === "" || lostProduct === "" || premiumBoxes === "" || basicBoxes === "" || totalBoxes === "") {
            throw new BadRequestError("Please fill out all required fields");
        }

        const updateInventory = async (productID, newQty, basicBoxesDelta, premiumBoxesDelta) => {
            let product = await Product.findById(productID);
            product.pendingInventory += newQty;
            product.inventory -= newQty
            await product.save()

            let basic = await Box.findById("624602839b74b6f206a7590d")
            basic.inventory += basicBoxesDelta;
            await basic.save()

            let premium = await Box.findById("624738f4d7b5f4b99197937d")
            premium.inventory += premiumBoxesDelta;
            await premium.save()
        }

        updateInventory(productID, qtyProcessed, deltas.premiumBoxesDelta, deltas.basicBoxesDelta)
        req.body.status = "submitted"
        const inventory = await InventoryPost.findByIdAndUpdate(
            { _id: inventoryID },
            req.body,
            { new: true, runValidators: true }
            );
        if (!inventory) {
            throw new BadRequestError(`No inventory post with ID ${inventoryID}`);
        }
        return res.status(StatusCodes.OK).json({ inventory });
    })
    // Delete-----------------------------------------------------------------------------------
    .delete(async (req, res) => {
        const {
            body:{
                productID,
                qtyProcessed,
                premiumBoxes,
                basicBoxes,
                status
            },
            user: { userID },
            params: {id}
        } = req;

        const updateInventory = async (productID, qtyDelta, basicBoxes, premiumBoxes) => {
            let product = await Product.findById(productID);
            if (status === "submitted") {
                product.pendingInventory -= qtyDelta;
            } else {
                product.inventory -= qtyDelta
            }
            await product.save()

            let basic = await Box.findById("624602839b74b6f206a7590d")
            basic.inventory += basicBoxes;
            await basic.save()

            let premium = await Box.findById("624738f4d7b5f4b99197937d")
            premium.inventory += premiumBoxes;
            await premium.save()
        }

        updateInventory(productID, qtyProcessed, basicBoxes, premiumBoxes)

        const inventory = await InventoryPost.findByIdAndDelete({_id: id});
        if (!inventory) {
            throw new BadRequestError(`No inventory post with ID ${inventoryID}`);
        }
        return res.status(StatusCodes.OK).send("Inventory Post successfully removed");
    });

// Approve-----------------------------------------------------------------------------------------------------------
router.route('/approve/:id')
    .patch(async (req,res) => {
        const {
            body: {
                status
            },
            user: { userID },
            params: { id: inventoryID },
        } = req;

        const inventory = await InventoryPost.findByIdAndUpdate(
            { _id: inventoryID },
            req.body,
            { new: true, runValidators: true }
            );
        if (!inventory) {
            throw new BadRequestError(`No inventory post with ID ${inventoryID}`);
        }
        return res.status(StatusCodes.OK).json({ inventory });
    })

module.exports = router;
