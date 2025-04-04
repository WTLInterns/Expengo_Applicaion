const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const Cab = require("../models/Cab");
const Driver = require("../models/loginModel");
require("dotenv").config();
const Expense = require("../models/subAdminExpenses");
const Analytics = require("../models/SubadminAnalytics");

// ✅ Register Admin
const registerAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if admin already exists
    let existingAdmin = await Admin.findOne({ email });
    if (existingAdmin)
      return res.status(400).json({ message: "Admin already registered" });

    // ✅ Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ email, password: hashedPassword });

    await newAdmin.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Admin Login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    // ✅ Check if blocked
    if (admin.status === "Blocked") {
      return res
        .status(403)
        .json({ message: "Your account is blocked. Contact admin." });
    }

    console.log("Stored Hash:", admin.password);
    console.log("Entered Password:", password);

    // ✅ Compare hashed password with entered password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    // ✅ Generate JWT token
    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful!", token ,id:admin._id});
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const totalSubAdminCount = async (req, res) => {
  try {
    // If you are counting admin documents
    const subAdminCount = await Admin.countDocuments(); // Ensure this is the correct model for the task

    console.log("count of sub-admins", subAdminCount);
    res.status(200).json({ count: subAdminCount }); // ✅ Send correct response
  } catch (error) {
    console.error("Error counting sub-admins:", error);
    res.status(500).json({ message: "Error counting sub-admins" });
  }
};

const totalDriver = async (req, res) => {
  try {
    // If you are counting admin documents
    const driver = await Driver.countDocuments(); // Ensure this is the correct model for the task

    console.log("count of Drivers", driver);
    res.status(200).json({ count: driver }); // ✅ Send correct response
  } catch (error) {
    console.error("Error counting sub-admins:", error);
    res.status(500).json({ message: "Error counting sub-admins" });
  }
};

const totalCab = async (req, res) => {
  try {
    // If you are counting admin documents
    const cab = await Cab.countDocuments(); // Ensure this is the correct model for the task

    console.log("count of cabs", cab);
    res.status(200).json({ count: cab }); // ✅ Send correct response
  } catch (error) {
    console.error("Error counting sub-admins:", error);
    res.status(500).json({ message: "Error counting sub-admins" });
  }
};

// Get all sub-admins
const getAllSubAdmins = async (req, res) => {
  try {
    const subAdmins = await Admin.find()
      .select("-password")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, subAdmins });
  } catch (error) {
    console.error("Error fetching sub-admins:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch sub-admins",
      error: error.message,
    });
  }
};

// Add a new sub-admin
const addNewSubAdmin = async (req, res) => {
  try {
    const { name, email, password, role, phone, status } = req.body;
    const profileImage = req.file?.path || null;

    console.log("Image From Frontend:", profileImage);

    // Validate required fields
    if (!name || !email || !password || !role || !phone) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    // Check if email already exists
    const existingSubAdmin = await Admin.findOne({ email });
    if (existingSubAdmin) {
      return res.status(400).json({
        success: false,
        message: "Email already in use",
      });
    }

    // ✅ Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save new sub-admin
    const newSubAdmin = await Admin.create({
      profileImage,
      name,
      email,
      password: hashedPassword, // ✅ Store hashed password
      role,
      phone,
      status: status || "Active",
    });

    // Remove password before sending response
    const { password: _, ...subAdminResponse } = newSubAdmin.toObject();

    return res.status(201).json({
      success: true,
      message: "Sub-admin created successfully",
      newSubAdmin: subAdminResponse,
    });
  } catch (error) {
    console.error("Error adding sub-admin:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add sub-admin",
      error: error.message,
    });
  }
};

// Get a single sub-admin by ID
const getSubAdminById = async (req, res) => {
  try {
    const subAdmin = await Admin.findById(req.params.id).select("-password");

    if (!subAdmin) {
      return res
        .status(404)
        .json({ success: false, message: "Sub-admin not found" });
    }

    res.status(200).json({ success: true, subAdmin });
  } catch (error) {
    console.error("Error fetching sub-admin:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch sub-admin",
      error: error.message,
    });
  }
};

// Update a sub-admin
// const updateSubAdmin = async (req, res) => {
//     try {
//       const { name, email, password, role, phone, status } = req.body
//       const subAdminId = req.params.id

//       // Check if email is being changed and if it already exists
//       if (email) {
//         const existingSubAdmin = await Admin.findOne({ email, _id: { $ne: subAdminId } })
//         if (existingSubAdmin) {
//           return res.status(400).json({ success: false, message: "Email already in use by another sub-admin" })
//         }
//       }

//       // Prepare update data
//       const updateData = {
//         profileImage,
//         name,
//         email,
//         role,
//         phone,
//         status,
//       }

//       // Only update password if provided
//       if (password) {
//         const salt = await bcrypt.genSalt(10)
//         updateData.password = await bcrypt.hash(password, salt)
//       }

//       // Update sub-admin
//       const updatedSubAdmin = await Admin.findByIdAndUpdate(
//         subAdminId,
//         { $set: updateData },
//         { new: true, runValidators: true },
//       ).select("-password")

//       if (!updatedSubAdmin) {
//         return res.status(404).json({ success: false, message: "Sub-admin not found" })
//       }

//       res.status(200).json({
//         success: true,
//         message: "Sub-admin updated successfully",
//         subAdmin: updatedSubAdmin,
//       })
//     } catch (error) {
//       console.error("Error updating sub-admin:", error)
//       res.status(500).json({ success: false, message: "Failed to update sub-admin", error: error.message })
//     }
//   }

