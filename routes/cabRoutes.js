
// const express = require("express");
// const router = express.Router();
// const { addCab, getCabByNumber } = require("../controllers/cabController");
// router.post("/add", addCab);
// router.get("/:cabNo", getCabByNumber);

// module.exports = router;

// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const path = require("path");
// const {
//   getCabs,
//   getCabById,
//   addCab,
//   updateCab,
//   deleteCab,
//   filterDate
// } = require("../controllers/cabController");

// // Configure multer for file storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/"); // Store images in 'uploads' folder
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
//   },
// });

// const upload = multer({ storage });

// // Define routes
// router.get("/", getCabs);
// router.get('/filter-cabs',filterDate);
// router.get("/:cabNumber", getCabById);
// router.post("/", upload.fields([
//   { name: "receiptImage", maxCount: 1 },
//   { name: "transactionImage", maxCount: 1 },
//   { name: "punctureImage", maxCount: 1 },
// ]), addCab);
// router.put("/:id", upload.fields([
//   { name: "receiptImage", maxCount: 1 },
//   { name: "transactionImage", maxCount: 1 },
//   { name: "punctureImage", maxCount: 1 },
// ]), updateCab);
// router.delete("/:id", deleteCab);
// // const express = require("express");
// // const router = express.Router();
// // const { addCab, getCabByNumber } = require("../controllers/cabController");
// // router.post("/add", addCab);
// // router.get("/:cabNo", getCabByNumber);

// // module.exports = router;




const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { addCab, getCabById, getCabs } = require("../controllers/cabController");


router.post("/add", upload, addCab);
router.get("/:cabNumber", getCabById);
router.get("/", getCabs);

module.exports = router;

