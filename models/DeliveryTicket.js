const mongoose = require("mongoose");

const DeliveryTicketSchema = new mongoose.Schema({
    supplier: {
        type: String,
        required: [true, "Please provide the supplier for this inventory post"]
    },
    products: {
        type: Array,
        required: [true, "Please provide the product name for this inventory post"]
    },
    dateReceived: {
        type: Date,
        required: [true, "Please provide the date received for this inventory post"]
    },
    landOrigin: {
        type: String,
        required: [true, "Please provide land origin"]
    },
    status: {
        type: String,
        required: true,
        enum: ["open", "closed", "completed"],
        default: "open"
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

module.exports = mongoose.model("DeliveryTicket", DeliveryTicketSchema);