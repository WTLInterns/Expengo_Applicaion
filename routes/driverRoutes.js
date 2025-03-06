const express = require("express");
const router = express.Router();
const { registerDriver, driverLogin, getDriverDetails } = require("../controllers/driverController");
const { auth } = require("../middleware/auth");  // Ensure this file exists

// Driver Registration
router.post("/register", registerDriver);

// Driver Login
router.post("/login", driverLogin);

// Get Driver Details by ID
router.get("/:driverId", getDriverDetails); // Removed 'auth' for debugging

module.exports = router;
