// const Admin = require("../models/Admin");
// const Cab = require("../models/Cab");
// const Driver = require("../models/Driver");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// // ✅ Admin Registration
// exports.registerAdmin = async (req, res) => {
//     try {
//         const { name, email, password } = req.body;

//         let existingAdmin = await Admin.findOne({ email });
//         if (existingAdmin) return res.status(400).json({ message: "Admin already exists" });

//         const hashedPassword = await bcrypt.hash(password, 10);
//         const newAdmin = new Admin({ name, email, password: hashedPassword });

//         await newAdmin.save();
//         res.status(201).json({ message: "Admin registered successfully" });
//     } catch (error) {
//         console.error("Error in admin registration:", error);
//         res.status(500).json({ message: "Server Error" });
//     }
// };

// // ✅ Admin Login
// exports.adminLogin = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         const admin = await Admin.findOne({ email });
//         if (!admin) {
//             console.log("Admin not found in database");
//             return res.status(404).json({ message: "Admin not found" });
//         }

//         console.log("Entered Password:", password);
//         console.log("Stored Hashed Password:", admin.password);

//         const isMatch = await bcrypt.compare(password, admin.password);
//         console.log("Password Match:", isMatch);

//         if (!isMatch) {
//             return res.status(401).json({ message: "Invalid credentials" });
//         }

//         res.status(200).json({ message: "Login successful!" });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };



// // ✅ Get Cab & Driver Details by cabNo
// exports.getCabAndDriverDetails = async (req, res) => {
//     try {
//         const { cabNo } = req.params;

//         const cab = await Cab.findOne({ cabNo });
//         if (!cab) return res.status(404).json({ message: "Cab not found" });

//         const driver = await Driver.findOne({ cabNo }); // Ensure driver has cabNo field
//         if (!driver) return res.status(404).json({ message: "Driver not found" });

//         res.json({
//             cabDetails: {
//                 cabNo: cab.cabNo,
//                 tripDate: cab.tripDate,
//                 toFrom: cab.toFrom,
//                 fuelDetails: cab.fuelDetails,
//                 fastTagDetails: cab.fastTagDetails,
//                 tyrePunctureDetails: cab.tyrePunctureDetails,
//             },
//             driverDetails: {
//                 name: driver.name,
//                 licenseNo: driver.licenseNo,
//                 contact: driver.contact,
//             },
//         });
//     } catch (error) {
//         console.error("Error fetching cab & driver details:", error);
//         res.status(500).json({ message: "Server Error" });
//     }
// };




// const Admin = require("../models/Admin");
// const Cab = require("../models/Cab");
// const Driver = require("../models/Driver");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");


// // ✅ Admin Registration (No Hashing)
// exports.registerAdmin = async (req, res) => {
//     try {
//         const { name, email, password } = req.body;

//         let existingAdmin = await Admin.findOne({ email });
//         if (existingAdmin) return res.status(400).json({ message: "Admin already exists" });

//         // Store password as plain text (⚠️ Not recommended for production)
//         const newAdmin = new Admin({ name, email, password });

//         await newAdmin.save();
//         res.status(201).json({ message: "Admin registered successfully" });
//     } catch (error) {
//         console.error("Error in admin registration:", error);
//         res.status(500).json({ message: "Server Error" });
//     }
// };

// // ✅ Admin Login (No Hashing)
// exports.adminLogin = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         const admin = await Admin.findOne({ email });
//         if (!admin) return res.status(404).json({ message: "Admin not found" });

//         // Compare plain text passwords
//         if (password !== admin.password) {
//             return res.status(401).json({ message: "Invalid credentials" });
//         }

//         res.status(200).json({ message: "Login successful!" });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };



// // ✅ Get Cab & Driver Details by cabNo
// exports.getCabAndDriverDetails = async (req, res) => {
//     try {
//         const { cabNo } = req.params;

//         const cab = await Cab.findOne({ cabNo });
//         if (!cab) return res.status(404).json({ message: "Cab not found" });

//         // 🔹 Ensure Driver Schema has `assignedCabNo`
//         const driver = await Driver.findOne({ assignedCabNo: cabNo });
//         if (!driver) return res.status(404).json({ message: "Driver not found" });

//         res.json({
//             cabDetails: {
//                 cabNo: cab.cabNo,
//                 tripDate: cab.tripDate,
//                 toFrom: cab.toFrom,
//                 fuelDetails: cab.fuelDetails,
//                 fastTagDetails: cab.fastTagDetails,
//                 tyrePunctureDetails: cab.tyrePunctureDetails,
//             },
//             driverDetails: {
//                 name: driver.name,
//                 licenseNo: driver.licenseNo,
//                 contact: driver.contact,
//             },
//         });
//     } catch (error) {
//         console.error("Error fetching cab & driver details:", error);
//         res.status(500).json({ message: "Server Error" });
//     }
// };

const Admin = require("../models/Admin");
const Cab = require("../models/Cab");
const Driver = require("../models/Driver");

// ✅ Register Admin
exports.registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        let existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) return res.status(400).json({ message: "Admin already exists" });

        const newAdmin = new Admin({ name, email, password });
        await newAdmin.save();
        res.status(201).json({ message: "Admin registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// ✅ Admin Login
exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(404).json({ message: "Admin not found" });

        if (password !== admin.password) return res.status(401).json({ message: "Invalid credentials" });

        res.status(200).json({ message: "Login successful!" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// ✅ Get Cab & Driver Details
exports.getCabAndDriverDetails = async (req, res) => {
    try {
        const { cabNo } = req.params;
        const cab = await Cab.findOne({ cabNo });
        if (!cab) return res.status(404).json({ message: "Cab not found" });

        const driver = await Driver.findOne({ licenseNumber: cab.licenseNumber });
        res.status(200).json({
            cabDetails: cab,
            driverDetails: driver || "No driver assigned",
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
