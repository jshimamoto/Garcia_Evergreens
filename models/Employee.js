const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name for the Employee."],
    },
    phone: {
      type: String,
      required: [true, "Please provide phone"],
      default: "",
    },
    email: {
      type: String,
      required: [true, "Please provide an email."],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide valid email",
      ],
      unique: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "active", "nonactive"],
      default: "active",
    },
    notes: {
      type: String,
      required: false,
      default: "",
      maxLength: 1000,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "Admin",
      required: [true, "Please provide admin"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", EmployeeSchema);
