const CabAssignment = require('../models/CabAssignment');
const Driver = require('../models/loginModel');
const Cab = require('../models/CabsDetails');
const mongoose = require('mongoose');
// const getAssignCab = async (req, res) => {
//     try {
//         const assignments = await CabAssignment.find()
//             .populate('driver') // Get driver name & licenseNumber
//             .populate('cab'); // Get cab details

//         res.status(200).json(assignments);
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };

const getAssignCab = async (req, res) => {
    try {
        const adminId = req.admin._id;
        console.log("✅ Admin ID:", adminId);

        // Fetch all assignments & populate cab and driver
        const assignments = await CabAssignment.find()
        .populate("cab")  // ✅ Correct
        .populate("driver") // ✅ Change "Driver" to "driver"

        console.log("🔍 Raw Assignments from DB:", assignments); // Log fetched data

        // ✅ Ensure only cabs assigned by this admin are included
        const filteredAssignments = assignments.filter(
            (a) => a.cab && a.assignedBy.toString() === adminId.toString()
        );

        console.log("✅ Filtered Assignments:", filteredAssignments);

        res.status(200).json(filteredAssignments);
    } catch (error) {
        console.error("❌ Error in getAssignCab:", error);
        res.status(500).json({ message: "Server Error", error: error.message || error });
    }
};


const assignCab = async (req, res) => {
    try {
        const { driverId, cabNumber, assignedBy } = req.body;

        if (!driverId || !cabNumber || !assignedBy) {
            return res.status(400).json({ message: 'Driver ID, Cab Number, and Assigned By are required' });
        }

        
        let cab;
        if (mongoose.Types.ObjectId.isValid(cabNumber)) {
            cab = await Cab.findById(cabNumber);
        } else {
            cab = await Cab.findOne({ cabNumber: cabNumber });
        }

        if (!cab) {
            return res.status(404).json({ message: 'Cab not found' });
        }

        // Check if driver already has a cab assigned
        const existingDriverAssignment = await CabAssignment.findOne({ driver: driverId });
        if (existingDriverAssignment) {
            return res.status(400).json({ message: 'This driver already has a cab assigned' });
        }

        // Check if cab is already assigned
        const existingCabAssignment = await CabAssignment.findOne({ cab: cab._id });
        if (existingCabAssignment) {
            return res.status(400).json({ message: 'This cab is already assigned to another driver' });
        }

        const newAssignment = new CabAssignment({
            driver: new mongoose.Types.ObjectId(driverId),
            cab: new mongoose.Types.ObjectId(cab._id),
            assignedBy: new mongoose.Types.ObjectId(assignedBy)
        });

        await newAssignment.save();

        res.status(201).json({ message: 'Cab assigned successfully', assignment: newAssignment });
    } catch (error) {
        console.error("Error in assignCab:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const unassignCab = async (req, res) => {
    try {
        const adminId = req.admin.id; // Extract the logged-in admin ID
        const adminRole = req.admin.role; // Extract the logged-in admin's role

        // Find the cab assignment by ID
        const cabAssignment = await CabAssignment.findById(req.params.id);

        if (!cabAssignment) {
            return res.status(404).json({ message: "Cab assignment not found" });
        }

        // Ensure only the owner admin or a super admin can delete the assignment
        if (cabAssignment.assignedBy.toString() !== adminId && adminRole !== "super-admin") {
            return res.status(403).json({ message: "Unauthorized: You can only unassign cabs assigned by you" });
        }

        // Delete the assignment
        await CabAssignment.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Cab unassigned successfully" });

    } catch (error) {
        console.error("❌ Error in unassignCab:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


const getAssignDriver = async (req, res) => {
    try {
        const driverId = req.driver.id; // Get the logged-in driver's ID
        console.log("✅ Driver ID:", driverId);

        // Fetch all cab assignments, populate cab details
        const assignments = await CabAssignment.find({ driver: driverId })
            .populate("cab")
            .populate("driver");

        console.log("🔍 Assigned Cabs for Driver:", assignments);

        if (!assignments.length) {
            return res.status(404).json({ message: "No assigned cabs found for this driver." });
        }

        res.status(200).json(assignments);
    } catch (error) {
        console.error("❌ Error in getAssignCab:", error);
        res.status(500).json({ message: "Server Error", error: error.message || error });
    }
};


const EditDriverProfile =  async (req, res) => {
    try {
        const driverId = req.driver.id; // Get authenticated driver ID from middleware

        // Check if the driver is updating their own profile
     

        // Update the driver profile
        const updatedDriver = await Driver.findByIdAndUpdate(req.driver.id, req.body, {
            new: true,
            runValidators: true
        }).select("-password");
       
        if (!updatedDriver) {
            return res.status(404).json({ message: "Driver not found" });
        }

        res.json({ message: "Profile updated successfully", updatedDriver });
    } catch (err) {
        console.error("❌ Error updating driver profile:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};


module.exports = { assignCab, getAssignCab, unassignCab ,EditDriverProfile,getAssignDriver}