
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
//         console.error("❌ Error in getCabByNumber:", error);
//         res.status(500).json({ message: "Server Error", error: error.message });
//     }
// };


const Cab = require("../models/Cab");
const path = require("path");

// @desc    Get all cabs
// @route   GET /api/cabs
const getCabs = async (req, res) => {
  try {
    const cabs = await Cab.find().populate('Driver');
    res.status(200).json(cabs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cabs", error });
  }
};

// @desc    Get single cab by ID
// @route   GET /api/cabs/:id
const getCabById = async (req, res) => {
  try {
    const cab = await Cab.findOne({ cabNumber: req.params.cabNumber }).populate('Driver');
    if (!cab) return res.status(404).json({ message: "Cab not found" });

    res.status(200).json(cab);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cab details", error });
  }
};

// @desc    Add a new cab
// @route   POST /api/cabs
const addCab = async (req, res) => {
  try {
    const { cabNumber, location, fuel, fastTag, tyrePuncture, vehicleServicing } = req.body;

    // Handle image uploads
    const receiptImage = req.files?.receiptImage ? req.files.receiptImage[0].path : null;
    const transactionImage = req.files?.transactionImage ? req.files.transactionImage[0].path : null;
    const punctureImage = req.files?.punctureImage ? req.files.punctureImage[0].path : null;

    const newCab = new Cab({
      cabNumber,
      location,
      fuel: { ...fuel, receiptImage, transactionImage },
      fastTag,
      tyrePuncture: { ...tyrePuncture, image: punctureImage },
      vehicleServicing,
    });

    await newCab.save();
    res.status(201).json({ message: "Cab added successfully", cab: newCab });
  } catch (error) {
    res.status(500).json({ message: "Error adding cab", error });
  }
};

// @desc    Update cab details
// @route   PUT /api/cabs/:id
const updateCab = async (req, res) => {
  try {
    const updatedFields = req.body;

    // Handle image uploads
    if (req.files?.receiptImage) updatedFields.fuel.receiptImage = req.files.receiptImage[0].path;
    if (req.files?.transactionImage) updatedFields.fuel.transactionImage = req.files.transactionImage[0].path;
    if (req.files?.punctureImage) updatedFields.tyrePuncture.image = req.files.punctureImage[0].path;

    const updatedCab = await Cab.findByIdAndUpdate(req.params.id, updatedFields, { new: true });

    if (!updatedCab) return res.status(404).json({ message: "Cab not found" });

    res.status(200).json({ message: "Cab updated successfully", cab: updatedCab });
  } catch (error) {
    res.status(500).json({ message: "Error updating cab", error });
  }
};

// @desc    Delete cab
// @route   DELETE /api/cabs/:id
const deleteCab = async (req, res) => {
  try {
    const cab = await Cab.findByIdAndDelete(req.params.id);
    if (!cab) return res.status(404).json({ message: "Cab not found" });

    res.json(cab);
  } catch (error) {
    console.error("❌ Error in getCabByNumber:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const filterDate =  async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;

    // Check if fromDate or toDate is missing
    if (!fromDate || !toDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide fromDate and toDate'
      });
    }

    // Convert fromDate and toDate to ignore time
    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);

    // Set time to 00:00:00 for fromDate
    startDate.setHours(0, 0, 0, 0);
    // Set time to 23:59:59 for toDate
    endDate.setHours(23, 59, 59, 999);

    // Query to filter the cabs based on date (ignoring time)
    const cabs = await Cab.find({
      'location.dateTime': {
        $gte: startDate,
        $lte: endDate
      }
    });

    // Check if cabs found or not
    if (cabs.length === 0) {
      return res.status(200).json({
        success: false,
        message: 'No cabs found in the provided date range'
      });
    }

    // Send response if cabs are found
    res.status(200).json({
      success: true,
      message: 'Cabs fetched successfully',
      cabs: cabs
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};

module.exports = { getCabs, getCabById, addCab, updateCab, deleteCab, filterDate };