const updateSubAdmin = async (req, res) => {
  try {
    const { name, email, password, role, phone, status, profileImage } =
      req.body;
    const subAdminId = req.params.id;

    // Check if email is being changed and if it already exists
    if (email) {
      const existingSubAdmin = await Admin.findOne({
        email,
        _id: { $ne: subAdminId },
      });
      if (existingSubAdmin) {
        return res.status(400).json({
          success: false,
          message: "Email already in use by another sub-admin",
        });
      }
    }

    // Prepare update data
    const updateData = {
      name,
      email,
      role,
      phone,
      status,
    };

    // Only include profileImage if it's provided
    if (profileImage !== undefined) {
      updateData.profileImage = profileImage;
    }

    // Only update password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    // Update sub-admin
    const updatedSubAdmin = await Admin.findByIdAndUpdate(
      subAdminId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedSubAdmin) {
      return res
        .status(404)
        .json({ success: false, message: "Sub-admin not found" });
    }

    res.status(200).json({
      success: true,
      message: "Sub-admin updated successfully",
      subAdmin: updatedSubAdmin,
    });
  } catch (error) {
    console.error("Error updating sub-admin:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update sub-admin",
      error: error.message,
    });
  }
};

// Delete a sub-admin
const deleteSubAdmin = async (req, res) => {
  try {
    const deletedSubAdmin = await Admin.findByIdAndDelete(req.params.id);

    if (!deletedSubAdmin) {
      return res
        .status(404)
        .json({ success: false, message: "Sub-admin not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Sub-admin deleted successfully" });
  } catch (error) {
    console.error("Error deleting sub-admin:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete sub-admin",
      error: error.message,
    });
  }
};

// Toggle block status
const toggleBlockStatus = async (req, res) => {
  try {
    const subAdmin = await Admin.findById(req.params.id);

    if (!subAdmin) {
      return res
        .status(404)
        .json({ success: false, message: "Sub-admin not found" });
    }

    // Toggle status
    const newStatus = subAdmin.status === "Active" ? "Inactive" : "Active";

    const updatedSubAdmin = await Admin.findByIdAndUpdate(
      req.params.id,
      { $set: { status: newStatus } },
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: `Sub-admin ${
        newStatus === "Active" ? "activated" : "deactivated"
      } successfully`,
      status: newStatus,
      subAdmin: updatedSubAdmin,
    });
  } catch (error) {
    console.error("Error toggling sub-admin status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update sub-admin status",
      error: error.message,
    });
  }
};

// expense
const addExpense = async (req, res) => {
  try {
    console.log("Received request:", req.body);
    const { type, amount, driver, cabNumber } = req.body;

    const newExpense = new Expense({ type, amount, driver, cabNumber });
    console.log("Saving expense:", newExpense);

    await newExpense.save();
    console.log("Expense saved successfully");

    res.status(201).json(newExpense);
  } catch (error) {
    console.error("Error adding expense:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Get all expenses
const getAllExpenses = async (req, res) => {
  try {
    // Fetch all cabs added by this admin
    const cabs = await Cab.find();

    console.log("✅ Cabs added by admin:", cabs.length);
    if (cabs.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No cabs found for this admin." });
    }

    console.log("🔍 First cab sample:", JSON.stringify(cabs[0], null, 2));

    // Manually calculate total expenses
    const expenses = cabs.map((cab) => {
      const totalExpense =
        (cab.fuel?.amount || 0) +
        (cab.fastTag?.amount || 0) +
        (cab.tyrePuncture?.repairAmount || 0) +
        (cab.otherProblems?.amount || 0);

      return {
        cabNumber: cab.cabNumber,
        totalExpense,
        breakdown: {
          fuel: cab.fuel?.amount || 0,
          fastTag: cab.fastTag?.amount || 0,
          tyrePuncture: cab.tyrePuncture?.repairAmount || 0,
          otherProblems: cab.otherProblems?.amount || 0,
        },
      };
    });

    // Sort by highest expense first
    expenses.sort((a, b) => b.totalExpense - a.totalExpense);

    console.log("🔍 Expenses After Calculation:", expenses);

    if (expenses.length === 0) {
      return res
        .status(404)
        .json({
          success: false,
          message: "No expenses found after calculation!",
        });
    }

    res.status(200).json({ success: true, data: expenses });
  } catch (error) {
    console.error("❌ Error in cabExpensive:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Delete an expense
const deleteExpense = async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Expense deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an expense
const updateExpense = async (req, res) => {
  try {
    const { type, amount, driver, cabNumber } = req.body;
    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      { type, amount, driver, cabNumber },
      { new: true, runValidators: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json(updatedExpense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all analytics data
const getAnalytics = async (req, res) => {
  try {
    const data = await Analytics.find().sort({ date: -1 }).limit(10);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Add new analytics data
const addAnalytics = async (req, res) => {
  try {
    const { totalRides, revenue, customerSatisfaction, fleetUtilization } =
      req.body;
    const newEntry = new Analytics({
      totalRides,
      revenue,
      customerSatisfaction,
      fleetUtilization,
    });
    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (error) {
    res.status(500).json({ message: "Error adding data" });
  }
};

// ✅ Export all functions correctly
module.exports = {
  registerAdmin,
  adminLogin,
  totalSubAdminCount,
  getAllSubAdmins,
  addNewSubAdmin,
  getSubAdminById,
  updateSubAdmin,
  deleteSubAdmin,
  toggleBlockStatus,
  totalDriver,
  totalCab,
  addExpense,
  getAllExpenses,
  deleteExpense,
  updateExpense,
  getAnalytics,
  addAnalytics,
};
