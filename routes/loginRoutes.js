const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware"); // ✅ Correct import
const { registerUser, loginUser } = require("../controllers/loginController");
const { protect } = require("../middleware/authMiddleware");

// Public routes
router.post("/register", upload.single("profileImage"), registerUser);
router.post("/login", loginUser);

module.exports = router;
