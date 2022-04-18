const express = require("express");
const router = express.Router();
require("express-async-errors");

const Admin = require("../models/Admin");
const Employee = require("../models/Employee");
const InventoryPost = require("../models/InventoryPost")

const BadRequestError = require("../errors/bad-request");
const UnauthenticatedError = require("../errors/auth-error");
const StatusCodes = require("http-status-codes");

router.route("/")
    .get(async (req, res) => {
        const employees = await Employee.find({});
        return res.status(StatusCodes.OK).json({ employees });
    })
    .post(async (req, res) => {
        req.body.createdBy = req.admin.adminID;
        const newEmployee = await Employee.create(req.body);
        return res.status(StatusCodes.OK).json({ data: newEmployee, msg: "Successfully submitted" });
});

router.route("/:id")
    .get(async (req, res) => {
        const { id: employeeID } = req.params;
        const employee = await Employee.findById(employeeID);
        if (!employee) {
            throw new BadRequestError("Employee does not exist");
        }
        return res.status(StatusCodes.OK).json({ employee });
    })
    // .patch(async (req, res) => {
    //     const {
    //         body: {
    //             supplier,
    //             product,
    //             productID,
    //             qtyReceived,
    //             qtyProcessed,
    //             lostProduct,
    //             premiumBoxes,
    //             basicBoxes,
    //             totalBoxes,
    //             notes,
    //             deltas
    //         },
    //         admin: { adminID },
    //         params: { id: inventoryID },
    //     } = req;
    //     if (supplier === "" || product === "" || productID === "" || qtyReceived === "" || qtyProcessed === "" || lostProduct === "" || premiumBoxes === "" || basicBoxes === "" || totalBoxes === "") {
    //         throw new BadRequestError("Please fill out all required fields");
    //     }
    //     const inventory = await InventoryPost.findByIdAndUpdate(
    //         { _id: inventoryID },
    //         req.body,
    //         { new: true, runValidators: true }
    //         );
    //     if (!inventory) {
    //         throw new BadRequestError(`No inventory post with ID ${inventoryID}`);
    //     }
    //     return res.status(StatusCodes.OK).json({ inventory });
    // })
    // .delete(async (req, res) => {
    //     const {
    //         body:{
    //             productID,
    //             qtyProcessed,
    //             lostProduct,
    //             premiumBoxes,
    //             basicBoxes
    //         },
    //         admin: { adminID },
    //         params: { id: inventoryID },
    //     } = req;
    //     const inventory = await InventoryPost.findByIdAndDelete({_id: inventoryID,});
    //     if (!inventory) {
    //         throw new BadRequestError(`No inventory post with ID ${inventoryID}`);
    //     }
    //     return res.status(StatusCodes.OK).send("Inventory Post successfully removed");
    // });

//Employee Inventory Posts------------------------------------------------------------------------------------
router.route("/inventory/:id")
    .get(async (req, res) => {
        const { id: employeeID } = req.params;
        const employee = await Employee.findById(employeeID)
        const inventoryPosts = await InventoryPost.find({createdBy: employee.username});
        if (!inventoryPosts) {
            throw new BadRequestError("Employee does not exist");
        }
        return res.status(StatusCodes.OK).json({ inventoryPosts });
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
