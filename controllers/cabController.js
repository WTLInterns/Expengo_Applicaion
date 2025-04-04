const Cab = require("../models/CabsDetails");
const path = require("path");
const Driver = require("../models/loginModel")
const mongoose = require("mongoose");


const getCabs = async (req, res) => {
  try {
    const adminId = req.admin._id;
    const {cabNumber} = req.body;

    // Corrected populate fields
    const cabs = await Cab.find({ cabNumber: cabNumber })

    res.status(200).json(cabs);
  } catch (error) {
    console.error("Error fetching cabs:", error); // Log the error for debugging
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};



const getCabById = async (req, res) => {
  try {
    const { cabNumber } = req.params;
    const adminId = req.admin.id; // Extract admin ID from token (set by middleware)

    // Find cab assigned to the requesting admin
    const cab = await Cab.findOne({ cabNumber, addedBy: adminId }).populate("Driver").populate('cabNumber');;

    if (!cab) {
      return res.status(404).json({ message: "Cab not found or unauthorized access" });
    }

    res.status(200).json(cab);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cab details", error: error.message });
  }
};


// const addCab = async (req, res) => {
//   try {
//     console.log("Request Body:", req.body);
//     console.log("Uploaded Files:", req.files);

//     const {
//       cabNumber,
//       location,
//       totalDistance,
//       dateTime,
//       fuel,
//       fastTag,
//       tyrePuncture,
//       vehicleServicing,
//       otherProblems,
//       Driver,
//       addedBy,
//     } = req.body;

//     // 🔍 Check if fields are strings before parsing
//     const parsedLocation = typeof location === "string" ? JSON.parse(location) : location;
//     const parsedFuel = typeof fuel === "string" ? JSON.parse(fuel) : fuel;
//     const parsedFastTag = typeof fastTag === "string" ? JSON.parse(fastTag) : fastTag;
//     const parsedTyrePuncture = typeof tyrePuncture === "string" ? JSON.parse(tyrePuncture) : tyrePuncture;
//     const parsedVehicleServicing = typeof vehicleServicing === "string" ? JSON.parse(vehicleServicing) : vehicleServicing;
//     const parsedOtherProblems = typeof otherProblems === "string" ? JSON.parse(otherProblems) : otherProblems;

//     // ✅ Ensure uploaded files are handled correctly
//     const receiptImage = req.files?.receiptImage ? req.files.receiptImage[0].path : null;
//     const transactionImage = req.files?.transactionImage ? req.files.transactionImage[0].path : null;
//     const punctureImage = req.files?.punctureImage ? req.files.punctureImage[0].path : null;
//     const otherProblemsImage = req.files?.otherProblemsImage ? req.files.otherProblemsImage[0].path : null;

//     // ✅ Create new Cab entry
//     const newCab = new Cab({
//       cabNumber,
//       location: {
//         from: parsedLocation?.from,
//         to: parsedLocation?.to,
//         totalDistance,
//         dateTime,
//       },
//       fuel: {
//         type: parsedFuel?.type,
//         receiptImage,
//         transactionImage,
//         amount: parsedFuel?.amount,
//       },
//       fastTag: {
//         paymentMode: parsedFastTag?.paymentMode,
//         amount: parsedFastTag?.amount,
//         cardDetails: parsedFastTag?.cardDetails,
//       },
//       tyrePuncture: {
//         image: punctureImage,
//         repairAmount: parsedTyrePuncture?.repairAmount,
//       },
//       vehicleServicing: {
//         requiredService: parsedVehicleServicing?.requiredService,
//         details: parsedVehicleServicing?.details,
//       },
//       otherProblems: {
//         image: otherProblemsImage,
//         details: parsedOtherProblems?.details,
//         amount: parsedOtherProblems?.amount,
//       },
//       Driver,
//       addedBy
//     });

//     // ✅ Save to database
//     await newCab.save();
//     res.status(201).json({ message: "Cab added successfully", cab: newCab });
//   } catch (error) {
//     console.error("Error adding cab:", error.message);
//     res.status(500).json({ message: "Error adding cab", error: error.message });
//   }
// };



const addCab = async (req, res) => {
  try {
    console.log("📝 Request Body:", req.body);
    console.log("📂 Uploaded Files:", req.files);

    const { cabNumber, ...restData } = req.body;

    if (!cabNumber) {
      return res.status(400).json({ message: "Cab number is required" });
    }

    // 🔄 Parse JSON fields if necessary
    const parsedData = {};
    Object.keys(restData).forEach((key) => {
      parsedData[key] =
        typeof restData[key] === "string" ? JSON.parse(restData[key]) : restData[key];
    });

    // 🔄 Map uploaded images correctly into a nested structure
    const uploadedImages = {
      fuel: {
        receiptImage: req.files?.receiptImage ? req.files.receiptImage[0].path : null,
        transactionImage: req.files?.transactionImage ? req.files.transactionImage[0].path : null,
      },
      tyrePuncture: {
        image: req.files?.tyrePunctureImage ? req.files.tyrePunctureImage[0].path : null,
      },
      otherProblems: {
        image: req.files?.otherProblemsImage ? req.files.otherProblemsImage[0].path : null,
      },
    };

    // 🔍 Fetch existing cab entry (if it exists)
    let existingCab = await Cab.findOne({ cabNumber });

    if (!existingCab) {
      existingCab = new Cab({ cabNumber });
    }

    // ✅ Merge provided data with existing data
    const updatedData = {
      ...existingCab.toObject(),
      ...parsedData, // Merge new fields
      fuel: {
        ...existingCab.fuel,
        ...parsedData.fuel,
        receiptImage: uploadedImages.fuel.receiptImage || existingCab.fuel?.receiptImage,
        transactionImage: uploadedImages.fuel.transactionImage || existingCab.fuel?.transactionImage,
      },
      tyrePuncture: {
        ...existingCab.tyrePuncture,
        ...parsedData.tyrePuncture,
        image: uploadedImages.tyrePuncture.image || existingCab.tyrePuncture?.image,
      },
      otherProblems: {
        ...existingCab.otherProblems,
        ...parsedData.otherProblems,
        image: uploadedImages.otherProblems.image || existingCab.otherProblems?.image,
      },
    };

    // ✅ Update or create new entry
    const updatedCab = await Cab.findOneAndUpdate(
      { cabNumber },
      { $set: updatedData },
      { new: true, upsert: true, runValidators: false } // ✅ Prevent validation errors on missing fields
    );

    res.status(201).json({ message: "Cab data updated successfully", cab: updatedCab });

  } catch (error) {
    console.error("🚨 Error adding cab:", error.message);
    res.status(500).json({ message: "Error adding cab", error: error.message });
  }
};

const updateCab = async (req, res) => {
  const { id } = req.params;
  const adminId = req.user.id; // Assuming req.user is set via authentication middleware

  // ✅ Check if the cab exists
  const existingCab = await Cab.findById(id);
  if (!existingCab) {
    res.status(404);
    throw new Error("Cab not found");
  }

  // ✅ Ensure only the owner admin can update
  if (existingCab.addedBy.toString() !== adminId) {
    res.status(403);
    throw new Error("Unauthorized: You are not allowed to update this cab");
  }

  const updatedFields = { ...req.body };

  // ✅ Handle image uploads safely
  if (req.files) {
    if (req.files.receiptImage) {
      updatedFields.fuel = updatedFields.fuel || {};
      updatedFields.fuel.receiptImage = req.files.receiptImage[0].path;
    }
    if (req.files.transactionImage) {
      updatedFields.fuel = updatedFields.fuel || {};
      updatedFields.fuel.transactionImage = req.files.transactionImage[0].path;
    }
    if (req.files.punctureImage) {
      updatedFields.tyrePuncture = updatedFields.tyrePuncture || {};
      updatedFields.tyrePuncture.image = req.files.punctureImage[0].path;
    }
  }

  // ✅ Update cab details
  const updatedCab = await Cab.findByIdAndUpdate(id, updatedFields, { new: true });

  if (!updatedCab) {
    res.status(500);
    throw new Error("Failed to update cab");
  }

  res.status(200).json({ message: "Cab updated successfully", cab: updatedCab });
};


const deleteCab = async (req, res) => {
  const { id } = req.params;
  const adminId = req.user.id; // Assuming req.user is set via authentication middleware

  // ✅ Check if the cab exists
  const cab = await Cab.findById(id);
  if (!cab) {
    res.status(404);
    throw new Error("Cab not found");
  }

  // ✅ Ensure only the owner admin can delete
  if (cab.addedBy.toString() !== adminId) {
    res.status(403);
    throw new Error("Unauthorized: You are not allowed to delete this cab");
  }

  // ✅ Delete the cab
  await cab.deleteOne();

  res.status(200).json({ message: "Cab deleted successfully", deletedCab: cab });
};



const cabList = async (req, res) => {
  try {
    const adminId = new mongoose.Types.ObjectId(req.admin.id); // Ensure ObjectId

    // Fetch cabs only added by this admin
    const cabs = await Cab.aggregate([
      {
        $match: { addedBy: adminId } // Ensure the logged-in admin only sees their own cabs
      },
      {
        $group: {
          _id: "$cabNumber", // Group by cab number
          totalDistance: {
            $sum: {
              $toDouble: {
                $ifNull: ["$location.totalDistance", "0"] // Handle missing values
              }
            }
          }
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
      },
      { $sort: { totalDistance: -1 } } // Sort by totalDistance in descending order
    ]);

    res.status(200).json({ success: true, data: cabs });
  } catch (error) {
    console.error("Error in cabList:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};



const cabExpensive = async (req, res) => {
  try {
    const adminId = req.admin.id;
    console.log("✅ Admin ID:", adminId);

    // Fetch all cabs added by this admin
    const cabs = await Cab.find({ addedBy: adminId });

    console.log("✅ Cabs added by admin:", cabs.length);
    if (cabs.length === 0) {
      return res.status(404).json({ success: false, message: "No cabs found for this admin." });
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
        }
      };
    });

    // Sort by highest expense first
    expenses.sort((a, b) => b.totalExpense - a.totalExpense);

    console.log("🔍 Expenses After Calculation:", expenses);

    if (expenses.length === 0) {
      return res.status(404).json({ success: false, message: "No expenses found after calculation!" });
    }

    res.status(200).json({ success: true, data: expenses });
  } catch (error) {
    console.error("❌ Error in cabExpensive:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = { getCabs, getCabById, addCab, updateCab, deleteCab, cabList, cabExpensive };
