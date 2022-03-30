const mongoose = require("mongoose");

const InventoryPostSchema = new mongoose.Schema({
    supplier: {
        type: String,
        required: [true, "Please provide the supplier for this inventory post"]
    },
    product: {
        type: String,
        required: [true, "Please provide the product name for this inventory post"]
    },
    productID: {
        type: String,
        required: [true, "Please provide the product ID for this inventory post"]
      },
    qtyReceived: {
        type: Number,
        required: [true, "Please provide the quantity received for this inventory post"]
    },
    qtyProcessed: {
        type: Number,
        required: [true, "Please provide the quantity processed for this inventory post"]
    },
    lostProduct: {
        type: Number,
        required: [true, "Please provide the lost product for this inventory post"]
    },
    premiumBoxes: {
        type: Number,
        required: [true, "Please provide the premium boxes used for this inventory post"]
    },
    basicBoxes: {
        type: Number,
        required: [true, "Please provide the basic boxes used for this inventory post"]
    },
    totalBoxes: {
        type: Number,
        required: [true, "Please provide the total boxes used for this inventory post"]
    },
    status: {
        type: String,
        required: true,
        enum: ["submitted", "approved", "completed"],
        default: "submitted"
    },
    notes: {
        type: String,
        required: false,
        default: "",
        maxLength: 1000,
    },
    createdBy: {
        type: String,
        required: [true, "Please provide user"]
    }
    },
    { timestamps: true }
);

module.exports = mongoose.model("InventoryPost", InventoryPostSchema);