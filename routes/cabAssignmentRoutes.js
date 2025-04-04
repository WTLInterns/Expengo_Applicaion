const express = require('express');
const router = express.Router();
const { assignCab, getAssignCab, unassignCab } = require('../controllers/cabAssignmentController')
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");

// ✅ Assign a Cab to a Driver
router.post('/', authMiddleware,isAdmin ,assignCab)

// ✅ Get all assigned cabs with driver details
router.get('/', authMiddleware,isAdmin ,getAssignCab)

router.put('/', authMiddleware,isAdmin ,unassignCab)

module.exports = router;
