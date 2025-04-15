// const express = require("express");
// const router = express.Router();
// const Cab = require("../models/CabsDetails");
// const upload = require("../middleware/uploadFields");
// const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");
// const { driverAuthMiddleware } = require("../middleware/driverAuthMiddleware");


// router.patch('/add', authMiddleware, isAdmin, upload, async (req, res) => {
//     try {
//         console.log("📝 Request Body:", req.body);
//         console.log("📂 Uploaded Files:", req.files);

//         const { cabNumber, ...updateFields } = req.body;

//         if (!cabNumber) {
//             return res.status(400).json({ message: "Cab number is required" });
//         }

//         let existingCab = await Cab.findOne({ cabNumber });

//         const parseJSONSafely = (data, defaultValue = {}) => {
//             if (!data) return defaultValue;
//             try {
//                 return typeof data === "string" ? JSON.parse(data) : data;
//             } catch (error) {
//                 console.error(`JSON Parsing Error for ${data}:`, error.message);
//                 return defaultValue;
//             }
//         };

//         const uploadedImages = {
//             fuel: {
//                 receiptImage: req.files?.receiptImage ? req.files.receiptImage[0].path : null,
//                 transactionImage: req.files?.transactionImage ? req.files.transactionImage[0].path : null,
//             },
//             tyrePuncture: {
//                 image: req.files?.punctureImage ? req.files.punctureImage[0].path : null,
//             },
//             otherProblems: {
//                 image: req.files?.otherProblemsImage ? req.files.otherProblemsImage[0].path : null,
//             },
//             vehicleServicing: {
//                 image: req.files?.vehicleServicingImage ? req.files.vehicleServicingImage[0].path : null,
//             },
//             cabImage: req.files?.cabImage ? req.files.cabImage[0].path : existingCab?.cabImage,
//         };

//         const parsedFuel = parseJSONSafely(updateFields.fuel);
//         const parsedFastTag = parseJSONSafely(updateFields.fastTag);
//         const parsedTyre = parseJSONSafely(updateFields.tyrePuncture);
//         const parsedService = parseJSONSafely(updateFields.vehicleServicing);
//         const parsedOther = parseJSONSafely(updateFields.otherProblems);

//         const updateData = {
//             cabNumber,
//             insuranceNumber: updateFields.insuranceNumber || existingCab?.insuranceNumber,
//             insuranceExpiry: updateFields.insuranceExpiry || existingCab?.insuranceExpiry,
//             registrationNumber: updateFields.registrationNumber || existingCab?.registrationNumber,
//             location: { ...existingCab?.location, ...parseJSONSafely(updateFields.location) },

//             fuel: {
//                 ...parsedFuel,
//                 amount: [
//                     ...(existingCab?.fuel?.amount || []),
//                     ...(Array.isArray(parsedFuel?.amount) ? parsedFuel.amount : [parsedFuel?.amount])
//                 ],
//                 receiptImage: [
//                     ...(existingCab?.fuel?.receiptImage || []),
//                     ...(uploadedImages.fuel.receiptImage ? [uploadedImages.fuel.receiptImage] : [])
//                 ],
//                 transactionImage: [
//                     ...(existingCab?.fuel?.transactionImage || []),
//                     ...(uploadedImages.fuel.transactionImage ? [uploadedImages.fuel.transactionImage] : [])
//                 ],

//             },

//             fastTag: {
//                 ...parsedFastTag,
//                 amount: [
//                     ...(existingCab?.fastTag?.amount || []),
//                     ...(Array.isArray(parsedFastTag?.amount) ? parsedFastTag.amount : [parsedFastTag?.amount])
//                 ],

//             },

//             tyrePuncture: {
//                 ...parsedTyre,
//                 repairAmount: [
//                     ...(existingCab?.tyrePuncture?.repairAmount || []),
//                     ...(Array.isArray(parsedTyre?.repairAmount) ? parsedTyre.repairAmount : [parsedTyre?.repairAmount])
//                 ],
//                 image: [
//                     ...(existingCab?.tyrePuncture?.image || []),
//                     ...(uploadedImages.tyrePuncture.image ? [uploadedImages.tyrePuncture.image] : [])
//                 ],

//             },

//             vehicleServicing: {
//                 ...parsedService,
//                 amount: [
//                     ...(existingCab?.vehicleServicing?.amount || []),
//                     ...(Array.isArray(parsedService?.amount) ? parsedService.amount : [parsedService?.amount])
//                 ],
//                 image: [
//                     ...(existingCab?.vehicleServicing?.image || []),
//                     ...(uploadedImages.vehicleServicing.image ? [uploadedImages.vehicleServicing.image] : [])
//                 ],

