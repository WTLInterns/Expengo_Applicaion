const express = require("express");
const { adminLogin, registerAdmin } = require("../controllers/adminController");

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", adminLogin);

module.exports = router;
