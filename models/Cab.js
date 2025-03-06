
const mongoose = require("mongoose");
const CabSchema = new mongoose.Schema({
    cabNo: { type: String, unique: true },
    tripDate: { type: Date, default: Date.now },
    // tripDate: { type: String, required: true, default: Date.now() },
    toFrom: { type: String },
    fuelDetails: { type: String },
    fastTagDetails: { type: String },
    tyrePunctureDetails: { type: String },
    Driver:{type: mongoose.Schema.Types.ObjectId, ref: 'Driver'},
    // licenseNumber: { type: String, required: true },

});

module.exports = mongoose.model("Cab", CabSchema);

