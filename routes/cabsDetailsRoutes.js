const express = require("express");
const router = express.Router();
const Cab = require("../models/CabsDetails");
// const upload = require("../middleware/uploadFields"); // Multer setup for Cloudinary
const upload = require("../middleware/uploadFields");
const { authMiddleware, isAdmin} = require("../middleware/authMiddleware");
const { driverAuthMiddleware } = require("../middleware/driverAuthMiddleware");

// ✅ 1️⃣ Add a New Cab (Admin Only)
// router.post("/add", authMiddleware, isAdmin, upload.single("cabImage"), async (req, res) => {
//     try {
//         const { cabNumber, insuranceNumber, insuranceExpiry, registrationNumber } = req.body;
//         const cabImage = req.file?.path; // Cloudinary URL

//         // ✅ 1. Check if all required fields are provided
//         if (!cabNumber || !insuranceNumber || !insuranceExpiry || !registrationNumber || !cabImage) {
//             return res.status(400).json({ error: "All fields are required" });
//         }

//         // // ✅ 2. Validate cab number format (optional but recommended)
//         // const cabNumberRegex = /^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/; // Example: MH12AB1234
//         // if (!cabNumberRegex.test(cabNumber)) {
//         //     return res.status(400).json({ error: "Invalid cab number format" });
//         // }

//         // ✅ 3. Check if cab already exists
//         const existingCab = await Cab.findOne({ cabNumber });
//         if (existingCab) {
//             return res.status(400).json({ error: "Cab number already exists" });
//         }

//         // ✅ 4. Validate insurance expiry date
//         // const today = new Date();
//         // const expiryDate = new Date(insuranceExpiry);
//         // if (expiryDate < today) {
//         //     return res.status(400).json({ error: "Insurance expiry date must be in the future" });
//         // }

//         // ✅ 5. Create a new Cab entry
//         const newCab = new Cab({
//             cabNumber,
//             insuranceNumber,
//             insuranceExpiry,
//             registrationNumber,
//             cabImage,
//             addedBy: req.admin.id, // Get admin ID from auth middleware
//         });

//         // ✅ 6. Save to the database
//         await newCab.save();

//         res.status(201).json({ message: "Cab added successfully", cab: newCab });
//     } catch (error) {
//         console.error("Error adding cab:", error);
//         res.status(500).json({ error: "Server error", details: error.message });
//     }
// });


router.patch('/add', authMiddleware, isAdmin, upload, async (req, res) => {
    try {
        console.log("📝 Request Body:", req.body);
        console.log("📂 Uploaded Files:", req.files);

        const { cabNumber, ...updateFields } = req.body;

        if (!cabNumber) {
            return res.status(400).json({ message: "Cab number is required" });
        }

        let existingCab = await Cab.findOne({ cabNumber });

        // Function to safely parse JSON
        const parseJSONSafely = (data, defaultValue = {}) => {
            if (!data) return defaultValue;
            try {
                return typeof data === "string" ? JSON.parse(data) : data;
            } catch (error) {
                console.error(`JSON Parsing Error for ${data}:`, error.message);
                return defaultValue;
            }
        };

        // 🖼️ Handle Uploaded Images
        const uploadedImages = {
            fuel: {
                receiptImage: req.files?.receiptImage ? req.files.receiptImage[0].path : existingCab?.fuel?.receiptImage,
                transactionImage: req.files?.transactionImage ? req.files.transactionImage[0].path : existingCab?.fuel?.transactionImage,
            },
            tyrePuncture: {
                image: req.files?.punctureImage ? req.files.punctureImage[0].path : existingCab?.tyrePuncture?.image,
            },
            otherProblems: {
                image: req.files?.otherProblemsImage ? req.files.otherProblemsImage[0].path : existingCab?.otherProblems?.image,
            },
            cabImage: req.files?.cabImage ? req.files.cabImage[0].path : existingCab?.cabImage,
        };

        const updateData = {
            cabNumber,
            insuranceNumber: updateFields.insuranceNumber || existingCab?.insuranceNumber,
            insuranceExpiry: updateFields.insuranceExpiry || existingCab?.insuranceExpiry,
            registrationNumber: updateFields.registrationNumber || existingCab?.registrationNumber,
            location: { ...existingCab?.location, ...parseJSONSafely(updateFields.location) },
            fuel: { ...existingCab?.fuel, ...parseJSONSafely(updateFields.fuel), ...uploadedImages.fuel },
            fastTag: { ...existingCab?.fastTag, ...parseJSONSafely(updateFields.fastTag) },
            tyrePuncture: { ...existingCab?.tyrePuncture, ...parseJSONSafely(updateFields.tyrePuncture), ...uploadedImages.tyrePuncture },
            vehicleServicing: { ...existingCab?.vehicleServicing, ...parseJSONSafely(updateFields.vehicleServicing) },
            otherProblems: { ...existingCab?.otherProblems, ...parseJSONSafely(updateFields.otherProblems), ...uploadedImages.otherProblems },
            cabImage: uploadedImages.cabImage || existingCab?.cabImage,
            addedBy: req.admin?.id || existingCab?.addedBy,
        };

        if (!existingCab) {
            // 🚀 Create a new cab if it does not exist
            const newCab = new Cab(updateData);
            await newCab.save();
            return res.status(201).json({ message: "New cab created successfully", cab: newCab });
        } else {
            // 🔄 Update existing cab
            const updatedCab = await Cab.findOneAndUpdate(
                { cabNumber },
                { $set: updateData },
                { new: true, runValidators: true }
            );
            return res.status(200).json({ message: "Cab data updated successfully", cab: updatedCab });
        }
    } catch (error) {
        console.error("🚨 Error updating/creating cab:", error.message);
        res.status(500).json({ message: "Error updating/creating cab", error: error.message });
    }
});

