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
//const { findById } = require("../models/Admin");

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

router.route("/inventoryposts/:id")
    .get(async (req, res) => {
        const {id: deliveryID} = req.params
        const inventoryPosts = await InventoryPost.find({deliveryTicket: deliveryID});
        return res.status(StatusCodes.OK).json({inventoryPosts});
    })

// router.route("/export")
//     .post(async (req, res) => {
//         const exports = req.body.data;
//         const updateStatus = async (array) => {
//             for (let i = 0; i < array.length; i++) {
//                 let post = await InventoryPost.findById(array[i])
//                 post.status = "completed"
//                 await post.save()
//             }
//         }

//         updateStatus(exports)
//         res.status(StatusCodes.OK).send("success")
//     })

// Update/Delete-----------------------------------------------------------------------------------------------------------------------------
router.route("/:id")
    .get(async (req, res) => {
        const { id } = req.params
        const delivery = await DeliveryTicket.findById(id)
        res.status(StatusCodes.OK).json({delivery})
    })
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

    
module.exports = router;
