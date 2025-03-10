const multer = require("multer");
const path = require("path");

// Ensure the uploads folder exists
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../uploads")); // Ensure this folder exists
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size (5MB)
});

// Expecting multiple file uploads with specific field names
const uploadFields = upload.fields([
    { name: "fuelReceiptImage", maxCount: 1 },
    { name: "transactionImage", maxCount: 1 },
    { name: "tyrePunctureImage", maxCount: 1 },
]);

module.exports = uploadFields;
