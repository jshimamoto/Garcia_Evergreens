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

//Get w/ filters
router.route("/filter")
    .get(async (req, res) => {
        const query = req.query
        const inventoryPosts = await InventoryPost.find(query)
        res.status(StatusCodes.OK).json({inventoryPosts})
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
    // Get------------------------------------------------------------------------------------------
    .get(async (req, res) => {
        const { id: inventoryID } = req.params;
        const inventory = await InventoryPost.findOne({ _id: inventoryID });
        if (!inventory) {
            throw new BadRequestError("Inventory Post does not exist");
        }
        return res.status(StatusCodes.OK).json({ inventory });
    })
    // Patch
    .patch(async (req,res) => {
        const { id: inventoryID } = req.body

        const inventory = await InventoryPost.findByIdAndUpdate(
            { _id: inventoryID },
            req.body,
            { new: true, runValidators: true }
            );
        if (!inventory) {
            throw new BadRequestError(`No inventory post with ID ${inventoryID}`);
        }
        return res.status(StatusCodes.OK).send("updated");
    })
    // Delete
    .delete(async (req, res) => {       
        const { inventoryID } = req.body
        const inventoryPost = await InventoryPost.findByIdAndDelete({_id: inventoryID})
        if (!inventoryPost) {
            throw new BadRequestError(`No ticket with ID ${inventoryID}`)
        }
        return res.status(StatusCodes.OK).send('Product successfully removed')
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
