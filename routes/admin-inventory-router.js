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

// Get/Post-----------------------------------------------------------------------------------------------------------
router.route("/")
    .get(async (req, res) => {
        const inventoryPosts = await InventoryPost.find({});
        return res.status(StatusCodes.OK).json({ inventoryPosts });
    })
    .post(async (req, res) => {
        req.body.createdBy = req.user.username;
        const {productID, qtyProcessed, basicBoxes, premiumBoxes} = req.body
        req.body.productID = productID

        const updateInventory = async (productID, productQty, basicBoxes, premiumBoxes) => {
            let product = await Product.findById(productID)
            product.pendingInventory += productQty
            await product.save()

            let basic = await Box.findById("624602839b74b6f206a7590d")
            basic.inventory -= basicBoxes;
            await basic.save()

            let premium = await Box.findById("624738f4d7b5f4b99197937d")
            premium.inventory -= premiumBoxes;
            await premium.save()
        }

        updateInventory(productID, qtyProcessed, basicBoxes, premiumBoxes)

        const newInventoryPost = await InventoryPost.create(req.body);
        return res.status(StatusCodes.OK).json({ data: newInventoryPost, msg: "Successfully submitted" });
});

// Update/Delete-----------------------------------------------------------------------------------------------------------
router.route("/:id")
    .get(async (req, res) => {
        const { id: inventoryID } = req.params;
        const inventory = await InventoryPost.findOne({ _id: inventoryID });
        if (!inventory) {
            throw new BadRequestError("Inventory Post does not exist");
        }
        return res.status(StatusCodes.OK).json({ inventory });
    })
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
                status,
                notes,
                deltas
            },
            user: { userID },
            params: { id: inventoryID },
        } = req;
        
        if (supplier === "" || product === "" || productID === "" || qtyReceived === "" || qtyProcessed === "" || lostProduct === "" || premiumBoxes === "" || basicBoxes === "" || totalBoxes === "") {
            throw new BadRequestError("Please fill out all required fields");
        }

        const updateInventory = async (productID, qtyDelta, basicBoxesDelta, premiumBoxesDelta) => {
            let product = await Product.findById(productID);
            product.inventory += qtyDelta;
            await product.save()

            let basic = await Box.findById("624602839b74b6f206a7590d")
            console.log(basic)
            basic.inventory += basicBoxesDelta;
            await basic.save()

            let premium = await Box.findById("624738f4d7b5f4b99197937d")
            premium.inventory += premiumBoxesDelta;
            await premium.save()
        }

        updateInventory(productID, deltas.qtyDelta, deltas.premiumBoxesDelta, deltas.basicBoxesDelta)
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
    .delete(async (req, res) => {
        const {
            body:{
                productID,
                qtyProcessed,
                lostProduct,
                premiumBoxes,
                basicBoxes
            },
            user: { userID },
            params: { id: inventoryID },
        } = req;

        const updateProduct = async (ID, delta) => {
            let product = await Product.findById(ID);
            product.inventory -= delta;
            await product.save()
        }

        updateProduct(productID, qtyProcessed)

        const inventory = await InventoryPost.findByIdAndDelete({_id: inventoryID,});
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
                productID,
                qtyProcessed,
                status
            },
            user: { userID },
            params: { id: inventoryID },
        } = req;

        const updateProduct = async (productID, qtyDelta) => {
            let product = await Product.findById(productID);
            product.pendingInventory -= qtyDelta
            product.inventory += qtyDelta;
            await product.save()
        }

        updateProduct(productID, qtyProcessed)

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
    
// .get(async (req, res) => {
// 	return res.send('get admin inventory post')
// })
// .patch(async (req, res) => {
// 	return res.send('edit admin inventory post')
// })
// .delete(async (req, res) => {
// 	return res.send('delete admin inventory post')
// })

// create a new employee

module.exports = router;