//             },

//             otherProblems: {
//                 ...parsedOther,
//                 amount: [
//                     ...(existingCab?.otherProblems?.amount || []),
//                     ...(Array.isArray(parsedOther?.amount) ? parsedOther.amount : [parsedOther?.amount])
//                 ],
//                 image: [
//                     ...(existingCab?.otherProblems?.image || []),
//                     ...(uploadedImages.otherProblems.image ? [uploadedImages.otherProblems.image] : [])
//                 ],

//             },

//             cabImage: uploadedImages.cabImage,
//             addedBy: req.admin?.id || existingCab?.addedBy,
//         };

//         if (!existingCab) {
//             const newCab = new Cab(updateData);
//             await newCab.save();
//             return res.status(201).json({ message: "New cab created successfully", cab: newCab });
//         } else {
//             const updatedCab = await Cab.findOneAndUpdate(
//                 { cabNumber },
//                 { $set: updateData },
//                 { new: true, runValidators: true }
//             );
//             return res.status(200).json({ message: "Cab data updated successfully", cab: updatedCab });
//         }
//     } catch (error) {
//         console.error("🚨 Error updating/creating cab:", error.message);
//         res.status(500).json({ message: "Error updating/creating cab", error: error.message });
//     }
// });

// router.patch('/driver/add', driverAuthMiddleware, upload, async (req, res) => {
//     try {
//         console.log("📝 Request Body:", req.body);
//         console.log("📂 Uploaded Files:", req.files);

//         const { cabNumber, ...updateFields } = req.body;

//         if (!cabNumber) {
//             return res.status(400).json({ message: "Cab number is required" });
//         }

//         let existingCab = await Cab.findOne({ cabNumber });

//         // Function to safely parse JSON
//         const parseJSONSafely = (data, defaultValue = {}) => {
//             if (!data) return defaultValue;
//             try {
//                 return typeof data === "string" ? JSON.parse(data) : data;
//             } catch (error) {
//                 console.error(`JSON Parsing Error for ${data}:`, error.message);
//                 return defaultValue;
//             }
//         };

//         // 🖼️ Handle Uploaded Images
//         const uploadedImages = {
//             fuel: {
//                 receiptImage: req.files?.receiptImage ? req.files.receiptImage[0].path : existingCab?.fuel?.receiptImage,
//                 transactionImage: req.files?.transactionImage ? req.files.transactionImage[0].path : existingCab?.fuel?.transactionImage,
//             },
//             tyrePuncture: {
//                 image: req.files?.punctureImage ? req.files.punctureImage[0].path : existingCab?.tyrePuncture?.image,
//             },
//             vehicleServicing: {
//                 image: req.files?.vehicleServicingImage ? req.files.vehicleServicingImage[0].path : existingCab?.vehicleServicing?.image,
//             },
//             otherProblems: {
//                 image: req.files?.otherProblemsImage ? req.files.otherProblemsImage[0].path : existingCab?.otherProblems?.image,
//             },
//             cabImage: req.files?.cabImage ? req.files.cabImage[0].path : existingCab?.cabImage,
//         };

//         const updateData = {
//             cabNumber,
//             // insuranceNumber: updateFields.insuranceNumber || existingCab?.insuranceNumber,
//             // insuranceExpiry: updateFields.insuranceExpiry || existingCab?.insuranceExpiry,
//             // registrationNumber: updateFields.registrationNumber || existingCab?.registrationNumber,
//             location: { ...existingCab?.location, ...parseJSONSafely(updateFields.location) },
//             fuel: { ...existingCab?.fuel, ...parseJSONSafely(updateFields.fuel), ...uploadedImages.fuel },
//             fastTag: { ...existingCab?.fastTag, ...parseJSONSafely(updateFields.fastTag) },
//             tyrePuncture: { ...existingCab?.tyrePuncture, ...parseJSONSafely(updateFields.tyrePuncture), ...uploadedImages.tyrePuncture },
//             vehicleServicing: { ...existingCab?.vehicleServicing, ...parseJSONSafely(updateFields.vehicleServicing), ...uploadedImages.vehicleServicing },
//             otherProblems: { ...existingCab?.otherProblems, ...parseJSONSafely(updateFields.otherProblems), ...uploadedImages.otherProblems },
//             // cabImage: uploadedImages.cabImage || existingCab?.cabImage,
//             // addedBy: req.admin?.id || existingCab?.addedBy,
//         };

