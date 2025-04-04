
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { Resend } = require("resend");  
const Driver = require("../models/loginModel");
require("dotenv").config();

const router = express.Router();
const resend = new Resend(process.env.RESEND_API_KEY);

const registerUser = async (req, res) => {
  try {
    const { name, email, phone, licenseNo, adharNo, addedBy } = req.body;
    const profileImage = req.file ? req.file.path : "";

    if (!name?.trim() || !email?.trim() || !phone?.trim() || !licenseNo?.trim() || !adharNo?.trim()) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!/^\d{12}$/.test(adharNo)) {
      return res.status(400).json({ error: "Invalid Aadhaar number" });
    }

    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ error: "Invalid phone number" });
    }

    // ✅ Check if driver already exists
    const existingDriver = await Driver.findOne({ email });
    if (existingDriver) {
      return res.status(400).json({ error: "Driver with this email already exists" });
    }

    // ✅ Generate a secure random password
    const generatedPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    // ✅ Create driver
    const newDriver = new Driver({
      name,
      email,
      password: hashedPassword,  // 🔒 Store hashed password
      phone,
      licenseNo,
      adharNo,
      profileImage,
      addedBy,
    });

    await newDriver.save();

    // ✅ Send login details via Resend API
    await resend.emails.send({
      
        from: `"WTL Tourism Pvt. Ltd." <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Welcome to WTL Tourism - Driver Account Created",
        html: `
          <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
            <div style="text-align: center; padding-bottom: 20px;">
              <img src="https://your-logo-url.com/logo.png" alt="WTL Tourism Logo" style="max-width: 150px;">
            </div>
            <div style="background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
              <h2 style="color: #333; text-align: center;">Welcome to WTL Tourism</h2>
              <p style="color: #555; font-size: 16px;">Dear Driver,</p>
              <p style="color: #555; font-size: 16px;">Your driver account has been created successfully. Below are your login details:</p>
              <div style="background: #f3f3f3; padding: 15px; border-radius: 5px; font-size: 16px;">
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Password:</strong> ${generatedPassword}</p>
              </div>
              <p style="color: #555; font-size: 16px;">For security reasons, please log in and change your password immediately.</p>
              <div style="text-align: center; margin: 20px 0;">
                <a href="https://your-login-url.com" style="display: inline-block; padding: 12px 20px; font-size: 16px; color: #ffffff; background: #007BFF; text-decoration: none; border-radius: 5px;">Log in Now</a>
              </div>
              <p style="color: #777; font-size: 14px; text-align: center;">If you did not request this account, please ignore this email.</p>
            </div>
            <div style="text-align: center; margin-top: 20px; font-size: 14px; color: #777;">
              <p>Best Regards, <br><strong>WTL Tourism Pvt. Ltd.</strong></p>
              <p style="font-size: 12px;">123 Street, City, Country | contact@worldtriplink.com</p>
            </div>
          </div>
        `,
      
    });

    res.status(201).json({
      message: "User registered successfully. Password sent to email.",
      user: {
        _id: newDriver._id,
        name: newDriver.name,
        email: newDriver.email,
        phone: newDriver.phone,
        licenseNo: newDriver.licenseNo,
        adharNo: newDriver.adharNo,
        profileImage: newDriver.profileImage,
        addedBy: newDriver.addedBy,
        createdAt: newDriver.createdAt,
      },
    });
  } catch (err) {
    console.error("Register Error:", err.message);
    res.status(500).json({ message: "Error registering user", error: err.message });
  }
};

// ✅ Login Driver
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // ✅ Find user and explicitly select password
    const user = await Driver.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // ✅ Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // ✅ Generate JWT Token
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        licenseNo: user.licenseNo,
        adharNo: user.adharNo,
        profileImage: user.profileImage,
        addedBy: user.addedBy,
      },
    });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
};

// ✅ Export functions
module.exports = { registerUser, loginUser };



