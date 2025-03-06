// const express = require("express");
// const router = express.Router();
// const { adminLogin, registerAdmin, getCabAndDriverDetails } = require("../controllers/adminController");

// router.post("/register", registerAdmin);
// router.post("/login", adminLogin);
// router.get("/search/:cabNo", getCabAndDriverDetails);

// module.exports = router;


const express = require("express");
const router = express.Router();
const { adminLogin, registerAdmin, getCabAndDriverDetails } = require("../controllers/adminController"); // ✅ Ensure all functions are properly imported

router.post("/register", registerAdmin);
router.post("/login", adminLogin);
router.get("/search/:cabNo", getCabAndDriverDetails);

module.exports = router;
