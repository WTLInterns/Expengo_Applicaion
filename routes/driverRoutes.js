const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Driver = require("../models/loginModel");
const { protect } = require("../middleware/authMiddleware");


const router = express.Router();

// Get Driver Profile
router.get("/profile", async (req, res) => {
  try {
    const driver = await Driver.find().select("-password");
    if (!driver) return res.status(404).json({ message: "Driver not found" });

    res.json(driver);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update Driver Profile
router.put("/profile/:id", async (req, res) => {
  try {
    const { name, contact } = req.body;
    const updatedDriver = await Driver.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select("-password");

    res.json(updatedDriver);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete Driver Account
router.delete("/profile/:id", async (req , res) => {
  try {
    await Driver.findByIdAndDelete(req.params.id);
    res.json({ message: "Driver account deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
