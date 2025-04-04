const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware"); // ✅ Correct import
const { registerUser, loginUser } = require("../controllers/loginController");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");

// Public routes
router.post("/register",authMiddleware, upload.single("profileImage"), registerUser);
// router.post("/login",authMiddleware,isAdmin, loginUser);
router.post("/login", loginUser);

module.exports = router;