//         if (!existingCab) {
//             //  Create a new cab if it does not exist
//             const newCab = new Cab(updateData);
//             await newCab.save();
//             return res.status(201).json({ message: "New cab created successfully", cab: newCab });
//         } else {
//             // 🔄 Update existing cab
//             const updatedCab = await Cab.findOneAndUpdate(
//                 { cabNumber },
//                 { $set: updateData },
//                 { new: true, runValidators: true }
//             );
//             return res.status(200).json({ message: "Cab data updated successfully", cab: updatedCab });
//         }
//     } catch (error) {
//         console.error("🚨 Error updating/creating cab:", error.message);
//         res.status(500).json({ message: "Error updating/creating cab", error: error.message });
//     }
// });



// // ✅ 2️⃣ Get All Cabs
// router.get("/", authMiddleware, isAdmin, async (req, res) => {
//     try {
//         const cabs = await Cab.find({ addedBy: req.admin.id });
//         res.status(200).json(cabs);
//     } catch (error) {
//         res.status(500).json({ error: "Server error", details: error.message });
//     }
// });

// // ✅ 3️⃣ Get a Single Cab by ID
// router.get("/:id", authMiddleware, isAdmin, async (req, res) => {
//     try {
//         const cab = await Cab.findById(req.params.id).populate("addedBy", "name email");
//         if (!cab) return res.status(404).json({ error: "Cab not found" });

//         res.status(200).json(cab);
//     } catch (error) {
//         res.status(500).json({ error: "Server error", details: error.message });
//     }
// });


// router.delete("/delete/:id", authMiddleware, isAdmin, async (req, res) => {
//     try {
//         const cab = await Cab.findById(req.params.id);
//         if (!cab) return res.status(404).json({ error: "Cab not found" });

//         await cab.deleteOne();
//         res.status(200).json({ message: "Cab deleted successfully" });
//     } catch (error) {
//         res.status(500).json({ error: "Server error", details: error.message });
//     }
// });

// module.exports = router;



const express = require("express");
const router = express.Router();
const Cab = require("../models/CabsDetails");
const upload = require("../middleware/uploadFields");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");
const { driverAuthMiddleware } = require("../middleware/driverAuthMiddleware");


// Route for updating or creating a new cab data
router.patch("/add", authMiddleware, isAdmin, upload, async (req, res) => {
    try {
        console.log("we are making cab")
        console.log("📝 Request Body:", req.body);
        
        console.log("📂 Uploaded Files:", req.files);

        const { cabNumber, ...updateFields } = req.body;
        if (!cabNumber) {
            return res.status(400).json({ message: "Cab number is required" });
        }

        let existingCab = await Cab.findOne({ cabNumber });
        // if (!existingCab) {
        //     return res.status(404).json({ message: "Cab not found" });
        // }

        const parseJSONSafely = (data, defaultValue = {}) => {
            if (!data) return defaultValue;
            try {
                return typeof data === "string" ? JSON.parse(data) : data;
            } catch (error) {
                console.error(`JSON Parsing Error for ${data}:`, error.message);
                return defaultValue;
            }
        };

        const calculateKmTravelled = (meterReadings) => {
            let totalMeters = 0;
            for (let i = 1; i < meterReadings.length; i++) {
                const diff = meterReadings[i] - meterReadings[i - 1];
                if (diff > 0) {
                    totalMeters += diff;
                }
            }
            return Math.round(totalMeters); // convert to KM
        };
        
        // Parse and handle incoming data fields
        const parsedFuel = parseJSONSafely(updateFields.fuel);
        const parsedFastTag = parseJSONSafely(updateFields.fastTag);
        const parsedTyre = parseJSONSafely(updateFields.tyrePuncture);
        const parsedService = parseJSONSafely(updateFields.vehicleServicing);
        const parsedOther = parseJSONSafely(updateFields.otherProblems);

        // Handle uploaded images
        const uploadedImages = {
            fuel: {
                receiptImage: req.files?.receiptImage?.[0]?.path || null,
                transactionImage: req.files?.transactionImage?.[0]?.path || null,
            },
            tyrePuncture: {
                image: req.files?.punctureImage?.[0]?.path || null,
            },
            otherProblems: {
                image: req.files?.otherProblemsImage?.[0]?.path || null,
            },
            vehicleServicing: {
                image: req.files?.vehicleServicingImage?.[0]?.path || null,
            },
            cabImage: req.files?.cabImage?.[0]?.path || existingCab?.cabImage,
        };

        // Update the existing meter readings and calculate kmTravelled
        let updatedMeter = [...(existingCab?.vehicleServicing?.meter || [])];

        if (parsedService?.meter) {
            const newMeter = Number(parsedService.meter);
            if (!isNaN(newMeter)) {
                updatedMeter.push(newMeter);
            }
        }

        const kmTravelled = calculateKmTravelled(updatedMeter);

        // Prepare update data for existing cab
        const updateData = {
            cabNumber,
            insuranceNumber: updateFields.insuranceNumber || existingCab?.insuranceNumber,
            insuranceExpiry: updateFields.insuranceExpiry || existingCab?.insuranceExpiry,
            registrationNumber: updateFields.registrationNumber || existingCab?.registrationNumber,
            location: { ...existingCab?.location, ...parseJSONSafely(updateFields.location) },
            fuel: { ...existingCab?.fuel, ...parsedFuel, ...uploadedImages.fuel },
            fastTag: { ...existingCab?.fastTag, ...parsedFastTag },
            tyrePuncture: { ...existingCab?.tyrePuncture, ...parsedTyre, ...uploadedImages.tyrePuncture },
            vehicleServicing: {
                ...existingCab?.vehicleServicing,
                ...parsedService,
                meter: updatedMeter,
                kmTravelled: kmTravelled,
                image: [
                    ...(existingCab?.vehicleServicing?.image || []),
                    ...(uploadedImages.vehicleServicing.image ? [uploadedImages.vehicleServicing.image] : []),
                ],
            },
            otherProblems: { ...existingCab?.otherProblems, ...parsedOther, ...uploadedImages.otherProblems },
            cabImage: uploadedImages.cabImage,
            addedBy: req.admin?.id || existingCab?.addedBy,
        };
        
        if (!existingCab) {
            const newCab = new Cab(updateData);
            await newCab.save();
            return res.status(201).json({ message: "New cab created successfully", cab: newCab });
        } else {
            const updatedCab = await Cab.findOneAndUpdate(
                { cabNumber },
                { $set: updateData },
                { new: true, runValidators: true }
            );

            return res.status(200).json({
                message: "Cab data updated successfully",
                cab: updatedCab,
            });
        }
    } catch (error) {
        console.error("🚨 Error updating/creating cab:", error.message);
        res.status(500).json({ message: "Error updating/creating cab", error: error.message });
    }
});

