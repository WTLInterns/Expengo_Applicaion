
// // const express = require("express");
// // const router = express.Router();
// // const { addCab, getCabByNumber } = require("../controllers/cabController");
// // router.post("/add", addCab);
// // router.get("/:cabNo", getCabByNumber);

// // module.exports = router;




const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { addCab, getCabByNumber, getCabs } = require("../controllers/cabController");


router.post("/add", upload, addCab);
router.get("/:cabNo", getCabByNumber);
router.get("/", getCabs);

module.exports = router;

