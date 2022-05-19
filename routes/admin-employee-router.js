const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs')
require("express-async-errors");

const Admin = require("../models/Admin");
const Employee = require("../models/Employee");
const InventoryPost = require("../models/InventoryPost")

const BadRequestError = require("../errors/bad-request");
const UnauthenticatedError = require("../errors/auth-error");
const StatusCodes = require("http-status-codes");

//Get Employees -------------------------------------------------------------------------------------------------------
router.route("/")
    .get(async (req, res) => {
        const employees = await Employee.find({});
        return res.status(StatusCodes.OK).json({ employees });
    })
    .post(async (req, res) => {
        req.body.createdBy = req.user.userID;
        const newEmployee = await Employee.create(req.body);
        return res.status(StatusCodes.OK).json({ data: newEmployee, msg: "Successfully submitted" });
});

//Info and update for profile admin
router.route("/profile/admin")
    .get(async (req, res) => {
        const admin = await Admin.findById(req.user.userID);
        if (!admin) {
            throw new BadRequestError("user does not exist");
        }
        return res.status(StatusCodes.OK).json({ admin });
    })
    .patch(async (req, res) => {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            const password = await bcrypt.hash(req.body.password, salt)
            const updateInfo = {
                ...req.body,
                password: password
            }
            const admin = await Admin.findByIdAndUpdate(req.user.userID, updateInfo, {new: true, runValidators: true})
        } else if (!req.body.password){
            const admin = await Admin.findByIdAndUpdate(req.user.userID, req.body, {new: true, runValidators: true})
        } else {
            throw new BadRequestError(`No admin with ID ${req.user.userID}`)
        }

        return res.status(StatusCodes.OK).send('updated successfully')
    })

//Info and update for profile employee
router.route("/profile/employee")
    .get(async (req, res) => {
        const employee = await Employee.findById(req.user.userID);
        if (!employee) {
            throw new BadRequestError("user does not exist");
        }
        return res.status(StatusCodes.OK).json({ employee });
    })
    .patch(async (req, res) => {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            const password = await bcrypt.hash(req.body.password, salt)
            const updateInfo = {
                ...req.body,
                password: password
            }
            const employee = await Employee.findByIdAndUpdate(req.user.userID, updateInfo, {new: true, runValidators: true})
            if (!employee) {
                throw new BadRequestError(`no id ${req.user.userID}`)
            }
        } else if (!req.body.password){
            const employee = await Employee.findByIdAndUpdate(req.user.userID, req.body, {new: true, runValidators: true})
        } else {
            throw new BadRequestError(`No employee with ID ${req.user.userID}`)
        }

        return res.status(StatusCodes.OK).send('updated successfully')
    })

router.route("/employee/:id")
    .get(async (req, res) => {
        const { id: employeeID } = req.params;
        const employee = await Employee.findById(employeeID);
        if (!employee) {
            throw new BadRequestError("Employee does not exist");
        }
        return res.status(StatusCodes.OK).json({ employee });
    })


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

module.exports = router;
