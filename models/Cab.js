
// const mongoose = require("mongoose");
// const CabSchema = new mongoose.Schema({
//     cabNo: { type: String, unique: true },
//     tripDate: { type: Date, default: Date.now },
//     // tripDate: { type: String, required: true, default: Date.now() },
//     toFrom: { type: String },
//     fuelDetails: { type: String },
//     fastTagDetails: { type: String },
//     tyrePunctureDetails: { type: String },
//     Driver:{type: mongoose.Schema.Types.ObjectId, ref: 'Driver'},
//     // licenseNumber: { type: String, required: true },

// });

// // module.exports = mongoose.model("Cab", CabSchema);

const mongoose = require("mongoose");

const CabSchema = new mongoose.Schema({
    cabNumber: {
      type: String,
      required: true,
      unique: true,
    },
    location: {
      from: { type: String, required: true }, // Starting location
      to: { type: String, required: true }, // Destination location
      dateTime: { type: Date, default: Date.now }, // Auto-captured date & time
      totalDistance: { type: Number, required: false }, // Total calculated distance
    },
    fuel: {
      type: {
        type: String,
        enum: ["Cash", "Card"], // Payment types
        required: true,
      },
      receiptImage: { type: String }, // Image URL or file path
      transactionImage: { type: String }, // Image URL or file path (for Card)
      amount: { type: Number, required: true },
    },
    fastTag: {
      paymentMode: {
        type: String,
        enum: ["Online Deduction", "Cash", "Card"], // FastTag payment modes
        required: true,
      },
      amount: { type: Number },
      cardDetails: { type: String },
    },
    tyrePuncture: {
      image: { type: String }, // Image of puncture
      repairAmount: { type: Number },
    },
    vehicleServicing: {
      requiredService: { type: Boolean, default: false }, // Whether servicing is required
      details: { type: String }, // Details based on distance
    },
  });
  

const Cab = mongoose.model("Cab", CabSchema);

module.exports = Cab;