router.patch('/driver/add', driverAuthMiddleware, upload, async (req, res) => {
    try {
        console.log("📝 Request Body:", req.body);
        console.log("📂 Uploaded Files:", req.files);

        const { cabNumber, ...updateFields } = req.body;

        if (!cabNumber) {
            return res.status(400).json({ message: "Cab number is required" });
        }

        let existingCab = await Cab.findOne({ cabNumber });

        // Function to safely parse JSON
        const parseJSONSafely = (data, defaultValue = {}) => {
            if (!data) return defaultValue;
            try {
                return typeof data === "string" ? JSON.parse(data) : data;
            } catch (error) {
                console.error(`JSON Parsing Error for ${data}:`, error.message);
                return defaultValue;
            }
        };

        // 🖼️ Handle Uploaded Images
        const uploadedImages = {
            fuel: {
                receiptImage: req.files?.receiptImage ? req.files.receiptImage[0].path : existingCab?.fuel?.receiptImage,
                transactionImage: req.files?.transactionImage ? req.files.transactionImage[0].path : existingCab?.fuel?.transactionImage,
            },
            tyrePuncture: {
                image: req.files?.punctureImage ? req.files.punctureImage[0].path : existingCab?.tyrePuncture?.image,
            },
            otherProblems: {
                image: req.files?.otherProblemsImage ? req.files.otherProblemsImage[0].path : existingCab?.otherProblems?.image,
            },
            cabImage: req.files?.cabImage ? req.files.cabImage[0].path : existingCab?.cabImage,
        };

        const updateData = {
            cabNumber,
            // insuranceNumber: updateFields.insuranceNumber || existingCab?.insuranceNumber,
            // insuranceExpiry: updateFields.insuranceExpiry || existingCab?.insuranceExpiry,
            // registrationNumber: updateFields.registrationNumber || existingCab?.registrationNumber,
            location: { ...existingCab?.location, ...parseJSONSafely(updateFields.location) },
            fuel: { ...existingCab?.fuel, ...parseJSONSafely(updateFields.fuel), ...uploadedImages.fuel },
            fastTag: { ...existingCab?.fastTag, ...parseJSONSafely(updateFields.fastTag) },
            tyrePuncture: { ...existingCab?.tyrePuncture, ...parseJSONSafely(updateFields.tyrePuncture), ...uploadedImages.tyrePuncture },
            vehicleServicing: { ...existingCab?.vehicleServicing, ...parseJSONSafely(updateFields.vehicleServicing) },
            otherProblems: { ...existingCab?.otherProblems, ...parseJSONSafely(updateFields.otherProblems), ...uploadedImages.otherProblems },
            // cabImage: uploadedImages.cabImage || existingCab?.cabImage,
            // addedBy: req.admin?.id || existingCab?.addedBy,
        };

        if (!existingCab) {
            // 🚀 Create a new cab if it does not exist
            const newCab = new Cab(updateData);
            await newCab.save();
            return res.status(201).json({ message: "New cab created successfully", cab: newCab });
        } else {
            // 🔄 Update existing cab
            const updatedCab = await Cab.findOneAndUpdate(
                { cabNumber },
                { $set: updateData },
                { new: true, runValidators: true }
            );
            return res.status(200).json({ message: "Cab data updated successfully", cab: updatedCab });
        }
    } catch (error) {
        console.error("🚨 Error updating/creating cab:", error.message);
        res.status(500).json({ message: "Error updating/creating cab", error: error.message });
    }
});



// ✅ 2️⃣ Get All Cabs
router.get("/",  authMiddleware,isAdmin, async (req, res) => {
    try {
        const cabs = await Cab.find({addedBy:req.admin.id});
        res.status(200).json(cabs);
    } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
    }
});

// ✅ 3️⃣ Get a Single Cab by ID
router.get("/:id",  authMiddleware,isAdmin, async (req, res) => {
    try {
        const cab = await Cab.findById(req.params.id).populate("addedBy", "name email");
        if (!cab) return res.status(404).json({ error: "Cab not found" });

        res.status(200).json(cab);
    } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
    }
});

// ✅ 4️⃣ Update a Cab (Admin Only)
// router.put("/update/:id",  authMiddleware,isAdmin, upload.single("cabImage"), async (req, res) => {
//     try {
//         const { cabNumber, insuranceNumber, insuranceExpiry, registrationNumber } = req.body;
//         const cabImage = req.file?.path; // New Cloudinary URL if updated

//         const cab = await Cab.findById(req.params.id);
//         if (!cab) return res.status(404).json({ error: "Cab not found" });

//         // Update fields
//         cab.cabNumber = cabNumber || cab.cabNumber;
//         cab.insuranceNumber = insuranceNumber || cab.insuranceNumber;
//         cab.insuranceExpiry = insuranceExpiry || cab.insuranceExpiry;
//         cab.registrationNumber = registrationNumber || cab.registrationNumber;
//         if (cabImage) cab.cabImage = cabImage;

//         await cab.save();
//         res.status(200).json({ message: "Cab updated successfully", cab });
//     } catch (error) {
//         res.status(500).json({ error: "Server error", details: error.message });
//     }
// });

// ✅ 5️⃣ Delete a Cab (Admin Only)
router.delete("/delete/:id",  authMiddleware,isAdmin, async (req, res) => {
    try {
        const cab = await Cab.findById(req.params.id);
        if (!cab) return res.status(404).json({ error: "Cab not found" });

        await cab.deleteOne();
        res.status(200).json({ message: "Cab deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
    }
});

module.exports = router;
