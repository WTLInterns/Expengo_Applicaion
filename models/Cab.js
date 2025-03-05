
const mongoose = require("mongoose");
const CabSchema = new mongoose.Schema({
    cabNo: { type: String, required: true, unique: true },
    tripDate: { type: String, required: true },
    toFrom: { type: String, required: true },
    fuelDetails: { type: String, required: true },
    fastTagDetails: { type: String, required: true },
    tyrePunctureDetails: { type: String, required: true }
});

module.exports = mongoose.model("Cab", CabSchema);

