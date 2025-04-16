
const CabAssignment = require('../models/CabAssignment');
const Driver = require('../models/loginModel');
const Cab = require('../models/CabsDetails');
const mongoose = require('mongoose');

// ✅ Get all active cabs assigned by the logged-in admin
const getAssignCab = async (req, res) => {
  try {
    const adminId = req.admin._id;

    const assignments = await CabAssignment.find({ status: { $ne: "completed" } })
      .populate("cab")
      .populate("driver");

    const filteredAssignments = assignments.filter(
      (a) => a.cab && a.assignedBy.toString() === adminId.toString()
    );

    res.status(200).json(filteredAssignments);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Assign a cab to a driver
const assignCab = async (req, res) => {
  try {
    const { driverId, cabNumber, assignedBy } = req.body;

    if (!driverId || !cabNumber || !assignedBy) {
      return res.status(400).json({ message: 'Driver ID, Cab Number, and Assigned By are required' });
    }

    const cab = mongoose.Types.ObjectId.isValid(cabNumber)
      ? await Cab.findById(cabNumber)
      : await Cab.findOne({ cabNumber });

    if (!cab) return res.status(404).json({ message: 'Cab not found' });

    const existingDriverAssignment = await CabAssignment.findOne({
      driver: driverId,
      status: { $ne: "completed" }
    });
    if (existingDriverAssignment)
      return res.status(400).json({ message: 'This driver already has an active cab assigned' });

    const existingCabAssignment = await CabAssignment.findOne({
      cab: cab._id,
      status: { $ne: "completed" }
    });
    if (existingCabAssignment)
      return res.status(400).json({ message: 'This cab is already assigned to another driver' });

    const newAssignment = new CabAssignment({
      driver: driverId,
      cab: cab._id,
      assignedBy,
    //   status: "ongoing"
    });

    await newAssignment.save();
    res.status(201).json({ message: 'Cab assigned successfully', assignment: newAssignment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ✅ Mark a trip as completed (call this from driver or sub-admin when trip ends)
const completeTrip = async (req, res) => {
  try {
    const assignmentId = req.params.id;
    const assignment = await CabAssignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    assignment.status = "completed";
    await assignment.save();

    res.json({ message: "Trip marked as completed", assignment });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// ✅ Unassign cab (only owner or super admin)
const unassignCab = async (req, res) => {
  try {
    const adminId = req.admin.id;
    const adminRole = req.admin.role;

    const cabAssignment = await CabAssignment.findById(req.params.id);
    if (!cabAssignment) return res.status(404).json({ message: "Cab assignment not found" });

    if (cabAssignment.assignedBy.toString() !== adminId && adminRole !== "super-admin") {
      return res.status(403).json({ message: "Unauthorized: You can only unassign cabs assigned by you" });
    }

    await CabAssignment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Cab unassigned successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Get all current (not completed) assignments for logged-in driver
const getAssignDriver = async (req, res) => {
  try {
    const driverId = req.driver.id;
    const assignments = await CabAssignment.find({ driver: driverId, status: { $ne: "completed" } })
      .populate("cab")
      .populate("driver");

    if (!assignments.length) {
      return res.status(404).json({ message: "No active cab assignments found for this driver." });
    }

    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Edit the logged-in driver's profile
const EditDriverProfile = async (req, res) => {
  try {
    const driverId = req.driver.id;
    const updatedDriver = await Driver.findByIdAndUpdate(driverId, req.body, {
      new: true,
      runValidators: true
    }).select("-password");

    if (!updatedDriver) return res.status(404).json({ message: "Driver not found" });

    res.json({ message: "Profile updated successfully", updatedDriver });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  assignCab,
  getAssignCab,
  unassignCab,
  EditDriverProfile,
  getAssignDriver,
  completeTrip
};
