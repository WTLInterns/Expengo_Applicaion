
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
//         console.error(" Error in getCabByNumber:", error);
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



module.exports = { getCabs, getCabById, addCab, updateCab, deleteCab};

// exports.getCabByNumber = async (req, res) => {
//     try {
//         const cab = await Cab.findOne({ cabNumber: req.params.cabNo }).populate("Driver");
//         if (!cab) return res.status(404).json({ message: "Cab not found" });

//         res.json(cab);
//     } catch (error) {
//         console.error("❌ Error in getCabByNumber:", error);
//         res.status(500).json({ message: "Server Error", error: error.message });
//     }
// };

// exports.getCabs = async (req, res) => {
//     try {
//         const cabs = await Cab.find().populate("Driver");
//         res.json(cabs);
//     } catch (error) {
//         console.error("❌ Error in getCabs:", error);
//         res.status(500).json({ message: "Server Error", error: error.message });
//     }
// }
