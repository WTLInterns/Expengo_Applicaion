
const mongoose = require("mongoose");

const CabSchema = new mongoose.Schema({
    cabNumber: { type: String, required: true },
    location: {from: String,to: String,
        totalDistance: { type: Number, required: true }
    },
    fuel: {
        type: String,
        amount: Number,
        receiptImage: String,
        transactionImage: String
    },
    fastTag: {
        paymentMode: String,
        amount: Number
    },
    tyrePuncture: {
        image: String,
        repairAmount: Number
    },
    vehicleServicing: {
        requiredService: Boolean,
        details: String
    },
    otherProblems: {
        image: String,
        details: String,
        amount: Number
    },
    Driver: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" }, // Reference to Driver Model
}, { timestamps: true });

module.exports = mongoose.model("Cab", CabSchema);
