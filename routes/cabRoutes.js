
const express = require("express");
const router = express.Router();
const cabController = require("../controllers/cabController"); // Ensure correct path

// Route to add a cab
router.post("/add", cabController.addCab);

// Route to get cabs that have traveled more than 10,000 km
router.get("/list", cabController.getCabs);

module.exports = router;
