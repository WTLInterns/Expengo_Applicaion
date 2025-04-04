// const express = require("express");
// const Driver = require("../models/loginModel");
// const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");


// const router = express.Router();

// // Get Driver Profile
// router.get("/profile", authMiddleware, isAdmin, async (req, res) => {
//   try {
//     const adminId = req.admin._id; // Get logged-in admin's ID

//     // Fetch only drivers assigned to this admin
//     const drivers = await Driver.find({ addedBy: adminId });

//     res.status(200).json(drivers);
//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error });
//   }
// });

// // ✅ Update Driver Profile (Only Owner Admin or Super Admin)
// router.put(
//   "/profile/:id",
//   authMiddleware,
//   async (req, res) => {
//     try {
//       // const { name, contact } = req.body;
//       const adminId = req.admin.id;
//       const adminRole = req.admin.role;

//       // Find the driver by ID
//       const driver = await Driver.findById(req.params.id);

//       if (!driver) {
//         return res.status(404).json({ message: "Driver not found" });
//       }

//       // Check if the admin updating is the one who added the driver OR is a super admin
//       if (driver.addedBy.toString() !== adminId && adminRole !== "super-admin") {
//         return res.status(403).json({ message: "Unauthorized: You can only update drivers you added" });
//       }

//       // Update the driver
//       const updatedDriver = await Driver.findByIdAndUpdate(
//         req.params.id,
//         req.body,
//         { new: true, runValidators: true }
//       ).select("-password");

//       res.json({ message: "Driver profile updated successfully", updatedDriver });
//     } catch (err) {
//       console.error("❌ Error updating driver:", err);
//       res.status(500).json({ message: "Server error", error: err.message });
//     }
//   }
// );

// // ✅ Delete Driver Profile (Only Owner Admin or Super Admin)
// router.delete("/profile/:id",
//   authMiddleware,
//   async (req, res) => {
//     try {
//       const adminId = req.admin.id;
//       const adminRole = req.admin.role;

//       // Find the driver by ID
//       const driver = await Driver.findById(req.params.id);

//       if (!driver) {
//         return res.status(404).json({ message: "Driver not found" });
//       }

//       // Check if the admin deleting is the one who added the driver OR is a super admin
//       if (driver.addedBy.toString() !== adminId && adminRole !== "super-admin") {
//         return res.status(403).json({ message: "Unauthorized: You can only delete drivers you added" });
//       }

//       // Delete the driver
//       await Driver.findByIdAndDelete(req.params.id);
//       res.json({ message: "Driver account deleted successfully" });
//     } catch (err) {
//       console.error("❌ Error deleting driver:", err);
//       res.status(500).json({ message: "Server error", error: err.message });
//     }
//   }
// );

// module.exports = router;



const express = require("express");
const Driver = require("../models/loginModel");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");
const cloudinary = require("../config/cloudinary");

const router = express.Router();

// ✅ Get All Drivers Assigned to an Admin
router.get("/profile", authMiddleware, isAdmin, async (req, res) => {
    try {
        const adminId = req.admin._id; // Get logged-in admin's ID

        // Fetch only drivers assigned to this admin
        const drivers = await Driver.find({ addedBy: adminId });

        res.status(200).json(drivers);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// ✅ Update Driver Profile (Only Owner Admin or Super Admin)
router.put("/profile/:id", authMiddleware, async (req, res) => {
    try {
        const adminId = req.admin.id;
        const adminRole = req.admin.role;

        // Find the driver by ID
        const driver = await Driver.findById(req.params.id);
        if (!driver) {
            return res.status(404).json({ message: "Driver not found" });
        }

        // Check if the admin updating is the one who added the driver OR is a super admin
        if (driver.addedBy.toString() !== adminId && adminRole !== "super-admin") {
            return res.status(403).json({ message: "Unauthorized: You can only update drivers you added" });
        }

        // Update the driver
        const updatedDriver = await Driver.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }).select("-password");

        res.json({ message: "Driver profile updated successfully", updatedDriver });
    } catch (err) {
        console.error("❌ Error updating driver:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// ✅ Delete Driver Profile & Remove Image from Cloudinary
router.delete("/profile/:id", authMiddleware, async (req, res) => {
    try {
        const adminId = req.admin.id;
        const adminRole = req.admin.role;

        // Find the driver by ID
        const driver = await Driver.findById(req.params.id);
        if (!driver) {
            return res.status(404).json({ message: "Driver not found" });
        }

        // Check if the admin deleting is the one who added the driver OR is a super admin
        if (driver.addedBy.toString() !== adminId && adminRole !== "super-admin") {
            return res.status(403).json({ message: "Unauthorized: You can only delete drivers you added" });
        }

        // ✅ Delete the driver image from Cloudinary
        if (driver.imageId) {
            await cloudinary.uploader.destroy(driver.imageId);
        }

        // Delete driver from the database
        await Driver.findByIdAndDelete(req.params.id);

        res.json({ message: "Driver and image deleted successfully" });
    } catch (err) {
        console.error("❌ Error deleting driver:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

module.exports = router;
