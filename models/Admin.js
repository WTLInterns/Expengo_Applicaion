// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

// const AdminSchema = new mongoose.Schema(
//   {
//     profileImage: { type: String },
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     role: { type: String, default: "admin" },
//     assignedDrivers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Driver" }],
//     phone: { type: String, required: true },
//     status: { type: String, default: "Active" },
//     assignedCabs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Cab" }],
//     // verifyToken: { type: String, default: null } // ✅ Store the reset token
//   },
//   { timestamps: true }
// );

// // ✅ Compare password method
// AdminSchema.methods.comparePassword = async function (candidatePassword) {
//   return bcrypt.compare(candidatePassword, this.password);
// };

// module.exports = mongoose.model("Admin", AdminSchema);




const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const AdminSchema = new mongoose.Schema(
  {
    profileImage: { type: String },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "admin" },
    assignedDrivers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Driver" }],
    phone: { type: String, required: true },
    status: { type: String, default: "Active" },
    assignedCabs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Cab" }],
  },
  { timestamps: true }
);

// Method to compare password when logging in
AdminSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("Admin", AdminSchema);



