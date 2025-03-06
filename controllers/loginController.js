const User = require("../models/loginModel");
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router(); // ✅ Use router instead of app

// ✅ Define registerUser function separately
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, licenseNo, adharNo } = req.body;
    const profileImage = req.file ? req.file.path : ""; // 🔥 Save image path


    // Check if all fields are provided
    if (!name || !email || !password || !phone || !licenseNo || !adharNo ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Create and save user
    const user = new User({ name, email, password, phone, licenseNo, adharNo, profileImage  });
    await user.save();

    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    res.status(400).json({ message: "Error registering user", error: err.message });
  }
};

// ✅ Define loginUser function separately
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "defaultsecret",
      { expiresIn: "20d" }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

// ✅ Export the router, not just the functions
module.exports = {registerUser,loginUser};
