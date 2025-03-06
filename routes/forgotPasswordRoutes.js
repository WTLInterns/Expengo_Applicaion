const express = require("express");
const { sendResetOTP, forgotPassword, changePassword } = require("../controllers/forgotPasswordController");

const router = express.Router();

router.post("/sendpasswordlink", sendResetOTP);
router.get("/forgotpassword/:id/:token", forgotPassword);
router.post("/resetpassword/:id/:token", changePassword); // ✅ FIX: Use a specific path

module.exports = router;
