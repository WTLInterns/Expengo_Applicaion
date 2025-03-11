const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const driverSchema = new mongoose.Schema(
  {
    profileImage: { type: String },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    phone: {
      type: String,
      required: true,
      length: 10,
      unique: true,
    },
    licenseNo: {
      type: String,
      required: true,
      unique: true,
    },
    adharNo: {
      type: Number,
      required: true,
      unique: true,
    },
    resetOTP: { type: Number }, // ✅ Stores OTP for password reset
    otpExpiry: { type: Date },  // ✅ OTP expiration time
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    verifyToken: {
      type: String,
    },
  },
  { timestamps: true }
);

// ✅ Hash password before saving
driverSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// ✅ Compare password method
driverSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("Driver", driverSchema);