// Route for updating or creating a new driver-related cab data
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

        
        // Handle Uploaded Images
        const uploadedImages = {
            fuel: {
                receiptImage: req.files?.receiptImage ? req.files.receiptImage[0].path : existingCab?.fuel?.receiptImage,
                transactionImage: req.files?.transactionImage ? req.files.transactionImage[0].path : existingCab?.fuel?.transactionImage,
            },
            tyrePuncture: {
                image: req.files?.punctureImage ? req.files.punctureImage[0].path : existingCab?.tyrePuncture?.image,
            },
            vehicleServicing: {
                image: req.files?.vehicleServicingImage ? req.files.vehicleServicingImage[0].path : existingCab?.vehicleServicing?.image,
            },
            otherProblems: {
                image: req.files?.otherProblemsImage ? req.files.otherProblemsImage[0].path : existingCab?.otherProblems?.image,
            },
            cabImage: req.files?.cabImage ? req.files.cabImage[0].path : existingCab?.cabImage,
        };

        const updateData = {
            cabNumber,
            location: { ...existingCab?.location, ...parseJSONSafely(updateFields.location) },
            fuel: { ...existingCab?.fuel, ...parseJSONSafely(updateFields.fuel), ...uploadedImages.fuel },
            fastTag: { ...existingCab?.fastTag, ...parseJSONSafely(updateFields.fastTag) },
            tyrePuncture: { ...existingCab?.tyrePuncture, ...parseJSONSafely(updateFields.tyrePuncture), ...uploadedImages.tyrePuncture },
            vehicleServicing: { ...existingCab?.vehicleServicing, ...parseJSONSafely(updateFields.vehicleServicing), ...uploadedImages.vehicleServicing },
            otherProblems: { ...existingCab?.otherProblems, ...parseJSONSafely(updateFields.otherProblems), ...uploadedImages.otherProblems },
        };

        if (!existingCab) {
            const newCab = new Cab(updateData);
            await newCab.save();
            return res.status(201).json({ message: "New cab created successfully", cab: newCab });
        } else {
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
router.get("/", authMiddleware, isAdmin, async (req, res) => {
    try {
        const cabs = await Cab.find({ addedBy: req.admin.id });
        res.status(200).json(cabs);
    } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
    }
});

// ✅ 3️⃣ Get a Single Cab by ID
router.get("/:id", authMiddleware, isAdmin, async (req, res) => {
    try {
        const cab = await Cab.findById(req.params.id).populate("addedBy", "name email");
        if (!cab) return res.status(404).json({ error: "Cab not found" });

        res.status(200).json(cab);
    } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
    }
});

router.delete("/delete/:id", authMiddleware, isAdmin, async (req, res) => {
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