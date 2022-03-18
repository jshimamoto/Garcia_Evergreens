const express = require("express");
const router = express.Router();
require("express-async-errors");

const Admin = require("../models/Admin");
const Product = require("../models/Product");
const InventoryPost = require("../models/InventoryPost");

const BadRequestError = require("../errors/bad-request");
const UnauthenticatedError = require("../errors/auth-error");
const StatusCodes = require("http-status-codes");

router.route("/")
  .get(async (req, res) => {
    const inventoryPosts = await InventoryPost.find({});
    return res.status(StatusCodes.OK).json({ inventoryPosts });
  })
  .post(async (req, res) => {
    req.body.createdBy = req.admin.adminID;
    
    // const breakdown = req.body.breakdown
    // const updateInventory = async (input) => {
    // 		let item = input[i];
    // 		let product = await Product.findById(input.product.id)
    // 		console.log(product.name)
    // 		product.inventory += item.qtyProcessed
    // 		await product.save()
    // }
    // const updateInventory = async (input) => {
    // 	for (let i = 0; i < input.length; i++) {
    // 		let item = input[i];
    // 		let product = await Product.findById(item.product.id)
    // 		console.log(product.name)
    // 		product.inventory += item.qtyProcessed
    // 		await product.save()
    // 	}
    // }

    // updateInventory(breakdown)
    const newInventoryPost = await InventoryPost.create(req.body);
    return res.status(StatusCodes.OK).json({ data: newInventoryPost, msg: "Successfully submitted" });
});

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
        qtyReceived,
        qtyProcessed,
        lostProduct,
        premiumBoxes,
        basicBoxes,
        notes,
      },
      admin: { adminID },
      params: { id: inventoryID },
    } = req;
    if (name === "" || available === "" || price === "") {
      throw new BadRequestError("Please fill out all required fields");
    }
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
      admin: { adminID },
      params: { id: inventoryID },
    } = req;
    const inventory = await InventoryPost.findByIdAndDelete({_id: inventoryID,});
    if (!inventory) {
      throw new BadRequestError(`No inventory post with ID ${inventoryID}`);
    }
    return res
      .status(StatusCodes.OK)
      .send("Inventory Post successfully removed");
  });
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
