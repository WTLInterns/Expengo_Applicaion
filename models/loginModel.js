const mongoose = require("mongoose"); // Add this line
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
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

     // OTP fields
  otp: String,
  otpExpires: Date,

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

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("Driver", userSchema);