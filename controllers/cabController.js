
// const Cab = require("../models/Cab");

// exports.addCab = async (req, res) => {
//     try {
//         // console.log(" Received request to add a cab:", req.body);
//         // const { cabNo, toFrom, fuelDetails, fastTagDetails, tyrePunctureDetails,Driver } = req.body;
//         // if (!cabNo ||  !toFrom || !fuelDetails || !fastTagDetails || !tyrePunctureDetails || !Driver) {
//         //     console.log(" Missing required fields");
//         //     return res.status(400).json({ message: "All fields are required" });
//         // }
//         // const existingCab = await Cab.findOne({ cabNo });
//         // if (existingCab) {
//         //     console.log(" Cab already exists:", cabNo);
//         //     return res.status(400).json({ message: "Cab already exists" });
//         // }
//         // const newCab = new Cab({ cabNo, toFrom, fuelDetails, fastTagDetails, tyrePunctureDetails ,Driver});
//         const newCab = new Cab(req.body);
//         await newCab.save();
//         console.log(" Cab added successfully:", newCab);
//         res.status(201).json({ message: "Cab added successfully", cab: newCab });
//     } catch (error) {
//         console.error(" Error in addCab:", error);
//         res.status(500).json({ message: "Server Error", error: error.message });
//     }
// };

// exports.getCabByNumber = async (req, res) => {
//     try {
//         const cab = await Cab.findOne({ cabNo: req.params.cabNo }).populate("Driver");
//         if (!cab) return res.status(404).json({ message: "Cab not found" });

//         res.json(cab);
//     } catch (error) {
//         console.error(" Error in getCabByNumber:", error);
//         res.status(500).json({ message: "Server Error", error: error.message });
//     }
// };




const Cab = require("../models/Cab");

exports.addCab = async (req, res) => {
    try {
        const {
            cabNumber, from, to, totalDistance, fuelType, fuelAmount,
            fastTagMode, fastTagAmount, tyreRepairAmount, serviceDetails,
            Driver, otherProblemsDetails, otherProblemsAmount
        } = req.body;

        // Ensure file uploads are handled correctly
        const fuelReceiptImage = req.files?.fuelReceiptImage?.[0]?.path || null;
        const transactionImage = req.files?.transactionImage?.[0]?.path || null;
        const tyrePunctureImage = req.files?.tyrePunctureImage?.[0]?.path || null;
        const otherProblemsImage = req.files?.otherProblemsImage?.[0]?.path || null;

        const newCab = new Cab({
            cabNumber,
            location: { from, to, totalDistance: totalDistance || null },
            fuel: {
                type: fuelType,
                amount: fuelAmount,
                receiptImage: fuelReceiptImage,
                transactionImage: transactionImage,
            },
            fastTag: {
                paymentMode: fastTagMode,
                amount: fastTagAmount,
            },
            tyrePuncture: {
                image: tyrePunctureImage,
                repairAmount: tyreRepairAmount,
            },
            vehicleServicing: {
                requiredService: serviceDetails ? true : false,
                details: serviceDetails,
            },
            otherProblems:{
                image : otherProblemsImage,
                details: otherProblemsDetails,
                amount: otherProblemsAmount
            },
            Driver
        });

        await newCab.save();
        console.log("✅ Cab added successfully:", newCab);
        res.status(201).json({ message: "Cab added successfully", cab: newCab });
    } catch (error) {
        console.error("❌ Error in addCab:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

exports.getCabByNumber = async (req, res) => {
    try {
        const cab = await Cab.findOne({ cabNumber: req.params.cabNo }).populate("Driver");
        if (!cab) return res.status(404).json({ message: "Cab not found" });

        res.json(cab);
    } catch (error) {
        console.error("❌ Error in getCabByNumber:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

exports.getCabs = async (req, res) => {
    try {
        const cabs = await Cab.find().populate("Driver");
        res.json(cabs);
    } catch (error) {
        console.error("❌ Error in getCabs:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}