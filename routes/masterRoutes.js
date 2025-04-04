const express = require('express');
const { registerMasterAdmin, adminLogin} = require('../controllers/masterController');
const router = express.Router();

// Register Master Admin
router.post('/register-master-admin', registerMasterAdmin);

// Master Admin Login
router.post('/login-master-admin', adminLogin);


// // Get total sub-admin count for a master admin
// router.get("/sub-admin-count/:masterAdminId", getSubAdminCount); // The correct route with parameter


module.exports = router;
