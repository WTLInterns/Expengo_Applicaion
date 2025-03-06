
const express = require("express");
const router = express.Router();
const { addCab, getCabByNumber } = require("../controllers/cabController");
router.post("/add", addCab);
router.get("/:cabNo", getCabByNumber);

module.exports = router;
