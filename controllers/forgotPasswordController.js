const User = require("../models/loginModel");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken"); // ✅ FIX: Import jwt
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ✅ Send Email Link for Reset Password
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
      { _id: userFind._id }, 
      { verifyToken: token }, 
      { new: true }
    );

    if (setusertoken) {
      const mailOptions = {
        from: process.env.EMAIL_USER, // ✅ FIX: Use env variable
        to: email,
        subject: "Password Reset Request",
        text: `Click on this link to reset your password: http://localhost:3000/forgotPassword/${userFind.id}/${setusertoken.verifyToken}`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("error", error);
          return res.status(500).json({ status: 500, message: "Email not sent" });
        } else {
          console.log("Email sent", info.response);
          return res.status(200).json({ status: 200, message: "Email sent Successfully" });
        }
      });
    }
  } catch (error) {
    return res.status(500).json({ status: 500, message: "Invalid user" });
  }
};

// ✅ Verify User for Forgot Password
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

    // ✅ Update Password
    await User.findByIdAndUpdate({ _id: id }, { password: newPassword });

    res.status(200).json({ status: 200, message: "Password changed successfully" });

  } catch (error) {
    return res.status(500).json({ status: 500, error });
  }
};

// ✅ Export Functions
module.exports = { sendResetOTP, forgotPassword, changePassword };
