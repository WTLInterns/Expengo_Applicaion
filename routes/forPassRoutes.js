const express = require("express");
const { sendResetOTP, forgotPassword, changePassword } = require("../controllers/forpassController");

const router = express.Router();

router.post("/sendpasswordlink", sendResetOTP);
router.get("/forgotpassword/:id/:token", forgotPassword); // ✅ FIXED: Added `id` parameter
router.post("/resetpassword/:id/:token", changePassword); // ✅ FIXED: Added `id` parameter

module.exports = router;
