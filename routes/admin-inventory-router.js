const express = require("express");
const router = express.Router();
require("express-async-errors");
const {parseAsync} = require('json2csv');
const {Parser} = require('json2csv');


const Admin = require("../models/Admin");
const Product = require("../models/Product");
const InventoryPost = require("../models/InventoryPost");
const Box = require('../models/Box')

const BadRequestError = require("../errors/bad-request");
const UnauthenticatedError = require("../errors/auth-error");
const StatusCodes = require("http-status-codes");

// Get/Post-----------------------------------------------------------------------------------------------------------
router.route("/export")
    .post(async (req, res) => {
        const data = []
        for (const key of Object.key(req.body)) {
            data.push(req.body[key])
            console.log(data)
        }

        const fields = [
            {
                label: "Supplier",
                value:"supplier"
            },
            {
                label: "Product",
                value:"product"
            },
            {
                label: "Quanitity Received",
                value:"qtyReceived"
            },
            {
                label: "Quanitity Processed",
                value:"qtyProcessed"
            },
            {
                label: "Lost Product",
                value:"lostProduct"
            },
            {
                label: "Premium Boxes Used",
                value:"premiumBoxes"
            },
            {
                label: "Basic Boxes Used",
                value:"basicBoxes"
            },
            {
                label: "Total Boxes",
                value:"totalBoxes"
            },
            {
                label: "Created By",
                value:"createdBy"
            }
        ];

        const opts = { fields: fields, quote: '' };

        try {
            const jsonParser = new Parser(opts);
            const csv = parser.parse(data)
            console.log(csv)
            //res.setHeader('Content-disposition', 'attachment; filename=inventoryPostExport.csv');
            //res.set('Content-Type', 'text/csv')
            res.attachment('inventory_export.csv').send(csv)
            res.status(StatusCodes.OK)
        } catch (err) {
            console.log(err)
        }

        // jsonParser = new Parser({opts})
        // const csv = await jsonParser.parse(req.body);
    })

router.route("/")
    .get(async (req, res) => {
        const inventoryPosts = await InventoryPost.find({});
        return res.status(StatusCodes.OK).json({inventoryPosts});
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
