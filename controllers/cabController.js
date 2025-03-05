
const Cab = require("../models/Cab");
exports.addCab = async (req, res) => {
    try {
        console.log(" Received request to add a cab:", req.body);
        const { cabNo, tripDate, toFrom, fuelDetails, fastTagDetails, tyrePunctureDetails } = req.body;
        if (!cabNo || !tripDate || !toFrom || !fuelDetails || !fastTagDetails || !tyrePunctureDetails) {
            console.log(" Missing required fields");
            return res.status(400).json({ message: "All fields are required" });
        }
        const existingCab = await Cab.findOne({ cabNo });
        if (existingCab) {
            console.log(" Cab already exists:", cabNo);
            return res.status(400).json({ message: "Cab already exists" });
        }
        const newCab = new Cab({ cabNo, tripDate, toFrom, fuelDetails, fastTagDetails, tyrePunctureDetails });
        await newCab.save();
        console.log(" Cab added successfully:", newCab);
        res.status(201).json({ message: "Cab added successfully", cab: newCab });
    } catch (error) {
        console.error(" Error in addCab:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

exports.getCabByNumber = async (req, res) => {
    try {
        const cab = await Cab.findOne({ cabNo: req.params.cabNo });
        if (!cab) return res.status(404).json({ message: "Cab not found" });

        res.json(cab);
    } catch (error) {
        console.error("❌ Error in getCabByNumber:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
