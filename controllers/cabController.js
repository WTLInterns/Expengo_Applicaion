
const Cab = require("../models/Cab");

// ✅ Add a new cab
exports.addCab = async (req, res) => {
    try {
        const newCab = new Cab(req.body);
        const savedCab = await newCab.save();
        res.status(201).json({ success: true, data: savedCab });
    } catch (error) {
        console.error("❌ Error in addCab:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// ✅ Get cabs with total distance greater than 10,000 km and sum distances per cab
exports.getCabs = async (req, res) => {
    try {
        const cabs = await Cab.aggregate([
            {
                $group: {
                    _id: "$cabNumber", // Group by cab number
                    totalDistance: { $sum: "$location.totalDistance" } // Sum total distance per cab
                }
            },
            {
                $match: { totalDistance: { $gt: 10000 } } // Filter AFTER summing
            },
            {
                $project: {
                    _id: 0, // Remove _id
                    cabNumber: "$_id", // Rename _id to cabNumber
                    totalDistance: 1 // Keep totalDistance
                }
            }
        ]);

        res.status(200).json({ success: true, data: cabs });
    } catch (error) {
        console.error("❌ Error in getCabs:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
