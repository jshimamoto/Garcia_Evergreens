const express = require("express");
const router = express.Router();
require("express-async-errors");

const Admin = require("../models/Admin");
const Product = require("../models/Product");
const DeliveryTicket = require("../models/DeliveryTicket");
const InventoryPost = require("../models/InventoryPost")
const Box = require('../models/Box')

const BadRequestError = require("../errors/bad-request");
const UnauthenticatedError = require("../errors/auth-error");
const StatusCodes = require("http-status-codes");

// Get/Post-----------------------------------------------------------------------------------------------------------
router.route("/")
    .get(async (req, res) => {
        const deliveryTickets = await DeliveryTicket.find({});
        return res.status(StatusCodes.OK).json({deliveryTickets});
    })
    .post(async (req, res) => {
        req.body.createdBy = req.user.username;
        const newDeliveryTicket = await DeliveryTicket.create(req.body);
        return res.status(StatusCodes.OK).json({ data: newDeliveryTicket, msg: "Successfully submitted" });
    });

// router.route("/open")
//     .get(async (req, res) => {
//         const deliveryTickets = await DeliveryTicket.find({status: "open"});
//         return res.status(StatusCodes.OK).json({deliveryTickets});
//     })

//Get w/ filters
router.route("/filter")
    .get(async (req, res) => {
        const query = req.query
        const deliveryTickets = await DeliveryTicket.find(query)
        res.status(StatusCodes.OK).json({deliveryTickets})
    })

//Get specific ticket
router.route("/:id")
    .get(async (req, res) => {
        const { id: id } = req.params
        const delivery = await DeliveryTicket.findById(id)
        res.status(StatusCodes.OK).json({delivery})
    })

//Gets all inventory posts associated with the delivery ticket
router.route("/inventoryposts/:id")
    .get(async (req, res) => {
        const {id: deliveryID} = req.params
        const inventoryPosts = await InventoryPost.find({deliveryTicket: deliveryID});
        return res.status(StatusCodes.OK).json({inventoryPosts});
    })

// Close Ticket-----------------------------------------------------------------------------------------------------------------------------
router.route("/close/:id")
    .patch(async (req, res) => {
        const { status, productsBoxed, deliveryID } = req.body

        const deliveryTicket = await DeliveryTicket.findByIdAndUpdate(
            { _id: deliveryID },
            {status},
            { new: true, runValidators: true }
            );

        if (!deliveryID) {
            throw new BadRequestError(`No delivery ticket with ID ${deliveryID}`);
        }

        const updateInventory = async (products) => {
            for (let i = 0; i < products.length; i++) {
                let temp = await Product.find({name: products[i].name})
                let product = temp[0]
                product.premiumBoxes = product.premiumBoxes + products[i].premiumBoxes;
                product.basicBoxes = product.basicBoxes + products[i].basicBoxes;
                await product.save();
            }
        }

        updateInventory(productsBoxed)

        const updateBoxes = async (products) => {
            for (let i = 0; i < products.length; i++) {
                let product = products[i]

                let temp = await Box.find({name: "Premium"});
                let premium = temp[0];
                premium.inventory -= product.premiumBoxes;
                await premium.save();

                let temp2 = await Box.find({name: "Basic"});
                let basic = temp2[0];
                basic.inventory -= product.basicBoxes;
                await basic.save();  
            }
        }

        updateBoxes(productsBoxed)

        return res.status(StatusCodes.OK).send('closed')
    })


// Reopen Ticket-----------------------------------------------------------------------------------------------------------------------------
router.route("/reopen/:id")
    .patch(async (req, res) => {
        const { status, productsBoxed, deliveryID } = req.body

        const deliveryTicket = await DeliveryTicket.findByIdAndUpdate(
            { _id: deliveryID },
            {status},
            { new: true, runValidators: true }
            );

        if (!deliveryID) {
            throw new BadRequestError(`No delivery ticket with ID ${deliveryID}`);
        }

        const updateInventory = async (products) => {
            for (let i = 0; i < products.length; i++) {
                let temp = await Product.find({name: products[i].name})
                let product = temp[0]
                product.premiumBoxes = product.premiumBoxes - products[i].premiumBoxes;
                product.basicBoxes = product.basicBoxes - products[i].basicBoxes;
                await product.save();
            }
        }

        updateInventory(productsBoxed)

        const updateBoxes = async (products) => {
            for (let i = 0; i < products.length; i++) {
                let product = products[i]

                let temp = await Box.find({name: "Premium"});
                let premium = temp[0];
                premium.inventory += product.premiumBoxes;
                await premium.save();

                let temp2 = await Box.find({name: "Basic"});
                let basic = temp2[0];
                basic.inventory += product.basicBoxes;
                await basic.save();  
            }
        }

        updateBoxes(productsBoxed)

        return res.status(StatusCodes.OK).send('closed')
    })

// Edit Ticket-----------------------------------------------------------------------------------------------------------------------------
router.route("/edit/:id")
    .patch(async (req, res) => {
        const { deliveryID, supplier, landOrigin, products, dateReceived, notes } = req.body

        const deliveryTicket = await DeliveryTicket.findByIdAndUpdate(
            { _id: deliveryID },
            {
                supplier,
                products,
                landOrigin,
                dateReceived,
                notes
            },
            { new: true, runValidators: true }
            );
        return res.status(StatusCodes.OK).send('closed')
    })

// Delete Ticket-----------------------------------------------------------------------------------------------------------------------------
router.route("/delete/:id")
    .delete(async (req, res) => {
        const { deliveryID } = req.body
        const deliveryTicket = await DeliveryTicket.findByIdAndDelete({_id: deliveryID})
        if (!deliveryTicket) {
            throw new BadRequestError(`No ticket with ID ${deliveryID}`)
        }
        return res.status(StatusCodes.OK).send('Product successfully removed')
    })
    
module.exports = router;
