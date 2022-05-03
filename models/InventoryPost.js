const mongoose = require("mongoose");

const InventoryPostSchema = new mongoose.Schema({
    supplier: {
        type: String,
        required: [true, 'Please provide a supplier']
    },
    deliveryTicket: {
        type: mongoose.ObjectId,
        required: [true, "Post must be linked to a delivery ticket"]
    },
    products: {
        type: Array,
        required: [true, "Please provide the product name for this inventory post"]
    },
    dateProcessed: {
        type: Date,
        required: [true, "Please provide the date processed for this inventory post"]
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