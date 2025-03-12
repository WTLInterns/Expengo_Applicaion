const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const User = require("../models/Admin"); // ✅ Import User model
require("dotenv").config();

// ✅ Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});3

// ✅ Send Email with Password Reset Link
const sendResetOTP = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(401).json({ message: 'Email is required' });
  }

  console.log('Received email:', email);

  try {
    const userFind = await User.findOne({ email: email });
    if (!userFind) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Generate Token
    const token = jwt.sign({ _id: userFind._id }, process.env.JWT_SECRET, { expiresIn: "2m" });

    // ✅ Save Token in Database
    const setusertoken = await User.findByIdAndUpdate(
      userFind._id, // ✅ Correct way to pass ID
      { verifyToken: token }, 
      { new: true } // ✅ Ensures the updated user document is returned
    );

    console.log("Generated Token:", token);
    console.log("Updated Token in DB:", setusertoken?.verifyToken);

    // ✅ Construct the reset link
    const resetToken = setusertoken?.verifyToken || token;
    const resetLink = `http://localhost:3000/forgotPassword/${userFind._id}/${resetToken}`;

    console.log("Reset Link:", resetLink);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      text: `Click on this link to reset your password: ${resetLink}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Email sending error:", error);
        return res.status(500).json({ status: 500, message: "Email not sent" });
      } else {
        console.log("Email sent:", info.response);
        return res.status(200).json({ status: 200, message: "Email sent Successfully" });
      }
    });

  } catch (error) {
    console.error("Error in sendResetOTP:", error);
    return res.status(500).json({ status: 500, message: "Internal Server Error" });
  }
};

// ✅ Verify User Token for Forgot Password
const forgotPassword = async (req, res) => {
  const { id, token } = req.params;

  try {
    const validUser = await User.findOne({ _id: id, verifyToken: token });
    if (!validUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!verifyToken) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    res.status(200).json({ status: 200, validUser });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    return res.status(500).json({ status: 500, error });
  }
};

// ✅ Change Password
const changePassword = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  try {
    const validUser = await User.findOne({ _id: id, verifyToken: token });
    if (!validUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!verifyToken) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // ✅ Hash Password
    const newPassword = await bcrypt.hash(password, 12);

    // ✅ Update Password and Remove Token
    await User.findByIdAndUpdate(id, { password: newPassword, verifyToken: null });

    res.status(200).json({ status: 200, message: "Password changed successfully" });

  } catch (error) {
    console.error("Error in changePassword:", error);
    return res.status(500).json({ status: 500, error });
  }
};

// ✅ Export Functions
module.exports = { sendResetOTP, forgotPassword, changePassword };
